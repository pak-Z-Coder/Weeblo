import Room from "@/models/room";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";
await connectDB();
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const user = await User.findById(id).select("username");
    if (user) {
      return NextResponse.json({
        status: 201,
        body: { username: user.username },
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: { message: error.message },
    });
  }
};
export const POST = async (req) => {
  try {
    const { userId, roomId } = await req.json();
    if (!userId || !roomId) {
      throw new Error("Invalid Request");
    }

    // Update the room and add the user to the users array
    const updatedRoom = await Room.findOneAndUpdate(
      { _id: roomId },
      { $addToSet: { users: userId } }, // Prevent duplicate entries
      { new: true } // Return the updated room
    ).populate({
      path: "host",
      select: "username",
    });

    if (!updatedRoom) {
      throw new Error("Room not found");
    } else {
      return NextResponse.json({
        status: 201,
        body: { room: updatedRoom },
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
    const { userId, roomId } = await req.json();
    if (!userId || !roomId) {
      throw new Error("Invalid Request");
    }

    // Update the room and add the user to the users array
    const updatedRoom = await Room.findOneAndUpdate(
      { _id: roomId },
      { $pull: { users: userId } }, // Prevent duplicate entries
      { new: true } // Return the updated room
    ).populate({
      path: "host",
      select: "username",
    });

    if (!updatedRoom) {
      throw new Error("Room not found");
    } else {
      return NextResponse.json({
        status: 201,
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: { message: error.message },
    });
  }
};
