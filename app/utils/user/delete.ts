import type { User } from '@prisma/client'
import { prisma } from "~/libs";

export async function deleteUser(id: User['id']) {
  return prisma.user.delete({ where: { id } })
}
