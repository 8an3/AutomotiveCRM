
import { useAppContext } from "~/components/microsoft/AppContext";
import { useState, useEffect } from 'react'
import { Button, Input } from "~/components";
import { Form } from "@remix-run/react";
import { CheckIcon, PaperPlaneIcon, PlusIcon, UploadIcon, DownloadIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"
import { ActionFunction, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData, writeAsyncIterableToWritable } from "@remix-run/node";
import { UploadItem } from "~/components/microsoft/GraphService";
import { useMsal } from "@azure/msal-react";
import { prisma } from "~/libs";

export default function Root(request) {

  const app = useAppContext();
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const [file, setFile] = useState([])
  const [fileName, setFileName] = useState([])
  const [clientFile, setClientFile] = useState([])
  const [customer, setCust] = useState()
  const [user, setUser] = useState()

  const [isFile, setIsfile] = useState(false)

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setIsfile(true)
  };
  const handleFileNameChange = (event) => {
    setFileName(event.target);
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
  useEffect(() => {
    const getCust = window.localStorage.getItem("customer");
    const parseCust = getCust ? JSON.parse(getCust) : [];
    setCust(parseCust);

    const getUser = window.localStorage.getItem("user");
    const parseUser = getUser ? JSON.parse(getUser) : [];
    setUser(parseUser);
  }, []);


const fileDownload = async () => {
    const itemId = formData.get("itemId");

  const uploadDocument = await DownloadItem(app.authProvider!, itemId);
return ({uploadDocument})
}

  return (
    <div className="mx-auto mt-3 text-[#fafafa]">
      <Form onSubmit={() => fileUpload } className='flex items-center'>
        <div className="relative mt-5 grid grid-cols-1">
          <Input name='fileName'   onChange={handleFileNameChange}  className="w-full bg-[#09090b] border-[#27272a] "/>
          <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-[#909098] peer-focus:-top-3 peer-focus:text-[#909098]">File Name</label>
        <div>
            <div className="relative mt-5">
              <Input id="file" type="file" className='border-[#27272a] button:border-[#27272a] rounded-md text-[#fafafa] bg-[#09090b] button:text-[#fafafa]  button:bg-[#09090b] px-2 ' name='document' onChange={handleFileChange} />
              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-[#09090b] transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-[#909098] peer-focus:-top-3 peer-focus:text-[#909098]">File Upload</label>
            </div>
            <div>
            <input type='hidden' name='intent' value='' />
            <Button
              value="uploadFile"
              type="submit"
              name="intent"
              size="icon"
              onClick={() => {
                toast.success(`File uploaded!`)
              }}
              disabled={isFile === false}
              className='bg-[#dc2626] ml-2 my-auto'>
              <UploadIcon className="h-4 w-4" />
              <span className="sr-only">Upload</span>
            </Button>
            </div>

          </div>
        </div>

      </Form>
      <hr className="my-3 text-[#27272a] w-[98%] mx-auto" />
       <div className="font-semibold">Download Docs</div>
       <Form onSubmit={() => fileUpload(request)} className='flex items-center'>

      <ul className="grid gap-3">
          {clientFile.length > 0 ? (
            clientFile.map((file, index) => (
              <li key={index} className="flex items-center justify-between">
              <input type='hidden' name='itemId' value={file.itemId} />
                 <span className="text-[#909098]">{file.fileName}</span>
                   <Button size="icon"    className='bg-[#dc2626] ml-2' >
                       <DownloadIcon className="h-4 w-4" />
                    </Button>
              </li>
            ))
          ) : (
            <p>No client files currently...</p>
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
