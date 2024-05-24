import {
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import React, { createContext, useEffect, useRef, useState } from "react";
import {
  type DataFunctionArgs,
  type ActionFunction,
  json,
  type LinksFunction,
} from "@remix-run/node";
import { getSession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import { cn } from "~/components/ui/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Button,
  buttonVariants,
} from "~/components";
import { CheckIcon, PaperPlaneIcon, PlusIcon } from "@radix-ui/react-icons";
import { accDocsSidebarNav, adminDocsSidebarNav, apiDocsSidebarNav, financeDocsSidebarNav, managerDocsSidebarNav, partsDocsSidebarNav, salesDocsSidebarNav, serviceDocsSidebarNav, techDocsSidebarNav } from "../docs";

interface SidebarNavProps extends HTMLAttributes<HTMLElement> {
  items: {
    to: string
    title: string
  }[]
}

export default function StaffChat() {
  const { user, videoMenu, dept } = useLoaderData();

  const [video, setVideo] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    setVideo(videoMenu[0].name)
    setVideoUrl(videoMenu[0].url)
  }, []);

  function SidebarNav({ className, items, ...props }: SidebarNavProps) {
    const location = useLocation();
    const pathname = location.pathname
    console.log(pathname)
    return (
      <nav className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1  text-[#f1f1f1]", className)} {...props} >
        {items.map((item) => (
          <Button
            key={item.url}
            variant='ghost'
            onClick={() => {
              setVideo(item.name)
              setVideoUrl(item.url)
            }}
            className={cn(
              'justify-start text-left text-[#f1f1f1]',
              buttonVariants({ variant: 'ghost' }),
              video === item.name
                ? "bg-[#232324] hover:bg-[#232324] w-[90%] text-[#f1f1f1]  "
                : "hover:bg-[#232324] text-[#a1a1aa] w-[90%]  ",
              "justify-start w-[90%]"
            )} >
            {item.name}
          </Button>
        ))}
      </nav>
    )
  }
  let result = dept.charAt(0).toUpperCase() + dept.slice(1);

  return (
    <Card className=" z-50 w-[90%] text-[#f1f1f1]   h-[80%] mx-auto mt-[50px] border-[#27272a]" x-chunk="dashboard-05-chunk-4"  >
      <CardHeader className="flex flex-row items-start bg-[#18181a]">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Docs
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className=" bg-[#09090b] border-[#27272a] p-6 text-sm grid grid-cols-8 gap-3">
        <fieldset className="col-span-2  gap-6 rounded-lg border p-4   h-auto w-auto mr-1 flex-grow !grow border-[#27272a]   " >
          <legend className="-ml-1 px-1 text-lg font-medium text-[#f1f1f1]">{result}</legend>
          <SidebarNav items={videoMenu} />
        </fieldset>

        <fieldset className="col-span-6   gap-6 rounded-lg border p-4  h-auto w-auto  ml-1 flex-grow !grow border-[#27272a]   " >
          <legend className="-ml-1 px-1 text-lg font-medium text-[#f1f1f1]">{video}</legend>
          <div className='flex justify-center'>
            <iframe width="750" height="500" src={String(videoUrl)} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen autoplay ></iframe>
          </div>
        </fieldset>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t border-[#27272a] bg-[#18181a] px-6 py-3">
        <Input type="hidden" defaultValue={user.email} name="userEmail" />
      </CardFooter>
    </Card>
  );
}
/**          <iframe width="auto" height='auto'  src={videoUrl} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen ></iframe> */

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: "/dashboard.svg" },
];

export async function loader({ request, params }) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email");
  const user = await GetUser(email);
  const dept = params.dept

  let videoMenu
  switch (params.dept) {
    case "accessories":
      videoMenu = accDocsSidebarNav
      break;
    case "admin":
      videoMenu = adminDocsSidebarNav
      break;
    case "api":
      videoMenu = apiDocsSidebarNav
      break;
    case "finance":
      videoMenu = financeDocsSidebarNav
      break;
    case "manager":
      videoMenu = managerDocsSidebarNav
      break;
    case "parts":
      videoMenu = partsDocsSidebarNav
      break;
    case "sales":
      videoMenu = salesDocsSidebarNav
      break;
    case "service":
      videoMenu = serviceDocsSidebarNav
      break;
    case "technician":
      videoMenu = techDocsSidebarNav
      break;
    default:
      null
  }



  return json({ user, videoMenu, dept });
}

export async function action({ request }: ActionFunction) {
  return null;
}
