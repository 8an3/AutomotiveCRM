import { json, type LoaderFunction } from '@remix-run/node';
import { prisma } from "~/libs";

export async function loader({ request, params }: LoaderFunction) {
  const { brand } = params;
  if (brand === 'Harley-Davidson') {
    const models = await prisma.harley.findMany({
      select: {
        model: true
      }
    })
    return json({ models })
  }
}
