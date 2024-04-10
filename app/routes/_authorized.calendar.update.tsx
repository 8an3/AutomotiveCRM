import { json, LoaderFunction, type ActionFunction } from '@remix-run/node';
import { prisma } from "~/libs";


export let action: ActionFunction = async ({ request }) => {
  // Parse the JSON body from the request
  const requestBody = await request.json();
  // Now you can access the data from the request
  const { intent, start, end, id, resourceId } = requestBody;

  // Perform your database operations or other actions here...
  const finance = await prisma.clientApts.update({
    data: {
      start: start,
      end: end,
      resourceId: resourceId,
    },
    where: {
      id: id,
    },
  });
  // Return a response
  return json({ finance, status: 'success' });
};
