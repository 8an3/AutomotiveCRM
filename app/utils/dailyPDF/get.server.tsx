import { prisma } from "~/libs";

export async function getDailyPDF({ userEmail }) {
  try {
    const dailyPDFRecord = await prisma.dailyPDF.findFirst({
      where: {
        userEmail,
      },
    });

    return dailyPDFRecord;
  } catch (error) {
    console.error('Error retrieving DailyPDF:', error);
    throw new Error('Failed to retrieve DailyPDF');
  }
}
