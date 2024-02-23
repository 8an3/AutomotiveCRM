import { json } from "@remix-run/node";
import { prisma } from "~/libs";

export async function ClientAptsServer(data, intent, id) {
  let ClientApts;
  try {
    if (intent === "createClientApts") {
      ClientApts = await prisma.clientApts.create({
        data: {
          ...data,
        },
      });
    }

    if (intent === "updateClientApts") {
      ClientApts = await prisma.clientApts.update({
        data: {
          ...data,
        },
        where: {
          id: id,
        },
      });
    }
    if (intent === "deleteClientApts") {
      ClientApts = await prisma.clientApts.delete({
        where: {
          id: id,
        },
      });
    }
    //console.log('finance created successfully')
    return ClientApts;
  } catch (error) {
    console.error("Error creating Dashboard:", error);
    throw error;
  }
}
