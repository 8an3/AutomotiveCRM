import { json, type LoaderFunction, } from '@remix-run/node';
import { prisma } from "~/libs";

export async function loader({ request, params }: LoaderFunction) {
  const url = new URL(request.url);
  const apptId = url.searchParams.get("apptId") || '';
  const appt = await prisma.clientApts.findUnique({
    where: { id: apptId }
  })
  console.log(url, apptId, appt, 'singleAppt')
  return json({ appt })
}
