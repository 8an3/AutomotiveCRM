import { json, type LoaderFunction } from '@remix-run/node';

export async function loader({ request, params }: LoaderFunction) {
  const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2'
  const authToken = 'd38e2fd884be4196d0f6feb0b970f63f'
  const client = require('twilio')(accountSid, authToken);

  const response = await client.conversations.v1.conversations('CH3435b240ad4a4515ab9525a885bfdb0b')
    .participants
    .create({ identity: 'skylerzanth' })
    .then(participant => console.log(participant.sid));

  return json({ response })
}

/**
 *
 *  const response = await client.conversations.v1.conversations
    .create({ friendlyName: 'My First Conversation' })
    .then(conversation => console.log(conversation.sid))


    const response = await client.conversations.v1.conversations('CH3435b240ad4a4515ab9525a885bfdb0b')
    .fetch()
    .then(conversation => console.log(conversation.chatServiceSid));

    IS6b1701e976754278a28dc46756f383ea

const response = await client.conversations.v1.conversations('CH3435b240ad4a4515ab9525a885bfdb0b')
    .participants
    .create({
      'messagingBinding.address': '+16138980992',
      'messagingBinding.proxyAddress': '+12176347250'
    })
    .then(participant => console.log(participant.sid));

MB8d6bc91115374f3594bb2dbab0c3b8f0


twilio token:chat --identity skylerzanth --chat-service-sid IS6b1701e976754278a28dc46756f383ea --profile skylerzanth


 const response = await client.conversations.v1.conversations('CH3435b240ad4a4515ab9525a885bfdb0b')
    .participants
    .create({ identity: 'skylerzanth' })
    .then(participant => console.log(participant.sid));

    MBc2ab8623256a464b992ae13a5b4ef718


 */
