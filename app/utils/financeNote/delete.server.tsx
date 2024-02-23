import { prisma } from "~/libs";

export async function deleteFinanceNote(id) {
    const deleteFinanceNote = await prisma.financeNote.delete({ where: { id } });
    return ({ ok: true, deleteFinanceNote, })
}

