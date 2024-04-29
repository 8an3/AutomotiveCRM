import { useEffect, useState } from "react";
import { useAppContext } from "./AppContext";
import { testInbox } from "./GraphService";
import { Input } from "~/components";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';



export default function ProfileContent() {
  const app = useAppContext();
  const [emails, setEmails] = useState([]);
  const [selectedLine, setSelectedLine] = useState(null);
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const folderName = 'inbox'
        const response = await testInbox(app.authProvider!);
        //  console.log(emails)
        setEmails(response.value);
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    }
    fetchEmails();
  }, []);


  useEffect(() => {
    if (emails.length === 0) {
      handleClicktestInbox();
    }
  }, [emails]);

  const handleClicktestInbox = async () => {
    const response = await testInbox(app.authProvider!);
    setEmails(response.value);
    setSelectedLine(null)
    setIsOpen(false)
  };

  return (
    <>
      <div className="flex-grow  px-2 mainContent ">
        {emails.length === 0 ? (
          <p>No emails available.</p>
        ) : (
          <div className="">
            {Array.isArray(emails) && emails.map((message: any, index: number) => (
              <>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div key={index} className={`mx-auto w-full ml-2 ${selectedLine !== null && selectedLine !== index ? 'opacity-30' : ''}`}>
                    <div
                      onClick={() => {
                        messageRead(app.authProvider!, message.id);
                        handleLineClick(index);
                        setEmail(emailBody);
                        getEmailById(app.authProvider!, message.id);
                      }}
                      className='my-2 p-3 parent gap-2 items-center rounded cursor-pointer  text hover:text-[#02a9ff] bg-[#0d0f10] emailLine hover:shadow-sm hover:shadow-[#02a9ff]'>
                      <p className='cursor-pointer div1 my-auto text-left px-1 lg:p-1 text-[12px]'>
                        {message.from?.emailAddress?.name}
                      </p>
                      <p className='text-left div2 overflow-ellipsis overflow-hidden px-1 lg:p-1 my-auto text-[12px] whitespace-nowrap'>
                        {message.subject}
                      </p>
                      <p className='text-left div3 overflow-ellipsis overflow-hidden px-1 lg:p-1 my-auto text-[12px] whitespace-nowrap'>
                        {message.bodyPreview}
                      </p>
                      <p className='text-right text-slate-400 px-1 div4 my-auto font-weight-500 div3 lg:p-1 md:p-1 hidden md:block text-[10px]'>
                        {new Date(message.receivedDateTime).toLocaleString()}
                      </p>
                    </div>

                    <div className={` emailBody rounded ease-in-out  ${selectedLine === true && isOpen === true ? 'h-[50vh] overflow-y-auto' : ''}`}>
                      <div className={` bg-[#053666] shadow-[0_2px_10px] w-full items-center overflow-x-hidden   border-slate12 rounded  ease-in-out md:w-full ${selectedLine === index ? ' translate-y-0 ease-linear' : '-translate-y-full ease-linear'}`}>
                        <div className={`bg-[#edf5e1] ${selectedLine === index ? 'block' : 'hidden'}`}>
                          <div className="flex flex-col space-y-4 w-full bg-[#edf5e1]">
                            <div className="flex justify-between bg-[#edf5e1] ">
                              <div className="flex items-center justify-center ">
                                <div onClick={() => {
                                  handleClicktestInbox()

                                  handleLineClick(index)
                                }} className="cursor-pointer p-2 hover:text-[#02a9ff]">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                                </div>

                                <p onClick={() => setDetails(!details)} className="text-[13px] flex items-center my-auto cursor-pointer hover:text-[#02a9ff]">
                                  Details
                                </p>
                              </div>
                              <div className="justify-end">
                                <div className="ml-auto flex px-2  ">

                                  <DropdownMenuDemo message={message} />



                                  <div onClick={() => { handleClicktestInbox() }} className="cursor-pointer p-2 hover:text-[#02a9ff]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-check"><path d="M18 6 7 17l-5-5" /><path d="m22 10-7.5 7.5L13 16" /></svg>
                                  </div>
                                  <div className="cursor-pointer p-2 hover:text-[#02a9ff]"
                                    onClick={() => {
                                      messageUnRead(app.authProvider!, message.id);

                                    }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock-10"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 8 10" /></svg>
                                  </div>
                                  <div className="cursor-pointer p-2 hover:text-[#02a9ff]"
                                    onClick={() => {
                                      GetEmailsFromFolder('inbox');
                                      deleteMessage(app.authProvider!, message.id);
                                    }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pin"><line x1="12" x2="12" y1="17" y2="22" /><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" /></svg>
                                  </div>
                                  <div className="cursor-pointer p-2 hover:text-[#02a9ff]"
                                    onClick={() => {
                                      GetEmailsFromFolder('inbox');
                                      deleteMessage(app.authProvider!, message.id);
                                    }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {details && (
                              <div className="bg-[#edf5e1] w-full translate-y-0 items-center overflow-x-hidden   border-slate12 transition-all duration-300 ease-in-out  ">
                                <div className="w-full">
                                  <p className='ml-3 text-left p-2  md:hidden block text-[12px]'>
                                    {new Date(message.receivedDateTime).toLocaleString()}
                                  </p>
                                  <p className="px-2 text-[12px]">
                                    From: {message.from?.emailAddress?.address}
                                  </p>

                                </div>
                              </div>
                            )}

                            <div className={`relative mx-auto mt-[20px] text-[12px] max-h-[50vh] overflow-y-scroll transition-all duration-500 ml-3 mr-3 text-[#f1f6ff] ${isOpen ? 'h-[50vh]' : 'h-[50vh] '}`}>
                              {/* This is the third row */}
                              <div className='whitespace-pre-wrap text-[#f1f6ff] w-full' dangerouslySetInnerHTML={{ __html: message.body.content }} />
                            </div>

                            <div className={`border-[#edf5e1]  replyContent text-colors-myColor-200 border-t-gray-950 bg-[#379683] border-t w-full items-center overflow-x-hidden shadow-sm transition-all duration-500 ${isOpen ? 'h-[37%]' : 'h-14 '}`}>
                              <div className="grid grid-cols-2 items-center justify-between">
                                <button onClick={handleClick} className="bg-transparent text-[#5cdb95] p-2 text-left cursor-pointer hover:text-[#02a9ff]">
                                  Reply
                                </button>
                                <div className="ml-auto flex p-2  ">
                                  <button
                                    type="submit"
                                    onClick={() => {
                                      let intentValue = 'reply';
                                      setIntent(intentValue);
                                    }}
                                    className="cursor-pointer p-2 hover:text-[#02a9ff]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-reply"><polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" /></svg>
                                  </button>
                                  <button
                                    onClick={() => {
                                      let intentValue = 'replyAll';
                                      setIntent(intentValue);
                                    }}
                                    type="submit"
                                    className="cursor-pointer p-2 hover:text-[#02a9ff]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-reply-all"><polyline points="7 17 2 12 7 7" /><polyline points="12 17 7 12 12 7" /><path d="M22 18v-2a4 4 0 0 0-4-4H7" /></svg>
                                  </button>
                                  <button
                                    onClick={() => {
                                      let intentValue = 'forward';
                                      setIntent(intentValue);
                                    }}
                                    type="submit"
                                    className="cursor-pointer p-2 hover:text-[#02a9ff]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-forward"><polyline points="15 17 20 12 15 7" /><path d="M4 18v-2a4 4 0 0 1 4-4h12" /></svg>
                                  </button>
                                  <button onClick={() => {
                                    let intentValue = 'draft';
                                    setIntent(intentValue);
                                  }} type="submit"
                                    className="cursor-pointer p-2 hover:text-[#02a9ff]">
                                    <p>RiDraftLine </p>
                                  </button>
                                  <button
                                    onClick={() => {
                                      let intentValue = 'template';
                                      setIntent(intentValue);
                                    }} type="submit" className="cursor-pointer p-2 hover:text-[#02a9ff]">
                                    <p>HiOutlineTemplate </p>
                                  </button>
                                </div>
                              </div>
                              <div className={` mb-3  ${isOpen ? 'block' : 'hidden'}`}>
                                <Input type='text' placeholder='Subject' defaultValue={message.subject}
                                  {...register("subject")} />
                                <input type="hidden" {...register('body')} value={value} />

                                <div className="border rounded  mt-3  mb-3 w-[95%] mx-auto richEditor ">

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <input type="hidden" {...register('body')} />

                  <input type='hidden' defaultValue={message.id}
                    {...register("messageId")}
                  />
                  <input type='hidden' defaultValue={message.from?.emailAddress?.address}
                    {...register("toAddress")} />
                </form>
              </>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
