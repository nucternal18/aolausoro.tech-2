/* eslint-disable no-undef */
// <reference types="cypress" />
describe("Aolausoro Tech Home Page", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit("/");
  });

  // afterEach(() => {
  //     cy.visit("/");
  // })
  it("should have the correct test on page load", () => {
    cy.contains(/hi there, i'm woyin\./i).should("be.visible");
    cy.contains(/i am a web & mobile application developer\./i).should(
      "be.visible"
    );
    cy.get("h1").should("exist");
  });

  it("should redirect to CV on clicking resume button", async () => {
    cy.get("[data-testid=cv-button]").should(
      "have.attr",
      "href",
      "https://firebasestorage.googleapis.com/v0/b/aolausoro-tech.appspot.com/o/Adewoyin%20Oladipupo-Usoro%20CV.pdf?alt=media&token=ab66f4d3-ae06-4edf-8084-52dd24b17de5"
    );
    cy.get("button").contains("Resume").click();
    await cy
      .url()
      .should(
        "include",
        "https://firebasestorage.googleapis.com/v0/b/aolausoro-tech.appspot.com/o/Adewoyin%20Oladipupo-Usoro%20CV.pdf?alt=media&token=ab66f4d3-ae06-4edf-8084-52dd24b17de5"
      );

    cy.go("back");
  });
});
