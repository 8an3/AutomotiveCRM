// In your route file
import {
  type LoaderFunction, type ActionFunction, json, redirect, unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData, type UploadHandler,
  ActionArgs,
  unstable_createFileUploadHandler
} from '@remix-run/node';

export const action = async ({ request }: ActionArgs) => {
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      file: ({ filename }) => filename,
    }),
    unstable_createMemoryUploadHandler()
  );

  try {
    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler
    );

    const csvFile = formData.get('selected_csv') as File;
    const csv = String(csvFile)
    console.log(`csv`, csv);
    return json({ csv });
  } catch (error) {
    console.error('Error parsing form data:', error);
    return json({ error: 'Failed to parse form data' }, { status: 500 });
  }
};

export default function ImportExport() {
  return null
}

export const loader: LoaderFunction = async ({ req, request, params }) => {
  return null
};
