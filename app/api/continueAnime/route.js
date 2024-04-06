import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

await connectDB();

export const POST = async (req) => {
  try {
    const { animeId, userEmail } = await req.json();
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.continueWatching.some((anime) => anime.animeId === animeId)) {
      user.continueWatching = user.continueWatching.filter(
        (anime) => anime.animeId !== animeId
      );
      await user.save();
      return NextResponse.json({
        status: 201,
        body: {
          message: "Anime removed from continue watching list",
        },
      });
    }
  } catch (error) {
    return NextResponse.json({ status: 400, body: { message: error.message } });
  }
};
export const PUT = async (req) => {
  try {
    const {
      animeId,
      continueTime,
      episodeNumber,
      totalTime,
      name,
      poster,
      userEmail,
    } = await req.json();
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      throw new Error("User not found");
    }

    const existingAnimeIndex = user.continueWatching.findIndex(
      (item) => item.animeId === animeId
    );

    if (existingAnimeIndex !== -1) {
      // Item already exists in continueWatching array
      const existingAnime = user.continueWatching[existingAnimeIndex];

      // Update existing item and move it to the top (beginning) of the array
      existingAnime.animeId = animeId;
      existingAnime.continueTime = continueTime;
      existingAnime.totalTime = totalTime;
      existingAnime.episodeNumber = episodeNumber;
      existingAnime.name = name;
      existingAnime.poster = poster;

      // Move the existing item to the beginning of the array
      user.continueWatching.splice(existingAnimeIndex, 1); // Remove the existing item
      user.continueWatching.unshift(existingAnime); // Add the updated item at the beginning
    } else {
      // Item is not in continueWatching array, add it to the top
      const newItem = {
        animeId,
        continueTime,
        totalTime,
        episodeNumber,
        name,
        poster,
      };

      // Add new item at the beginning of the array
      user.continueWatching.unshift(newItem);
    }

    await user.save();
    return NextResponse.json({
      status: 200,
      body: {
        message: "Anime added to Continue watching successfully",
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 400,
      body: {
        message: error.message,
      },
    });
  }
};
