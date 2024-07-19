import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input, Dialog as Dialog1, } from "~/components";
import ProvideAppContext, {
  useAppContext,
} from "~/components/microsoft/AppContext";

import {
  EditorTiptapHook,
  Editor,
  EditorTiptapHookCompose,
  EditorTiptapHookComposeDashboardEmailClient,
} from "~/components/libs/basicEditor";




export default function DashboardClient() {
  const [user, setUser] = useState()
  const [customer, setCust] = useState()
  const [to, setTo] = useState()
  const [subject, setSubject] = useState()
  const [text, setText] = React.useState("");
  const app = useAppContext();

  useEffect(() => {
    const userIs = window.localStorage.getItem("user");
    const parseUser = userIs ? JSON.parse(userIs) : [];
    setUser(parseUser)
    const getCust = window.localStorage.getItem("customer");
    const parseCust = getCust ? JSON.parse(getCust) : [];
    setCust(parseCust)
    setTo(parseCust?.email)
    const handleMessage = (event) => {
      const data = event.data;
      if (data && data.cust && data.user) {
        console.log(data);

        const { user, cust } = data;

        console.log('merged1', user, cust, data);
        //setTo(cust.email);
        // setCust(cust);
        // setUser(user);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  console.log(to, customer, user, ' inside dashboard client')
  return (
    <>
      <div className="email flex   flex-col  ">
        <div className="flex justify-center  mt-4">
          <Input
            type='hidden'
            defaultValue={to}
            name="to"
            className="m-2 mx-auto mr-2 w-[98%] bg-background text-foreground   border-border"
          />
          <div className="relative w-full">
            <Input
              name="subject"
              className=" bg-background border-border text-foreground"
              onChange={(e) => setSubject(e.target.value)}
            />
            <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground"> Subject</label>
          </div>
        </div>
        <div className=" grid grid-cols-1">
          <div className="w-full mx-auto mb-2 mt-auto    ">
            <EditorTiptapHookComposeDashboardEmailClient
              content={null}
              subject={subject}
              to={to}
              app={app}
              user={user}
              customer={customer}
            // cc={cc}
            //  bcc={bcc}
            />
            <input type="hidden" defaultValue={text} name="body" />
          </div>
        </div>
      </div>

    </>
  )
}
