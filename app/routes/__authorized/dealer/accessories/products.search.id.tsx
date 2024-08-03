import { LoaderFunction } from "@remix-run/node"
import { prisma } from "~/libs"


export async function loader({ request, params }: LoaderFunction) {
  let q = new URL(request.url).searchParams.get("q");
  if (!q) return [];
  q = q.toLowerCase();
  let result;
  // console.log(q, 'q')
  const getit = await prisma.accessories.findMany({});
  //console.log(getit, 'getit')
  // const searchResults = await getit//searchCases(q)
  result = getit.filter(
    (result) =>
      result.id?.toLowerCase().includes(q) ||
      result.accessoryNumber?.toString().includes(q)
  );
  //console.log(getit, 'getit', result, 'results',)
  return result;
}

export async function action({ request, params }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  let q = formPayload.q//new URL(request.url).searchParams.get("q");
  if (!q) return [];
  q = q.toLowerCase();
  let result;
  // console.log(q, 'q')
  const getit = await prisma.accessories.findMany({});
  //console.log(getit, 'getit')
  // const searchResults = await getit//searchCases(q)
  result = getit.filter(
    (result) =>
      result.id?.toLowerCase().includes(q) ||
      result.accessoryNumber?.toString().includes(q)
  );
  //console.log(getit, 'getit', result, 'results',)
  return result;
}
