import { FaPlusCircle } from "react-icons/fa";

const UploadForm = ({
  changeHandler,
  register,
  handleSubmit,
  onSubmit,
  imageUrl,
  errors,
}) => {
  return (
    <section>
      <form
        className="flex flex-col items-center justify-center w-full p-6 mb-4 text-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-6 text-3xl">
          <label>
            <FaPlusCircle className="dark:text-gray-300" />
            <input type="file" onChange={changeHandler} className="hidden" />
          </label>
        </div>

        <div>
          {imageUrl && <p className="truncate">{imageUrl}</p>}
          {/* {file && <ProgressBar file={file} setFile={setFile} setUrl={setUrl} />} */}
        </div>

        <div className="flex flex-col w-full mx-auto">
          <div className="mb-6 md:flex md:items-center">
            <label
              className="block mb-1 font-bold text-gray-500 md:text-right md:mb-0"
              htmlFor="project-name"
            />

            <input
              className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500"
              id="project-name"
              placeholder="Project Name"
              type="text"
              name="project-name"
              aria-label="project-name-input"
              aria-errormessage="project-name-error"
              aria-invalid="true"
              {...register("projectName", {
                required: "This is required",
                maxLength: {
                  value: 20,
                  message: "Maximum number of characters is 20",
                },
                pattern: {
                  value: /^[A-Za-z -]+$/,
                  message: "Please enter your name",
                },
              })}
            />
          </div>
          {errors.projectName && (
            <span
              id="project-name-error"
              className="text-gray-800 dark:text-yellow-500"
            >
              {errors.projectName.message}
            </span>
          )}
          <div className="mb-6 md:flex md:items-center ">
            <label
              className="block mb-1 font-bold text-gray-500 md:text-right md:mb-0"
              htmlFor="github"
            />
            <input
              className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500"
              id="github"
              type="text"
              name="github"
              placeholder="Github Address"
              aria-label="github-input"
              aria-errormessage="github-error"
              aria-invalid="true"
              {...register("github", {
                required: "This is required",
                maxLength: 20,
                pattern: {
                  value: /^[A-Za-z -]+$/,
                  message: "Please enter your name",
                },
              })}
            />
          </div>
          {errors.github && (
            <span
              id="github-error"
              className="text-gray-800 dark:text-yellow-500"
            >
              {errors.github.message}
            </span>
          )}
          <div className="mb-6 md:flex md:items-center ">
            <label
              className="block mb-1 font-bold text-gray-500 md:text-right md:mb-0"
              htmlFor="url-address"
            />

            <input
              className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500"
              id="url-address"
              type="text"
              name="url-address"
              placeholder="Web Address"
              aria-label="url-address-input"
              aria-errormessage="url-address-error"
              aria-invalid="true"
              {...register("address", {
                required: "This is required",
                maxLength: 20,
                pattern: {
                  value: /^[A-Za-z -]+$/,
                  message: "Please enter your name",
                },
              })}
            />
          </div>
          {errors.address && (
            <span
              id="url-address-error"
              className="text-gray-800 dark:text-yellow-500"
            >
              {errors.address.message}
            </span>
          )}
          <div className="md:flex md:items-center">
            <div className="w-full mx-auto">
              <button
                className="w-full px-4 py-2 font-bold text-blue-700 border-2 border-blue-700 rounded dark:border-transparent dark:bg-yellow-500 dark:text-gray-100 hover:bg-blue-700 dark:hover:bg-yellow-700 focus:outline-none focus:shadow-outline hover:text-white"
                type="submit"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default UploadForm;
