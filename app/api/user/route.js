import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

await connectDB();
export const POST = async (req) => {
  try {
    const { email } = await req.json();
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    } else {
      return NextResponse.json({
        status: 201,
        body: { user },
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: { message: error.message },
    });
  }
};
export const PUT = async (req) => {
  try {
    const { email, username, password } = await req.json();
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    } else {
      user.username = username;
      user.password = password;
      await user.save();
      return NextResponse.json({
        status: 201,
        body: { user },
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: { message: error.message },
    });
  }
};
