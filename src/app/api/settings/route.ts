import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { passwordChangeSchema, profileSettingsSchema } from "@/lib/validation/settings";

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = await request.json();
    if (payload.type === "password") {
      const input = passwordChangeSchema.parse(payload);
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (!dbUser) return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
      const valid = await bcrypt.compare(input.currentPassword, dbUser.passwordHash);
      if (!valid) return NextResponse.json({ message: "Password lama salah" }, { status: 400 });
      await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(input.newPassword, 12) } });
      return NextResponse.json({ ok: true });
    }

    const input = profileSettingsSchema.parse(payload);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name: input.name, preferredCurrency: input.preferredCurrency },
      select: { id: true, name: true, email: true, preferredCurrency: true },
    });
    return NextResponse.json({ user: updated });
  } catch {
    return NextResponse.json({ message: "Data settings tidak valid" }, { status: 400 });
  }
}
