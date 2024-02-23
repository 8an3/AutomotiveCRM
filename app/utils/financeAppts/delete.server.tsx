import { prisma } from "~/libs";

export async function deleteFinanceAppts({ id }) {
    const deleteFinancAppts = await prisma.clientApts.delete({ where: { id } });
    return ({ ok: true, deleteFinancAppts, })
}

