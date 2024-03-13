
import { z } from 'zod'
import { redirect, type DataFunctionArgs, json, type MetaFunction, type ActionFunction, LoaderFunction } from '@remix-run/node'
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { directClose, getCloses, assumptiveClose, alternativeClose, problemSolvingClose, emotionalClose, getOvercomes, feltClose, getFollowUp, getQualifying, getTexting, getStories, testDriveClose, upSellClose, questionClose, summaryClose, trialClose, getScriptsListItems, getLatestScripts } from '~/utils/scripts/get.server'
import { zfd } from 'zod-form-data'
import { prisma } from "~/libs";
import { financeFormSchema } from '../shared/actions';
import { getSession } from '~/sessions/auth-session.server';
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from '~/models'


export async function scriptsLoader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      subscriptionId: true,
      customerId: true,
      returning: true,
      phone: true,
      dealer: true,
      position: true,
      roleId: true,
      profileId: true,
      omvicNumber: true,
      role: { select: { symbol: true, name: true } },
    },
  });  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  const dFees = await getDealerFeesbyEmail(user?.email)

  const directs = await directClose()
  const closes = await getCloses()
  const assumptive = await assumptiveClose();
  const alternative = await alternativeClose()
  const problem = await problemSolvingClose()
  const felt = await feltClose()
  const emotional = await emotionalClose()
  const overcomes = await getOvercomes()
  const followups = await getFollowUp()
  const qualifying = await getQualifying()
  const texting = await getTexting()
  const stories = await getStories()
  const testDrives = await testDriveClose()
  const question = await questionClose()
  const summary = await summaryClose()
  const trial = await trialClose()
  const upsell = await upSellClose()
  const scripts = await getScriptsListItems();
  return json({
    ok: true,
    user,
    closes,
    scripts,
    overcomes,
    followups,
    qualifying,
    stories,
    testDrives,
    upsell,
    dFees,
    directs,
    assumptive,
    alternative,
    felt,
    problem,
    emotional,
    texting,
    question,
    summary,
    trial,

  })
}


export const scriptsAction: ActionFunction = async ({ request }) => {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);

  const template = await prisma.emailTemplates.create({
    data: {
      name: formData.name,
      body: formData.body,
      title: formData.title,
      category: formData.category,
      userEmail: formData.userEmail,
      dept: formData.dept,
      type: 'text / email',
    },
  });
  return template;
}



const contactSchema = z.object({
  email: z.string().email(),
  script: zfd.text(z.string().optional()),
  content: zfd.text(z.string().optional()),
  intent: z.string(),
  name: zfd.text(z.string().optional()),
  subCat: zfd.text(z.string().optional()),
  category: zfd.text(z.string().optional()),
})
