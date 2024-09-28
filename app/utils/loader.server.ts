//import { GetUser } from "~/utils/loader.server";
import { redirect } from "@remix-run/node";
import { prisma } from "~/libs";

export async function GetUser(email) {
  if (!email) {
    return redirect('/login')
  }
  let user = await prisma.user.findUnique({
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
      roleId: true,
      profileId: true,
      omvicNumber: true,
      lastSubscriptionCheck: true,
      profile: true,
      activisUserId: true,
      activixEmail: true,
      activixActivated: true,
      activixId: true,
      dealerAccountId: true,
      microId: true,
      givenName: true,
      familyName: true,
      identityProvider: true,
      plan: true,
      positions: { select: { position: true } },
      role: { select: { symbol: true, name: true } },
      customerSync: { select: { orderId: true, updatedAt: true } },
      ColumnStateInventory: { select: { id: true, state: true } },
      //   ColumnStateClient: { select: { id: true, state: true } },
      columnStateSales: { select: { id: true, state: true } },
      dealerId: true,
      Dealer: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          dealerName: true,
          dealerAddress: true,
          dealerCity: true,
          dealerProv: true,
          dealerPostal: true,
          dealerPhone: true,
          dealerEmail: true,
          dealerContact: true,
          dealerAdminContact: true,
          dealerEmailAdmin: true,
          dealerEtransferEmail: true,
          vercel: true,
          github: true,
          perSale: true,
          percentage: true,
          accPerSale: true,
          accPercentage: true,
          writerPerSale: true,
          writerPercentage: true,
          sentWelcomeEmail: true,
          userLoanProt: true,
          destinationCharge: true,
          userTireandRim: true,
          userGap: true,
          userExtWarr: true,
          userServicespkg: true,
          vinE: true,
          lifeDisability: true,
          rustProofing: true,
          userLicensing: true,
          userFinance: true,
          userDemo: true,
          userGasOnDel: true,
          userOMVIC: true,
          userOther: true,
          userTax: true,
          userAirTax: true,
          userTireTax: true,
          userGovern: true,
          userPDI: true,
          userLabour: true,
          userMarketAdj: true,
          userCommodity: true,
          userFreight: true,
          userAdmin: true,
          userEmail: true,
          DealerLogo: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              dealerLogo: true,
              Dealer: true,
              dealerId: true,
            }
          }
        }
      }
    },
  });

  return user
}
