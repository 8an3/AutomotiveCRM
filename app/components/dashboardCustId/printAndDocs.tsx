import UcdaInputs from "~/components/formToPrint/ucdaInputs";
import { PrintSpec } from "~/routes/overviewUtils/printSpec";
import { ModelPage } from '~/routes/overviewUtils/modelPage'
import { PrintDealer } from "~/components/formToPrint/printDealer"
import PrintContract from "~/components/formToPrint/printContact"
import React, { useEffect, useRef, useState } from "react";
import { RemixNavLink, Input, Separator, Button, TextArea, Label, } from "~/components";
import { useLoaderData } from "@remix-run/react";

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

