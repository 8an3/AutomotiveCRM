import { prisma } from "~/libs";

export async function updateClientApts( data, apptId ) {
  try {
    const finance = await prisma.clientApts.update({
      data: {
        ...data,
      },
      where: {
        id: apptId,
      },
    });
    //console.log('finance created successfully')
    return finance;
  } catch (error) {
    console.error("Error creating Dashboard:", error);
    throw error;
  }
}
