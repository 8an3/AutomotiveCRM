import type { User } from '@prisma/client'
import { prisma } from "~/libs";
import { getSession as sessionGet } from '~/sessions/auth-session.server'

type GetUserSelector = {
  id?: User['id']
  email?: User['email']
}

export async function getUser(selector: GetUserSelector) {
  const { id, email } = selector

  if (id) return prisma.user.findUnique({ where: { id } })
  if (email) return prisma.user.findUnique({ where: { email } })

  return null
}

export async function getUserById(id: User['id']) {
  return prisma.user.findUnique({
    where: { id },
  })
}

export async function getUserByEmail(email) {
  if (email) {
    //console.log('got user')
    return prisma.user.findUnique({ where: { email } })
  }
  return null
}

export async function getSession(request) {
  if (request) {
    //console.log('got user')
    return sessionGet(request.headers.get("Cookie"));
  }
  return null
}
