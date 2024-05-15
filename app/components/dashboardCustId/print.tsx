import UcdaInputs from "~/components/formToPrint/ucdaInputs";
import { PrintSpec } from "~/overviewUtils/printSpec";
import { ModelPage } from '~/overviewUtils/modelPage'
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
import UploadFile from '~/routes/__authorized/dealer/uploadFile'
import Root from "~/routes/__authorized/dealer/upload/file";


export default function Print() {
  const { user, finance, merged, filename, financeId } = useLoaderData();
  const newMerged = {
    ...merged,
    tradeMileage: finance.tradeMileage,
    userName: user?.username,
    year: finance.year === null ? ' ' : finance.year,
    tradeYear: finance.tradeYear === null ? ' ' : finance.tradeYear,
    vin: finance.vin === null ? ' ' : finance.vin,
    tradeVin: finance.tradeVin === null ? ' ' : finance.tradeVin,
    stockNum: finance.stockNum === null ? ' ' : finance.stockNum,
    namextwar: finance.userExtWarr === null ? ' ' : 'Extended Warranty',
    nameloan: 'Loan Protection',
    namegap: finance.userGap === null ? ' ' : 'Gap Insurance',
    nameTireandRim: finance.userTireandRim === null ? ' ' : 'Warranty',
    namevinE: finance.vinE === null ? ' ' : 'Vin Etching',
    namerust: finance.rustProofing === null ? ' ' : 'Rust Proofing',
    namelife: finance.lifeDisability === null ? ' ' : 'Life and Disability Ins.',
    nameservice: finance.userServicespkg === null ? ' ' : 'Service Package',
    namedelivery: finance.deliveryCharge === null ? ' ' : 'Delivery Charge',
    userGovern: Number(merged.userGovern) < 0 ? ' ' : 'Government Fees',
    userAirTax: Number(merged.userAirTax) < 0 ? ' ' : 'Air Tax',
    userTireTax: Number(merged.userTireTax) < 0 ? ' ' : 'Tire Tax',
    userFinance: Number(merged.userFinance) < 0 ? ' ' : 'Finance Fee',
    destinationCharge: Number(merged.destinationCharge) < 0 ? ' ' : 'Destination Charge',
    userMarketAdj: Number(merged.userMarketAdj) < 0 ? ' ' : 'Market Adjustment',
    userOMVIC: Number(merged.userOMVIC) < 0 ? ' ' : 'OMVIC / Gov Fee',
    userDemo: Number(merged.userDemo) < 0 ? ' ' : 'Demonstration Fee',
    discountPer: Number(merged.discountPer) < 0 ? ' ' : 'Discount %',
    discount: Number(merged.discount) < 0 ? ' ' : 'Discount',
    namefreight: Number(merged.freight) < 0 ? ' ' : 'Freight',
    nameadmin: Number(merged.admin) < 0 ? ' ' : 'Admin',
    namepdi: Number(merged.pdi) < 0 ? ' ' : 'PDI',
    namcomm: Number(merged.commodity) < 0 ? ' ' : 'Commodity',
    nameaccessories: Number(merged.accessories) < 0 ? ' ' : 'Other Accessories',
    namelabour: Number(merged.labour) < 0 ? ' ' : 'Labour',


  }
  const iFrameRef: React.LegacyRef<HTMLIFrameElement> = useRef(null);
  const MyIFrameComponent = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      if (iFrameRef?.current) {
        iFrameRef.current.src = 'http://localhost:3000/uploadFile';
        //iFrameRef.current.src = 'http://localhost:3002/customerGen';
      }
    });
    const hideSpinner = () => {
      setIsLoading(false);
    };

    return (
      <>
        <div className="h-auto w-full ">
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



  useEffect(() => {
    if (iFrameRef?.current) {
      const userId = user.id
      const data = { newMerged, user, userId };
      window.localStorage.setItem("data", data);
    }
  }, [iFrameRef, user, finance, merged]);



  return (
    <>
      <div className="mb-8 mt-2">
        <div className="h-[600] relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-100 border-0 grid-cols-1"  >
          <div className="rounded-t bg-[#09090b] mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-[#fafafa] text-xl font-bold uppercase">
                Upload Docs
              </h6>
            </div>
          </div>
          <div className="flex-auto px-2 lg:px-10 py-10 pt-0 bg-slate11 z-50">
            <Root />
          </div>
        </div>

      </div>
    </>
  )
}

/***import UcdaInputs from "~/components/formToPrint/ucdaInputs";
import { PrintSpec } from "~/overviewUtils/printSpec";
import { ModelPage } from '~/overviewUtils/modelPage'
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
import UploadFile from '~/routes/__authorized/dealer/uploadFile'


export default function Print() {
  const { user, finance, merged, filename, financeId } = useLoaderData();
  const newMerged = {
    ...merged,
    tradeMileage: finance.tradeMileage,
    userName: user?.username,
    year: finance.year === null ? ' ' : finance.year,
    tradeYear: finance.tradeYear === null ? ' ' : finance.tradeYear,
    vin: finance.vin === null ? ' ' : finance.vin,
    tradeVin: finance.tradeVin === null ? ' ' : finance.tradeVin,
    stockNum: finance.stockNum === null ? ' ' : finance.stockNum,
    namextwar: finance.userExtWarr === null ? ' ' : 'Extended Warranty',
    nameloan: 'Loan Protection',
    namegap: finance.userGap === null ? ' ' : 'Gap Insurance',
    nameTireandRim: finance.userTireandRim === null ? ' ' : 'Warranty',
    namevinE: finance.vinE === null ? ' ' : 'Vin Etching',
    namerust: finance.rustProofing === null ? ' ' : 'Rust Proofing',
    namelife: finance.lifeDisability === null ? ' ' : 'Life and Disability Ins.',
    nameservice: finance.userServicespkg === null ? ' ' : 'Service Package',
    namedelivery: finance.deliveryCharge === null ? ' ' : 'Delivery Charge',
    userGovern: Number(merged.userGovern) < 0 ? ' ' : 'Government Fees',
    userAirTax: Number(merged.userAirTax) < 0 ? ' ' : 'Air Tax',
    userTireTax: Number(merged.userTireTax) < 0 ? ' ' : 'Tire Tax',
    userFinance: Number(merged.userFinance) < 0 ? ' ' : 'Finance Fee',
    destinationCharge: Number(merged.destinationCharge) < 0 ? ' ' : 'Destination Charge',
    userMarketAdj: Number(merged.userMarketAdj) < 0 ? ' ' : 'Market Adjustment',
    userOMVIC: Number(merged.userOMVIC) < 0 ? ' ' : 'OMVIC / Gov Fee',
    userDemo: Number(merged.userDemo) < 0 ? ' ' : 'Demonstration Fee',
    discountPer: Number(merged.discountPer) < 0 ? ' ' : 'Discount %',
    discount: Number(merged.discount) < 0 ? ' ' : 'Discount',
    namefreight: Number(merged.freight) < 0 ? ' ' : 'Freight',
    nameadmin: Number(merged.admin) < 0 ? ' ' : 'Admin',
    namepdi: Number(merged.pdi) < 0 ? ' ' : 'PDI',
    namcomm: Number(merged.commodity) < 0 ? ' ' : 'Commodity',
    nameaccessories: Number(merged.accessories) < 0 ? ' ' : 'Other Accessories',
    namelabour: Number(merged.labour) < 0 ? ' ' : 'Labour',


  }
  const iFrameRef: React.LegacyRef<HTMLIFrameElement> = useRef(null);
  const MyIFrameComponent = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      if (iFrameRef?.current) {
        iFrameRef.current.src = 'http://localhost:3000/uploadFile';
        //iFrameRef.current.src = 'http://localhost:3002/customerGen';
      }
    });
    const hideSpinner = () => {
      setIsLoading(false);
    };

    return (
      <>
        <div className="h-auto w-full ">
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



  useEffect(() => {
    if (iFrameRef?.current) {
      iFrameRef.current.src = 'http://localhost:3000/uploadFile';
      //  iFrameRef.current.src = 'http://localhost:3002/customer-forms';
      const userId = user.id
      //  let merged = { finance }
      //  let merged = { finance }
      // Function to convert values to strings

      const handleLoad = () => {
        const data = { newMerged, user, userId };
        iFrameRef.current?.contentWindow?.postMessage(data, '*');
      };

      iFrameRef.current.addEventListener('load', handleLoad);

      // Clean up the event listener when the component is unmounted
      return () => {
        iFrameRef.current?.removeEventListener('load', handleLoad);
      };
    }
  }, [iFrameRef, user, finance, merged]);



  return (
    <>
      <div className="mb-8 mt-2">
        <div className="h-[600] relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-100 border-0 grid-cols-1"  >
          <div className="rounded-t bg-[#09090b] mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-[#fafafa] text-xl font-bold uppercase">
                Upload Docs
              </h6>
            </div>
          </div>
          <div className="flex-auto px-2 lg:px-10 py-10 pt-0 bg-slate11 z-50">
            <UploadFile />
          </div>
        </div>

      </div>
    </>
  )
}

 */
