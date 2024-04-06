import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

await connectDB();

export const POST = async (req) => {
  try {
    const { username, email, password } = await req.json();
    const user = {
      username,
      email,
      password,
      savedAnime: [],
      continueWatching: [],
    };

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      throw new Error("Email is already in use");
    }
    await User.create(user);
    return NextResponse.json({
      status: 201,
      body: { message: "Account created!", user },
    });
  } catch (error) {
    return NextResponse.json({
      status: 400,
      body: { message: error.message },
    });
  }
};
