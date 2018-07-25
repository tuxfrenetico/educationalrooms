Feature: Gerenciamento de questões
  Para gerenciamento de questões
  Como usuário
  Eu quero poder criar, atualizar e buscar questões

  Scenario Outline: Criar questão
    Given Dado que eu tenha criado uma questão
    When Quando eu criar <caso> atribuindo <propriedade>
    Then Então eu devo obter a mensagem <mensagem> depois de tentar criar

    Examples:
      | caso                                | propriedade                                                                                                                                                                                                                                           | mensagem                                                                         |
      | 'sem descrição'                     | '{"description": ""}'                                                                                                                                                                                                                                 | "Descrição inválida."                                                            |
      | 'sem respostas'                     | '{"answers": null}'                                                                                                                                                                                                                                   | "A questão deve ter 4 respostas."                                                |
      | 'com um número menor de respostas'  | '{"answers": [{}, {}, {}]}'                                                                                                                                                                                                                           | "A questão deve ter 4 respostas."                                                |
      | 'com um númerio maior de respostas' | '{"answers": [{}, {}, {}, {}, {}]}'                                                                                                                                                                                                                   | "A questão deve ter 4 respostas."                                                |
      | 'com alguma resposta sem descrição' | '{"answers": [{"description": "", "classification": "A"}, {"description": "teste", "classification": "B"}, {"description": "teste", "classification": "C"}, {"description": "teste", "classification": "D"}]}'                                        | "A questão possui respostas sem descrição."                                      |
      | 'sem resposta correta'              | '{"answers": [{"description": "teste", "classification": "A"}, {"description": "teste", "classification": "B"}, {"description": "teste", "classification": "C"}, {"description": "teste", "classification": "D"}]}'                                   | "A questão deve possuir 1 resposta correta."                                     |
      | 'mais de um resposta correta'       | '{"answers": [{"description": "teste", "classification": "A", "correct": true}, {"description": "teste", "classification": "B", "correct": true}, {"description": "teste", "classification": "C"}, {"description": "teste", "classification": "D"}]}' | "A questão deve possuir 1 resposta correta."                                     |
      | 'respostas repetidas'               | '{"answers": [{"description": "teste1", "classification": "A"}, {"description": "teste2", "classification": "B", "correct": true}, {"description": "teste3", "classification": "C"}, {"description": "teste3", "classification": "D"}]}'              | "Existem respostas repetidas."                                                   |
      | 'sem classificação necessária'      | '{"answers": [{"description": "teste1", "classification": "A"}, {"description": "teste2", "classification": "B", "correct": true}, {"description": "teste3", "classification": "C"}, {"description": "teste4", "classification": "C"}]}'              | "As respostas não possuem as classificações necessárias."                        |
      | 'sem área'                          | '{"area": ""}'                                                                                                                                                                                                                                        | "A questão deve ter uma área."                                                   |
      | 'sem categoria'                     | '{"category": ""}'                                                                                                                                                                                                                                    | "A categoria deve ter os seguintes valores: 'Iniciante,Intermediário,Avançado'." |
      | 'a questão completa'                | '{}'                                                                                                                                                                                                                                                  | "Criado com sucesso."                                                            |

  Scenario Outline: Atualizar questão
    Given Dado que eu tenha atualizado uma questão
    When Quando eu atualizar <caso> atribuindo <propriedade>
    Then Então eu devo obter a mensagem <mensagem> depois de tentar atualizar

    Examples:
      | caso                                | propriedade                                                                                                                                                                                                                                               | mensagem                                                                         |
      | 'sem descrição'                     | '{"description": ""}'                                                                                                                                                                                                                                     | "Descrição inválida."                                                            |
      | 'sem respostas'                     | '{"answers": null}'                                                                                                                                                                                                                                       | "A questão deve ter 4 respostas."                                                |
      | 'com um número menor de respostas'  | '{"answers": [{}, {}, {}]}'                                                                                                                                                                                                                               | "A questão deve ter 4 respostas."                                                |
      | 'com um número maior de respostas'  | '{"answers": [{}, {}, {}, {}, {}]}'                                                                                                                                                                                                                       | "A questão deve ter 4 respostas."                                                |
      | 'com alguma resposta sem descrição' | '{"answers": [{"description": "", "classification": "A"}, {"description": "teste", "classification": "B"}, {"description": "teste", "classification": "C"}, {"description": "teste", "classification": "D"}]}'                                            | "A questão possui respostas sem descrição."                                      |
      | 'mais de uma resposta correta'      | '{"answers": [{"description": "teste1", "classification": "A"}, {"description": "teste2", "classification": "B"}, {"description": "teste3", "classification": "C"}, {"description": "teste4", "classification": "D"}]}'                                   | "A questão deve possuir 1 resposta correta."                                     |
      | 'sem resposta correta'              | '{"answers": [{"description": "teste1", "classification": "A", "correct": true}, {"description": "teste2", "classification": "B", "correct": true}, {"description": "teste3", "classification": "C"}, {"description": "teste4", "classification": "D"}]}' | "A questão deve possuir 1 resposta correta."                                     |
      | 'respostas repetidas'               | '{"answers": [{"description": "teste1", "classification": "A"}, {"description": "teste2", "classification": "B", "correct": true}, {"description": "teste3", "classification": "C"}, {"description": "teste3", "classification": "D"}]}'                  | "Existem respostas repetidas."                                                   |
      | 'sem classificação necessária'      | '{"answers": [{"description": "teste1", "classification": "A"}, {"description": "teste2", "classification": "B", "correct": true}, {"description": "teste3", "classification": "C"}, {"description": "teste4", "classification": "C"}]}'                  | "As respostas não possuem as classificações necessárias."                        |
      | 'com outro usuário'                 | '{"id": 2}'                                                                                                                                                                                                                                               | "Usuário sem permissão para alterar o item."                                     |
      | 'sem área'                          | '{"area": ""}'                                                                                                                                                                                                                                            | "A questão deve ter uma área."                                                   |
      | 'sem categoria'                     | '{"category": ""}'                                                                                                                                                                                                                                        | "A categoria deve ter os seguintes valores: 'Iniciante,Intermediário,Avançado'." |
      | 'a questão completa'                | '{}'                                                                                                                                                                                                                                                      | "Atualizado com sucesso."                                                        |

  Scenario: Obter questões do usuário logado
    Given Dado que eu esteja logado e queira obter minhas questões
    When Quando eu buscar as questões
    Then Então eu devo obter somente as minhas questões

  Scenario: Obter as questões compartilhadas por outros usuários
    Given Dado que eu queira obter as questões compartilhadas por outros usuários
    When Quando eu buscar as questões compartilhadas
    Then Então eu devo obter somente as questões compartilhadas por outros usuários

  Scenario: Obter questão por id
    Given Dado que eu queira obter uma questão pelo id
    When Quando eu buscar a questão
    Then Então eu devo obter uma questão

  Scenario: Obter minhas categorias
    Given Dado que eu queira obter áreas já cadastradas
    When Quando eu buscar as áreas
    Then Então eu quero obter uma lista das áreas

  Scenario Outline: Remover questão
    Given Dado que eu queira remover uma questão
    When Quando eu enviar o id de uma questão <caso> <id>
    Then Então eu devo obter a mensagem <mensagem> depois de tentar remover a questão

    Examples:
      | id | caso                  | mensagem                                     |
      | 4  | 'que me pertence'     | "Questão removida com sucesso."              |
      | 2  | 'que não me pertence' | "Usuário sem permissão para remover o item." |
      | 99 | 'que não existe'      | "A questão não existe."                      |

  Scenario Outline: Compartilhamento da questão
    Given Dado que eu queira alterar o compartilhamento de uma questão
    When Quando eu enviar o id de uma <caso> <id> a ser ou não compartilhada
    Then Então eu devo obter a mensagem <mensagem> depois de alterar o compartilhamento

    Examples:
      | id | caso                          | mensagem                                     |
      | 6  | 'questão que me pertence'     | "Compartilhada com sucesso."                 |
      | 5  | 'questão que não me pertence' | "Usuário sem permissão para alterar o item." |
      | 99 | 'questão que não existe'      | "A questão não existe."                      |