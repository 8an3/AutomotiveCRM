import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { GetUser } from '~/utils/loader.server';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { prisma } from '~/libs';

export async function loader({ request, params }: LoaderFunction) {
  try {
    console.log('Interval fired');
    const lockedTerminals = await prisma.lockFinanceTerminals.findMany({
      where: { locked: true }
    });
    const locked = lockedTerminals.length > 0 ? lockedTerminals[0] : null;
    if (locked) { locked.lockedId = locked.id; }
    return json({ locked });
  } catch (error) {
    console.error('Error in loader:', error);
    return json({ error: 'Failed to fetch locked terminals' }, { status: 500 });
  }
}
