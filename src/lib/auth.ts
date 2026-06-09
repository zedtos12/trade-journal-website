import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";

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

const nowIso = () => new Date().toISOString();

export function findUserByEmail(email: string): (User & { password_hash: string }) | undefined {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as (User & { password_hash: string }) | undefined;
}

export function findUserById(id: string): User | undefined {
  return db
    .prepare("SELECT id, name, email, preferred_currency, created_at, updated_at FROM users WHERE id = ?")
    .get(id) as User | undefined;
}

export async function createUser(input: { name: string; email: string; password: string }) {
  if (findUserByEmail(input.email)) {
    throw new Error("EMAIL_TAKEN");
  }

  const timestamp = nowIso();
  const user = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    password_hash: await bcrypt.hash(input.password, 12),
    preferred_currency: "USD",
    created_at: timestamp,
    updated_at: timestamp,
  };

  db.prepare(
    `INSERT INTO users (id, name, email, password_hash, preferred_currency, created_at, updated_at)
     VALUES (@id, @name, @email, @password_hash, @preferred_currency, @created_at, @updated_at)`,
  ).run(user);

  return findUserById(user.id)!;
}

export async function verifyLogin(email: string, password: string) {
  const user = findUserByEmail(email);
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return null;
  return findUserById(user.id)!;
}

export async function createSession(userId: string) {
  const id = randomUUID();
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  db.prepare("INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)").run(
    id,
    userId,
    expires.toISOString(),
    nowIso(),
  );

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

  const session = db
    .prepare("SELECT user_id, expires_at FROM sessions WHERE id = ?")
    .get(sessionId) as { user_id: string; expires_at: string } | undefined;

  if (!session || new Date(session.expires_at) < new Date()) return null;
  return findUserById(session.user_id) ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
  cookieStore.delete(SESSION_COOKIE);
}
