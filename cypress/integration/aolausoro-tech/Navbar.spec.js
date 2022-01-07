/* eslint-disable no-undef */

describe("navigation", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit("/");
  });
  it("should navigate to the home page", () => {
    cy.get('a[href="/"]').click();
    cy.url().should("include", /home/i);
    cy.get("h1").contains(/welcome to my portfolio/i);
  });
});
