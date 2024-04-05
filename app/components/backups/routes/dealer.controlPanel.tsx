import { json, type LoaderFunction, type ActionFunctionArgs, redirect } from '@remix-run/node';
import axios from 'axios';
import { Form, useLoaderData, useSubmit, Link, useFetcher, useNavigation } from '@remix-run/react'
import { Button, Tabs, TabsList, TabsTrigger, TabsContent, Card, CardHeader, CardTitle, CardContent, CardDescription, Separator, Label, Input, } from '~/components';
import { ButtonLoading } from "~/components/ui/button-loading";
import bcrypt from "bcryptjs";
import { prisma } from "~/libs";
import { toast } from "sonner"
import invariant from "tiny-invariant";






export async function action({ request, }: ActionFunctionArgs) {
  const formPayload = Object.fromEntries(await request.formData())
  const intent = formPayload.intent
  const dealerName = formPayload.dealerName
  function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  const createFirstRepo = async (newDealerRepoName) => {
    const YOUR_GITHUB_TOKEN = process.env.PERSONAL_ACCESS_TOKEN;
    const templateOwner = '8an3';
    const templateRepo = 'thesalespersonscrmm';
    const newRepoName = newDealerRepoName;
    const newRepoOwner = '8an3';

    const apiUrl = `https://api.github.com/repos/${templateOwner}/${templateRepo}/generate`;

    const config = { headers: { 'Accept': 'application/vnd.github.baptiste-preview+json', 'Authorization': `token ${YOUR_GITHUB_TOKEN}`, }, };

    const data = { name: newRepoName, owner: newRepoOwner, };
    return axios.post(apiUrl, data, config).then(response => { console.log('Repository created successfully:', response.data); })
      .catch(error => { console.error('Error creating repository:', error.response.data); });
  };
  const createSecondRepo = async (newDealerRepoName) => {
    const YOUR_GITHUB_TOKEN = process.env.PERSONAL_ACCESS_TOKEN;
    const templateOwner = '8an3';
    const templateRepo = 'third';
    const newRepoName = newDealerRepoName;
    const newRepoOwner = '8an3';

    const apiUrl = `https://api.github.com/repos/${templateOwner}/${templateRepo}/generate`;

    const config = { headers: { 'Accept': 'application/vnd.github.baptiste-preview+json', 'Authorization': `token ${YOUR_GITHUB_TOKEN}`, }, };

    const data = { name: newRepoName, owner: newRepoOwner, };
    return axios.post(apiUrl, data, config).then(response => { console.log('Repository created successfully:', response.data); })
      .catch(error => { console.error('Error creating repository:', error.response.data); });
  };
  const createThirdRepo = async (newDealerRepoName) => {
    const YOUR_GITHUB_TOKEN = process.env.PERSONAL_ACCESS_TOKEN;
    const templateOwner = '8an3';
    const templateRepo = 'crmsat';
    const newRepoName = newDealerRepoName;
    const newRepoOwner = '8an3';

    const apiUrl = `https://api.github.com/repos/${templateOwner}/${templateRepo}/generate`;

    const config = { headers: { 'Accept': 'application/vnd.github.baptiste-preview+json', 'Authorization': `token ${YOUR_GITHUB_TOKEN}`, }, };

    const data = { name: newRepoName, owner: newRepoOwner, };
    return axios.post(apiUrl, data, config).then(response => { console.log('Repository created successfully:', response.data); })
      .catch(error => { console.error('Error creating repository:', error.response.data); });
  };
  const createAxios = async (newDealerRepoName) => {
    const apiUrl = 'https://api.planetscale.com/v1/organizations/skylerzanth/databases';
    const planetScale_token = process.env.PLANETSCALE_TOKEN;
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${planetScale_token}`,
      },
    };

    const requestData = {
      // Include your request payload here
      "name": newDealerRepoName,
      "plan": 'hobby',
    };

    try {
      const response = await axios.post(apiUrl, requestData, config);
      console.log('Database created successfully:', response.data);
      return response
    } catch (error) {
      console.error('Error creating database:', error.response.data);
    }
  };
  const createSecondAxios = async (newDealerRepoName) => {
    const apiUrl = 'https://api.planetscale.com/v1/organizations/skylerzanth/databases';
    const planetScale_token = process.env.PLANETSCALE_TOKEN;
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${planetScale_token}`,
      },
    };

    const requestData = {
      // Include your request payload here
      "name": newDealerRepoName,
      "plan": 'hobby',
    };

    try {
      const response = await axios.post(apiUrl, requestData, config);
      console.log('Database created successfully:', response.data);
      return response
    } catch (error) {
      console.error('Error creating database:', error.response.data);
    }
  };
  const createThirdAxios = async (newDealerRepoName) => {
    const apiUrl = 'https://api.planetscale.com/v1/organizations/skylerzanth/databases';
    const planetScale_token = process.env.PLANETSCALE_TOKEN;
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${planetScale_token}`,
      },
    };

    const requestData = {
      // Include your request payload here
      "name": newDealerRepoName,
      "plan": 'hobby',
    };

    try {
      const response = await axios.post(apiUrl, requestData, config);
      console.log('Database created successfully:', response.data);
      return response
    } catch (error) {
      console.error('Error creating database:', error.response.data);
    }
  };
  const createFirstVercel = async (newDealerRepoName, createFirst, createFirstPlanet) => {
    const vercelToken = process.env.VERCEL_TOKEN;

    const apiUrl = 'https://api.vercel.com/v9/projects';

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${vercelToken}`,
      },
    };

    const projectData = {
      name: newDealerRepoName,
      environmentVariables: [
        {
          key: 'GOOGLE_PROD_CALLBACK_URL',
          target: 'production',
          type: 'system',
          value: `${createFirst.name}/google/callback`,
        },
        {
          key: 'REMIX_SESSION_SECRET',
          target: 'production',
          type: 'system',
          value: '3847ad8f0be06852c4b92b030fe1efe3',
        },
        {
          key: 'REMIX_ADMIN_EMAIL',
          target: 'production',
          type: 'system',
          value: 'skylerzanth@gmail.com',
        },
        {
          key: 'REMIX_ADMIN_PASSWORD',
          target: 'production',
          type: 'system',
          value: 'Ch3w8acca66',
        },
        {
          key: 'COOKIE_SECRET',
          target: 'production',
          type: 'system',
          value: 'cookiesecret_sauce66',
        },
        {
          key: 'REMIX_APP_NAME',
          target: 'production',
          type: 'system',
          value: 'dealersalesassistant',
        },
        {
          key: 'DATABASE_URL',
          target: 'production',
          type: 'system',
          value: createFirstPlanet.url,
        },
        {
          key: 'STRIPE_SECRET_KEY',
          target: 'production',
          type: 'system',
          value: 'sk_live_pNtrt5zYNjHQtYrSrINfKyAJ',
        },
        {
          key: 'API_ACTIVIX',
          target: 'production',
          type: 'system',
          value: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk',
        },
      ],
      framework: 'remix',
      gitRepository: {
        repo: newDealerRepoName,
        type: 'github',
      },
      publicSource: true,
      skipGitConnectDuringLink: true,
    };

    try {
      const response = await axios.post(apiUrl, projectData, config);
      console.log('Project created successfully:', response.data);
    } catch (error) {
      console.error('Error creating project:', error.response.data);
    }
  };

  const createSecondVercel = async (newDealerRepoName, createSec, createSecondPlanet) => {

    const vercelToken = process.env.VERCEL_TOKEN;

    const apiUrl = 'https://api.vercel.com/v9/projects';

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${vercelToken}`,
      },
    };

    const projectData = {
      name: newDealerRepoName,
      environmentVariables: [
        {
          key: 'GOOGLE_PROD_CALLBACK_URL',
          target: 'production',
          type: 'system',
          value: `${createSec.name}/google/callback`,
        },
        {
          key: 'REMIX_SESSION_SECRET',
          target: 'production',
          type: 'system',
          value: '3847ad8f0be06852c4b92b030fe1efe3',
        },
        {
          key: 'REMIX_ADMIN_EMAIL',
          target: 'production',
          type: 'system',
          value: 'skylerzanth@gmail.com',
        },
        {
          key: 'REMIX_ADMIN_PASSWORD',
          target: 'production',
          type: 'system',
          value: 'Ch3w8acca66',
        },
        {
          key: 'COOKIE_SECRET',
          target: 'production',
          type: 'system',
          value: 'cookiesecret_sauce66',
        },
        {
          key: 'REMIX_APP_NAME',
          target: 'production',
          type: 'system',
          value: 'dealersalesassistant',
        },
        {
          key: 'DATABASE_URL',
          target: 'production',
          type: 'system',
          value: createSecondPlanet.url,
        },
        {
          key: 'STRIPE_SECRET_KEY',
          target: 'production',
          type: 'system',
          value: 'sk_live_pNtrt5zYNjHQtYrSrINfKyAJ',
        },
        {
          key: 'API_ACTIVIX',
          target: 'production',
          type: 'system',
          value: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk',
        },
      ],
      framework: 'remix',
      gitRepository: {
        repo: newDealerRepoName,
        type: 'github',
      },
      publicSource: true,
      skipGitConnectDuringLink: true,
    };

    try {
      const response = await axios.post(apiUrl, projectData, config);
      console.log('Project created successfully:', response.data);
    } catch (error) {
      console.error('Error creating project:', error.response.data);
    }
  };
  const createThirdVercel = async (newDealerRepoName, createThird, createThirdPlanet) => {

    const vercelToken = process.env.VERCEL_TOKEN;

    const apiUrl = 'https://api.vercel.com/v9/projects';

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${vercelToken}`,
      },
    };

    const projectData = {
      name: newDealerRepoName,
      environmentVariables: [
        {
          key: 'GOOGLE_PROD_CALLBACK_URL',
          target: 'production',
          type: 'system',
          value: `${createThird.name}/google/callback`,
        },
        {
          key: 'REMIX_SESSION_SECRET',
          target: 'production',
          type: 'system',
          value: '3847ad8f0be06852c4b92b030fe1efe3',
        },
        {
          key: 'REMIX_ADMIN_EMAIL',
          target: 'production',
          type: 'system',
          value: 'skylerzanth@gmail.com',
        },
        {
          key: 'REMIX_ADMIN_PASSWORD',
          target: 'production',
          type: 'system',
          value: 'Ch3w8acca66',
        },
        {
          key: 'COOKIE_SECRET',
          target: 'production',
          type: 'system',
          value: 'cookiesecret_sauce66',
        },
        {
          key: 'REMIX_APP_NAME',
          target: 'production',
          type: 'system',
          value: 'dealersalesassistant',
        },
        {
          key: 'DATABASE_URL',
          target: 'production',
          type: 'system',
          value: createThirdPlanet.url,
        },
        {
          key: 'STRIPE_SECRET_KEY',
          target: 'production',
          type: 'system',
          value: 'sk_live_pNtrt5zYNjHQtYrSrINfKyAJ',
        },
        {
          key: 'API_ACTIVIX',
          target: 'production',
          type: 'system',
          value: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk',
        },
      ],
      framework: 'remix',
      gitRepository: {
        repo: newDealerRepoName,
        type: 'github',
      },
      publicSource: true,
      skipGitConnectDuringLink: true,
    };

    try {
      const response = await axios.post(apiUrl, projectData, config);
      console.log('Project created successfully:', response.data);
    } catch (error) {
      console.error('Error creating project:', error.response.data);
    }
  };



  if (intent === 'createDealer') {
    const createFirst = await createFirstRepo(dealerName)
    //  const createSec = await createSecondRepo(dealerName)
    //  const createThird = await createThirdRepo(dealerName)
    console.log(createFirst)
    await delay(50);
    const createFirstPlanet = await createAxios(dealerName)
    //  const createSecondPlanet = await createSecondAxios(dealerName)
    //  const createThirdPlanet = await createThirdAxios(dealerName)
    await delay(50);
    const createFirstVercel = await createFirstVercel(dealerName, createFirst, createFirstPlanet)
    // const createSecondVercel = await createSecondVercel(dealerName, createSec, createSecondPlanet)
    // const createThirdVercel = await createThirdVercel(dealerName, createThird, createThirdPlanet)
    console.log(createFirstVercel)

    const adminUserRole = await prisma.userRole.findFirst({ where: { symbol: "ADMIN" }, });
    invariant(adminUserRole, "User Role with symbol ADMIN is not found");
    const hashedPassword2 = await bcrypt.hash('adminAccess', 10);
    const user = await prisma.user.create({
      data: {
        email: formPayload.dealerEmail,
        password: { create: { hash: hashedPassword2 } },
        name: "DealerAdmin",
        username: "DealerAdmin",
        phone: formPayload.dealerPhone,
        role: { connect: { id: adminUserRole.id } },
        profile: {
          create: {
            headline: "I am Admin",
            bio: "The administrator of this app.",
          },
        },

      },
    });
    const dealer = await prisma.dealerCustomer.create({
      data: {
        dealerName: formPayload.dealerName,
        dealerPhone: formPayload.dealerPhone,
        dealerAddress: formPayload.dealerAddress,
        dealerCity: formPayload.dealerCity,
        dealerProvince: formPayload.dealerProvince,
        dealerPostal: formPayload.dealerPostal,
        dealerEmail: formPayload.dealerEmail,
        planetScale: createFirstPlanet.url,
        vercel: createFirstVercel.project.url,
        github: createFirst.url,

      }
    })
    return ({ user, createFirst, createFirstVercel, createFirstPlanet, dealer })
  }
  return null

}

export async function loader() {
  return null
}

export default function DashboardPage() {
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";
  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <p>CalendarDateRangePicker</p>
              <Button>Download</Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Dealers
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className='border border-white text-white'>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card className='border border-white text-white'>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Subscriptions
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+2350</div>
                    <p className="text-xs text-muted-foreground">
                      +180.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card className='border border-white text-white'>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card className='border border-white text-white'>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Now
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">
                      +201 since last hour
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border border-white ">
                  <CardHeader>
                    <CardTitle className='text-white'>Add New Dealer</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="space-y-6">
                      <Separator />
                      <div className="ml-5">
                        <Form method='post' className="space-y-4">
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="email" className='text-white'>Dealer Name</Label>
                            <Input type="text" id="email" name="dealerName" />
                          </div>
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="email" className='text-white'>Dealer Phone</Label>
                            <Input type="text" id="email" name="dealerPhone" />
                          </div>
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="email" className='text-white'>Dealer Address</Label>
                            <Input type="text" id="email" name="dealerAddress" />
                          </div>
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="email" className='text-white'>Dealer City</Label>
                            <Input type="text" id="email" name="dealerCity" />
                          </div>
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="email" className='text-white'>Dealer Province</Label>
                            <Input type="text" id="email" name="dealerProvince" />
                          </div>
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="email" className='text-white'>Dealer Postal Code</Label>
                            <Input type="text" id="email" name="dealerPostal" />
                          </div>
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="email" className='text-white'>Dealer Email</Label>
                            <Input type="text" id="email" name="dealerEmail" />
                          </div>
                          <ButtonLoading
                            size="lg"
                            value='updateFinance'
                            className="w-auto cursor-pointer ml-auto mt-5 hover:text-[#02a9ff] text-white border border-white"
                            name="intent"
                            type="submit"
                            isSubmitting={isSubmitting}
                            onClick={() => toast.success(`Dealer added!`)}
                            loadingText="Adding new dealer..."
                          >
                            Add
                          </ButtonLoading>
                        </Form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3 border border-white text-white">
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>
                      You made 265 sales this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>RecentSales </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
