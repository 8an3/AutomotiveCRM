import { json, type LoaderFunction } from '@remix-run/node';
import { prisma } from "~/libs";

export async function loader({ request, params }: LoaderFunction) {
  const { customer } = params;
  if (customer.length > 2) {
    const messages = await prisma.staffChat.findMany({
      where: {
        to: customer
      }
    })
    return json({ messages })
  }
}
