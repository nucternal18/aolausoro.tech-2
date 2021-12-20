import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import user from "@testing-library/user-event";
import RegisterForm from "./RegisterForm";

describe("Register", () => {
  const submitHandler = jest.fn();
  const errors = {
    name: {
      message: "This is required",
    },
    email: {
      message: "This is required",
    },
    password: {
      message: "This is required",
    },
    confirmPassword: {
      message: "This is required",
    },
  };
  const handleSubmit = jest.fn();
  const register = jest.fn();

  beforeEach(() => {
    submitHandler.mockClear();

    render(
      <RegisterForm
        submitHandler={submitHandler}
        errors={errors}
        handleSubmit={handleSubmit}
        register={register}
      />
    );
  });

  // it("submitHandler is called when all field pass validation", async () => {
  //   user.type(getName(), "nucternal");
  //   user.type(getEmail(), "adewoyin@aolausoro.tech");
  //   user.type(getPassword(), "P@ssword1");
  //   user.type(getConfirmPassword(), "P@ssword1");

  //   fireEvent.submit(screen.getByTestId("register-form"));
  //   await waitFor(() => expect(submitHandler).toHaveBeenCalledTimes(1));
  //   const formData = {
  //     name: "nucternal",
  //     email: "adewoyin@aolausoro.tech",
  //     password: "P@ssword1",
  //     confirmPassword: "P@ssword1",
  //   };
  //   expect(submitHandler).toHaveBeenCalledWith(formData);
  // });

  it("has 4 required fields", async () => {
    clickSubmitButton();
    await waitFor(() =>
      expect(getName()).toHaveErrorMessage("This is required")
    );
    await waitFor(() =>
      expect(getEmail()).toHaveErrorMessage("This is required")
    );
    await waitFor(() =>
      expect(getPassword()).toHaveErrorMessage("This is required")
    );
    await waitFor(() =>
      expect(getConfirmPassword()).toHaveErrorMessage("This is required")
    );
  });
});

function clickSubmitButton() {
  return fireEvent.click(screen.getByRole("button", { name: /register/i }));
}

function getName() {
  return screen.getByLabelText("name-input");
}
function getEmail() {
  return screen.getByLabelText("email-input");
}

function getPassword() {
  return screen.getByLabelText("password-input");
}
function getConfirmPassword() {
  return screen.getByLabelText("confirm-password-input");
}
