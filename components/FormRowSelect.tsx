interface IFormRowSelect {
  name: string;
  type: string;
  list: string[];
  register: any;
}

const FormRowSelect = ({ register, list, errors, name, type }) => {
  return (
    <div className="mb-4 w-full">
      <label
        htmlFor="jobType"
        className="block mb-2 text-base font-bold text-gray-700"
      >
        {name}
      </label>
      <select
        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow-md appearance-none focus:outline-none focus:shadow-outline dark:bg-gray-100"
        id={`${type}`}
        aria-label={`${type}-input`}
        aria-errormessage={`${type}-error`}
        name={`${type}`}
        aria-invalid="true"
        {...register(`${type}`)}
      >
        {list?.map((itemValue, index) => {
          return (
            <option key={`${index} + ${itemValue}`} value={itemValue}>
              {itemValue}
            </option>
          );
        })}
      </select>

      {errors && (
        <span
          id={`${type}-error`}
          className="text-gray-800 dark:text-yellow-500"
        >
          {errors.message}
        </span>
      )}
    </div>
  );
};

export default FormRowSelect;
