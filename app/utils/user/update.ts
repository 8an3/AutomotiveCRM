import type { User } from '@prisma/client'
import { prisma } from "~/libs";

type UpdateUserSelector = {
  id?: User['id']
  email?: User['email']
}

export async function updateUser(selector: UpdateUserSelector, data: Partial<User>) {
  const { id, email } = selector

  if (id) return prisma.user.update({ where: { id }, data: { ...data } })
  if (email) return prisma.user.update({ where: { email }, data: { ...data } })

  return null
}

export async function updateUserById(id: User['id'], user: Partial<User>) {
  return prisma.user.update({
    where: { id },
    data: { ...user },
  })
}
