import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import AddJobComponent from "../../../../components/forms/AddJobComponent";
import { authOptions } from "app/api/auth/[...nextauth]/route";

async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}

async function AddJob() {
  const session = await getSession();

  if (!session) {
    return redirect("/auth/login");
  }
  return <AddJobComponent />;
}

export default AddJob;
