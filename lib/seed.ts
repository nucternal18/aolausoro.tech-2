import { database } from "context/authContext";
import { collection, getDocs } from "firebase/firestore";
import Project from "models/projectModel";
import db from "./db";

export async function seedDatabase(id) {
  const querySnapshot = await getDocs(collection(database, "projects"));
  await db.connectDB();
  querySnapshot.forEach(async (doc) => {
    // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, " => ", doc.data());
    const newProject = {
      projectName: doc.data().projectName,
      address: doc.data().address,
      github: doc.data().github,
      techStack: doc.data().techStack,
      url: doc.data().url,
      user: id,
    };
    const project = new Project(newProject);
    await project.save();
  });
  await db.disconnect();
}
