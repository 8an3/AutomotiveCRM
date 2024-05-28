import { BellPlus } from 'lucide-react';
import { Button } from '../ui';
import { useFetcher, useLocation, useSubmit } from '@remix-run/react';
import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { GetUser } from '~/utils/loader.server';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { prisma } from '~/libs';
import { toast } from 'sonner';


export async function action({ request, params }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session = await getSession(request.headers.get('Cookie'));
  const email = session.get('email')
  const user = await GetUser(email)

  return json({ user });
};


export default function Interruptions(user, email) {
  const fetcher = useFetcher()
  const submit = useSubmit()
  const location = useLocation();
  const pathname = location.pathname
  return (
    <div>
      <fetcher.Form method='post' >
        <input type='hidden' name='userEmail' value={email} />
        <input type='hidden' name='intent' value='createInterruption' />
        <input type='hidden' name='pathname' value={pathname} />
        <Button type='submit' size='icon' variant='ghost' className="right-[125px] top-[25px] border-none fixed hover:bg-transparent bg-transparent hover:text-[#02a9ff]" onClick={() => {
          submit
          toast.success('Reminder saved!')
        }}>
          <BellPlus color="#fdfcfc" />
        </Button>
      </fetcher.Form>
    </div>
  )
}
