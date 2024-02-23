import { prisma } from "~/libs";


export async function createDashData({ ...data }) {
  const customerState = "Pending";
  const newData = { ...data, customerState };

  try {
    const finance = await prisma.dashboard.create({
      data: newData,
    });
    return finance;
  } catch (error) {
    console.error("Error creating finance:", error);
    throw error;
  }
}
