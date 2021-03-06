import { Given, When, Then } from 'cucumber'
import supertest from 'supertest'
import { assert, expect } from 'chai'

import app from '../../../../src/server'

const request = supertest(app)
let questions = []
let question = null
let token = ''
let areas = []

/**
 * Obter questões do usuário logado
 */
Given('Dado que eu esteja logado e queira obter minhas questões', () => {
  return request
    .post('/api/token')
    .send({ email: 'questionmock3@mail.com', password: '123qwe' })
    .then((result) => {
      token = result.body.token
    })
})

When('Quando eu buscar as questões', () => {
  return request
    .get('/api/question')
    .set({ token: token })
    .then((result) => {
      questions = result.body
    })
})

Then('Então eu devo obter somente as minhas questões', () => {
  let ok = true
  for (let i = 0; i < questions.length; i++)
    if (questions[i].userId != 3)
      ok = false
  assert.isOk(ok, 'Uma das questões não pertence ao usuário logado.')
})

/**
 * Obter questões do usuário logado e compartilhadas por outros usuários
 */
Given('Dado que eu queira obter as questões compartilhadas por outros usuários', () => {
  return request
    .post('/api/token')
    .send({ email: 'questionmock3@mail.com', password: '123qwe' })
    .then((result) => {
      token = result.body.token
    })
})

When('Quando eu buscar as questões compartilhadas', () => {
  return request
    .get('/api/question-others')
    .set({ token: token })
    .then((result) => {
      questions = result.body
    })
})

Then('Então eu devo obter somente as questões compartilhadas por outros usuários', () => {
  let ok = true
  for (let i = 0; i < questions.length; i++)
    if (questions[i].userId === 3 || !questions[i].shared)
      ok = false
  assert.isOk(ok, `Uma das questões pertencem ao usuário ou não está compartilhada. ${JSON.stringify(questions)}`)
})

/**
 * Obter questão pelo id
 */
Given('Dado que eu queira obter uma questão pelo id', () => {
  return request
    .post('/api/token')
    .send({ email: 'questionmock3@mail.com', password: '123qwe' })
    .then((result) => {
      token = result.body.token
    })
})

When('Quando eu buscar a questão', () => {
  return request
    .get('/api/question/1')
    .set({ token: token })
    .then((result) => {
      question = result.body
    })
})

Then('Então eu devo obter uma questão', () => {
  expect(question.description).to.eql('teste')
})

/**
 * Obter áreas
 */
Given('Dado que eu queira obter áreas já cadastradas', () => {
  return request
    .post('/api/token')
    .send({ email: 'questionmock3@mail.com', password: '123qwe' })
    .then((result) => {
      token = result.body.token
    })
})

When('Quando eu buscar as áreas', () => {
  return request
    .get('/api/areas')
    .set({ token: token })
    .then((result) => {
      areas = result.body
    })
})

Then('Então eu quero obter uma lista das áreas', () => {
  assert.isTrue(areas.length > 0, 'Deve retornar mais de uma áreas')
})

/**
 * Exportar questões do usuário logado
 */
Given('Dado que eu queira exportar minhas questões cadastradas', () => {
  return request
    .post('/api/token')
    .send({ email: 'questionmock3@mail.com', password: '123qwe' })
    .then((result) => {
      token = result.body.token
    })
})

When('Quando eu chamar o método de exportar', () => {
  return request
    .get('/api/questions-export')
    .set({ token: token })
    .then((result) => {
      questions = JSON.parse(result.text)
    })
})

Then('Então quero obter um arquivo com as minhas questões exportadas', () => {
  assert.isOk(questions.length, 'Não retornou questões exportadas.')
})

/**
 * Adquirir questão compartilhada
 */
Given('Dado que eu queira adquirir uma questão compartilhada', () => {
  return request
    .post('/api/token')
    .send({ email: 'questionmock3@mail.com', password: '123qwe' })
    .then((result) => {
      token = result.body.token
    })
})

When('Quando eu solicitar uma questão compartilhada', () => {
  return request
    .get('/api/question-get-shared/3')
    .set({ token: token })
    .then((result) => {
      question = result.body
    })
})

Then('Então eu devo obter a questão compartilhada', () => {
  expect(question.message.en).to.eql('Question acquired successfully.')
})