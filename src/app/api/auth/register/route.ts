import { NextResponse } from "next/server";
import { createSession, createUser } from "@/lib/auth";
import { registerSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const payload = registerSchema.parse(await request.json());
    const user = await createUser({ name: payload.name, email: payload.email, password: payload.password });
    await createSession(user.id);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_TAKEN") {
      return NextResponse.json({ message: "Email sudah dipakai" }, { status: 409 });
    }
    return NextResponse.json({ message: "Data register tidak valid" }, { status: 400 });
  }
}
