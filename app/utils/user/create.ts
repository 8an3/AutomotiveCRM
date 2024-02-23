import type { User } from "@prisma/client";
import { prisma } from "~/libs";

export async function createUser(data: Pick<User, "email">) {
  return prisma.user.create({ data: { ...data } });
}
