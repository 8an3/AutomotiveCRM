import { json } from "@remix-run/node";
import { prisma } from "~/libs";

export async function FinanceNoteServer(data, intent, id) {
  let createFinanceNote;
  let updateFinanceNote;
  let deleteFinanceNote;
  let updateFinanceNote;
  let FinanceNote;
  try {
    if (intent === "createFinanceNote") {
      const FinanceNote = await prisma.financeNotes.create({
        data: {
          ...data,
        },
      });
    }
    else if (intent === "updateFinanceNote") {
      const FinanceNote = await prisma.financeNotes.update({
        data: {
          ...data,
        },
        where: {
          id: id,
        },
      });
    }
    else (intent === "deleteFinanceNote") {
      const FinanceNote = await prisma.financeNotes.delete({
        where: {
          id: id,
        },
      });
    }
    //console.log('finance created successfully')
    return FinanceNote;
  } catch (error) {
    console.error("Error creating Dashboard:", error);
    throw error;
  }
}
