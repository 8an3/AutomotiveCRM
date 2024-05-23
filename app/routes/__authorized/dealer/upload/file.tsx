
import { useAppContext } from "~/components/microsoft/AppContext";
import { useState, useEffect } from 'react'
import { Button, Input } from "~/components";
import { Form } from "@remix-run/react";
import { CheckIcon, PaperPlaneIcon, PlusIcon, UploadIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"
import { ActionFunction, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData, writeAsyncIterableToWritable } from "@remix-run/node";
import { Readable } from 'stream';
import { getSession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import { UploadItem } from "~/components/microsoft/GraphService";

export const action: ActionFunction = async ({ req, request, params }) => {

  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)

  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 500_000,
  });

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const document = formData.get("document");
  const filename = formData.get("filename");
  const uploadDocument = await UploadItem(request, document, filename);
 async function SaveUploadToDb() {
        await prisma.uploadDocs.create({
          data: {
            financeId: customer?.financeId,
            fileName: filename,
            userEmail: user?.email,
            itemId: uploadDocument.id,
          }
        });
      }
console.log( uploadDocument, SaveUploadToDb)
  return json({ uploadDocument, SaveUploadToDb });

}
