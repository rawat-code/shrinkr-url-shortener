import { createHash, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(nodeScrypt);
type User = { id: string; name: string; email: string; passwordHash: string };
const users = new Map<string, User>();
const sessions = new Map<string, string>();

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, encoded] = stored.split(":");
  if (!salt || !encoded) return false;
  const expected = Buffer.from(encoded, "hex");
  const actual = (await scrypt(password, salt, 64)) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function registerUser(name: string, email: string, password: string): Promise<string> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!name.trim() || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) throw new Error("Enter a valid name and email.");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");
  if (users.has(normalizedEmail)) throw new Error("An account with that email already exists.");
  const user: User = { id: randomBytes(12).toString("hex"), name: name.trim(), email: normalizedEmail, passwordHash: await hashPassword(password) };
  users.set(normalizedEmail, user);
  return createSession(user.id);
}

export async function loginUser(email: string, password: string): Promise<string> {
  const user = users.get(email.trim().toLowerCase());
  if (!user || !(await verifyPassword(password, user.passwordHash))) throw new Error("Email or password is incorrect.");
  return createSession(user.id);
}

function createSession(userId: string): string { const token = createHash("sha256").update(randomBytes(32)).digest("hex"); sessions.set(token, userId); return token; }