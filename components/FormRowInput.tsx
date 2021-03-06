import React from "react";
import { FieldError } from "react-hook-form";

interface IFormRowSelect {
  title: string;
  name?: string;
  type: string;
  inputType: string;
  register: any;
  errors: FieldError | undefined;
}

const FormRowInput = ({
  title,
  register,
  errors,
  type,
  inputType,
}: IFormRowSelect) => {
  return (
    <div className="mb-4 w-full">
      <label
        htmlFor="position"
        className="block mb-2 text-base font-bold text-gray-900 dark:text-gray-200"
      >
        {title}
      </label>
      <input
        className="w-full px-3 py-2 leading-tight text-gray-900 border rounded shadow-md appearance-none focus:outline-none focus:shadow-outline dark:bg-white"
        id={`${type}`}
        type={`${inputType}`}
        placeholder={`${title}`}
        aria-label={`${type}-input`}
        aria-errormessage={`${type}-error`}
        name={`${type}`}
        aria-invalid="true"
        {...register(`${type}`, {
          required: "This is required",
          minLength: {
            value: 2,
            message: "Please enter a name with at least 2 characters",
          },
          pattern: {
            value: /^[A-Za-z\s, -]+$/,
            message: "Please enter a valid name",
          },
        })}
      />
      {errors && (
        <span
          id={`${type}-error`}
          className="text-gray-800 dark:text-yellow-500"
        >
          {errors?.message}
        </span>
      )}
    </div>
  );
};

export default FormRowInput;
