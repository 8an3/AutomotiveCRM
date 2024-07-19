import { BellPlus } from 'lucide-react';
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
import { useEffect } from 'react';
import { Button, DropdownMenuItem, DropdownMenuShortcut } from '~/components';


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

  // bind command + i
  useEffect(() => {
    let listener = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'i') {
        event.preventDefault()
        const formData = new FormData();
        formData.append("userEmail", email);
        formData.append("intent", 'createInterruption');
        formData.append("pathname", pathname);
        submit(formData, { method: "post" });
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  return (
    <fetcher.Form method='post' >
      <DropdownMenuItem
        className='w-[95%] rounded-[4px]'
        onSelect={(e) => {
          e.preventDefault()
          submit
          toast.success('Reminder saved!')
        }}>
        <input type='hidden' name='userEmail' value={email} />
        <input type='hidden' name='intent' value='createInterruption' />
        <input type='hidden' name='pathname' value={pathname} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className='flex justify-between items-center'>

              <BellPlus color="#fdfcfc" size={16} />
              <DropdownMenuShortcut className='justify-end'> ctrl + i</DropdownMenuShortcut>
            </TooltipTrigger>
            <TooltipContent className='w-[250px]'>
              <div>
                <p>Interruption reminder</p>
                <p>If something needs your attention but you don't want to forget what you were last doing, hit this button and a notification will be waiting for you when your done. When you come back to your desk, you will know exactly what you were doing before you were interrupted.</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DropdownMenuItem>
    </fetcher.Form>
  )
}
