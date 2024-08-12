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
      result.brand?.toLowerCase().includes(q) ||
      result.name?.toLowerCase().includes(q) ||
      result.category?.toLowerCase().includes(q) ||
      result.location?.toLowerCase().includes(q) ||
      result.distributer?.toLowerCase().includes(q) ||
      result.subCategory?.toLowerCase().includes(q)
  );
  //console.log(getit, 'getit', result, 'results',)
  return result;
}
