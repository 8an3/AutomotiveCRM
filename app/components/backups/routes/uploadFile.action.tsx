import { prisma } from "~/libs/prisma.server";
import {
  Form,
  useActionData,

  useLoaderData
} from "@remix-run/react";
import {
  json,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import type { LoaderFunction, ActionFunction, LoaderArgs, HeadersFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  // makwe new record save file name and finance to get it later or display it in a list forr people to downlaod
  const handler = unstable_createFileUploadHandler({
    directory: `./api/client/uploads`,
    file: ({ filename }: { filename: string }) => filename,
    maxFileSize: 50_000_000
  });

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

  const uploadedDocs = await prisma.uploadDocs.create({
    data: {
      userId: userId,
      category: category,
      financeId: financeId,
      fileName: file.name + '-' + financeId,
    }
  })
  return {
    uploadedDocs,
    url: `/api/client/uploads/${file.name}`,
    size: file.size,
    name: file.name
  };
};
