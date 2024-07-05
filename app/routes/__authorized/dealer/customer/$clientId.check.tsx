import { json, redirect, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { GetUser } from '~/utils/loader.server';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { prisma } from '~/libs';

export async function loader({ request, params }: LoaderFunction) {
  const clientId = params.clientId
  const client = await prisma.clientfile.findUnique({
    where: { id: clientId }
  })
  const finance = await prisma.finance.findMany({
    where: { email: client.email }
  })
  const financeId = finance[0].id
  return redirect(`/dealer/customer/${clientId}/${financeId}`)
};
