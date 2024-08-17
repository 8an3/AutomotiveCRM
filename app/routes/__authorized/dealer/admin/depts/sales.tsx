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

  const dealerInfo = [
    { name: "dealerName", value: dealer.dealerName, placeholder: "Name" },
    { name: "dealerAddress", value: dealer.dealerAddress, placeholder: "Address" },
    { name: "dealerCity", value: dealer.dealerCity, placeholder: "City" },
    { name: "dealerProv", value: dealer.dealerProv, placeholder: "Prov" },
    { name: "dealerPostal", value: dealer.dealerPostal, placeholder: "Postal Code" },
    { name: "dealerPhone", value: dealer.dealerPhone, placeholder: "Phone" },
    { name: "dealerEmail", value: dealer.dealerEmail, placeholder: "Email" },
    { name: "dealerContact", value: dealer.dealerContact, placeholder: "Dealer Contact" },
    { name: "dealerAdminContact", value: dealer.dealerAdminContact, placeholder: "Admin Contact" },
    { name: "dealerEmailAdmin", value: dealer.dealerEmailAdmin, placeholder: "Admin Email" },
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
            <CardTitle>Store Information</CardTitle>
            <CardDescription>
              Used to identify your store in the marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dealerInfo.map((fee, index) => (
              <div className=" " key={index}>
                <Input
                  name={fee.name}
                  defaultValue={fee.value}
                  placeholder={fee.name}
                  className='mt-4'
                />

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
        <CardHeader>
          <CardTitle>Dealer logo</CardTitle>
          <CardDescription>
            Input your dealer logo to be used on receipts, bills of sales, etc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input type="file" accept="image/jpeg" onChange={handleFileChange} className='mt-3' />
          <Form method='post' >
            <input type='hidden' value={base64} name='dealerLogo' />
            <Button type='submit' name='intent' value='inputDealerLogo' size='sm' className='mt-3 bg-primary' >
              Submit
            </Button>
            {base64 && (
              <div>
                <h3>Base64 String:</h3>
                <textarea readOnly rows="10" cols="50" value={base64} />
                <img src={base64} alt="Selected" style={{ maxWidth: '300px', maxHeight: '300px' }} />
              </div>
            )}
            {error && <div style={{ color: 'red' }}>{error}</div>}
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
