import { MdCloudUpload } from "react-icons/md";

interface IUploadForm {
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadForm = ({ changeHandler }: IUploadForm) => {
  return (
    <form className="flex flex-col items-center justify-center w-full h-full p-6 mb-4 text-center">
      <div className="flex w-full h-full justify-start">
        <label htmlFor="main-image" className="flex w-full h-full">
          <div className="flex w-full h-full cursor-pointer items-center justify-center border-2 border-gray-200 p-2">
            <div className="flex items-center justify-center w-full h-full flex-col border-4 border-dashed hover:border-gray-300 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-7">
                <MdCloudUpload className="text-gray-300" fontSize={44} />
                <p className="text-gray-300">Select Image</p>
                <input
                  id="main-image"
                  type="file"
                  accept="image/*"
                  aria-label="main-image"
                  className="w-full cursor-pointer opacity-0"
                  onChange={changeHandler}
                />
              </div>
            </div>
          </div>
        </label>
      </div>
    </form>
  );
};

export default UploadForm;
