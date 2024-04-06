import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

await connectDB();

export const POST = async (req) => {
  try {
    const { animeId, name, poster, userEmail } = await req.json();
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.savedAnime.some((anime) => anime.animeId === animeId)) {
      user.savedAnime = user.savedAnime.filter(
        (anime) => anime.animeId !== animeId
      );
      await user.save();
      return NextResponse.json({
        status: 201,
        message: "Anime removed from saved list",
      });
    } else {
      user.savedAnime = [...user.savedAnime, { animeId, name, poster }];
      await user.save();
      return NextResponse.json({
        status: 200,
        message: "Anime saved successfully",
      });
    }
  } catch (error) {
    return NextResponse.json({ status: 400, message: error.message });
  }
};
