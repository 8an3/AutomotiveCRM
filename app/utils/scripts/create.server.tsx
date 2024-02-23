import { prisma } from "~/libs";


export async function createSalesScript({ email, content, id, name, category, subCat }) {
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new Error('User not found')
    }
    const contents = await prisma.script.create({
      data: {
        email,
        content,
        category,
        subCat,
      },
    })
    //console.log('finance created successfully')
    return contents
  } catch (error) {
    console.error('Error creating finance:', error)
    throw new Error('Failed to create finance')
  }
}

