import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    address: {
      type: String,
      required: true,
    },
    github: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    techStack: {
      type: [String],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
