import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { GetUser } from '~/utils/loader.server';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import useSWR, { SWRConfig, mutate } from 'swr';
import { Conversation, Paginator } from "@twilio/conversations";

const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2'
const authToken = 'd38e2fd884be4196d0f6feb0b970f63f'


export let loader: LoaderFunction = async () => {
  const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2';
  const authToken = 'd38e2fd884be4196d0f6feb0b970f63f';
  const conversationSid = 'CH4bd655010ca744a6aab106bfda8327b0'; // Replace with the actual conversationSid
  const url = `https://conversations.twilio.com/v1/Conversations/${conversationSid}/Messages`;
  const credentials = `${accountSid}:${authToken}`;
  const base64Credentials = btoa(credentials);
  const client = require('twilio')(accountSid, authToken);
  //CHc4d41869ad514fc5a11298f8c4b547ad
  //CHbee3affaedec4f3ebd15bfe362b0addf
  //CHbc50654fe19a4df38fdd0448291b0381
  //CH4ff4039b35d74decbae78c15d5b335cc
  //CH53a04870f58940acb130a065efeb36a4
  //CH4bd655010ca744a6aab106bfda8327b0
  //CH4ab6349236fc4b8eb8bdd0ce4dc675c7
  //CH3e066206b9e34db8b8d7021c6564049a

  //CHbee3affaedec4f3ebd15bfe362b0addf
  // done
  //CHcbe0e491fd2546cba0514563f57a9bd7
  //USe2dba46a0aa745e3a43274db2766053f
  //USf4ff5fc84fc641658321a702ed67efbb
  //CH4bd655010ca744a6aab106bfda8327b0


  const conversation = await client.conversations.v1.conversations(conversationSid)
    .fetch()
    .then(conversation => console.log(conversation));

  console.log(conversation, 'conversations')
  try {
    const response = await fetch(url, { method: 'GET', headers: { 'Authorization': `Basic ${base64Credentials}` } })

    if (!response.ok) {
      throw new Error(`Error fetching messages: ${response.statusText}`);
    }

    const data = await response.json();
    return json({ data, conversation, });
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }

};
