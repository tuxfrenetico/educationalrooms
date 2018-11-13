import {
  throwValidationError,
  throwForbiddenError,
  answerErros,
  questionErros
} from '../helpers/error'
import db from '../infra/db/models/index'

export const questionStatus = {
  NEW: 'N',
  UPDATED: 'U',
  REMOVED: 'R'
}

const { sequelize, Question, Answer, RoomQuestion, Room } = db

const validateAnswers = (answers) => {
  let corrects = 0
  let classifications = []
  let descriptions = []
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i]
    if (answer.correct)
      corrects++

    if (!answer.classification || typeof answer.classification !== 'string')
      throwValidationError(answerErros.HAS_CLASSIFICATION)

    if (!answer.description)
      throwValidationError(answerErros.HAS_DESCRIPTION)

    classifications.push(answer.classification)
    descriptions.push(answer.description)
  }

  if (corrects != 1)
    throwValidationError(answerErros.HAS_CORRECT_ANSWER)

  if (classifications.filter((v, i, arr) => arr.indexOf(v) === i).length !== answers.length)
    throwValidationError(answerErros.HAS_CLASSIFICATION_NEEDED)

  if (descriptions.filter((v, i, arr) => arr.indexOf(v) === i).length !== answers.length)
    throwValidationError(answerErros.NO_ANSWER_REPEATED)
}

const validateQuestion = (question) => {

  if (!question || !question.description)
    throwValidationError(questionErros.HAS_DESCRIPTION)

  const { answers, difficulty, area } = question

  if (!area)
    throwValidationError(questionErros.HAS_AREA)

  if (!difficulty || difficulty < 1 || difficulty > 5)
    throwValidationError('A dificuldade deve estar entre 1 e 5.')

  if (!Array.isArray(question.answers) || question.answers.length < 2 || question.answers.length > 6)
    throwValidationError(questionErros.HAS_BETWEEN_ANSWERS)

  validateAnswers(answers)
}

const toResult = (questions) => {
  if (Array.isArray(questions))
    return questions.map(q => toResult(q))
  else
    return {
      id: questions.id,
      description: questions.description,
      difficulty: questions.difficulty,
      area: questions.area,
      answers: questions.Answers,
      shared: questions.shared,
      userId: questions.userId,
      sharedQuestionId: questions.sharedQuestionId
    }
}

export default {

  getById: async (req, res) => {
    const { id } = req.params
    const question = await Question.findOne({ include: Answer, where: { id: id } })
    res.json(toResult(question))
  },

  getMy: async (req, res) => {
    const questions = await Question.findAll({
      include: { model: Answer },
      where: sequelize.and(
        { userId: req.claims.id },
        { sync: { [sequelize.Op.ne]: questionStatus.REMOVED } },
      ),
      order: [[Answer, 'classification']]
    })
    res.json(toResult(questions))
  },

  getOthers: async (req, res) => {
    const addedIds = await Question.findAll({
      attributes: ['sharedQuestionId'],
      where: sequelize.and(
        { userId: req.claims.id },
        { sharedQuestionId: { [sequelize.Op.ne]: null } }
      )
    }).map(p => p.sharedQuestionId)
    const questions = await Question.findAll({
      include: Answer,
      where: sequelize.and(
        { userId: { [sequelize.Op.ne]: req.claims.id } },
        addedIds.length > 0 ? { id: { [sequelize.Op.notIn]: addedIds } } : null,
        { shared: true }
      )
    })
    res.json(toResult(questions))
  },

  getAreas: async (req, res) => {
    const areas = await Question.findAll({
      attributes: ['area'],
      group: ['area'],
      order: sequelize.literal('count(1) desc')
    })
    res.json(areas.map(p => p.area))
  },

  create: async (req, res) => {
    let question = {}
    const transaction = await sequelize.transaction()
    try {

      question.id = req.body.id
      question.difficulty = req.body.difficulty
      question.area = req.body.area
      question.description = req.body.description
      question.shared = req.body.shared
      question.answers = req.body.answers
      question.userId = req.claims.id

      validateQuestion(question)
      question.sync = questionStatus.NEW
      question.createdAt = new Date()
      question.updatedAt = new Date()
      const questionDB = await Question.create(question, { transaction: transaction })
      const { answers } = question
      for (let i = 0; i < answers.length; i++) {
        answers[i].questionId = questionDB.id
        await Answer.create(answers[i], { transaction: transaction })
      }
      transaction.commit()
      res.json({ message: 'Criado com sucesso.' })
    } catch (ex) {
      transaction.rollback()
      throw ex
    }
  },

  update: async (req, res) => {
    let question = {}
    let transaction = await sequelize.transaction()
    try {

      question.id = req.body.id
      question.difficulty = req.body.difficulty
      question.area = req.body.area
      question.description = req.body.description
      question.shared = req.body.shared
      question.answers = req.body.answers

      const questionDb = await Question.findOne({ include: Answer, where: { id: question.id } })

      if (!questionDb)
        throwForbiddenError('A questão não foi localizada.')

      if (questionDb.userId != req.claims.id)
        throwForbiddenError('Usuário sem permissão para alterar o item.')

      validateQuestion(question)

      question.userId = req.claims.id
      question.updatedAt = new Date()

      const roomQuestion = await Room.findOne({
        include: [{
          model: RoomQuestion,
          required: true,
          where: { questionId: question.id }
        }],
        where: { startedAt: { [sequelize.Op.ne]: null } }
      })

      if (roomQuestion)
        throwForbiddenError('A questão pertence à uma sala que já foi iniciada ou finalizada e não pode ser editada.')

      await Question.update(question, {
        where: { id: question.id },
        transaction: transaction
      })

      await Answer.destroy({ where: { questionId: question.id }, transaction: transaction })

      const { answers } = question

      for (let i = 0; i < answers.length; i++) {
        let answer = answers[i]
        await Answer.create({
          correct: answer.correct,
          description: answer.description,
          questionId: question.id,
          classification: answer.classification
        }, { transaction: transaction })
      }
      transaction.commit()
      res.json({ message: 'Atualizado com sucesso.' })
    } catch (ex) {
      if (transaction)
        transaction.rollback()
      throw ex
    }
  },

  remove: async (req, res) => {
    const { id } = req.params
    const transaction = await sequelize.transaction()
    try {
      const question = await Question.findOne({ where: { id: id } })
      if (!question)
        throwValidationError('A questão não existe.')
      if (question.userId != req.claims.id)
        throwForbiddenError('Usuário sem permissão para remover o item.')

      const roomQuestion = await RoomQuestion.findOne({ where: { questionId: id } })

      if (roomQuestion)
        throwValidationError('A questão faz parte de uma sala e não pode ser removida.')

      await Answer.destroy({ where: { questionId: id }, transaction: transaction })
      await Question.destroy({ where: { id: id }, transaction: transaction })

      transaction.commit()
      res.json({ message: 'Questão removida com sucesso.' })
    } catch (ex) {
      transaction.rollback()
      throw ex
    }
  },

  share: async (req, res) => {
    const question = req.body
    const questionDb = await Question.findOne({ where: { id: question.id } })

    if (!questionDb)
      throwValidationError('A questão não existe.')

    if (questionDb.userId != req.claims.id)
      throwForbiddenError('Usuário sem permissão para alterar o item.')

    await Question.update({ shared: question.shared }, {
      where: { id: question.id }
    })

    res.json({ message: 'Compartilhada com sucesso.' })
  },

  getShared: async (req, res) => {
    const { id } = req.params
    const questionDb = await Question.findOne({
      where: { id: id, shared: true },
      include: [{ model: Answer }]
    })

    if (!questionDb)
      throwValidationError('A questão não existe ou não está compartilhada.')

    const already = await Question.findOne({
      where: { sharedQuestionId: id }
    })

    if (already)
      throwValidationError('Essa questão já foi adicionada.')

    const q = {
      description: questionDb.description,
      userId: req.claims.id,
      shared: false,
      area: questionDb.area,
      difficulty: questionDb.difficulty,
      createdAt: questionDb.createdAt,
      updatedAt: questionDb.updatedAt,
      sharedQuestionId: questionDb.id
    }

    const transaction = await sequelize.transaction()
    try {
      const added = await Question.create(q, { transaction: transaction })
      for (let i = 0; i < questionDb.Answers.length; i++) {
        const a = {
          description: questionDb.Answers[i].description,
          correct: questionDb.Answers[i].correct,
          questionId: added.id,
          classification: questionDb.Answers[i].classification
        }
        await Answer.create(a, { transaction: transaction })
      }
      transaction.commit()
      res.json({ message: 'Questão adquirida com sucesso.' })
    } catch (ex) {
      transaction.rollback()
      throw ex
    }
  }
}