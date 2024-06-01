import { type ActionFunction, json, type LoaderFunction, redirect } from "@remix-run/node"
import { GetUser } from "~/utils/loader.server"
import {
  authSessionStorage,
  commitSession,
  destroySession,
  getSession,
} from "~/sessions/auth-session.server"
import {
  useActionData,
  useNavigation,
  Form,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { useEffect } from "react";
import { prisma } from "~/libs";

import { authenticator } from "~/services";


export async function loader({ request, }: LoaderFunction) {
  //
  // const email = session.get('email')
  const params = new URLSearchParams(request.url.split('?')[1] || '');
  const email = decodeURIComponent(params.get('email') || '');
  const name = decodeURIComponent(params.get('name') || '');
  console.log(params, email, name, 'form params')

  return json({ name, email })
}


export async function action({ request, }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  // let session = await getSession(request.headers.get("Cookie"))
  // session.set("email", formData.email)
  // session.set("name", formData.name)
  await prisma.currentSession.create({
    data: {
      name: formData.name,
      email: formData.email,
    }
  })
  await authenticator.authenticate("user-pass", request, {
    successRedirect: "/dealer/quote/Harley-Davidson",
    failureRedirect: "/login",
  });
  //return redirect('/usercheck', { headers: { 'Set-Cookie': await commitSession(session) } });
}

export default function Signup() {
  //const { name, email } = useLoaderData()
  const [session, setSession] = useRecoilState(currentSession);
  console.log(session, 'session')
  const email = session.email
  const name = session.name
  const submit = useSubmit();
  useEffect(() => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    submit(formData, { method: "post" });
  }, [email, name, submit]);
  return (
    <Form method="post">
      <p>
        <input type="text" name="username" defaultValue={name} />
      </p>

      <p>
        <input name="email" defaultValue={email} />
      </p>

      <button type="submit">
        Sign Up
      </button>

    </Form>
  );
}
