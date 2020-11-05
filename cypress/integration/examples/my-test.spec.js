/// <reference types="cypress" />

describe('Test creating sistems', () => {
  beforeEach(() => {
    cy.server()
    cy.visit('http://localhost:3000')
    cy.wait(500)
  })

  it('Creates a requirement!', () => {
    cy.route({
      method: 'POST',
      url: '**/non-func-reqs',
      response: {
        nameReq: 'performance',
        id: 4,
      },
    })
    cy.contains('New System').click()

    cy.get('[data-cy=reqTextField]').type('performance').type('{enter}')

    cy.get('[data-cy=checkbox-4]')
  })

  it('Creates a system without requirements!', () => {
    cy.route({
      method: 'POST',
      url: '**/sistema',
      response: {
        name: 'Sistema 1',
        id: 40,
        nonFuncReqs: [],
      },
    })
    cy.contains('New System').click()

    cy.get('[data-cy=nameTextField]').type('Sistema 1')
    cy.get('[data-cy=descriptionTextField]').type('Descrição do sistema 1')

    cy.contains('Create').click()

    cy.contains('Sistema 1')
  })

  it('Creates a system with requirements!', () => {
    cy.route({
      method: 'POST',
      url: '**/sistema',
      response: {
        name: 'Sistema 1',
        description: 'Descrição do sistema 1',
        id: 40,
        nonFuncReqs: [
          {
            nameReq: 'escalabilidade',
            id: 1,
          },
          {
            nameReq: 'segurança',
            id: 2,
          },
          {
            nameReq: 'usabilidade',
            id: 3,
          },
        ],
      },
    })
    cy.contains('New System').click()

    cy.get('[data-cy=nameTextField]').type('Sistema 1')
    cy.get('[data-cy=descriptionTextField]').type('Descrição do sistema 1')
    cy.get('[data-cy=checkbox-1]').check({ force: true })
    cy.get('[data-cy=checkbox-2]').check({ force: true })
    cy.get('[data-cy=checkbox-3]').check({ force: true })

    cy.contains('Create').click()

    cy.contains('Sistema 1')
  })
})
