import React, { useEffect, useRef, useState } from "react";
import { useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import { ClientOnly } from "remix-utils";
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { redirect, json } from "@remix-run/node";
import { model } from '~/models';
import { getSession } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";
import { GetUser } from "~/utils/loader.server";

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }

  if (!user) { return json({ status: 302, redirect: '/login' }); };

  let userId = JSON.stringify(user.id);;

  const docName = "doc" + userId + uuidv4();

  const deFees = await getDealerFeesbyEmail(email)


  let merged = {
    userLoanProt: '1500',
    userTireandRim: '799',
    userGap: '780',
    userExtWarr: '1500',
    userServicespkg: '1500',
    vinE: '799',
    lifeDisability: '1500',
    rustProofing: '450',
    userLicensing: '60',
    userFinance: '650',
    userDemo: '555',
    userGasOnDel: '85',
    userOMVIC: '0',
    userOther: '0',
    userTax: '13',
    userAirTax: '25',
    userTireTax: '10.68',
    userGovern: '60',
    userPDI: '750',
    userLabour: '240',
    userMarketAdj: '1500',
    userCommodity: '850',
    destinationCharge: '200',
    userFreight: '750',
    userAdmin: '289',
    iRate: '10.99',
    months: '60',
    discount: '0',
    total: '20059',
    onTax: '22726.67',
    on60: '483.15',
    biweekly: '222.99',
    weekly: '111.5',
    weeklyOth: '111.5',
    biweekOth: '222.99',
    oth60: '483.15',
    weeklyqc: '111.5',
    biweeklyqc: '222.99',
    qc60: '483.15',
    deposit: '500',
    biweeklNatWOptions: '196.23',
    weeklylNatWOptions: '98.11',
    nat60WOptions: '425.16',
    weeklyOthWOptions: '111.5',
    biweekOthWOptions: '222.99',
    oth60WOptions: '483.15',
    biweeklNat: '196.83',
    weeklylNat: '98.42',
    nat60: '426.47',
    qcTax: '22726.67',
    otherTax: '22726.67',
    totalWithOptions: '20059',
    otherTaxWithOptions: '22726.67',
    desiredPayments: 'Standard Payment',
    freight: '0',
    admin: '0',
    commodity: '0',
    pdi: '0',
    discountPer: null,
    deliveryCharge: null,
    paintPrem: null,
    msrp: '19999',
    licensing: '60',
    options: null,
    accessories: 0,
    labour: '0',
    year: '2023',
    brand: 'Harley-Davidson',
    model: 'Street Bob 114 - Vivid Black - FXBBS',
    stockNum: 'b1234',
    model1: null,
    color: 'Vivid Black',
    modelCode: '23-202020',
    tradeValue: '0',
    tradeDesc: 'S100RR',
    tradeColor: 'Black',
    tradeYear: '2023',
    tradeMake: 'BMW',
    tradeVin: 'ZBAS5411654161',
    tradeTrim: null,
    tradeMileage: '2525',
    trim: null,
    vin: 'zasxc651651',
    typeOfContact: null,
    timeToContact: null,
    date: new Date().toLocaleDateString(),
    id: 'clpuqa39a0004uoxolo2exta8',
    financeId: null,
    clientfileId: 'clpuqa34u0003uoxoq2uji9js',
    userEmail: 'skylerzanth@gmail.com',
    dl: 'T123412341234',
    email: 'Test1234@gmail.com',
    firstName: 'Skyler',
    lastName: 'Test',
    phone: '6136136134',
    name: 'Skyler Test',
    address: '1234 Test st',
    city: 'Testville',
    postal: 'k1k1k1',
    province: 'Test',
    referral: 'off',
    visited: 'off',
    bookedApt: 'off',
    aptShowed: 'off',
    aptNoShowed: 'off',
    testDrive: 'off',
    metService: 'off',
    metManager: 'off',
    metParts: 'off',
    sold: 'off',
    depositMade: 'off',
    refund: 'off',
    turnOver: 'off',
    financeApp: 'off',
    approved: 'off',
    signed: 'off',
    pickUpSet: 'off',
    demoed: 'off',
    delivered: 'off',
    status: 'Active',
    customerState: 'Reached',
    result: 'Reached',
    lastContact: '2023-12-07T05:50:02.697Z',
    timesContacted: null,
    nextAppointment: '2023-12-08T05:50:02.696Z',
    followUpDay: '2023-12-08T05:50:02.696Z',
    deliveredDate: null,
    notes: 'off',
    visits: null,
    progress: null,
    metSalesperson: 'off',
    metFinance: 'off',
    financeApplication: 'off',
    pickUpDate: '',
    pickUpTime: 'off',
    depositTakenDate: 'off',
    docsSigned: 'off',
    tradeRepairs: 'off',
    seenTrade: 'off',
    lastNote: 'off',
    dLCopy: 'off',
    insCopy: 'off',
    testDrForm: 'off',
    voidChq: 'off',
    loanOther: 'off',
    signBill: 'off',
    ucda: 'off',
    tradeInsp: 'off',
    customerWS: 'off',
    otherDocs: 'off',
    urgentFinanceNote: 'off',
    funded: 'off',
    countsInPerson: null,
    countsPhone: null,
    countsSMS: null,
    countsOther: null,
    countsEmail: null,
    createdAt: '2023-12-07T04:58:50.494Z',
    updatedAt: '2023-12-07T05:50:02.699Z',
    dashboardId: 'clpuqa3ev0005uoxoua34yhgi',
  }

  for (let key in merged) {
    merged[key] = String(merged[key]);
  }
  console.log(merged, 'merged')
  let filename = 'template12';


  return json({ userId, user, docName, merged, filename });
}

export default function PrintAndDocs() {

  return (
    <>
      <div className="h-screen justify-center bg-slate1">
        <ClientOnly fallback={<p>Fallback component ...</p>}>
          {() => (
            <React.Suspense fallback={<div>Loading...</div>}>
              <PdfGen />
            </React.Suspense>
          )}
        </ClientOnly>
      </div>
    </>
  );
}



export function PdfGen() {
  const { user, userId, docName, merged, filename } = useLoaderData();
  // console.log('merged', merged, 'user', user, 'docName', docName)
  const iFrameRef: React.LegacyRef<HTMLIFrameElement> = useRef(null);

  const MyIFrameComponent = ({ iFrameRef }) => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      if (iFrameRef?.current) {
        //  iFrameRef.current.src = 'https://third-kappa.vercel.app/';
        iFrameRef.current.src = 'https://third-kappa.vercel.app';
      }
    });
    const hideSpinner = () => {
      setIsLoading(false);
    };

    // console.log('merged23', merged, 'user', user, 'docName', docName)
    useEffect(() => {
      if (iFrameRef?.current) {
        iFrameRef.current.src = 'https://third-kappa.vercel.app'
        // iFrameRef.current.src = 'https://third-kappa.vercel.app/';



        const handleLoad = () => {
          const data = { merged, user, userId };
          iFrameRef.current.contentWindow.postMessage(data, '*');
        };

        iFrameRef.current.addEventListener('load', handleLoad);

        // Clean up the event listener when the component is unmounted
        return () => {
          iFrameRef.current?.removeEventListener('load', handleLoad);
        };
      }
    }, [iFrameRef]);

    return (
      <>
        <div className="w-[100vw] h-screen mt-[60px]">
          <iframe
            ref={iFrameRef}
            title="my-iframe"
            width="100%"
            height="100%"
            onLoad={hideSpinner}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <div className="h-screen justify-center">

        <MyIFrameComponent iFrameRef={iFrameRef} />
      </div>
    </>
  )
}
