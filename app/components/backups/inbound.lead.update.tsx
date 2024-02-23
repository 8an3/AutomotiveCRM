// In your route file
import { PrismaClient } from "@prisma/client";
import { ActionFunction } from "@remix-run/node";

let prisma = new PrismaClient();

export let action: ActionFunction = async ({ request }) => {
  // Parse the JSON body of the request
  let data = await request.json();

  // Store the data in the database
  let createdData = await prisma.finance.create({
    data: {
      // Your data fields here
    },
  });

  return new Response("Data received and stored");
};
