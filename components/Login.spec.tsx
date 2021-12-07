import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import Login from "./Login";

describe("Login", () => {
  const handleLogin = jest.fn();

  beforeEach(() => {
    handleLogin.mockClear();
    render(<Login handleLogin={handleLogin} error="login failed" />);
  });

  it("handleLogin is called when all field pass validation", async () => {
    user.type(getEmail(), "adewoyin@aolausoro.tech");

    user.type(getPassword(), "P@ssword1");

    clickSubmitButton();
    await waitFor(() => expect(handleLogin).toHaveBeenCalledTimes(1));
    expect(handleLogin).toHaveBeenCalledWith({
      email: "adewoyin@aolausoro.tech",
      password: "P@ssword1",
    });
  });

  it("has 2 required fields", async () => {
    clickSubmitButton();
    await waitFor(() =>
      expect(getEmail()).toHaveErrorMessage("This is required")
    );
    await waitFor(() =>
      expect(getPassword()).toHaveErrorMessage("This is required")
    );
  });
});

function clickSubmitButton() {
  return user.click(screen.getByRole("button", { name: /login/i }));
}

function getEmail() {
  return screen.getByLabelText("email-input");
}

function getPassword() {
  return screen.getByLabelText("password-input");
}
