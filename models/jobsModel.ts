import mongoose from "mongoose";

const JobsSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide a company"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide a company"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["Interviewing", "Declined", "Pending", "Offer"],
      default: "Pending",
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship"],
      default: "full-time",
    },
    jobLocation: {
      type: String,
      default: "my-city",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  { timestamps: true }
);

const Job = mongoose.models.Job || mongoose.model("Job", JobsSchema);
export default Job;
