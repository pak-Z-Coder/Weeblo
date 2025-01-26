import mongoose, { Schema } from "mongoose";
const Anime = new Schema({
  name: String,
  epNo: Number,
  epId: String,
  category: String,
  poster: String,
});
const Message = new Schema({
  text: { type: String, required: true },
  username: { type: String, required: true },
});
const RoomSchema = new Schema({
  _id: { type: String, required: true },
  anime: { type: Anime, required: true },
  host: { type: Schema.Types.ObjectId, ref: "User", required: true },
  passkey: { type: String, default: null },
  currentTime: { type: Number },
  playing: { type: Boolean, default: false },
  messages: [Message],
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: {
    type: Date,
    default: Date.now,
    expireAfterSeconds: 21600, // TTL in seconds (6 hour = 21600 seconds)
  },
});
const Room = mongoose.models.Room || mongoose.model("Room", RoomSchema);
export default Room;
