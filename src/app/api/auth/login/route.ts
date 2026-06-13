import { NextResponse } from "next/server";
import { createSession, verifyLogin } from "@/lib/auth";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit({ key: getRateLimitKey(request, "login"), limit: 10, windowMs: 15 * 60 * 1000 });
    if (!rateLimit.allowed) {
      return NextResponse.json({ message: "Terlalu banyak percobaan login. Coba lagi nanti." }, { status: 429 });
    }

    const payload = loginSchema.parse(await request.json());
    const user = await verifyLogin(payload.email, payload.password);
    if (!user) return NextResponse.json({ message: "Email atau password salah" }, { status: 401 });
    await createSession(user.id);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ message: "Data login tidak valid" }, { status: 400 });
  }
}
