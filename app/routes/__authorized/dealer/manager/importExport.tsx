import { ActionArgs, ActionFunctionArgs, LoaderFunction, UploadHandler, json, redirect, unstable_composeUploadHandlers, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData, } from "@remix-run/node";
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { GetUser } from '~/utils/loader.server';
import { getSession } from "~/sessions/auth-session.server";
import { prisma } from '~/libs';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  Button, Input,
  Card, CardHeader, CardTitle, CardFooter, CardContent,
  SelectValue,
} from "~/components"
import { Form, useFetcher, useSubmit } from '@remix-run/react';
import { DownloadIcon, PaperPlaneIcon, UploadIcon } from '@radix-ui/react-icons';
import { toast } from "sonner"
import { useState, useRef, useEffect } from 'react';


export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  return null
};


export const action = async ({ request }: ActionArgs) => {
  // Create a memory upload handler
  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 5_000_000, // 5MB limit for uploaded files
  });

  // Parse the multipart form data
  const formData = await unstable_parseMultipartFormData(request, uploadHandler);

  // Get the uploaded file
  const csvFile = formData.get('csv');

  // Ensure the file is a Blob and not a string
  if (typeof csvFile === 'string' || !csvFile) {
    return json({ error: 'Invalid file upload' }, { status: 400 });
  }

  // Read the CSV file content
  const csvText = await csvFile.text();

  // Parse the CSV content
  const parsedData = Papa.parse(csvText, {
    header: true, // Assumes the first row contains headers
  });

  console.log(parsedData.data); // Log the parsed data

  return json({ message: 'File uploaded and parsed successfully', data: parsedData.data });
};
export default function ImportExport() {
  const [selectImport, setSelectImport] = useState(false)
  const [selectExport, setSelectExport] = useState(false)
  const [isFile, setIsfile] = useState(false)
  const [file, setFile] = useState([])
  const [link, setLink] = useState('')
  const fetcher = useFetcher();
  const submit = useSubmit()
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setIsfile(true)
  };
  const ExportChange = (value) => {
    setSelectExport(true);
    setLink(value);
  };
  const ImportChange = (value) => {
    setSelectImport(true);
    setLink(value);
  };
  const DropChangeOn = async (event) => {
    console.log('hit change')
    console.log(event.target.files[0], 'checking file');

    let config = {
      skipFirstNLines: 1,
    };
    try {
      const parsedFile = await Papa.parse(event.target.files[0], config);
      console.log(parsedFile, 'parsedfile');
    } catch (error) {
      console.error('Error parsing file:', error);
    }
  };

  const iFrameRef: React.LegacyRef<HTMLIFrameElement> = useRef(null);
  const MyIFrameComponent = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const handleHeightMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'iframeHeight' && event.data.height) {
          setIsLoading(false);

          if (iFrameRef.current) {
            iFrameRef.current.style.height = `${event.data.height}px`;
          }
        }
      };

      if (iFrameRef.current) {
        // iFrameRef.current.src = 'http://localhost:3000/body';
        iFrameRef.current.src = 'https://crmsat.vercel.app/admin/import/motorcycle';
        window.addEventListener('message', handleHeightMessage);
      }

      return () => {
        if (iFrameRef.current) {
          window.removeEventListener('message', handleHeightMessage);
        }
      };
    }, []);

    return (
      <>
        <div className="h-full w-full ">
          <iframe
            ref={iFrameRef}
            title="my-iframe"
            width="100%"
            className=' border-none'
            style={{ minHeight: '840px' }}
          />
        </div>
      </>
    );
  };
  // action={`/dealer/manager/import/${link}`}
  return (
    <Card className="overflow-hidden text-foreground w-[600px] mt-[50px] mx-auto" x-chunk="dashboard-05-chunk-4" >
      <CardHeader className="flex flex-row items-start bg-muted-background">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Import / Export
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow !grow   overflow-x-clip p-6 text-sm bg-background">
        <div>
          <div className="font-semibold">Import Data</div>
          <fetcher.Form
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.nativeEvent.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (!file) return;
              const formData = new FormData();
              formData.set("csv", file);
              submit(formData)
            }}
            method='post' encType="multipart/form-data">
            <ul className="grid gap-3 mt-4">
              <li className="flex items-center justify-between">
                <div className="text-foreground ">
                  <div className="relative mt-3">
                    <Select name='intent' onValueChange={ImportChange}>
                      <SelectTrigger className="w-[180px] bg-background border-border">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent className='bg-background border-border text-foreground'>
                        <SelectGroup>
                          <SelectLabel>Export</SelectLabel>
                          <SelectItem className="cursor-pointer  hover:bg-muted/50 w-[95%] rounded-md" value="Customers">Customers</SelectItem>
                          <SelectItem className="cursor-pointer  hover:bg-muted/50 w-[95%] rounded-md" value="UnitInventory">Unit Inventory</SelectItem>
                          <SelectItem className="cursor-pointer  hover:bg-muted/50 w-[95%] rounded-md" value="Deals">Deals</SelectItem>
                          <SelectItem className="cursor-pointer  hover:bg-muted/50 w-[95%] rounded-md" value="Parts">Parts</SelectItem>
                          <SelectItem className="cursor-pointer  hover:bg-muted/50 w-[95%] rounded-md" value="Accessories">Accessories</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Data Type</label>
                  </div>
                </div>
                <div>
                  <div className="relative mt-3">
                    <Input id="file" type="file" className='hidden' name='csv' onChange={handleFileChange} />
                    <label htmlFor="file" className={`h-[37px] cursor-pointer border border-border rounded-md text-foreground bg-background px-4 py-2 inline-block w-[225px]
                    ${isFile === false ? 'border-primary' : 'border-[#3dff3d]'}`}  >
                      <div className="mr-4">
                        {isFile === false ? <p>Choose File - No File Chosen</p> : <p>File Selected</p>}
                      </div>
                    </label>
                    <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                      CSV File
                    </label>
                  </div>

                </div>
              </li>
              <li className="flex items-center justify-between">
                <div className="text-[#8a8a93]"> </div>
                <div>
                  <Button
                    type="submit"
                    size="icon"
                    onClick={() => {
                      toast.success(`Downloading data....`)
                    }}
                    disabled={isFile === false && selectImport === false}
                    className='bg-primary '>
                    <UploadIcon className="h-4 w-4" />
                    <div className="sr-only">Upload</div>
                  </Button>
                </div>
              </li>

            </ul>
          </fetcher.Form>

          <fetcher.Form  >
            <div>
              <label htmlFor="contact-file">
                <div>Upload a file</div>
                <input id="contact-file" name="selected_csv" type="file" onChange={DropChangeOn} />
              </label>
              <p>or drag and drop</p>
            </div>
            <p>  CSV up to 5MB</p>
          </fetcher.Form>
          <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
          <div className="font-semibold">Export Data</div>
          <ul className="grid gap-3 mt-4">
            <li className="flex items-center justify-between">
              <div className="text-foreground ">
                <div className="relative mt-3">
                  <Select name='intent' onValueChange={ExportChange}>
                    <SelectTrigger className="w-[180px] bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-background border-border text-foreground'>
                      <SelectGroup>
                        <SelectLabel>Export</SelectLabel>
                        <SelectItem className="cursor-pointer  hover:bg-muted/50 w-[95%] rounded-md" value="Customers">Customers</SelectItem>
                        <SelectItem className="cursor-pointer  hover:bg-muted/50 w-[95%] rounded-md" value="UnitInventory">Unit Inventory</SelectItem>
                        <SelectItem className="cursor-pointer  hover:bg-muted/50 w-[95%] rounded-md" value="Deals">Deals</SelectItem>
                        <SelectItem className="cursor-pointer  hover:bg-muted/50 w-[95%] rounded-md" value="Parts">Parts</SelectItem>
                        <SelectItem className="cursor-pointer  hover:bg-muted/50 w-[95%] rounded-md" value="Accessories">Accessories</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Data Type</label>
                </div>
              </div>
              <div>
                <a href={`/dealer/manager/export/${link}`} target='_blank'>
                  <Button
                    type="submit"
                    size="icon"
                    onClick={() => {
                      toast.success(`Downloading data....`)
                    }}
                    disabled={selectExport === false}
                    className='bg-primary '>
                    <DownloadIcon className="h-4 w-4" />
                    <div className="sr-only">Download</div>
                  </Button>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t border-border bg-muted-background px-6 py-3">
        <Input type='hidden' />
      </CardFooter>
    </Card >
  )
}
