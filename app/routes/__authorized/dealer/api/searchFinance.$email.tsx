import {
  json,
  type ActionFunction,
  type LoaderFunction,
} from "@remix-run/node";
import { prisma } from "~/libs";


export async function loader({ request, params }: LoaderFunction) {
  const email = params.email
  const finance = await prisma.finance.findMany({ where: { email: email } });
return finance
}
