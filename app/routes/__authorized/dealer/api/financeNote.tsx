import { json, type LoaderFunction, } from '@remix-run/node';
import { prisma } from "~/libs";

export async function loader({ request, params }: LoaderFunction) {
  const url = new URL(request.url);
  const financeId = url.searchParams.get("financeId") || '';
  const financeNote = await prisma.financeNote.findUnique({
    where: { id: financeId }
  })
  return json({ financeNote })
}
