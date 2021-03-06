import { TutorialService } from "../services/tutorial.service";

const createIntro = (steps) => {
  let intro = introJs()
  intro.setOptions({
    nextLabel: ' > ',
    prevLabel: ' < ',
    doneLabel: 'OK',
    skipLabel: 'Ignorar',
    showStepNumbers: false,
    exitOnOverlayClick: false,
    steps: steps
  })
  return intro
}

const tutorialService = new TutorialService()

export class TourStep {

  type: string
  step: number

  constructor(type, step) {
    this.type = type
    this.step = step
  }
}

export const Tour = {
  menu: () => {
    let intro = createIntro([      
      {
        element: '#menu-scores',
        intro: 'Veja de forma amigável suas pontuações geradas',
        position: 'right'
      }, 
      {
        element: '#menu-my-questions',
        intro: 'Veja a lista de questões que você já criou e às gerencie',
        position: 'right'
      }, {
        element: '#menu-my-room',
        intro: 'Veja a lista de suas salas, crie novas e às gerencie abrindo e iniciando ',
        position: 'right'
      }, {
        element: '#menu-opened-rooms',
        intro: "Veja as salas abertas que você possa participar",
        position: 'right'
      }, {
        element: '#menu-associated-rooms',
        intro: "Veja as salas que você participa ou já participou",
        position: 'right'
      }, {
        element: '#menu-all-questions',
        intro: 'Veja uma lista de questões compartilhadas por outros usuários que você não possui.',
        position: 'right'
      }, {
        element: '#btnMenuNotification',
        intro: 'Veja e exclua suas notificações.',
        position: 'right'
      }, {
        element: '#btnMenuTutorial',
        intro: 'Obtenha ajuda com os tutoriais do site.',
        position: 'right'
      }, {
        element: '#btnMenuAccount',
        intro: 'Veja e altere seus dados.',
        position: 'right'
      }
    ])
    intro.start()
    tutorialService.set(new TourStep('main', 1))
  },

  question: {
    step1: (callback) => {
      let intro = createIntro([
        {
          element: '#createQuestion',
          intro: 'Crie uma nova questão',
          position: 'right'
        }
      ])
      intro.oncomplete(() => {
        if (callback)
          callback()
      })
      intro.start()
      tutorialService.set(new TourStep('question', 1))
    },
    step2: () => {
      let intro = createIntro([
        {
          element: '#selectArea',
          intro: 'Selecione uma área para a sua questão',
          position: 'top'
        }, {
          element: '#customArea',
          intro: 'Selecione a opção "Outra..." para habilitar este campo e digitar uma área de sua escolha. Ex.: Matemática, Inglês ...',
          position: 'top'
        }, {
          element: '#btnNextStep',
          intro: 'Após o preenchimento dos campos vá para o próximo passo.',
          position: 'top'
        }
      ])
      intro.start()
      tutorialService.set(new TourStep('question', 2))
    },

    step3: () => {
      let intro = introJs()
      intro.setOptions({
        nextLabel: ' > ',
        prevLabel: ' < ',
        doneLabel: 'OK',
        skipLabel: 'Ignorar',
        showStepNumbers: false,
        exitOnOverlayClick: false,
        steps: [
          {
            element: '#selectCategory',
            intro: 'Verifique se a categoria está de acordo com o nível de dificuldade da questão.',
            position: 'top'
          }
        ]
      })
      intro.start()
      tutorialService.set(new TourStep('question', 3))
    },

    step4: () => {
      let intro = createIntro([
        {
          element: '#questionDescription',
          intro: 'Informe a pergunta da questão para prosseguir',
          position: 'top'
        }
      ])
      intro.start()
      tutorialService.set(new TourStep('question', 4))
    },

    step5: () => {
      let intro = createIntro([
        {
          element: '.introDescriptionAnswer',
          intro: 'Informe a alternativas da questão',
          position: 'top'
        }, {
          element: '.introCorrectAnswer',
          intro: 'Confira se a alternativa marcada é a correta',
          position: 'top'
        }
      ])
      intro.start()
      tutorialService.set(new TourStep('question', 5))
    },

    step6: () => {
      let intro = createIntro([
        {
          element: '#shareQuestion',
          intro: 'Compartilhe as questões criadas com outros usuários.',
          position: 'top'
        },
        {
          element: '#manageQuestion',
          intro: 'Edite ou exclua suas questões.',
          position: 'top'
        }
      ])
      intro.start()
      tutorialService.set(new TourStep('question', 6))
    }
  },
  room: {
    step1: () => {
      let intro = createIntro([
        {
          element: '#roomName',
          intro: 'Escolha um nome para a sala',
          position: 'right'
        }, {
          element: '#roomTime',
          intro: 'Defina o tempo da sala que deve ser em segundos',
          position: 'right'
        }, {
          element: '#addQuestionRoom',
          intro: 'Abra a lista de questões disponível para serem adicionadas à sala',
          position: 'right'
        }, {
          element: '#selOrderQuestions',
          intro: 'Selecione a ordem em que as questões serão passadas na sala',
          position: 'right'
        }
      ])
      intro.start()
      tutorialService.set(new TourStep('room', 1))
    },
  }
}