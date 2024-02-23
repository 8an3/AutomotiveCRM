import { prisma } from "~/libs";


export function createSalesInput({ email, sales, date }) {
    return prisma.sales.create({
        data: {
            email,
            sales,
            date
        }
    })
}

export async function getSalesData({ email }) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        //console.log('getsalesdata', email)
        const salesData = await prisma.sales.findMany({
            where: {
                email: email,
            }
        });
        return salesData;
    } catch (error) {
        console.error('Error retrieving sales data:', error);
        throw new Error('Failed to retrieve sales data');
    } finally {
        await prisma.$disconnect();
    }
}
