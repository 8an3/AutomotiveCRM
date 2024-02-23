import { prisma } from "~/libs";



export async function updateSalesScript({ category, content, id, userId, name, subCat }) {
  try {
    return prisma.script.update({
      data: {
        content,
        category,
        userId,
        name,
        subCat,
      },
      where: {
        id: id,
      }
    })
  } catch (error) {
    console.error('Error occurred while updating script:', error)
  }
}
