import { prisma } from "~/libs";

export async function createFinanceStorage({ ...data }) {
  try {
    const finance = await prisma.financeStorage.create({
      data: {
        ...data,
      },
    });
    console.log('financeStorage created successfully')
    return finance;
  } catch (error) {
    console.error("Error creating financeStorage:", error);
    throw error;
  }
}
