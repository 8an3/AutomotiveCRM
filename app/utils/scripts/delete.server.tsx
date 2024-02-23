import { prisma } from "~/libs";

export async function deleteFinance({ id }) {
    const deleteFinance = await prisma.finance.delete({ where: { id } });
    const deleteDash = await prisma.dashboard.delete({ where: { id } });
    return ({ ok: true, deleteFinance, deleteDash })
}

export async function deleteManitou({ id }) {
    const deleteFinManOptions = await prisma.finManOptions.delete({ where: { id } });
    const deleteFinCanOptions = await prisma.finCanOptions.delete({ where: { id } });
    return ({ ok: true, deleteFinManOptions, deleteFinCanOptions })
}

export async function deleteBMW({ id }) {
    const deleteBmwMotoOptions = await prisma.bmwMotoOptions.delete({ where: { id } });
    const deleteBmwMotoOptions2 = await prisma.bmwMotoOptions2.delete({ where: { id } });
    return ({ ok: true, deleteBmwMotoOptions, deleteBmwMotoOptions2 })
}
