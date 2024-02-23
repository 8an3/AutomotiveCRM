import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Input } from '~/components/ui';
import { Button } from '~/ui/button';
import { Form } from '@remix-run/react';


export default function TextClient() {
  const props = {}

  const conversationsList = {
    "results": [
      {
        "messageId": "817790313235066447",
        "from": "385916242493",
        "to": "385921004026",
        "text": "QUIZ Correct answer is Paris",
        "cleanText": "Correct answer is Paris",
        "keyword": "QUIZ",
        "receivedAt": "2016-10-06T09:28:39.220+0000",
        "smsCount": 1,
        "price": {
          "pricePerMessage": 0,
          "currency": "EUR"
        },
        "callbackData": "callbackData"
      },
      {
        "messageId": "817790313235066448",
        "from": "385916242493",
        "to": "385921004026",
        "text": "QUIZ Am I Right",
        "cleanText": "Am I Righ",
        "keyword": "QUIZ",
        "receivedAt": "2016-10-06T09:31:41.220+0000",
        "smsCount": 1,
        "price": {
          "pricePerMessage": 0,
          "currency": "EUR"
        },
        "callbackData": "callbackData"
      },
      {
        "messageId": "817790313235066450",
        "from": "385916242492",
        "to": "385921004026",
        "text": "QUIZ hery whats goong on",
        "cleanText": "hery whats goong on",
        "keyword": "QUIZ",
        "receivedAt": "2016-10-06T09:81:39.220+0000",
        "smsCount": 1,
        "price": {
          "pricePerMessage": 0,
          "currency": "EUR"
        },
        "callbackData": "callbackData"
      },
    ],
    "messageCount": 3,
    "pendingMessageCount": 0
  }
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(conversationsList.results[0]);
  //console.log(selectedConversation)
  return (
    <>
      <div className='flex h-[95%] justify-center mx-auto mainSmsClient'>
        <UserList conversations={conversations} setSelectedConversation={setSelectedConversation} />
        <MyComponent selectedConversation={selectedConversation} props={props} conversations={conversations} />
      </div>
    </>
  )
}
function SettingssModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="mr-auto shadow-blackA4 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/5324b9a5a86ff6ea2720eb456fc20eca5df70ccac886182543fb2a408550939d?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
            className="aspect-square object-contain object-center w-4 overflow-hidden self-center shrink-0 max-w-full my-auto"
          />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Edit profile
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description>
          <fieldset className="mb-[15px] flex items-center gap-5">
            <label className="text-violet11 w-[90px] text-right text-[15px]" htmlFor="name">
              Name
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="name"
              defaultValue="Pedro Duarte"
            />
          </fieldset>
          <fieldset className="mb-[15px] flex items-center gap-5">
            <label className="text-violet11 w-[90px] text-right text-[15px]" htmlFor="username">
              Username
            </label>
            <input
              className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              id="username"
              defaultValue="@peduarte"
            />
          </fieldset>
          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                Save changes
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function UserList(conversations, setSelectedConversation) {
  const [isOpen, setIsOpen] = useState(false);
  let lastMessages = [];
  const handleLineClick = () => {
    setIsOpen(!isOpen);
  };

  if (conversations && conversations.results) {
    // Create an object where the keys are the 'from' numbers and the values are the messages
    const lastMessagesByPerson = conversations.results.reduce((acc, message) => {
      acc[message.from] = message;
      return acc;
    }, {});

    // Convert this object to an array of messages
    lastMessages = Object.values(lastMessagesByPerson);

    // Sort the messages by the 'receivedAt' property in descending order
    lastMessages.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
  }
  return (
    <>
      <div className="w-[300px] border rounded-tl-md rounded-bl-md border-black bg-white items-center">
        <div className='border-b w-full items-center justify-between h-[40px]'>


          <button onClick={() => {
            handleLineClick()
          }} className='text-black border border-md justify-start'>
            New Chat
          </button>
          <SettingssModal />

        </div>
        <div
          className={`${isOpen === true
            ? "h-[150px]  mt-3 w-full p-3"
            : ""
            }`}
        >
          {isOpen === true && (
            <Form method='post' >
              <Input name='recipient' placeholder='16136136134' className=' w-[97%] border border black mx-auto justify-center mt-2' />
              <Button name='intent' value='createSmsChat' type='submit' className='mt-2 justify-end'>
                Create
              </Button>
            </Form>
          )}

        </div>

        <div className="w-[240px] mt-3 border border-slate9 rounded ml-1 mr-3 ">
          {lastMessages.map((message, index) => (
            <button key={index} className="flex p-3  ml-1 mr-3" onClick={() => setSelectedConversation(message)}>
              <div className=''>
                <p className='text-bold text-black ml-3'>
                  {message.from}
                </p>
                <p className='text-slate11 ml-3' style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {message.text}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
function MyComponent(props, selectedConversation, conversations) {

  const selectedNumber = selectedConversation.from;
  console.log(selectedNumber)
  console.log(conversations)

  const messagesFromSelectedNumber = conversations.results.filter(conversation => conversation.from === selectedNumber);


  return (
    <div className="justify-between items-start shadow-sm bg-white flex flex-col rounded-tr-md rounded-br-md border border-slate9  w-full mr-3">
      <div className="bg-white self-stretch flex w-full items-stretch justify-center gap-5 pl-3.5 pr-6 py-4 max-md:max-w-full max-md:flex-wrap max-md:justify-center max-md:pr-5">

        <div className="justify-center items-stretch flex grow basis-[0%] flex-col">
          <div className="text-zinc-800 text-sm font-semibold leading-5 whitespace-nowrap mx-auto">
            Teodros Girmay
          </div>
          <div className="text-neutral-500 text-xs whitespace-nowrap mt-1 mx-auto">
            last seen 45 minutes ago
          </div>
        </div>

      </div>


      <div>
        {messagesFromSelectedNumber && messagesFromSelectedNumber.map((message, index) => (
          <div key={index} className="flex w-[342px] max-w-full flex-col items-stretch pr-4 mt-5 self-end max-md:mr-2.5 ml-auto">
            <div className="text-black text-xs whitespace-nowrap">
              {message.date}
            </div>

            <div className=" bg-white flex w-[264px] max-w-full flex-col justify-center mt-1.5 px-2 py-1 rounded-md self-end border border-black">
              <div className=" flex justify-between gap-2">
                <div className=" flex grow basis-[0%] flex-col">
                  <div className="text-black text-sm leading-5 whitespace-nowrap">
                    {message.text}
                  </div>
                </div>
                <div className="justify-center items-stretch flex gap-1 mt-4 self-start">
                  <div className="text-black text-xs grow whitespace-nowrap">
                    {message.timestamp}
                  </div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/555b3a879f605d40c41019fb2cf0fba3e34804540c5e292383f8d523477f1a35?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                    className="aspect-[2] object-contain object-center w-4 overflow-hidden self-center shrink-0 max-w-full my-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      <div className="left-side self-stretch mt-4 mx-4 max-md:max-w-full max-md:mr-2.5">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">


          <div className="flex flex-col items-stretch w-[57%] max-md:w-full max-md:ml-0">
            <div className="flex grow flex-col items-stretch ">
              <div className="flex justify-start gap-1 pr-20 items-start max-md:pr-5">

                <div className=" self-stretch flex justify-between gap-0">

                  <div className=" bg-white z-[1] flex w-full flex-col pr-3 p-1 rounded-md border border-black">
                    <div className=" flex justify-between gap-2.5 pr-20 max-md:pr-5 ">
                      <div className="text-slate1 text-sm font-semibold leading-5 whitespace-nowrap">
                        Jav
                      </div>

                    </div>
                    <div className="items-stretch flex justify-between gap-2 ">
                      <div className="flex grow basis-[0%] flex-col pr-20 items-start max-md:pr-5">
                        <div className="text-black text-sm leading-5 whitespace-nowrap">
                          I’m down! Any ideas??
                        </div>
                        <div className="bg-gray-100 flex w-[148px] shrink-0 h-px flex-col mt-2.5" />
                      </div>
                      <div className="text-black text-xs z-[1] grow whitespace-nowrap mt-4 self-end">
                        11:35 AM
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>







      <Input className="justify-center border border-black rounded-md items-center w-[98%] shadow-sm bg-white flex gap-0 mt-48 px-3 max-md:max-w-[95%] max-md:flex-wrap max-md:mt-10 ml-3  mb-3  " placeholder='Start Typing...' />


    </div >
  );
}


