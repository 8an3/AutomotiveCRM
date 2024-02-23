import { prisma } from "~/libs";

export async function saveMyDocument({ dbData }) {
  try {
    const myDoc = await prisma.saveMyDoc.create({
      data: {
        ...dbData,
      },
    });
    //console.log('finance created successfully')
    return myDoc;
  } catch (error) {
    console.error("Error creating Dashboard:", error);
    throw error;
  }
}
