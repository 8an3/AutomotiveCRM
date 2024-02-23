import { prisma } from "~/libs";

export async function deleteDailyPDF(userEmail) {
    const deleteFinance = await prisma.dailyPDF.delete({ where: { userEmail } });
    return ({ ok: true, deleteFinance })
}
