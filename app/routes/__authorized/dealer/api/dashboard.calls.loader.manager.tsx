
import { defer, type V2_MetaFunction, type ActionFunction, type LoaderFunction, json, redirect } from '@remix-run/node'
import { prisma } from '~/libs';

export async function loader({ request, params }: LoaderFunction) {
    const financeList = await prisma.finance.findMany();
    const dataSet = financeList
    return json(dataSet)
}

