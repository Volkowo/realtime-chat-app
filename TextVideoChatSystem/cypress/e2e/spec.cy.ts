describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('Sign In')
  })
})

describe('Group Chat', () => {
  beforeEach(() => {
    cy.visit('/login');

    // wait for inputs and type credentials
    cy.get('input[name=username]').should('be.visible').type('super');
    cy.get('input[name=pass]').type('123');

    // click the login button (type=button)
    cy.get('button').contains('Submit').click();

    // wait until redirected to group chat page
    cy.url().should('include', '/group');
  });

  it('should allow user to select a group and channel', () => {
    // Select a group
    cy.contains('TestGroup').click();

    // Select a channel
    cy.contains('general').click();

    // The current chat container should be visible
    cy.get('#chatContainer').should('be.visible');
  });

  it('should send a text message and display it', () => {
    const message = 'Hello Cypress!';
    // Select a group
    cy.contains('TestGroup').click();

    // Select a channel
    cy.contains('general').click();
      
    cy.get('input[name=messageContent]').scrollIntoView().should('be.visible').type(message);

    cy.get('form').submit();

    // Message should appear in chat container
    cy.get('#chatContainer').contains(message).should('exist');
  });

  it('should allow user to attach and send an image', () => {
    cy.contains('TestGroup').click();
    cy.contains('general').click();

    cy.get('input[type=file]').scrollIntoView().selectFile('cypress/fixtures/disabledToilet.webp', { force: true });
    cy.get('form').submit();

    // Wait for the message to render
    cy.get('#chatContainer img').should('be.visible');
  });

  it('should clear chat when switching channels', () => {
    cy.contains('TestGroup').click();
    cy.contains('general').click();

    cy.get('input[name=messageContent]').type('Switch test');
    cy.get('form').submit();

    cy.contains('random').click(); // switch channel
    cy.get('#chatContainer').should('not.contain', 'Switch test');
  });

  it('should log out and redirect to login page', () => {
    cy.visit('/profile');
    cy.get('button').contains('Logout').click();
    cy.url().should('include', '/');
    cy.contains('Sign In')
  });

  it('should display messages from other users in real-time', () => {
    cy.task('insertChatMessage', {
      group: 'TestGroup',
      channel: 'general',
      user: 'otherUser',
      message: 'Hey there!'
    });

    cy.contains('TestGroup').click();
    cy.contains('general').click();

    cy.get('#chatContainer').scrollIntoView().contains('Hey there!').should('exist');
  });
});
