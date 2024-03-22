import { redirect } from "@remix-run/node";
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { getSession, commitSession } from "~/utils/pref.server";


export default async function ClientProfile(formData, session) {

  const clientEmail = formData.email;
  const financeId = formData.financeId;
  const client = await prisma.clientfile.findFirst({
    where: {
      email: clientEmail,
    },
  });
  session.set("clientId", client.id);
  const brand = formData.brand;
  session.set("brand", brand);
  const finaceCheckId = session.get("financeId");
  console.log(finaceCheckId, 'finaceCheckId')
  console.log(client.id, 'clientId')

  console.log(client, financeId, 'client proifile function in dashboard calls')
  //   console.log('clientProfile cookie', cookie, brand, 'clientProfile cookie');
  // const redirectTo = `/customer/${client.id}/${financeId}`;
  return redirect(`/customer/${client.id}/${financeId}`)
  //{
  // headers: { "Set-Cookie": cookie }
  //});
}
