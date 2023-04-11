import getUser from "lib/getUser";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import AddJobComponent from "../../../../components/forms/AddJobComponent";

function AddJob() {
  return <AddJobComponent />;
}

export default AddJob;
