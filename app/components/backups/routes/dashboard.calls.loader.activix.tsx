
import { defer, type V2_MetaFunction, type ActionFunction, type LoaderFunction, json, type LoaderFunction } from '@remix-run/node'
import { getMergedFinance } from "~/utils/dashloader/dashloader.server";
import { prisma } from '~/libs';
import { getSession } from "~/sessions/auth-session.server";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from '~/models'
import { commitSession } from '~/sessions/session.server';
import { GetUser } from "~/utils/loader.server";

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  async function getMergedFinance(userEmail) {
    ///console.log(userEmail)
    /// console.log(userEmail, 'email dashboard calls loader')
    try {
      const financeData = await prisma.finance.findMany({
        where: {
          userEmail: {
            equals: userEmail,
          },
        },
      });
      ///  console.log('financeData:', financeData); // Debugging line

      const dashData = await prisma.dashboard.findMany({
        where: {
          userEmail: {
            equals: userEmail,
          },
        },
      });
      ///console.log('dashData:', dashData); // Debugging line
      const activixData = await prisma.activixLead.findMany({
        where: {
          userEmail: {
            equals: userEmail,
          },
        },
      })

      const mergedData = await Promise.all(financeData.map(async (financeRecord) => {
        // console.log('financeRecord.id:', financeRecord.id); // Debugging line
        const correspondingDashRecord = dashData.find(dashRecord => dashRecord.financeId === financeRecord.id);
        // console.log('correspondingDashRecord:', correspondingDashRecord); // Debugging line
        const correspondingActivixRecord = activixData.find(activixRecord => activixRecord.activixId === financeRecord.activixId);

        const comsCounter = await prisma.communications.findUnique({
          where: {
            financeId: financeRecord.id
          },
        });
        return {
          ...comsCounter,
          ...correspondingActivixRecord,
          ...correspondingDashRecord,
          ...financeRecord,
        };
      }));


      return mergedData;
    } catch (error) {
      console.error("Error fetching dashboard entries by financeId:", error);
      throw new Error("Failed to fetch dashboard entries by financeId");
    }
  }
  const dataSet = await getMergedFinance(email);

  // console.log(dataSet, 'dataSet loader')
  return json(dataSet)
}

