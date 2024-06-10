
import { useAppContext } from "~/components/microsoft/AppContext";
import { useState, useEffect } from 'react'
import { Button, Input } from "~/components";
import { Form, useActionData } from "@remix-run/react";
import { CheckIcon, PaperPlaneIcon, PlusIcon, UploadIcon, DownloadIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"
import { ActionFunction, LoaderFunction, json, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData, writeAsyncIterableToWritable } from "@remix-run/node";
import { UploadFile, deleteFile, downloadFile, listFilesByFinanceId } from "~/components/microsoft/GraphService";
import { useMsal } from "@azure/msal-react";
import { prisma } from "~/libs";
import { getSession } from "~/sessions/auth-session.server";
import { cors } from "remix-utils";
import { Trash } from "lucide-react";


export default function Root() {

  const app = useAppContext();
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const [file, setFile] = useState([])
  const [fileName, setFileName] = useState('')
  const [clientFile, setClientFile] = useState([])
  const [customer, setCustomer] = useState()
  const [user, setUser] = useState()
  const [downloadFileId, setDownloadFileId] = useState('')
  const [isFile, setIsfile] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const actionData = useActionData();
  const authProvider = app.authProvider!

  const handleFileNameChange = (event) => {
    setFileName(event.target);
  };


  /**
   *   const handleFileChange = (event) => {
      setFile(event.target.files[0]);
    };
      const fileUpload = async (event) => {
      event.preventDefault();

      const formData = new FormData();
      formData.append("document", file);
      formData.append("filename", fileName);
      formData.append("customer", JSON.stringify(customer));
      formData.append("user", JSON.stringify(user));

      try {
        const response = await fetch("/dealer/upload/file", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          toast.success(`File uploaded!`);
        } else {
          toast.error(`Failed to upload file.`);
        }
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    };
      const fileDownload = async () => {
      const itemId = formData.get("itemId");

      const uploadDocument = await DownloadItem(app.authProvider!, itemId);
      return ({ uploadDocument })
    } */
  useEffect(() => {
    const getCust = window.localStorage.getItem("customer");
    const parseCust = JSON.parse(getCust)
    setCustomer(parseCust);
    if (customer) {
      console.log(customer, ' customer is real')
    }
    const getUser = window.localStorage.getItem("user");
    const parseUser = JSON.parse(getUser)
    setUser(parseUser);
    console.log(getCust, getUser, parseCust, parseUser)
    if (user) {
      console.log(user, ' user is real')
    }
  }, []);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsfile(true)

  };
  useEffect(() => {
    if (customer) {
      async function getFiles() {
        const financeId = customer.financeId
        const files = await listFilesByFinanceId(authProvider, financeId);
        console.log(files)
        setClientFile(files)
      }
      getFiles()
      console.log(clientFile, customer, 'clientFile')
    }
  }, [customer]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    const authProvider = app.authProvider!
    try {
      const fileNametwo = customer.financeId + '-' + fileName
      const fileContent = selectedFile;
      const response = await UploadFile(authProvider, fileNametwo, fileContent);
      toast.success('File uploaded successfully')
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };


  const fileId = downloadFileId

  const handleDownload = async () => {
    try {
      toast.success('Retrieving file for download...');
      const response = async () => {
        function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
        await delay(1000);
        const download = await downloadFile(authProvider, fileId)
        return download

      }
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'downloaded-file';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('File downloaded successfully!');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error(`Error downloading file: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    const result = await deleteFile(authProvider, fileId);
    if (result.success) {
      toast.success('File Deleted')
    } else {
      alert('Error deleting file: ' + result.error);
    }
  };

  return (
    <div className="mx-auto mt-3 text-foreground">
      <Form method='post' encType="multipart/form-data" className='grid grid-cols-1 items-center' onSubmit={handleSubmit}>
        <div className="relative grid grid-cols-2 justify-center   ">

          <div className='mr-2'>
            <Input name='fileName' onChange={(e) => setFileName(e.target.value)} className="w-full bg-background border-border " />
            <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">File Name</label>
          </div>

          <div className="relative ml-2">
            <Input id="file" type="file" className='hidden' name='file' onChange={handleFileChange} />
            <label htmlFor="file" className={`h-[37px] cursor-pointer border border-border rounded-md text-foreground bg-background px-4 py-2 inline-block w-full
                    ${isFile === false ? 'border-[#dc2626]' : 'border-[#3dff3d]'}`}  >
              <span className="mr-4">
                {isFile === false ? <p>Choose File</p> : <p>File Selected</p>}
              </span>
            </label>
            <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
              File Upload - Scanned Image
            </label>
            {actionData?.error && <div style={{ color: 'red' }}>{actionData.error}</div>}
            {actionData?.success && <div style={{ color: 'green' }}>File uploaded successfully!</div>}
          </div>
        </div>
        <div className='flex justify-end'>
          <input type='hidden' name='financeId' value={customer?.financeId} />
          <Button
            value="uploadFile"
            type="submit"
            name="intent"
            size="icon"
            onClick={() => {
              toast.success(`File uploaded!`)
            }}
            disabled={isFile === false}
            className='bg-[#dc2626] ml-auto my-auto'>
            <UploadIcon className="h-4 w-4" />
            <span className="sr-only">Upload</span>
          </Button>
        </div>

      </Form>
      <hr className="my-3 text-muted-foreground w-[98%] mx-auto" />
      <div className="font-semibold">Download Docs {downloadFileId}</div>
      <Form className='flex items-center'>

        <ul className="grid gap-3">
          {clientFile && clientFile.length > 0 ? (
            clientFile.map((file, index) => {
              const splitString = file.name.split('-');
              const result = splitString[1];
              return (
                <li key={index} className="flex items-center justify-between">
                  <input type='hidden' name='itemId' value={file.id} />
                  <div className='grid grid-cols-1'>
                    <span className="  text-left">{result}</span>
                    <span className="text-muted-foreground text-left">Uploaded by: {file.createdBy.user.displayName}</span>
                  </div>
                  <div className='flex justify-end'>
                    <Button onClick={() => {
                      setDownloadFileId(file.id)

                      handleDownload()
                    }} size="icon" className='bg-[#dc2626] ml-auto mr-2' >
                      <DownloadIcon className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => {
                      setDownloadFileId(file.id)

                      handleDelete()
                    }} size="icon" className='bg-[#dc2626] ml-auto' >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              )
            })
          ) : (
            <span className="text-muted-foreground  text-sm ">No client files uploaded yet.</span>

          )}
        </ul>
      </Form>
    </div>
  )
}
/**  const fileUpload = async ( ) => {
    try {
      const uploadHandler = unstable_createMemoryUploadHandler({
        maxPartSize: 500_000,
      });

      const formData = await unstable_parseMultipartFormData(

        uploadHandler
      );

      const document = formData.get("document");
      const firstFilename = formData.get("filename");

      const getCust = window.localStorage.getItem("customer");
      const customer = getCust ? JSON.parse(getCust) : [];

      const filename = customer?.email + firstFilename;

      const uploadDocument = await UploadItem(app.authProvider!, document, filename);

      if (!uploadDocument) {
        throw new Error('Upload failed');
      }

      const getUser = window.localStorage.getItem("user");
      const user = getUser ? JSON.parse(getUser) : [];

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

      return { uploadDocument, SaveUploadToDb };

    } catch (error) {
      console.error("Error during file upload process:", error);
      return { uploadDocument: null, SaveUploadToDb: null }; // Return null values in case of error
    }
  }; */


export const headers = ({ loaderHeaders, parentHeaders }) => {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
  };
};
