import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 1800, // this is the expiry time in seconds - 30 mins
    },
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.models.Token || mongoose.model("Order", tokenSchema);

export default Token;
