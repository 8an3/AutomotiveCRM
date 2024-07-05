import { BellPlus } from 'lucide-react';
import { Button } from '../ui';
import { useFetcher, useLocation, useSubmit } from '@remix-run/react';
import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { GetUser } from '~/utils/loader.server';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { prisma } from '~/libs';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"

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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type='submit' size='icon' variant='ghost' className="right-[125px] top-[25px] border-none fixed hover:bg-transparent bg-transparent hover:text-primary" onClick={() => {
                submit
                toast.success('Reminder saved!')
              }}>
                <BellPlus color="#fdfcfc" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className='w-[250px]'>
              <div>
                <p>Interruption reminder</p>
                <p>If something needs your attention but you don't want to forget what you were last doing, hit this button and a notification will be waiting for you when your done. When you come back to your desk, you will know exactly what you were doing before you were interrupted.</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </fetcher.Form>
    </div>
  )
}
