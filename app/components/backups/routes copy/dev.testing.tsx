import { useLoaderData, useNavigation } from "@remix-run/react";
import axios from "axios";
import { useState } from "react";
import { Button, Card } from "~/components/ui";
import { redirect, json, LoaderArgs } from "@remix-run/node";
import { prisma } from "~/libs";
import { Separator } from "~/components/ui/separator"
import { getSession } from "~/sessions/auth-session.server";
import { commitSession as commitPref, getSession as getPref } from '~/utils/pref.server';
import { RefreshToken } from "~/services/google-auth.server";
import { model } from '~/models'

import { requireAuthCookie } from '~/utils/misc.user.server';
export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await model.user.query.getForSession({ email: email });
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }

  const refreshToken2 = userSession.get('refreshToken');

  return ({ user, refreshToken2 })
}
/**
 *
 *
 *  'webleads',
'emails/send/form',
'emails/send/payments',
'client/whatsapp',
'subscribe',
    'dev/testing',
    'emails/send/contact',
    '/dashboard/calls',
    '/dashboard',

 */

/**
 * to do mmanually
  'inbound/lead/create',
 *     'overview/Harley-Davidson/clr74zmoz000510nxzuuqqqm7',
  'overview/Harley-Davidson',
  leads
 */
export default function AdminTesting() {
  const { userSession, refreshToken2 } = useLoaderData()
  const [results, setResults] = useState();
  const [userResult, setuserRuelt] = useState({});
  const [registerResult, setRegisterdResult] = useState({})
  const navigation = useNavigation();
  const [refreshToken, setRefreshToken] = useState({})
  // const isSubmitting = navigation.state === "submitting";
  const isSubmitting = navigation.formAction === "";
  const routes = [
    '/client/sms/receive',
    '/client/sms/send',
    '/client/sms',
    '/client',
    '/contact',
    '/customer/clr74zmhc000410nxyq48hzvt/clr74zmoz000510nxzuuqqqm7',
    '/customer/clr74zmhc000410nxyq48hzvt',
    '/customer/finance/overview',
    '/customer',
    '/dashboard/api/docs',
    '/dashboard/calls/loader/activix',
    '/dashboard/calls/loader',
    '/document/second',
    '/docUploaderintake',
    '/download/$',
    '/dummyroute',
    '/editor/templates',
    '/editor',
    '/email',
    '/faq',
    '/globalSearch/result',
    '/globalSearch',
    '/notifications/fetch/new',
    '/options/Switch',
    '/options/Manitou',
    '/options/Sea-doo',
    '/options/BMW-Motorrad',
    '/options',
    '/overview/Harley-Davidson/clr74zmoz000510nxzuuqqqm7',
    '/overview/Harley-Davidson',
    '/payments/calculator',
    '/quote/Harley-Davidson/clr74zmoz000510nxzuuqqqm7',
    '/quote/Harley-Davidson',
    '/quote/Triumph',
    '/quote/Kawasaki',
    '/quote/BMW-Motorrad',
    '/quote/Suzuki',
    '/quote/Sea-Doo',
    '/quote/Ski-Doo',
    '/quote/Switch',
    '/quote/Can-Am-SXS',
    '/quote/Spyder',
    '/quote/Can-Am',
    '/quote',
    '/',
    '/login',
    '/options/Harley-Davidson',
    '/options',
    '/payments/calculator',
    '/quote/Harley-Davidson/clr74zmoz000510nxzuuqqqm7',
    '/quote/Harley-Davidson',
    '/quote',
    '/search',
    '/sms',
    '/uploadFile/action',
    '/uploadFile',
    '/user',
    '/user/dashboard',
    '/user/dashboard/SkylerZanth',
    '/user/dashboard/Susername.$noteSlug',
    '/user/dashboard/SkylerZanth',
    '/user/dashboard/dealerfees',
    '/user/dashboard/notes',
    '/user/dashboard/notes.SnoteSlug',
    '/user/dashboard/notes',
    '/user/dashboard/password',
    '/user/dashboard/roadmap',
    '/user/dashboard/salestracker',
    '/user/dashboard/scripts',
    '/user/dashboard/settings',
    '/user/dashboard',
    '/user/notes',
    '/user/notes/1/edit',
    '/user/notes/new',
    '/user/notes',
    '/user/profile',
    '/user',
    '/vitals',
    '/welcome/dealerfees',
    '/welcome/quote',
    '/welcome',
    '/welcome/NewUser',

  ];

  async function addUser() {
    let userReults;
    const response = await axios.post('register', {
      email: 'skylerzanth@gmail.com',
      password: 'Ch3w8acca66',
      name: 'skyler',
      username: 'skylerzanth',
    });
    if (response) { setuserRuelt(response) }
  }
  async function loginUser() {
    let userReults;
    const response = await axios.post('login', {
      email: 'skylerzanth@gmail.com',
      password: 'Ch3w8acca66',
      name: 'skyler',
      username: 'skylerzanth',
    });
    if (response) { setRegisterdResult(response) }
  }
  // this works

  async function RefreshZTokenFromServer() {
    const getToken = await RefreshToken(refreshToken2)
    setRefreshToken(getToken)
    return getToken
  }

  async function doRoutesWork() {
    const requests = routes.map(route => {
      return fetch(route, {
        headers: { 'Cookie': userSession },
        credentials: 'include'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return { route: route, status: 'OK' };
        })
        .catch(error => ({ route: route, error: error.message }));
    });

    const newResults = await Promise.all(requests);
    setResults(newResults);
  }

  return (
    <div className='mx-auto w-[95%] justify-center text-white'>
      <h1 className='text-[30px] text-center' >Dev Testing</h1>

      <Card className='mt-5 border border-[#4be446] mx-auto'>
        <div className=' mt-1 flex items-center justify-center'>
          <p className='text-[16px]'>Testing pages: OK success happy time</p>
          <Button variant='outline' className='m-2 border-white px-3 py-2 text-white' onClick={doRoutesWork}>Run</Button>

        </div>
        <Separator className='mb-5 text-white bg-white w-2/3 justify-center mx-auto' />

        <div className="flex flex-wrap justify-center">
          {results && results.map((result, index) => (
            result.status === 'OK' || result.status === '200' ? (
              <div key={index} className='mx-3 mb-2 w-1/3 justify-center'>
                <a href={`http://localhost:3000${result.route}`} target="_blank"  >
                  <p>{result.status}: {result.route}</p>
                </a>
              </div>
            ) : null
          ))}
        </div>

      </Card>
      <Card className='mt-5 border border-[#e44646]'>
        <div className=' mt-1 flex items-center justify-center'>
          <p className='text-[16px] px-3 py-2 m-2'>Testing pages: NOT OK sad time</p>
        </div>
        <Separator className='mb-5 text-white bg-white w-2/3 justify-center mx-auto' />
        <div className="flex flex-wrap justify-center">
          {results && results.map((result, index) => (
            result.status !== 200 || result.status !== '200' ? (
              <div key={index} className='mx-3 mb-2 w-1/3 justify-center'>
                <a href={`http://localhost:3000/${result.route}`} target="_blank">
                  <p>{result.error} {result.errorText}: {result.route}</p>
                </a>
              </div>
            ) : null
          ))}
        </div>
      </Card>
      <div className='mx-auto flex items-center  justify-center'>
        <Card className='mr-3 mt-5 w-auto border border-white'>
          <h1 className='text-[16px] mt-3 text-center'>Auth</h1>
          <Separator className='mb-5 text-white bg-white w-2/3 justify-center mx-auto' />
          <div className='mx-4 mb-3 flex items-center' >
            <Button variant='outline' className='mr-1  border-white px-3 py-2 text-white'
              onClick={addUser}>Run</Button>
            <p className=' ml-1 text-center'>
              Register: {userResult.status ? `${userResult.status} ${userResult.statusText}` : 'No response'}</p>
          </div>
          <div className='mx-4 mb-3 flex items-center' >
            <Button variant='outline' className='mr-1  border-white px-3 py-2 text-white'
              onClick={loginUser}>Run</Button>
            <p className=' ml-1 text-center'>
              Login: {registerResult.status ? `${registerResult.status} ${registerResult.statusText}` : 'No response'}</p>
          </div>
        </Card>
        <Card className='mr-3 mt-5 w-auto border border-white'>
          <h1 className='text-[16px] mt-3 text-center'>Auth</h1>
          <Separator className='mb-5 text-white bg-white w-2/3 justify-center mx-auto' />
          <div className='mx-4 mb-3 flex items-center' >
            <Button variant='outline' className='mr-1  border-white px-3 py-2 text-white'
              onClick={addUser}>Run</Button>
            <p className=' ml-1 text-center'>
              Register: {userResult.status ? `${userResult.status} ${userResult.statusText}` : 'No response'}</p>
          </div>
          <div className='mx-4 mb-3 flex items-center' >
            <Button variant='outline' className='mr-1  border-white px-3 py-2 text-white'
              onClick={loginUser}>Run</Button>
            <p className=' ml-1 text-center'>
              Login: {registerResult.status ? `${registerResult.status} ${registerResult.statusText}` : 'No response'}</p>
          </div>

        </Card>
        <Card className='mr-3 mt-5 w-auto border border-white'>
          <h1 className='text-[16px] mt-3 text-center'>Tokens</h1>
          <Separator className='mb-5 text-white bg-white w-2/3 justify-center mx-auto' />
          <div className='mx-4 mb-3 flex items-center' >
            <Button variant='outline' className='mr-1  border-white px-3 py-2 text-white'
              onClick={RefreshZTokenFromServer}>RefreshToken</Button>
            <p className=' ml-1 text-center'>
              Register: {refreshToken.status ? `${refreshToken.access_token} ${refreshToken.statusText}` : 'No response'}</p>
          </div>
          <div className='mx-4 mb-3 flex items-center' >
            <Button variant='outline' className='mr-1  border-white px-3 py-2 text-white'
              onClick={loginUser}>Run</Button>
            <p className=' ml-1 text-center'>
              Login: {registerResult.status ? `${registerResult.status} ${registerResult.expires_in}` : 'No response'}</p>
          </div>

        </Card>
      </div>

    </div>
  );
}
