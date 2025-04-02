import { NextResponse } from "next/server";

export async function GET(req) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0] : "Unknown IP";

  console.log("User IP:", ip);
  return NextResponse.json({
    status: 201,
    body: { ip: ip },
  });
}
