import connectDB from "@/lib/mongodb";
import Room from "@/models/room";
import { NextResponse } from "next/server";
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  if (!roomId) {
    return new Response(JSON.stringify({ error: "Room ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Prepare the response for Event Stream
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });

  const stream = new ReadableStream({
    start(controller) {
      connectDB().then(async () => {
        const collection = Room.collection;

        const pipeline = [{ $match: { "documentKey._id": `${roomId}` } }];
        const changeStream = collection.watch(pipeline, {
          fullDocument: "updateLookup",
        });

        // Write ping messages to keep the connection alive
        const keepAliveInterval = setInterval(() => {
          controller.enqueue(
            `data: ${JSON.stringify({ ping: "keep-alive" })}\n\n`
          );
        }, 20000); // Send a ping every 20 seconds

        changeStream.on("change", (change) => {
          controller.enqueue(`data: ${JSON.stringify(change)}\n\n`);
        });

        req.signal.addEventListener("abort", () => {
          changeStream.close();
          clearInterval(keepAliveInterval); // Cleanup keep-alive interval
          controller.close();
        });
      });
    },
  });

  return new Response(stream, { headers });
}
export async function POST(req) {
  await connectDB();
  try {
    const { currentTime, playing, roomId } = await req.json();
    if (!roomId) {
      throw new Error("Invalid Request");
    }

    // Update the room
    const updatedRoom = await Room.findOneAndUpdate(
      { _id: roomId },
      { currentTime, playing },
      { new: true }
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
export async function PUT(req) {
  await connectDB();
  try {
    const { roomId, isHost, currentTime } = await req.json();
    if (!roomId) {
      throw new Error("Invalid Request");
    }

    if (!isHost) {
      const room = await Room.findOne({ _id: roomId }).select("currentTime");
      if (!room) {
        throw new Error("Room not found");
      } else {
        const newCurrentTime = room.currentTime;
        return NextResponse.json({
          status: 201,
          body: { newCurrentTime: newCurrentTime },
        });
      }
    } else {
      const room = await Room.findOneAndUpdate(
        { _id: roomId },
        { currentTime: currentTime },
        { new: true }
      ).select("currentTime");
      if (!room) {
        throw new Error("Room not found");
      } else {
        const newCurrentTime = room.currentTime;
        return NextResponse.json({
          status: 201,
          body: { newCurrentTime: newCurrentTime },
        });
      }
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: { message: error.message },
    });
  }
}
