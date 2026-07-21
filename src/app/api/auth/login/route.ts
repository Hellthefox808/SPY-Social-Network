import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { encrypt, decrypt } from "@/lib/session";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sg_session")?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false });
    }
    const session = await decrypt(token);
    if (!session) {
      return NextResponse.json({ authenticated: false });
    }
    return NextResponse.json({ authenticated: true, user: session });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken, email } = body || {};

    if (!idToken) {
      return NextResponse.json({ success: false, error: "Missing ID token" }, { status: 400 });
    }

    const userEmail = email || "admin@socialgraph.local";
    const sessionToken = await encrypt({ userId: idToken, email: userEmail });

    const cookieStore = await cookies();
    cookieStore.set("sg_session", sessionToken, {
      maxAge: 7 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({ success: true, message: "Authentication successful", user: { email: userEmail } });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}


