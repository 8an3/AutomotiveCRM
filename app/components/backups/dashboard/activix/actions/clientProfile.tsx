import { json, redirect } from "@remix-run/node";
import { commitSession, getSession } from '~/utils/pref.server';

export default async function ClientProfile({ formData, session }) {
  try {
    console.log('hit client profile in action');
    console.log(formData);
    const financeId = formData.financeId;
    session.set("financeId", financeId);
    const brand = formData.brand;
    session.set("brand", brand);
    const cookie = await commitSession(session);
    console.log('clientProfile cookie', cookie, brand, 'clientProfile cookie');
    const id = formData.id;
    const redirectTo = `/customer/${data.id}`;
    window.open(redirectTo, '_blank');
    return json(
      { cookie },
      redirect(`/customer/${data.id}`),
      { headers: { "Set-Cookie": cookie } }
    );
  } catch (error) {
    console.error('Error in ClientProfile:', error);
  }
}
