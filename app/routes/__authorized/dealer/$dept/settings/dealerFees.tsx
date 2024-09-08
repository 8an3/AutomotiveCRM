import { isRouteErrorResponse, Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, useLocation, useNavigate, useRouteError } from "@remix-run/react";
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
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
  User,
  Tags,
  Receipt,
  Binary,
  FileClock,
  Wrench,
  User2,
  CalendarDays,
  Shirt,
  WrenchIcon,
  DollarSign,
  Cog,
  Calendar,
  Clipboard,
  Settings2
} from "lucide-react"
import { prisma } from "~/libs";
import { getSession } from '~/sessions/auth-session.server';
import { json, redirect } from "@remix-run/node";
import { createCacheHeaders, createSitemap } from "~/utils";
import { model } from "~/models";
import { GetUser } from "~/utils/loader.server";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { getUserById, updateUser, updateDealerFees, getDealerFeesbyEmail } from '~/utils/user.server'
import { useState } from "react";

export async function loader({ request, params }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  if (!user) {
    redirect('/login')
  }
  const metrics = await model.admin.query.getMetrics();
  const dealer = await prisma.dealer.findUnique({
    where: { id: 1 }
  })
  const userEmail = user?.email
  const comsRecords = await prisma.comm.findMany({ where: { userEmail: user.email, }, });
  return json(
    { user, metrics, dealer, comsRecords },
    { headers: createCacheHeaders(request) }
  );
}



export async function action({ request }: ActionArgs) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const Input = financeFormSchema.parse(formPayload)
  const intent = formPayload.intent

  if (intent === 'inputDealerLogo') {
    const logo = await prisma.dealerLogo.update({
      where: { id: 1 },
      data: {
        dealerLogo: formPayload.dealerLogo
      }
    })
    return json({ logo })
  }
  if (intent === 'updateDealerFeesAdmin') {

    const update = await prisma.dealer.update({
      where: {
        id: 1
      },
      data: {
        userLoanProt: formData.userLoanProt,
        userTireandRim: formData.userTireandRim,
        userGap: formData.userGap,
        userExtWarr: formData.userExtWarr,
        userServicespkg: formData.userServicespkg,
        vinE: formData.vinE,
        lifeDisability: formData.lifeDisability,
        rustProofing: formData.rustProofing,
        userLicensing: formData.userLicensing,
        userFinance: formData.userFinance,
        userDemo: formData.userDemo,
        userGasOnDel: formData.userGasOnDel,
        userOMVIC: formData.userOMVIC,
        userOther: formData.userOther,
        userTax: formData.userTax,
        userAirTax: formData.userAirTax,
        userTireTax: formData.userTireTax,
        userGovern: formData.userGovern,
        userPDI: formData.userPDI,
        userLabour: formData.userLabour,
        userMarketAdj: formData.userMarketAdj,
        userCommodity: formData.userCommodity,
        destinationCharge: formData.destinationCharge,
        userFreight: formData.userFreight,
        userAdmin: formData.userAdmin,
      }
    })
    return update;
  }
  if (intent === 'updateUser') {
    delete Input.intent;

    const saveUser = await updateUser(Input)
    const saveDealer = await updateDealerFees(Input)
    return ({ saveUser, saveDealer })
  }

  if (intent === 'updateDealerInfo') {
    const dealer = await prisma.dealer.update({
      data: {
        dealerName: formData.dealerName,
        dealerAddress: formData.dealerAddress,
        dealerCity: formData.dealerCity,
        dealerProv: formData.dealerProv,
        dealerPostal: formData.dealerPostal,
        dealerPhone: formData.dealerPhone,
        dealerEmail: formData.dealerEmail,
        dealerContact: formData.dealerContact,
        dealerAdminContact: formData.dealerAdminContact,
        dealerEmailAdmin: formData.dealerEmailAdmin,
        vercel: formData.vercel,
        github: formData.github,
      },
      where: {
        id: 1
      }
    })
    return dealer
  }
  return null
}


export default function SettingsGenerral() {
  const { user, dealer, } = useLoaderData()

  const Dealerfees = [
    { name: "userAdmin", value: dealer.userAdmin, placeholder: "Admin" },
    { name: "userFreight", value: dealer.userFreight, placeholder: "Freight" },
    { name: "userCommodity", value: dealer.userCommodity, placeholder: "Commodity" },
    { name: "userPDI", value: dealer.userPDI, placeholder: "PDI" },
    { name: "userAirTax", value: dealer.userAirTax, placeholder: "Air Tax" },
    { name: "userTireTax", value: dealer.userTireTax, placeholder: "Tire Tax" },
    { name: "userGovern", value: dealer.userGovern, placeholder: "Government Fees" },
    { name: "userFinance", value: dealer.userFinance, placeholder: "Finance Fees" },
    { name: "destinationCharge", value: dealer.destinationCharge, placeholder: "Destination Charge" },
    { name: "userGasOnDel", value: dealer.userGasOnDel, placeholder: "Gas On Delivery" },
    { name: "userMarketAdj", value: dealer.userMarketAdj, placeholder: "Market Adjustment" },
    { name: "userDemo", value: dealer.userDemo, placeholder: "Demonstratration Fee" },
    { name: "userOMVIC", value: dealer.userOMVIC, placeholder: "OMVIC or Other" },
    { name: "userLicensing", value: dealer.userLicensing, placeholder: "Licensing" },
    { name: "userTax", value: dealer.userTax, placeholder: "Tax Rate" },
  ];

  const FinanceOptions = [
    { name: "userExtWarr", value: dealer.userExtWarr, placeholder: 'Extended Warranty' },
    { name: "userLoanProt", value: dealer.userLoanProt, placeholder: 'Loan Protection' },
    { name: "userGap", value: dealer.userGap, placeholder: 'Gap Protection' },
    { name: "userTireandRim", dealer: dealer.userTireandRim, placeholder: 'Tire and Rim' },
    { name: "vinE", value: dealer.vinE, placeholder: 'Vin Etching' },
    { name: "rustProofing", value: dealer.rustProofing, placeholder: 'Under Coating' },
    { name: "userServicespkg", value: dealer.userServicespkg, placeholder: 'Service Package' },
    { name: "lifeDisability", value: dealer.lifeDisability, placeholder: 'Life and Disability' },
    { name: "userOther", value: dealer.userOther, placeholder: 'Other data Package' },
  ];


  const [base64, setBase64] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setBase64(reader.result);
      };

      reader.onerror = () => {
        setError('Failed to read file!');
      };

      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="grid gap-6">
      <Card x-chunk="dashboard-04-chunk-1">
        <Form method="post" className="">
          <CardHeader>
            <CardTitle>Dealer Fees</CardTitle>
            <CardDescription>
              Used for values on quotes and bills of sales along with receipts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Dealerfees.map((fee, index) => (
              <div className="relative mt-4 " key={index}>
                <Input
                  name={fee.name}
                  defaultValue={fee.value}
                  placeholder={fee.name}
                  className='mt-4'
                />
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">{fee.placeholder}</label>
              </div>
            ))}
          </CardContent>
          <CardFooter className="border-t border-border px-6 py-4">
            <Button
              type='submit'
              name='intent'
              value='updateDealerInfo'>
              Save
            </Button>
          </CardFooter>
        </Form>
      </Card>
      <Card x-chunk="dashboard-04-chunk-2">
        <Form method="post" className="">

          <CardHeader>
            <CardTitle>Finance Options</CardTitle>
            <CardDescription>
              Input your dealer finance options to encourage more sales.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {FinanceOptions.map((fee, index) => (
              <div className="relative mt-4 " key={index}>
                <Input
                  name={fee.name}
                  defaultValue={fee.value}

                  className='mt-4'
                />
                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">{fee.placeholder}</label>
              </div>
            ))}
          </CardContent>
          <CardFooter className="border-t border-border px-6 py-4">
            <Button
              type='submit'
              name='intent'
              value='updateDealerInfo'>
              Save
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  )
}

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: '/favicons/calendar.svg' },
];

export const meta = () => {
  return [
    { title: "Settings - Dealer Fees || ADMIN || Dealer Sales Assistant" },
    {
      property: "og:title",
      content: "Your very own assistant!",
    },
    {
      name: "description",
      content:
        "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
      keywords: "Automotive Sales, dealership sales, automotive CRM",
    },
  ];
};
