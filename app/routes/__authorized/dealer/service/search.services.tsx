import { LoaderFunction, redirect } from "@remix-run/node"
import { prisma } from "~/libs"


export async function loader({ request, params }: LoaderFunction) {
  let q = new URL(request.url).searchParams.get("q");
  if (!q) return [];
  q = q.toLowerCase();
  let result;
  const getit = await prisma.services.findMany({});
  result = getit.filter(
    (result) =>
      result.service?.toLowerCase().includes(q) ||
      result.description?.toLowerCase().includes(q)
  );
  return result;
}
