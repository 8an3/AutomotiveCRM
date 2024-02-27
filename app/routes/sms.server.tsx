
import { json, type LoaderFunction } from '@remix-run/node';

export async function loader({ request, params }: LoaderFunction) {
  const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2'
  const authToken = 'd38e2fd884be4196d0f6feb0b970f63f'
  const client = require('twilio')(accountSid, authToken);

  const GetConvo = await client.conversations.v1.conversations('CH4f08622d81c34b4ea947f8ea233148a5').messages.list({ limit: 20 })
  console.log(GetConvo, 'getconvo')

  return json({ GetConvo })
}

/**
*


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




   await client.conversations.v1.conversations.create({ friendlyName: 'My test' }).then(conversation => {
     conversationSid = conversation.sid
     console.log(conversation.sid)
   })

   setTimeout(async (conversationSid) => {
     try {
       const conversation = await client.conversations.v1.conversations(conversationSid).fetch();
       conversationChatServiceSid = conversation.chatServiceSid;
       console.log(conversation.chatServiceSid);
     } catch (error) { console.error('Error fetching conversation:', error); }
   }, 5);

   setTimeout(async (conversationSid) => {
     try {
       const participant = await client.conversations.v1.conversations(conversationSid).participants.create({
         'messagingBinding.address': `+1${user?.phone}`,
         'messagingBinding.proxyAddress': proxyPhone,
       });
       participantSid = participant.sid;
       console.log(participant.sid);
     } catch (error) { console.error('Error creating participant:', error); }
   }, 10);


   setTimeout(async () => {
     try {
       const user = await client.conversations.v1.users.create({ identity: `${username}` });
       userSid = user.sid;
       console.log(user.sid);
     } catch (error) {
       console.error('Error creating user:', error);
     }
   }, 15);

   await client.conversations.v1.conversations(conversationSid)
     .participants
     .create({ identity: `${username}` })
     .then(participant => console.log(participant.sid));

   convoList = await client.conversations.v1.users(userSid).userConversations.list({ limit: 20 }).then(userConversations => userConversations.forEach(u => console.log(u.friendlyName)));
*/
