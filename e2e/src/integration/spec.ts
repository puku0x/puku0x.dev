describe('App', () => {
  it('should display welcome message', () => {
    cy.visit('/');
    cy.contains('Welcome');
    cy.contains('website app is running!');
  });
});
