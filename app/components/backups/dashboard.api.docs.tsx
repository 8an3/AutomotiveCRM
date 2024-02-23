// https://github.com/remix-run/examples/tree/main/file-and-cloudinary-upload

import type { ActionArgs } from "@remix-run/node";
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createFileUploadHandler as createFileUploadHandler,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { Form, useActionData, useFetcher, useLoaderData, useRouteLoaderData, useSubmit, useTransition } from "@remix-run/react";
import { Button, Input } from "~/components";
import DocumentInputs from "~/components/lists/DocumentInputs";
import { updateFinanceWithDashboard, updateClientFileRecord } from "~/utils/finance/update.server";
import { updateDashData } from '~/utils/dashboard/update.server';
import financeFormSchema from "../../routes/overviewUtils/financeFormSchema";
import { findDashData, findQuoteById } from "~/utils/finance/get.server";
import { commitSession, getSession } from '~/utils/pref.server';
import { useEffect, useState } from "react";
import axios from "axios";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from "~/models";

export async function loader({ params, request }) {
  const session = await getSession(request.headers.get("Cookie"))
  const financeId = session.get('financeId')
  console.log('financeId cookie', financeId)
  const finance = await findQuoteById(financeId);
  const dashData = await findDashData(financeId);
  return json({ ok: true, finance, dashData, financeId })
}

export const action = async ({ request }: ActionArgs) => {
  const formPayload = Object.fromEntries(await request.formData());
  const brand = formPayload.brand
  let formData = financeFormSchema.parse(formPayload)

  // upload function
  console.log('in api.filepload.docs action')
  const uploadHandler = composeUploadHandlers(
    createFileUploadHandler({
      directory: "./public/uploads/",
      maxPartSize: 5_000_000,
    }),
    createMemoryUploadHandler(),
  );
  const uploadData = await parseMultipartFormData(request, uploadHandler);
  const file = uploadData.get("file");

  if (!file || typeof file === "string") {
    return json({ error: "something wrong", imgSrc: null });
  }
  const dLCopy = file.name
  formData = { ...formData, dLCopy }
  // const DashData = await updateDashData(formData)
  console.log(file.name, formData)
  const financeId = formData.financeId; // replace with your finance id
  const financeData = { ...formData };
  const dashData = { ...formData };

  const updatedFinance = await updateFinanceWithDashboard(financeId, financeData, dashData);
  console.log('on submit', formData)
  return json({ updatedFinance, dashData, imgSrc: file.name })
}


export function UploadDocs() {
  const data = useActionData<typeof action>();
  const { finance, dashData } = useLoaderData();
  const fetcher = useFetcher();

  const DocumentInputs = [
    { name: "dLCopy", value: '', placeholder: "Driver's Lic", },
    { name: "insCopy", value: '', placeholder: "Proof of Ins", },
    { name: "testDrForm", value: '', placeholder: "Test Drive Form", },
    { name: "voidChq", value: '', placeholder: "Void Chq" },
    { name: "loanOther", value: '', placeholder: "Loan Other", },
    { name: "signBill", value: '', placeholder: "Signed BOS", },
    { name: "ucda", value: '', placeholder: "UCDA", },
    { name: "tradeInsp", value: '', placeholder: "Trade Insp", },
    { name: "customerWS", value: '', placeholder: "Customer WS", },
    { name: "otherDocs", value: '', placeholder: "Other - Check Notes", },
  ]

  return (
    <>
      <fetcher.Form method="post" encType="multipart/form-data">
        <input type="file" name="file" className='h-8' />
        <Input type="hidden" defaultValue={finance.id} name="financeId" />

        <button type="submit">Driver's Lic</button>
      </fetcher.Form>
      {dashData?.dLCopy ? (
        <>{dashData.dLCopy}
          <p>Uploaded DL</p>
          <a alt="uploaded" href={`/uploads/${data?.imgSrc}`} >{dashData.dLCopy}</a>
        </>
      ) : null}

    </>
  );
}


export default function TemplateBuilder() {
  const { user, getTemplates } = useLoaderData();
  const [data, setData] = useState(setDataset);
  console.log(getTemplates, data)

  const setDataset = axios.get('http://localhost:3000/editor/email/templates')
    .then(response => {
      // Call your function and pass the data to it
      setData(response.data);
    })
    .catch(error => {
      console.error('There was a problem with the axios operation: ', error);
    });
  useEffect(() => {
    if (Array.isArray(getTemplates)) {
      setData(getTemplates);
    }
  }, [getTemplates]);

  const [isOpen, setIsOpen] = useState(false);
  const [lineIsOpen, setLineIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedLine, setSelectedLine] = useState(null);

  const handleLineClick = (index) => {
    setSelectedLine(selectedLine === index ? null : index);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
    //setEmail(emailBody)
  };
  return (
    <>
      <div className="" >

      </div>
    </>
  )
}
