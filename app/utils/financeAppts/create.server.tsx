import { useRootLoaderData } from "~/hooks";
import { prisma } from "~/libs";

export async function createfinanceApt(user, clientAptsData, formData) {
  try {
    const finance = await prisma.clientApts.create({
      data: {
        ...clientAptsData,
        userId: user.id,
        financeId: formData.financeId,
      }
    });
    console.log("clientApts created successfully");
    return finance;
  } catch (error) {
    console.error("Error creating clientApts:", error);
    throw error;
  }
}
