import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { json, redirect, type ActionFunction, type DataFunctionArgstype, type MetaFunction, type LoaderFunction, } from '@remix-run/node'
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { getSession } from '~/sessions/auth-session.server'


export const action: ActionFunction = async ({ request }) => {
  const data = await request.json();

  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  let user = await GetUser(email)
  if (!user) {
    return redirect('/auth/login')
  }

  try {
    const document = await prisma.savedDocuments.create({
      data: {
        userEmail: email,
        document: data.content,
      },
    });

    return json(document);
  } catch (error) {
    console.error("Error saving document:", error);
    return json({ error: "Failed to save document." }, { status: 500 });
  }
  const didNot = 'Did not work!!'
  return didNot
}
