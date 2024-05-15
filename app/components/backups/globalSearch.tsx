import { Link, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useNavigation, isRouteErrorResponse, useRouteError, useParams, Form, useFormAction, useLocation, useFetcher, } from "@remix-run/react";
import { ActionFunction, DataFunctionArgs, type LoaderFunction, json, redirect } from "@remix-run/node";
import { Button, Input, Label } from "~/components/ui";
import Sidebar from "~/components/shared/sidebar";
import { Bell, BellRing, BookOpenCheck, Milestone, X } from 'lucide-react';
import dayjs from "dayjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import { useEffect, useState } from "react";
import { getSession } from "~/sessions/auth-session.server";

const Footer = () => {
  return <p className='text-[#fff] text-center'> DSA </p>;
};


export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  return json({ ok: true, user, data });
}

export const action = async () => {
  return null;
};

export function PopoverMenu(readNot, newLeads) {
  const location = useLocation()
  const pathname = location.pathname
  let fetcher = useFetcher()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="mr-10 border-none">
          <Bell color="#02a9ff" strokeWidth={1.5} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600PX] bg-[#fff]">
        <Tabs defaultValue="Msgs" className="w-[580PX] mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="Msgs" className="text-sm">Msgs</TabsTrigger>
            <TabsTrigger value="Updates" className="text-sm">Updates</TabsTrigger>
            <TabsTrigger value="NewLeads" className="text-sm">New Leads</TabsTrigger>
          </TabsList>
          <TabsContent value="Msgs">
            <ul>
              {readNot && readNot.length > 0 ? (
                readNot.map((notification) => (
                  <li key={notification.id} className="rounded-md shadow bg-[#454954] mt-2">
                    <div className="grid grid-cols-10 p-2">
                      <div className="grid-span-9 ">
                        <h2 className='text-[#fff]'>{notification.title}</h2>
                        <p className='text-[#fff]'>{notification.content}</p>
                        <p className='text-[#fff] text-sm mt-auto'>{new Date(notification.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="grid-span-1">
                        <fetcher.Form method='post' className=" justify-end items-end">
                          <input type='hidden' name='financeId' value={notification.financeId} />
                          <input type='hidden' name='clientfileId' value={notification.clientfileId} />
                          <input type='hidden' name='id' value={notification.id} />
                          <input type='hidden' name='path' value={pathname} />
                          <input type='hidden' name='intent' value='dimiss' />

                          <input type='hidden' name='userId' value={notification.userId} />
                          <Button className='text-[#fff] '>
                            <X color="#02a9ff" size={20} strokeWidth={1.5} />
                          </Button>
                        </fetcher.Form>
                        <fetcher.Form method='post'>
                          <input type='hidden' name='financeId' value={notification.financeId} />
                          <input type='hidden' name='clientfileId' value={notification.clientfileId} />
                          <input type='hidden' name='id' value={notification.id} />
                          <input type='hidden' name='userId' value={notification.userId} />
                          <input type='hidden' name='path' value={pathname} />
                          <input type='hidden' name='intent' value='read' />
                          <Button className='text-[#fff] justify-center  items-center'>
                            <BookOpenCheck size={20} color="#02a9ff" strokeWidth={1.5} />
                          </Button>
                        </fetcher.Form>
                        <Link to={`/customer/${notification.clientfileId}/${notification.financeId}`} >
                          <Button className='text-[#fff] justify-center  items-center'>
                            <Milestone size={20} color="#02a9ff" strokeWidth={1.5} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p className='tezxt-[#fff]'>No notifications</p>
              )}
            </ul>
          </TabsContent>
          <TabsContent value="Updates">
            <ul>
              {readNot && readNot.length > 0 ? (
                readNot.map((notification) => (
                  <li key={notification.id} className="rounded-md shadow bg-[#454954] mt-2">
                    <div className="grid grid-cols-10 p-2">
                      <div className="grid-span-9 ">
                        <h2 className='text-[#fff]'>{notification.title}</h2>
                        <p className='text-[#fff]'>{notification.content}</p>
                        <p className='text-[#fff] text-sm mt-auto'>{new Date(notification.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="grid-span-1">
                        <fetcher.Form method='post' className=" justify-end items-end">
                          <input type='hidden' name='financeId' value={notification.financeId} />
                          <input type='hidden' name='clientfileId' value={notification.clientfileId} />
                          <input type='hidden' name='id' value={notification.id} />
                          <input type='hidden' name='path' value={pathname} />
                          <input type='hidden' name='intent' value='dimiss' />

                          <input type='hidden' name='userId' value={notification.userId} />
                          <Button className='text-[#fff] '>
                            <X color="#02a9ff" size={20} strokeWidth={1.5} />
                          </Button>
                        </fetcher.Form>
                        <fetcher.Form method='post'>
                          <input type='hidden' name='financeId' value={notification.financeId} />
                          <input type='hidden' name='clientfileId' value={notification.clientfileId} />
                          <input type='hidden' name='id' value={notification.id} />
                          <input type='hidden' name='userId' value={notification.userId} />
                          <input type='hidden' name='path' value={pathname} />
                          <input type='hidden' name='intent' value='read' />
                          <Button className='text-[#fff] justify-center  items-center'>
                            <BookOpenCheck size={20} color="#02a9ff" strokeWidth={1.5} />
                          </Button>
                        </fetcher.Form>
                        <Link to={`/customer/${notification.clientfileId}/${notification.financeId}`} >
                          <Button className='text-[#fff] justify-center  items-center'>
                            <Milestone size={20} color="#02a9ff" strokeWidth={1.5} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p className='tezxt-[#fff]'>No notifications</p>
              )}
            </ul>
          </TabsContent>
          <TabsContent value="NewLeads">
            <ul>
              {newLeads && newLeads.length > 0 ? (
                newLeads.map((notification) => (
                  <li key={notification.id} className="rounded-md shadow bg-[#454954] mt-2">
                    <div className="grid grid-cols-10 p-2">
                      <div className="col-span-9 ">
                        <h2 className='text-[#fff]'>{notification.title}</h2>
                        <p className='text-[#fff]'>{notification.content}</p>
                        <p className='text-[#fff] text-sm mt-auto'>{new Date(notification.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="col-span-1">
                        <fetcher.Form method='post' className=" justify-end items-end">
                          <input type='hidden' name='financeId' value={notification.financeId} />
                          <input type='hidden' name='clientfileId' value={notification.clientfileId} />
                          <input type='hidden' name='id' value={notification.id} />
                          <input type='hidden' name='path' value={pathname} />
                          <input type='hidden' name='intent' value='dimiss' />

                          <input type='hidden' name='userId' value={notification.userId} />
                          <Button className='text-[#fff] '>
                            <X color="#02a9ff" size={20} strokeWidth={1.5} />
                          </Button>
                        </fetcher.Form>
                        <fetcher.Form method='post'>
                          <input type='hidden' name='financeId' value={notification.financeId} />
                          <input type='hidden' name='clientfileId' value={notification.clientfileId} />
                          <input type='hidden' name='id' value={notification.id} />
                          <input type='hidden' name='userId' value={notification.userId} />
                          <input type='hidden' name='path' value={pathname} />
                          <input type='hidden' name='intent' value='read' />
                          <Button className='text-[#fff] justify-center  items-center'>
                            <BookOpenCheck size={20} color="#02a9ff" strokeWidth={1.5} />
                          </Button>
                        </fetcher.Form>
                        <Link to={`/customer/${notification.clientfileId}/${notification.financeId}`} >
                          <Button className='text-[#fff] justify-center  items-center'>
                            <Milestone size={20} color="#02a9ff" strokeWidth={1.5} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p className='tezxt-[#fff]'>No notifications</p>
              )}
            </ul>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}

/**
 *  const readNot = await prisma.notificationsUser.findMany({
    where: {
      userId: user?.id,
      read: false,
      type: 'Note'
      //dimiss: true,
    },
    take: 20,
    orderBy: {
      createdAt: 'desc'
    }
  });
  const newLeads = await prisma.notificationsUser.findMany({
    where: {
      userId: user?.id,
      read: false,
      type: 'New Lead'
      //dimiss: true,
    },
    take: 20,
    orderBy: {
      createdAt: 'desc'
    }
  });
  const msgs = await prisma.notificationsUser.findMany({
    where: {
      userId: user?.id,
      read: false,
      type: 'New Lead'
      //dimiss: true,
    },
    take: 20,
    orderBy: {
      createdAt: 'desc'
    }
  });

  console.log(readNot, 'readNot')
 *  readNot, newLeads,
 * let readNotData
  if (readNot) {
    readNotData = readNot
  }
  if (!readNot) {
    readNotData = []
  }



  const location = useLocation()
  const pathname = location.pathname
  const navigation = useNavigation()
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      const notifications = await prisma.notificationsUser.findMany({
        where: {
          userId: user?.user?.id,
        },

      });
      setNotifications(notifications);
      //   console.log(notifications, 'notifications')
    }

    fetchNotifications();
  }, []);
  // console.log(notifications, 'readNotifications', user)
  if (data.status === 'error') {
    console.error(data.error)
  }
  */

export default function TopBar() {
  const loaderData = useLoaderData();

  let user;
  let data;
  if (!loaderData) {
    return <p>Loading...</p>
  } else {
    user = useLoaderData();
    data = useLoaderData<typeof loader>()
  }

  return (
    <>
      {user?.subscriptionId === 'active' || user?.subscriptionId === 'trialing' && (
        pathname !== '/api/fileUpload' &&
        <div className="flex justify-between items-center  ml-2 h-[40px]">
          <div></div>
          <div className="flex items-center mr-3">


            <Sidebar />

          </div>
        </div>
      )}
    </>
  )
}

/** <PopoverMenu user={user} notifications={notifications} readNot={readNotData} newLeads={newLeads} /> */
/**export async function loader({ request }) {
  console.log('htttti')
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await model.user.query.getForSession({ id: userSession.id });
  const session = await getSession(request.headers.get("Cookie"))
  const clientfileId = session.get('clientfileId')
  const financeId = session.get('financeId')
  let userId = JSON.stringify(userSession.id);;
  console.log('user', userId)

  const docName = "doc" + userId + uuidv4();

  const email = user?.email;
  const deFees = await getDealerFeesbyEmail(email)
  const finance = await getMergedFinanceOnFinance(financeId)

  let merged = {
    userLoanProt: finance[0].userLoanProt,
    userTireandRim: finance[0].userTireandRim,
    userGap: finance[0].userGap,
    userExtWarr: finance[0].userExtWarr,
    userServicespkg: finance[0].userServicespkg,
    vinE: finance[0].vinE,
    lifeDisability: finance[0].lifeDisability,
    rustProofing: finance[0].rustProofing,
    userLicensing: finance[0].userLicensing,
    userFinance: finance[0].userFinance,
    userDemo: finance[0].userDemo,
    userGasOnDel: finance[0].userGasOnDel,
    userOMVIC: finance[0].userOMVIC,
    userOther: finance[0].userOther,
    userTax: finance[0].userTax,
    userAirTax: finance[0].userAirTax,
    userTireTax: finance[0].userTireTax,
    userGovern: finance[0].userGovern,
    userPDI: finance[0].userPDI,
    userLabour: finance[0].userLabour,
    userMarketAdj: finance[0].userMarketAdj,
    userCommodity: finance[0].userCommodity,
    destinationCharge: finance[0].destinationCharge,
    userFreight: finance[0].userFreight,
    userAdmin: finance[0].userAdmin,
    iRate: finance[0].iRate,
    months: finance[0].months,
    discount: finance[0].discount,
    total: finance[0].total,
    onTax: finance[0].onTax,
    on60: finance[0].on60,
    biweekly: finance[0].biweekly,
    weekly: finance[0].weekly,
    weeklyOth: finance[0].weeklyOth,
    biweekOth: finance[0].biweekOth,
    oth60: finance[0].oth60,
    weeklyqc: finance[0].weeklyqc,
    biweeklyqc: finance[0].biweeklyqc,
    qc60: finance[0].qc60,
    deposit: finance[0].deposit,
    biweeklNatWOptions: finance[0].biweeklNatWOptions,
    weeklylNatWOptions: finance[0].weeklylNatWOptions,
    nat60WOptions: finance[0].nat60WOptions,
    weeklyOthWOptions: finance[0].weeklyOthWOptions,
    biweekOthWOptions: finance[0].biweekOthWOptions,
    oth60WOptions: finance[0].oth60WOptions,
    biweeklNat: finance[0].biweeklNat,
    weeklylNat: finance[0].weeklylNat,
    nat60: finance[0].nat60,
    qcTax: finance[0].qcTax,
    otherTax: finance[0].otherTax,
    totalWithOptions: finance[0].totalWithOptions,
    otherTaxWithOptions: finance[0].otherTaxWithOptions,
    desiredPayments: finance[0].desiredPayments,
    freight: finance[0].freight,
    admin: finance[0].admin,
    commodity: finance[0].commodity,
    pdi: finance[0].pdi,
    discountPer: finance[0].discountPer,
    deliveryCharge: finance[0].deliveryCharge,
    paintPrem: finance[0].paintPrem,
    msrp: finance[0].msrp,
    licensing: finance[0].licensing,
    options: finance[0].options,
    accessories: finance[0].accessories,
    labour: finance[0].labour,
    year: finance[0].year,
    brand: finance[0].brand,
    model: finance[0].model,
    stockNum: finance[0].stockNum,
    model1: finance[0].model1,
    color: finance[0].color,
    modelCode: finance[0].modelCode,
    tradeValue: finance[0].tradeValue,
    tradeDesc: finance[0].tradeDesc,
    tradeColor: finance[0].tradeColor,
    tradeYear: finance[0].tradeYear,
    tradeMake: finance[0].tradeMake,
    tradeVin: finance[0].tradeVin,
    tradeTrim: finance[0].tradeTrim,
    tradeMileage: finance[0].tradeMileage,
    trim: finance[0].trim,
    vin: finance[0].vin,

    date: new Date().toLocaleDateString(),
    dl: finance[0].dl,
    email: finance[0].email,
    firstName: finance[0].firstName,
    lastName: finance[0].lastName,
    phone: finance[0].phone,
    name: finance[0].name,
    address: finance[0].address,
    city: finance[0].city,
    postal: finance[0].postal,
    province: finance[0].province,
    referral: finance[0].referral,
    visited: finance[0].visited,
    bookedApt: finance[0].bookedApt,
    aptShowed: finance[0].aptShowed,
    aptNoShowed: finance[0].aptNoShowed,
    testDrive: finance[0].testDrive,
    metService: finance[0].metService,
    metManager: finance[0].metManager,
    metParts: finance[0].metParts,
    sold: finance[0].sold,
    depositMade: finance[0].depositMade,
    refund: finance[0].refund,
    turnOver: finance[0].turnOver,
    financeApp: finance[0].financeApp,
    approved: finance[0].approved,
    signed: finance[0].signed,
    pickUpSet: finance[0].pickUpSet,
    demoed: finance[0].demoed,
    delivered: finance[0].delivered,
    status: finance[0].status,
    customerState: finance[0].customerState,
    result: finance[0].result,
    notes: finance[0].notes,
    metSalesperson: finance[0].metSalesperson,
    metFinance: finance[0].metFinance,
    financeApplication: finance[0].financeApplication,
    pickUpTime: finance[0].pickUpTime,
    depositTakenDate: finance[0].depositTakenDate,
    docsSigned: finance[0].docsSigned,
    tradeRepairs: finance[0].tradeRepairs,
    seenTrade: finance[0].seenTrade,
    lastNote: finance[0].lastNote,
    dLCopy: finance[0].dLCopy,
    insCopy: finance[0].insCopy,
    testDrForm: finance[0].testDrForm,
    voidChq: finance[0].voidChq,
    loanOther: finance[0].loanOther,
    signBill: finance[0].signBill,
    ucda: finance[0].ucda,
    tradeInsp: finance[0].tradeInsp,
    customerWS: finance[0].customerWS,
    otherDocs: finance[0].otherDocs,
    urgentFinanceNote: finance[0].urgentFinanceNote,
    funded: finance[0].funded,
    userName: user?.name,

  }
  console.log(merged, 'merged')
  for (let key in merged) {
    merged[key] = String(merged[key]);
  }

  return json({ merged, finance, user })
}
 */

/**
export function FinanceIdDialog() {
  const [financeIdMenu, setFinanceIdMenu] = React.useState(false);
  const financeIdState = useContext(FinanceIdContext);


  const { user, finance, merged, filename, financeId } = useLoaderData();
  const iFrameRef: React.LegacyRef<HTMLIFrameElement> = useRef(null);
  const handleClickOpen = () => {
    setFinanceIdMenu(true);
  };

  const handleClose = () => {
    setFinanceIdMenu(false);
  };

  const MyIFrameComponent = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      if (iFrameRef?.current) {
        iFrameRef.current.src = 'https://third-8an3.vercel.app/customer-forms';
        //iFrameRef.current.src = 'http://localhost:3002/customerGen';
      }
    });
    const hideSpinner = () => {
      setIsLoading(false);
    };

    return (
      <>
        <div className="h-auto w-full ">
          <iframe
            ref={iFrameRef}
            title="my-iframe"
            width="100%"
            height="100%"
            onLoad={hideSpinner}
          />
        </div>
      </>
    );
  };

  useEffect(() => {
    if (iFrameRef?.current) {
      iFrameRef.current.src = 'https://third-8an3.vercel.app/customer-forms';
      //  iFrameRef.current.src = 'http://localhost:3002/customer-forms';
      const userId = user.id
      const handleLoad = () => {
        const data = { merged, user, userId };
        iFrameRef.current?.contentWindow?.postMessage(data, '*');
      };
      iFrameRef.current.addEventListener('load', handleLoad);
      return () => {
        iFrameRef.current?.removeEventListener('load', handleLoad);
      };
    }
  }, [iFrameRef, user, finance, merged]);


  if (financeIdState) {
    return (
      <>
        <Dialog.Root open={financeIdMenu} onClose={handleClose}>
          <Dialog.Trigger asChild>
            {financeIdState && (
              <Button onClick={handleClickOpen} className='text-[#fafafa] mt-5'>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-printer"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect width="12" height="8" x="6" y="14" /></svg>
              </Button>
            )}
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-[#09090b]/80 backdrop-blur-sm data-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed bg-slate1 text-[#fafafa] top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
              <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                Print Docs
              </Dialog.Title>
              <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">

              </Dialog.Description>
              <MyIFrameComponent />
              <Dialog.Close asChild>
                <button onClick={handleClose}
                  className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                  aria-label="Close"
                >
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    );
  } else {
    return null;
  }
}
 */
