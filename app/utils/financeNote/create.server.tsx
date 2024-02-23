import { prisma } from "~/libs";

export async function createFinanceNote({ ...data }) {
  try {
    const finance = await prisma.financeNote.create({
      data: {
        ...data,
      },
    });
    console.log('financeNote created successfully')
    return finance;
  } catch (error) {
    console.error("Error creating financeNote:", error);
    throw error;
  }
}
