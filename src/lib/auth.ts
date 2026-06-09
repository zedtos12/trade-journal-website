import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";

export type User = {
  id: string;
  name: string;
  email: string;
  preferred_currency: string;
  created_at: string;
  updated_at: string;
};

const SESSION_COOKIE = "tj_session";
const SESSION_DAYS = 14;

function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  preferredCurrency: string;
  createdAt: Date;
  updatedAt: Date;
}): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    preferred_currency: user.preferredCurrency,
    created_at: user.createdAt.toISOString(),
    updated_at: user.updatedAt.toISOString(),
  };
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: string): Promise<User | undefined> {
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? toPublicUser(user) : undefined;
}

export async function createUser(input: { name: string; email: string; password: string }) {
  const existingUser = await findUserByEmail(input.email);
  if (existingUser) {
    throw new Error("EMAIL_TAKEN");
  }

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: await bcrypt.hash(input.password, 12),
      preferredCurrency: "USD",
    },
  });

  return toPublicUser(user);
}

export async function verifyLogin(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  return toPublicUser(user);
}

export async function createSession(userId: string) {
  const id = randomUUID();
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      id,
      userId,
      expiresAt: expires,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) return null;
  return toPublicUser(session.user);
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) await prisma.session.deleteMany({ where: { id: sessionId } });
  cookieStore.delete(SESSION_COOKIE);
}
