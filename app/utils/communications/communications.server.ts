import { prisma } from "~/libs";

export async function CreateCommunications(comdata) {
  try {
    const finance = await prisma.communicationsOverview.create({
      data: comdata,
    });
    console.log("Created finance:", finance);
    return finance;
  } catch (error) {
    console.error("Error creating finance:", error);
    throw error;
  }
}
export async function getComsOverview(email) {
  try {
    const finance = await prisma.comm.findMany({
      where: {
        userEmail: email,
      },
    });
    return finance;
  } catch (error) {
    console.error("Error creating finance:", error);
    throw error;
  }
}
