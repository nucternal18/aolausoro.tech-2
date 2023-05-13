import { UserInfoProps } from "../lib/types";

interface IUserProfile {
  randomImage: string;
  user: UserInfoProps;
}

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full  w-20 outline-none";
const NotActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full  w-20 outline-none";

function UserProfileComponent({ randomImage, user }: IUserProfile) {
  return (
    <section className="relative pb-2 h-full justify-center items-center max-w-screen-lg mx-auto">
      <div className="flex flex-col pb-5">
        <div className="relative flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              className="w-full h-[300px] shadow-lg object-cover"
              src={randomImage}
              alt="banner-pic"
            />
            <img
              src={user?.image}
              alt="user-pic"
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user?.name}
            </h1>
          </div>

          <div className="px-2"></div>
        </div>
      </div>
    </section>
  );
}

export default UserProfileComponent;
