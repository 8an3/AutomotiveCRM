import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { GetUser } from '~/utils/loader.server';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { prisma } from '~/libs';

export async function loader({ request, params }: LoaderFunction) {
  const users = await prisma.user.findMany({
    where: {
      positions: {
        some: {
          position: 'Administrator'//'Finance Manager'
        }
      }
    },
    include: {
      positions: true // If you want to include the related positions in the result
    }
  });
  return json({ users });
};
