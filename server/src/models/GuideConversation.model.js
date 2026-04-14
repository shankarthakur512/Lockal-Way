import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    senderType: {
      type: String,
      enum: ["traveler", "guide"],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const guideConversationSchema = new Schema(
  {
    guide: {
      type: Schema.Types.ObjectId,
      ref: "LocalGuide",
      required: true,
      index: true,
    },
    traveler: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    latestMessagePreview: {
      type: String,
      trim: true,
      default: "",
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

guideConversationSchema.index({ guide: 1, traveler: 1 }, { unique: true });

const GuideConversation = mongoose.model("GuideConversation", guideConversationSchema);

export default GuideConversation;
