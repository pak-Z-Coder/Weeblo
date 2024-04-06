import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

await connectDB();
export const POST = async (req) => {
  try {
    const { email, password } = await req.json();
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    } else if (user.password != password) {
      throw new Error("Incorrect Password!");
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
