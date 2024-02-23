import { prisma } from "~/libs";

export async function updateClientFile(clientfileId, financeData) {
  try {
    const clientFile = await prisma.clientfile.update({
      where: {
        id: clientfileId,
      },
      data: { ...financeData },
    });
    console.log("ClientFile updated successfully");
    return { clientFile };
  } catch (error) {
    console.error("Error retrieving ClientFile, Finance, and DashData:", error);
    throw error;
  }
}
