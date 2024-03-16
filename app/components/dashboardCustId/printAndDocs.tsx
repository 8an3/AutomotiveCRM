import UcdaInputs from "~/components/formToPrint/ucdaInputs";
import { PrintSpec } from "~/routes/overviewUtils/printSpec";
import { ModelPage } from '~/routes/overviewUtils/modelPage'
import { PrintDealer } from "~/components/formToPrint/printDealer"
import PrintContract from "~/components/formToPrint/printContact"
import React, { useEffect, useRef, useState } from "react";
import { RemixNavLink, Input, Separator, Button, TextArea, Label, } from "~/components";
import { useLoaderData } from "@remix-run/react";
import UploadDocs from "~/routes/dealer.api.fileUpload";
import { json } from "@remix-run/node";
import { getClientFileById } from "~/utils/finance/get.server";
import { getMergedFinanceOnFinance } from "~/utils/dashloader/dashloader.server";
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { model } from "~/models";
//import { authenticator } from "~/services";
import { v4 as uuidv4 } from "uuid";
import { commitSession, getSession } from '~/utils/pref.server';
import UploadFile from '~/routes/uploadFile'

export async function loader({ request }) {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await model.user.query.getForSession({ id: userSession.id });
  const session = await getSession(request.headers.get("Cookie"))
  const clientfileId = session.get('clientfileId')
  const financeId = session.get('financeId')
  let userId = JSON.stringify(userSession.id);;
  console.log('user', userId)

  const docName = "doc" + userId + uuidv4();

  const email = user?.email;
  const deFees = await getDealerFeesbyEmail(email)
  const finance = await getMergedFinanceOnFinance(financeId)

  let merged = {
    userLoanProt: finance[0].userLoanProt,
    userTireandRim: finance[0].userTireandRim,
    userGap: finance[0].userGap,
    userExtWarr: finance[0].userExtWarr,
    userServicespkg: finance[0].userServicespkg,
    vinE: finance[0].vinE,
    lifeDisability: finance[0].lifeDisability,
    rustProofing: finance[0].rustProofing,
    userLicensing: deFees.userLicensing,
    userFinance: deFees.userFinance,
    userDemo: deFees.userDemo,
    userGasOnDel: deFees.userGasOnDel,
    userOMVIC: deFees.userOMVIC,
    userOther: finance[0].userOther,
    userTax: deFees.userTax,
    userAirTax: deFees.userAirTax,
    userTireTax: deFees.userTireTax,
    userGovern: deFees.userGovern,
    userPDI: deFees.userPDI,
    userLabour: deFees.userLabour,
    userMarketAdj: deFees.userMarketAdj,
    userCommodity: deFees.userCommodity,
    destinationCharge: deFees.destinationCharge,
    userFreight: deFees.userFreight,
    userAdmin: deFees.userAdmin,
    iRate: finance[0].iRate,
    months: finance[0].months,
    discount: finance[0].discount,
    total: finance[0].total,
    onTax: finance[0].onTax,
    on60: finance[0].on60,
    biweekly: finance[0].biweekly,
    weekly: finance[0].weekly,
    weeklyOth: finance[0].weeklyOth,
    biweekOth: finance[0].biweekOth,
    oth60: finance[0].oth60,
    weeklyqc: finance[0].weeklyqc,
    biweeklyqc: finance[0].biweeklyqc,
    qc60: finance[0].qc60,
    deposit: finance[0].deposit,
    biweeklNatWOptions: finance[0].biweeklNatWOptions,
    weeklylNatWOptions: finance[0].weeklylNatWOptions,
    nat60WOptions: finance[0].nat60WOptions,
    weeklyOthWOptions: finance[0].weeklyOthWOptions,
    biweekOthWOptions: finance[0].biweekOthWOptions,
    oth60WOptions: finance[0].oth60WOptions,
    biweeklNat: finance[0].biweeklNat,
    weeklylNat: finance[0].weeklylNat,
    nat60: finance[0].nat60,
    qcTax: finance[0].qcTax,
    otherTax: finance[0].otherTax,
    totalWithOptions: finance[0].totalWithOptions,
    otherTaxWithOptions: finance[0].otherTaxWithOptions,
    desiredPayments: finance[0].desiredPayments,
    freight: finance[0].freight,
    admin: finance[0].admin,
    commodity: finance[0].commodity,
    pdi: finance[0].pdi,
    discountPer: finance[0].discountPer,
    deliveryCharge: finance[0].deliveryCharge,
    paintPrem: finance[0].paintPrem,
    msrp: finance[0].msrp,
    licensing: finance[0].licensing,
    options: finance[0].options,
    accessories: finance[0].accessories,
    labour: finance[0].labour,
    year: finance[0].year,
    brand: finance[0].brand,
    model: finance[0].model,
    stockNum: finance[0].stockNum,
    model1: finance[0].model1,
    color: finance[0].color,
    modelCode: finance[0].modelCode,
    tradeValue: finance[0].tradeValue,
    tradeDesc: finance[0].tradeDesc,
    tradeColor: finance[0].tradeColor,
    tradeYear: finance[0].tradeYear,
    tradeMake: finance[0].tradeMake,
    tradeVin: finance[0].tradeVin,
    tradeTrim: finance[0].tradeTrim,
    tradeMileage: finance[0].tradeMileage,
    trim: finance[0].trim,
    vin: finance[0].vin,

    date: new Date().toLocaleDateString(),
    dl: finance[0].dl,
    email: finance[0].email,
    firstName: finance[0].firstName,
    lastName: finance[0].lastName,
    phone: finance[0].phone,
    name: finance[0].name,
    address: finance[0].address,
    city: finance[0].city,
    postal: finance[0].postal,
    province: finance[0].province,
    referral: finance[0].referral,
    visited: finance[0].visited,
    bookedApt: finance[0].bookedApt,
    aptShowed: finance[0].aptShowed,
    aptNoShowed: finance[0].aptNoShowed,
    testDrive: finance[0].testDrive,
    metService: finance[0].metService,
    metManager: finance[0].metManager,
    metParts: finance[0].metParts,
    sold: finance[0].sold,
    depositMade: finance[0].depositMade,
    refund: finance[0].refund,
    turnOver: finance[0].turnOver,
    financeApp: finance[0].financeApp,
    approved: finance[0].approved,
    signed: finance[0].signed,
    pickUpSet: finance[0].pickUpSet,
    demoed: finance[0].demoed,
    delivered: finance[0].delivered,
    status: finance[0].status,
    customerState: finance[0].customerState,
    result: finance[0].result,
    notes: finance[0].notes,
    metSalesperson: finance[0].metSalesperson,
    metFinance: finance[0].metFinance,
    financeApplication: finance[0].financeApplication,
    pickUpTime: finance[0].pickUpTime,
    depositTakenDate: finance[0].depositTakenDate,
    docsSigned: finance[0].docsSigned,
    tradeRepairs: finance[0].tradeRepairs,
    seenTrade: finance[0].seenTrade,
    lastNote: finance[0].lastNote,
    dLCopy: finance[0].dLCopy,
    insCopy: finance[0].insCopy,
    testDrForm: finance[0].testDrForm,
    voidChq: finance[0].voidChq,
    loanOther: finance[0].loanOther,
    signBill: finance[0].signBill,
    ucda: finance[0].ucda,
    tradeInsp: finance[0].tradeInsp,
    customerWS: finance[0].customerWS,
    otherDocs: finance[0].otherDocs,
    urgentFinanceNote: finance[0].urgentFinanceNote,
    funded: finance[0].funded,
    userName: user?.name,

  }
  console.log(merged, 'merged')
  for (let key in merged) {
    merged[key] = String(merged[key]);
  }

  return json({ merged, finance, user })
}

export default function PrintAndDocs() {
  const { user, finance, merged, filename, financeId } = useLoaderData();
  const iFrameRef: React.LegacyRef<HTMLIFrameElement> = useRef(null);
  const MyIFrameComponent = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {

      if (iFrameRef?.current) {
        iFrameRef.current.src = 'https://third-8an3.vercel.app/customer-forms';
        //iFrameRef.current.src = 'http://localhost:3002/customerGen';
      }
    });
    const hideSpinner = () => {
      setIsLoading(false);
    };
    return (
      <>
        <div className="h-auto w-full z-99 ">
          <iframe
            ref={iFrameRef}
            title="my-iframe"
            width="100%"
            height="100%"
            onLoad={hideSpinner}
            style={{ minHeight: '840px' }}

          />
        </div>
      </>
    );
  };


  useEffect(() => {
    if (iFrameRef?.current) {
      iFrameRef.current.src = 'https://third-kappa.vercel.app/customer-forms';
      //  iFrameRef.current.src = 'http://localhost:3002/customer-forms';
      const userId = user.id
      const handleLoad = () => {
        const data = { merged, user, userId };
        iFrameRef.current?.contentWindow?.postMessage(data, '*');
      };
      iFrameRef.current.addEventListener('load', handleLoad);
      return () => {
        iFrameRef.current?.removeEventListener('load', handleLoad);
      };
    }
  }, [iFrameRef, user, finance, merged]);

  return (
    <>
      <div className="mb-8 mt-2">

        <div className="h-[900px] relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-100 border-0 grid-cols-1"  >
          <div className="rounded-t bg-slate12 mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-slate1 text-xl font-bold uppercase">
                Print Docs
              </h6>
            </div>
          </div>
          <div className="flex-auto px-2 lg:px-10 py-10 pt-0 bg-slate11 z-50">
            <MyIFrameComponent />
          </div>
        </div>
      </div>
    </>
  )
}

