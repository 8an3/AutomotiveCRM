import {
  Message,
  Conversation,
  Participant,
  Client,
  ConnectionState,
  Paginator,
} from "@twilio/conversations";
import {
  Form,
  Link,
  useActionData,
  useFetcher,
  useLoaderData,
  useSubmit,
  useNavigation,
  useParams,
  useNavigate,
  useLocation,
} from "@remix-run/react";
import React, { createContext, useEffect, useRef, useState } from "react";
import {
  type DataFunctionArgs,
  type ActionFunction,
  json,
  type LinksFunction,
  redirect,
} from "@remix-run/node";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { prisma } from "~/libs";
import { getSession } from "~/sessions/auth-session.server";
import axios from "axios";
import { GetUser } from "~/utils/loader.server";
import { cn } from "~/components/ui/utils";
import {
  Tabs,
  Badge,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  Alert,
  Debug,
  InputPassword,
  Layout,
  PageHeader,
  RemixForm,
  RemixLinkText,
  CardHeader,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectGroup,
  RemixNavLink,
  Input,
  Separator,
  Button,
  Label,
  PopoverTrigger,
  PopoverContent,
  Popover,
  TextArea,
  buttonVariants,
} from "~/components";
import { CheckIcon, PaperPlaneIcon, PlusIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import useSWR, { SWRConfig, mutate } from "swr";

const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const useSWRWithInterval = (url, refreshInterval) => {
  return useSWR(url, fetchData, { refreshInterval });
};
const labels = [
  { dept: "General", label: "General" },
  { dept: "Sales", label: "Sales" },
  { dept: "Finance", label: "Finance" },
  { dept: "Techs", label: "Techs" },
  { dept: "Service", label: "Service" },
  { dept: "Accessories", label: "Accessories" },
  { dept: "Parts", label: "Parts" },
];
const sortConversationsByDept = (conversations, labels) => {
  // Create a map for quick lookup of room labels by department
  const roomLabelMap = new Map();
  labels.forEach((room) => {
    roomLabelMap.set(room.dept, room.label);
  });

  // Sort conversations by department matching the room labels
  return conversations.sort((a, b) => {
    const roomA = roomLabelMap.get(a.dept);
    const roomB = roomLabelMap.get(b.dept);

    if (roomA < roomB) return -1;
    if (roomA > roomB) return 1;
    return 0;
  });
};
export default function StaffChat() {
  function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  const { user, conversationsList } = useLoaderData();
  const [conversations, setConversations] = useState([]);
  const [filtererdConversations, setFilteredConversations] = useState([]);
  const [roomLabel, setRoomLabel] = useState("General");

  useEffect(() => {
    setConversations(conversationsList);
    const filteredConversations = conversationsList.reduce((filtered, conv) => {
      if (conv.dept === roomLabel) {
        filtered.push(conv);
      }
      return filtered;
    }, []);
    setFilteredConversations(filteredConversations);
  }, []);

  const [input, setInput] = useState("");
  const inputLength = input.trim().length;
  const fetcher = useFetcher();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  let formRef = useRef();
  const timerRef = useRef(0);

  const url1 = "/dealer/staff/getConvos";
  const { data: userMessages } = useSWR(
    url1,
    (url) => fetch(url).then((res) => res.json()),
    { refreshInterval: 180000 }
  );

  useEffect(() => {
    if (Array.isArray(userMessages)) {
      setConversations(userMessages);
      const filteredConversations = conversationsList.reduce(
        (filtered, conv) => {
          if (conv.dept === roomLabel) {
            filtered.push(conv);
          }
          return filtered;
        },
        []
      );
      setFilteredConversations(filteredConversations);
    }
  }, [userMessages]);

  const handleRoomButtonClick = async (dept) => {
    setRoomLabel(dept);
    await delay(150);
    if (!conversations) {
      const filteredConversations = conversationsList.filter(conv => conv.dept === dept);
      console.log(filteredConversations, "filteredConversations");
      setFilteredConversations(filteredConversations);
    } else {
      const filteredConversations = conversationsList.filter(conv => conv.dept === dept);
      console.log(filteredConversations, "filteredConversations");
      setFilteredConversations(filteredConversations);
    }
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    console.log("Conversations:", conversations); // Check if the component rerenders after state update
  }, [conversations]);

  return (
    <Card
      className=" z-50 w-[800px] text-[#f1f1f1] max-h-[80vh]"
      x-chunk="dashboard-05-chunk-4"
    >
      <CardHeader className="flex flex-row items-start bg-[#18181a]">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Staff Chat
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className=" bg-[#09090b] p-6 text-sm">
        <div className="grid grid-cols-8 gap-3 ">
          <Card className="col-span-2">
            <CardContent className="flex-col">
              {labels.map((room, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => handleRoomButtonClick(room.dept)}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    roomLabel === room.dept
                      ? "w-[90%] bg-[#232324] hover:bg-[#232324]"
                      : "w-[90%] hover:bg-[#232324]",
                    "w-[90%] justify-start"
                  )}
                >
                  {room.label}
                </Button>
              ))}
            </CardContent>
          </Card>
          <Card className="col-span-6">
            <CardContent className="flex-grow  overflow-x-clip overflow-y-scroll">
              <div className="mt-5 h-auto  max-h-[800px] space-y-4">
                {filtererdConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                      conversation.userEmail === user.email
                        ? "ml-auto bg-[#dc2626] text-[#fafafa]"
                        : "bg-[#262626]"
                    )}
                  >
                    <div className="grid grid-cols-1">
                      {conversation.userEmail !== user.email && (
                        <p className="text-[#8c8c8c]">
                          {conversation.userName}
                        </p>
                      )}
                      {conversation.body}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t border-[#27272a] bg-[#18181a] px-6 py-3">
        <fetcher.Form
          ref={formRef}
          method="post"
          className="flex w-full items-center space-x-2"
        >
          <Input type="hidden" defaultValue={user.email} name="userEmail" />
          <Input type="hidden" defaultValue={user.username || user.name} name="username" />
          <Input type="hidden" defaultValue={roomLabel} name="dept" />
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1 border-[#27272a] bg-[#18181a]  "
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            name="body"
          />
          <Button
            value="sendMessage"
            type="submit"
            name="intent"
            size="icon"
            onClick={() => {
              toast.success(`Message Sent!`);
            }}
            disabled={inputLength === 0}
            className="bg-[#dc2626] "
          >
            <PaperPlaneIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>

        </fetcher.Form>
      </CardFooter>
    </Card>
  );
}

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: "/dashboard.svg" },
];

export async function loader({ request, params }) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email");
  const user = await GetUser(email);
  const conversationsList = await prisma.staffChat.findMany();
  console.log(user);
  return json({ user, conversationsList });
}

export async function action({ request }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData());
  const formData = financeFormSchema.parse(formPayload);
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email");
  const saveMessage = await prisma.staffChat.create({
    data: {
      body: formData.body,
      userEmail: formData.userEmail,
      username: formData.username,
      dept: formData.dept,
    },
  });

  return saveMessage;
}
