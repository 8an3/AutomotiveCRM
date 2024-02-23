import { prisma } from "~/libs";

export async function updateFinanceNote(financeId, financeNote) {
  try {
    const finance = await prisma.finance.update({
      where: {
        id: financeId,
      },
      data: {
        financeNote: financeNote,
      },
    });

    console.log('Updated Finance Note successfully')
    return finance;
  } catch (error) {
    console.error("Error updating Finance Note:", error);
    throw error;
  }
}
