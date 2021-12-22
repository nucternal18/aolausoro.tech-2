import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import user from "@testing-library/user-event";
import ContactForm from "./ContactForm";

describe("Login", () => {
  const submitHandler = jest.fn();
  beforeEach(() => {
    render(<ContactForm submitHandler={submitHandler} />);
  });

  // it("submitHandler is called when all field pass validation", async () => {
  //   user.type(getName(), "Johnny test");
  //   user.type(getEmail(), "adewoyin@aolausoro.tech");
  //   user.type(getSubject(), "Test");
  //   user.type(getMessage(), "This is a Test");

  //   clickSubmitButton();
  //   await waitFor(() => expect(submitHandler).toHaveBeenCalledTimes(1));
  //   const newMessage = {
  //     name: "Johnny test",
  //     email: "adewoyin@aolausoro.tech",
  //     subject: "Test",
  //     message: "This is a Test",
  //   };
  //   expect(submitHandler).toHaveBeenCalledWith(newMessage);
  // });

  it("has 2 required fields", async () => {
    clickSubmitButton();
    await waitFor(() =>
      expect(getName()).toHaveErrorMessage("This is required")
    );
    await waitFor(() =>
      expect(getEmail()).toHaveErrorMessage("This is required")
    );
    await waitFor(() =>
      expect(getSubject()).toHaveErrorMessage("This is required")
    );
    await waitFor(() =>
      expect(getMessage()).toHaveErrorMessage("This is required")
    );
  });
});

function clickSubmitButton() {
  return fireEvent.click(screen.getByRole("button", { name: /send/i }));
}

function getName() {
  return screen.getByLabelText("name-input");
}

function getEmail() {
  return screen.getByLabelText("email-input");
}

function getSubject() {
  return screen.getByLabelText("subject-input");
}

function getMessage() {
  return screen.getByLabelText("message-input");
}
