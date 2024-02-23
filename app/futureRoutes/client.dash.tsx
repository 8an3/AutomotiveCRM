import { Infobip, AuthType } from "@infobip-api/sdk";
import axios from 'axios';
import {
  json,
  ActionFunction,
  type LoaderFunction,
  redirect, type LoaderFunctionArgs,
  JsonFunction,
} from "@remix-run/node";
import React from "react";
import { Form, } from "@remix-run/react";

//export async function loader({ request, params }: LoaderFunctionArgs) {
//return null
//}

export async function loader({ request, params }: LoaderFunctionArgs) {
  // const payload = Object.fromEntries(await request.formData());
  const action = ''// payload.get('action');


  const baseUrL = 'https://9l1z4r.api.infobip.com'
  const sender = 'InfoSMS'
  const recipient = "16138980992";
  const auth = 'App df1047336028413cf8b479c53d1fd99b-47c5fc33-9371-4840-8576-9b79ddd4f880'
  const message = 'sup'

  const data = {
    "messages": [
      {
        "destinations": [
          {
            "to": recipient
          }
        ],
        "from": sender,
        "text": message
      }
    ]
  };

  if (action === 'sendSMS') {
    const sendSMS = await fetch(`${baseUrL}/sms/2/text/advanced`, {
      method: 'POST',
      headers: {
        "Authorization": auth,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    console.log(sendSMS)
    return json({ sendSMS })

  }
  if (action === 'getSMS') {
    return null
  }
  const getSMS = await fetch(`${baseUrL}/sms/1/logs`, {
    method: 'GET',
    headers: {
      "Authorization": auth,
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  console.log(getSMS)
  return json({ getSMS })
}


/**
export default function smsClient() {
  return (
    <div>
      <h1>Send SMS</h1>
      <Form method='post'>
        <input hidden name='action' value='getSMS' />
        <button>GET SMS</button>

      </Form>
    </div>
  );
}
 */
