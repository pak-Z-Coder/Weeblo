import mongoose, { Schema } from "mongoose";

const savedAnimeSchema = new Schema({
  animeId: String,
  name: String,
  poster: String,
});
const continueAnimeSchema = new Schema({
  animeId: String,
  name: String,
  poster: String,
  continueTime: Number,
  totalTime: Number,
  episodeNumber: Number,
});
const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedAnime: [savedAnimeSchema],
  continueWatching: [continueAnimeSchema],
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
