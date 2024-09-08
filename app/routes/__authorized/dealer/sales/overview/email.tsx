import { json, redirect, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { GetUser } from '~/utils/loader.server';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { prisma } from '~/libs';
import { Resend } from "resend";
import PaymentCalculatorEmail from '~/emails/PaymentCalculatorEmail';

const resend = new Resend('re_YFCDynPp_5cod9FSRkrbS6kfmRsoqSsBS')//new Resend(process.env.resend_API_KEY);


export async function action({ request, params }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session = await getSession(request.headers.get('Cookie'));
  const email = session.get('email')
  let user = await GetUser(email)
  user = {
    id: formData.id || '',
    name: formData.name || '',
    username: formData.username || '',
    email: formData.email || '',
    // profileId: formData.profileId,
    phone: formData.phone || '',
  }

  const finance = await prisma.finance.findUnique({ where: { id: formData.financeId } })
  const deFees = await prisma.dealer.findUnique({ where: { id: 1 } })
  const clientInfo = {
    ...finance,
  }
  const referer = request.headers.get("Referer");
  const model = finance?.model || '';
  const modelData = formData.modelData

  const data = await resend.emails.send({
    from: "Sales <sales@resend.dev>",//`${user?.name} <${user?.email}>`,
    reply_to: user?.email,
    to: [String(finance?.email || '')],
    subject: `${finance?.brand} ${model} model information.`,
    react: <PaymentCalculatorEmail clientInfo={clientInfo} user={user} deFees={deFees} finance={finance} modelData={modelData} formData={formData} />
  });

  if (referer) {
    const parts = referer.split('/').slice(3).join('/');
    console.log(data, parts, referer, 'data and referer')

    return json({ data, }, redirect('/' + parts))
  } else {
    return null
  }
};
/**  switch (formData.template) {
    case 'justPayments12211':

      break;
    case 'fullBreakdown':

      break;
    case 'FullBreakdownWOptions':

      break;
    case 'justPaymentsCustom':

      break;
    case 'fullBreakdownCustom':

      break;
    case 'FullBreakdownWOptionsCustom':

      break;
    default:
      bodyString = {}

  } */


export async function loader({ params, request }) {
  return null
}

export default function RedirectPage({ request }) {
  return null
};
