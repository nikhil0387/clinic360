import mongoose from "mongoose";

const slotSchema = mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index:true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    expiry: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

slotSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

const Slot = mongoose.model("Slot", slotSchema);
export default Slot;
