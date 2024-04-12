import { json } from "stream/consumers";
import { prisma } from "~/libs";

export async function SaveCache(data) {

  let saveCache = await prisma.microCache.findUnique({ where: { userEmail: data.userEmail } })
  let updateCache;
  let createCache;
  if (data.intent === 'saveCache') {
    updateCache = await prisma.microCache.update({
      where: {
        userEmail: data.userEmail
      },
      data: {
        accessToken: data.accessToken,
        accessTokenExpiry: data.accessTokenExpiry,
        refreshToken: data.refreshToken,
      }
    })
    return json({ updateCache })
  } else {
    createCache = await prisma.microCache.create({
      where: {
        userEmail: data.userEmail
      },
      data: {
        userEmail: data.userEmail,
        accessToken: data.accessToken,
        accessTokenExpiry: data.accessTokenExpiry,
        refreshToken: data.refreshToken,
      }
    })
    return json({ createCache })

  }
}
