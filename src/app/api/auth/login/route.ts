import { NextResponse } from "next/server";
import { createSession, verifyLogin } from "@/lib/auth";
import { loginSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const payload = loginSchema.parse(await request.json());
    const user = await verifyLogin(payload.email, payload.password);
    if (!user) return NextResponse.json({ message: "Email atau password salah" }, { status: 401 });
    await createSession(user.id);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ message: "Data login tidak valid" }, { status: 400 });
  }
}
