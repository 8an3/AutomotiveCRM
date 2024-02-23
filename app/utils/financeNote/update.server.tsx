import { prisma } from "~/libs";


export async function updateFinanceNote(noteId, noteData) {
  try {
    const updatingFinance = await prisma.financeNote.update({
      data: {
        ...noteData
      },
      where: { id: noteId },
    });
    console.log("FinanceNote updated successfully");

    return updatingFinance;
  } catch (error) {
    console.error("Error creating FinanceNote:", error);
    throw new Error("Failed to create FinanceNote");
  }
}
