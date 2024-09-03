import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError, useActionData } from "@remix-run/react";
import {
  buttonVariants,
  Debug,
  Icon,
  Logo,
  PageAdminHeader,
  RemixNavLink,
  SearchForm,
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectValue,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  Checkbox
} from "~/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Settings2, DownloadIcon } from "lucide-react"
import { prisma } from "~/libs";
import { getSession } from '~/sessions/auth-session.server';
import { createCacheHeaders, createSitemap } from "~/utils";
import { model } from "~/models";
import { GetUser } from "~/utils/loader.server";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  LoaderFunction, ActionFunction, UploadHandler, json, redirect,
} from "@remix-run/node";

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  const metrics = await model.admin.query.getMetrics();
  const dealer = await prisma.dealer.findUnique({ where: { id: 1 } })
  const comsRecords = await prisma.comm.findMany({ where: { userEmail: user.email, }, });
  return json(
    { user, metrics, dealer, comsRecords },
    { headers: createCacheHeaders(request) }
  );
}


export default function SettingsGenerral() {
  // export
  const [selectExport, setSelectExport] = useState(false)
  const [link, setLink] = useState('')
  const ExportChange = (value) => {
    setSelectExport(true);
    setLink(value);
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

  return (
    <div className="grid gap-6">

      <Card x-chunk="dashboard-04-chunk-2">
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>
            Select what you need to export it and download the file.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                  <SelectItem className="cursor-pointer  hover:bg-muted/50 w-[95%] rounded-md" value="Accessories">Accessories</SelectItem>
                  <SelectItem className="cursor-pointer  hover:bg-muted/50 w-[95%] rounded-md" disabled value="Accessories">Work Orders</SelectItem>
                  <SelectItem className="cursor-pointer  hover:bg-muted/50 w-[95%] rounded-md" disabled value="Accessories">Accessory Orders</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Data Type</label>
          </div>

        </CardContent>
        <CardFooter className="border-t border-border px-6 py-4">
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
        </CardFooter>
      </Card>
      <Card x-chunk="dashboard-04-chunk-2">
        <CardHeader>
          <CardTitle>Upload Units</CardTitle>
          <CardDescription>Upload your CSV file to add to the database.</CardDescription>
        </CardHeader>
        <CardContent>
          <MyIFrameComponent />
        </CardContent>
      </Card>
    </div>
  )
}
