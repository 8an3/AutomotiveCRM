import {
  Form,
  useActionData,

  useLoaderData,
  useLocation,
  useParams
} from "@remix-run/react";
import {
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import type { LoaderFunction, ActionFunction, LoaderArgs, HeadersFunction } from "@remix-run/node";
import { Label, Input, Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui";
import { toast } from "sonner"
import { useEffect, useRef, useState } from 'react'
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { cors } from "remix-utils";
import { useRootLoaderData } from "~/hooks";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from '~/models'
import { getSession } from "~/sessions/auth-session.server";
import { put } from '@vercel/blob';

import type { PutBlobResult } from '@vercel/blob';

export function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  return (
    <>
      <h1>Upload Your Avatar</h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          if (!inputFileRef.current?.files) {
            throw new Error("No file selected");
          }

          const file = inputFileRef.current.files[0];

          const response = await fetch(
            `/public/uploads/uploads?filename=${file.name}`,
            {
              method: 'POST',
              body: file,
            },
          );

          const newBlob = (await response.json()) as PutBlobResult;

          setBlob(newBlob);
        }}
      >
        <input name="file" ref={inputFileRef} type="file" required />
        <button type="submit">Upload</button>
      </form>
      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </>
  );
}

export const loader = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)


  if (!user) {
    redirect('/login')
  };

  return json(user,)
}

export const action: ActionFunction = async ({ request }) => {
  // makwe new record save file name and finance to get it later or display it in a list forr people to downlaod


  const { ...fileUploadHandlerOptions } = {
    maxPartSize: 5_000_000,
    file: ({ filename }: { filename: string }) => filename,
    directory: './api/client/uploads',

  };

  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler(fileUploadHandlerOptions),
    // parse everything else into memory
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(request, uploadHandler);
  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;
  const category = formData.get("category") as string;
  const financeId = formData.get("financeId") as string;
  const blob = await put(file.name, file, {
    access: 'public',
  });
  const uploadedDocs = await prisma.uploadDocs.create({
    data: {
      userId: userId,
      category: category,
      financeId: financeId,
      fileName: file.name + '-' + financeId,
    }
  })
  return {
    blob,
    uploadedDocs,
    url: `/api/client/uploads/${file.name}`,
    size: file.size,
    name: file.name
  };
};


export default function UploadFile() {
  const { UploadedDocs, url, merged } = useLoaderData();
  const { user } = useRootLoaderData()
  const actionData = useActionData();
  const location = useLocation();

  console.log(location.pathname)


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      userId: user.id,
      category: formData.get('category'),
      financeId: formData.get('financeId'),
      fileName: formData.get('fileName'),
    }
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    // console.log(data, formData, 'data')

    const promise = fetch('/uploadFile/action', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log(`${response.url}: ${response.status}`);
      })
      .catch((error) => {
        console.error(`Failed to fetch: ${error}`);
      });
    console.log(promise, 'promise2')
    return promise
  }

  if (location.pathname === "/uploadFile") {
    return (
      <div>
        <AvatarUploadPage />

        <Form
          method="post"
          encType="multipart/form-data"
        >
          {/* form contents here */}
          <div className="grid grid-cols-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture"> Select file:</Label>
              <Input type="file" name="file" />
              <input type='hidden' value='uploadFile' name='intent' />
              <input type='hidden' value={merged?.id} name='financeId' />
              <input type='hidden' defaultValue={user?.id} name='userId' />
            </div>
            <Select name='category'>
              <SelectTrigger className="w-auto ml-3 mt-5 focus:border-[#60b9fd] text-black border border-black font-bold uppercase">
                <SelectValue placeholder="Docs" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                <SelectItem value="Drivers License">Drivers License</SelectItem>
                <SelectItem value="Pay Stub">Pay Stub</SelectItem>
                <SelectItem value="Direct Deposit">Direct Deposit</SelectItem>
                <SelectItem value="BOS">BOS</SelectItem>
                <SelectItem value="Test Drive Waiver">Test Drive Waiver</SelectItem>
                <SelectItem value="Insurance">Insurance</SelectItem>
                <SelectItem value="Ownership">Ownership</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className={` cursor-pointer  p-3 mt-3 hover:text-primary hover:border-primary text-black border border-black font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 `}
          >
            Upload
          </Button>
        </Form>
        {actionData && (
          <div>
            <img
              src={actionData.url}
              style={{ maxWidth: "100vw" }}
              alt={actionData.name}
            />
            <p>File Name: {actionData.name}</p>
            <p>File size: {Math.round(actionData.size / 1024)} KB</p>
          </div>
        )
        }
        <div className='ml-2'>
          {UploadedDocs && UploadedDocs.map((document) => (
            <div key={document.id} className="flex ">
              <p>{document.category} {document.fileName}:</p>
              <a className='hover:text-primary hover:underline cursor-pointer ml-2' href={`http://localhost:3000/api/client/uploads/${document.fileName}`} download> Download</a>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (location.pathname !== "/uploadFile") {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [blob, setBlob] = useState<PutBlobResult | null>(null);
    return (
      <div className="mt-5">

        <Form
          onSubmit={async (event) => {
            event.preventDefault();

            if (!inputFileRef.current?.files) {
              throw new Error('No file selected');
            }

            const file = inputFileRef.current.files[0];

            const response = await fetch(
              `/api/client/uploads?filename=${file.name}`,
              {
                method: 'POST',
                body: file,
              },
            );

            const newBlob = (await response.json()) as PutBlobResult;

            setBlob(newBlob);
          }}
        >
          {/* form contents here */}
          < div className="grid grid-cols-2" >
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture"> Select file:</Label>
              <Input type="file" name="file" ref={inputFileRef} />
              <input type='hidden' value='uploadFile' name='intent' />
              <input type='hidden' value={merged?.id} name='financeId' />
              <input type='hidden' defaultValue={user?.id} name='userId' />
            </div>
            <Select name='category'>
              <SelectTrigger className="w-auto ml-3 mt-5 focus:border-[#60b9fd] text-black border border-black font-bold uppercase">
                <SelectValue placeholder="Docs" />
              </SelectTrigger>
              <SelectContent className='bg-black'>
                <SelectItem value="Drivers License">Drivers License</SelectItem>
                <SelectItem value="Pay Stub">Pay Stub</SelectItem>
                <SelectItem value="Direct Deposit">Direct Deposit</SelectItem>
                <SelectItem value="BOS">BOS</SelectItem>
                <SelectItem value="Test Drive Waiver">Test Drive Waiver</SelectItem>
                <SelectItem value="Insurance">Insurance</SelectItem>
                <SelectItem value="Ownership">Ownership</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button

            type="submit"
            className={` cursor-pointer  p-3 mt-3 hover:text-primary hover:border-primary text-black border border-black font-bold uppercase text-xs rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all text-center duration-150 `}
          >
            Upload
          </Button>
        </Form >
        {blob && (
          <div>
            Blob url: <a href={blob.url}>{blob.url}</a>
          </div>
        )}
        {actionData && (
          <div>
            <img
              src={actionData.url}
              style={{ maxWidth: "100vw" }}
              alt={actionData.name}
            />
            <p>File Name: {actionData.name}</p>
            <p>File size: {Math.round(actionData.size / 1024)} KB</p>
          </div>
        )
        }
        <div className='ml-2'>
          {UploadedDocs && UploadedDocs.map((document) => (
            <div key={document.id} className="flex ">
              <p>{document.category} {document.fileName}:</p>
              <a className='hover:text-primary hover:underline cursor-pointer ml-2' href={`http://localhost:3000/api/client/uploads/${document.fileName}`} download> Download</a>
            </div>
          ))}
        </div>
      </div>
    )
  }

}

/**
 * export async function loader({ request }: LoaderFunction) {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await model.user.query.getForSession({ id: userSession.id });
  if (!user?.subscriptionId) {
    return redirect("/subscribe");
  } else {
    return json({ user })
  }

}
 *



 * import {
  redirect,
  unstable_parseMultipartFormData,
  type ActionFunction,
  UploadHandlerArgs,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  type LoaderFunction,
} from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { Input } from '~/components';
import { dashboardLoader } from '~/components/actions/dashboardCalls';

type ActionData = {
  url: string;
  size: number;
  name: string;
};

export let loader = dashboardLoader

export const action: ActionFunction = async ({ request }) => {
  const { name, ...fileUploadHandlerOptions } = {
    maxPartSize: 5_000_000,
    file: ({ filename }: { filename: string }) => filename,
    directory: './public/uploads',
    name: `upload12`

  };
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler(fileUploadHandlerOptions, name),
    // parse everything else into memory
    unstable_createMemoryUploadHandler()
);

const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
);

const file = formData.get("file") as File;

console.log('returning', file);
return { file, name, fileUploadHandlerOptions }
  // Get the file as a buffer

  // const { data, error } = await supabaseClient.storage
  //   .from("images")
  //   .upload(filename, buffer);
  // if (error) {
  //   throw error;
  // }
}


export default function FormUploadworks() {
  const { finance, user, financeNotes, dashData } = useLoaderData();
  const actionData = useActionData<ActionData>();
  return (
    <div  >
      <Form method="post" encType="multipart/form-data">

        <Input type="hidden" defaultValue='File Uploaded' name="customContent" />
        <input type="file" id="my-file" name="my-file" className="text-[12px]" />
        <button name="intent" type="submit" className=" bg-transparent cursor-pointer" value="uploadFile" >          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
        </button>
      </Form>
      {actionData && (
        <div>
          <img
            src={actionData.url}
            style={{ maxWidth: "100vw" }}
            alt={actionData.name}
          />
          <p>File Name: {actionData.name}</p>
          <p>File size: {Math.round(actionData.size / 1024)} KB</p>
        </div>
      )}
    </div>
  )
}

 */
