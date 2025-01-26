import { nanoid } from "nanoid";
import Room from "@/models/room";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

await connectDB();
export const GET = async (req) => {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url?.searchParams);
    let page = parseInt(searchParams?.get("page") || "1", 10);
    const limit = parseInt(searchParams?.get("limit") || "30", 10);
    const type = searchParams?.get("type") || "all";
    let uId = null;
    if (type == "mine") {
      uId = searchParams.get("uId");
    }
    let filter = {};
    if (type === "mine" && uId) {
      filter.host = uId; // Filter rooms where the host is the user
    }
    if (type === "private") {
      filter.passkey = { $ne: null }; // Rooms with a non-null passkey are private
    }
    if (type === "public") {
      filter.passkey = null; // Rooms with a null passkey are public
    }
    const total = await Room.countDocuments(filter);
    const skip = (page - 1) * limit;
    const rooms = await Room.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "host",
        select: "username",
      }).lean();

    if (!rooms) {
      throw new Error("Rooms not found");
    } else {
      return NextResponse.json({
        status: 201,
        body: {
          rooms,
          totalPages: Math.ceil(total / limit),
          currentPage: Number(page),
        },
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
    const { roomId } = await req.json();
    const room = await Room.findOne({ _id: roomId }).populate({
      path: "host",
      select: "username",
    });
    if (!room) {
      throw new Error("Room not found");
    } else {
      return NextResponse.json({
        status: 201,
        body: { room },
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: { message: error.message },
    });
  }
};
// --------------------
let isIndexCreated = false; // Tracks if the TTL index is created
export const PUT = async (req) => {
  try {
    const { host, anime, passkey } = await req.json();
    const roomId = nanoid(8); // Generate a unique room ID
    await Room.create({
      _id: roomId,
      anime,
      host,
      passkey,
    });
    // Ensure the TTL index is created only once
    if (!isIndexCreated) {
      const indexes = await Room.collection.indexes();
      const hasTTLIndex = indexes.some(
        (index) =>
          index.key?.createdAt === 1 && index.expireAfterSeconds === 21600
      );

      if (!hasTTLIndex) {
        await Room.collection.createIndex(
          { createdAt: 1 },
          { expireAfterSeconds: 21600 }
        );
        isIndexCreated = true; // Set the flag after creating the index
      }
    }
    return NextResponse.json({
      status: 201,
      body: { roomId, anime, host, passkey, currentTime: 0 },
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: { message: error.message },
    });
  }
};
