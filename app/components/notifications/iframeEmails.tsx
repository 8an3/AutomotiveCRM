import { Input, Button, Dialog as DialogRoot, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, TextArea, Card, CardContent, CardHeader, CardFooter, CardTitle, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, } from "~/components";
import { useLoaderData, Form, useFetcher, useLocation, useNavigation } from "@remix-run/react";
import { PhoneOutcome, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose, } from "iconoir-react";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "~/components/ui/tabs"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "~/components/ui/command"
import React, { useCallback, useEffect, useRef, useState } from "react"


export default function MyIFrameComponent() {
  const iFrameRef: React.LegacyRef<HTMLIFrameElement> = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const handleHeightMessage = (event: MessageEvent) => {
      if (
        event.data &&
        event.data.type === "iframeHeight" &&
        event.data.height
      ) {
        setIsLoading(false);
        if (iFrameRef.current) {
          iFrameRef.current.style.height = `${event.data.height}px`;
        }
      }
    };
    const currentHost =
      typeof window !== "undefined" ? window.location.host : null;
    if (iFrameRef.current) {
      if (currentHost === "localhost:3000") {
        iFrameRef.current.src = "http://localhost:3000/dealer/email/notificationClient";
      }
      if (currentHost === "dealersalesassistant.ca") {
        iFrameRef.current.src =
          "https://www.dealersalesassistant.ca/dealer/email/notificationClient";
      }
      window.addEventListener("message", handleHeightMessage);
    }
    return () => {
      if (iFrameRef.current) {
        window.removeEventListener("message", handleHeightMessage);
      }
    };
  }, []);

  return (
    <>
      <div className="size-full ">
        <iframe
          ref={iFrameRef}
          title="my-iframe"
          width="100%"
          className=" border-none"
          style={{
            minHeight: "40vh"

          }}
        />
      </div>
    </>
  );
};
