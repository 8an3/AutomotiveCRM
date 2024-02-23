import { prisma } from "~/libs";

export async function getDocsbyUserId(UserId) {
  try {
    const getDocs = await prisma.saveMyDoc.findMany({
      where: {
        userId: UserId,
      },
    });

    return getDocs;
  } catch (error) {
    console.error("Error fetching client file by email:", error);
    throw error;
  }
}
