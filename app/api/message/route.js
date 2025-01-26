import connectDB from "@/lib/mongodb";
import Room from "@/models/room";
import { NextResponse } from "next/server";
export async function POST(req) {
  await connectDB();

  try {
    const { message, roomId } = await req.json();

    // Validate request data
    if (!message || !roomId || !message.username || !message.text) {
      return NextResponse.json(
        { error: "Invalid request. Missing required fields." },
        { status: 400 }
      );
    }

    // Update the room by adding the message
    const updatedRoom = await Room.findOneAndUpdate(
      { _id: roomId },
      { $addToSet: { messages: message } }, // Ensure no duplicate entries
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
}
