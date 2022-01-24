import AdminLayout from "components/layout/AdminLayout";
import AddJobComponent from "../../../components/AddJobComponent";

function AddJob() {
  const submitHandler = async (newMessage) => {};
  return (
    <AdminLayout title="Admin - Add Job">
      <AddJobComponent submitHandler={submitHandler} />
    </AdminLayout>
  );
}

export default AddJob;
