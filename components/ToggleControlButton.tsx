import React from "react";

const ToggleControlButton = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (...event: any[]) => void;
}) => {
  return (
    <div className="flex items-center m-2 cursor-pointer mb-6">
      <label
        htmlFor="toggle-example-checked"
        className="flex items-center cursor-pointer relative"
      >
        <input
          type="checkbox"
          id="toggle-example-checked"
          className="sr-only"
          checked={value}
        />
        <div
          onClick={() => onChange(!value)}
          className={`toggle-bg ${
            value
              ? "bg-green-500 border-green-500"
              : "bg-red-500 border-red-500"
          } border-2 h-6 w-11 rounded-full`}
        >
          <div
            className={`rounded-full w-5 h-5 bg-white ${
              value ? "translate-x-2" : "-translate-x-2"
            } transform mx-auto duration-300 ease-in-out`}
          ></div>
        </div>
        <span className="ml-3 text-gray-900 dark:text-gray-100 text-sm font-medium">
          Published
        </span>
      </label>
    </div>
  );
};

export default ToggleControlButton;
