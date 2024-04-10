import { Input, } from "./components/ui/input";
import { useEffect, useState } from 'react';
import { Event, Message } from '@microsoft/microsoft-graph-types';
import { add, endOfWeek, format, getDay, parseISO, startOfWeek } from 'date-fns';
import { RiDraftLine } from "react-icons/ri";
import { HiOutlineTemplate } from "react-icons/hi";
import { composeEmail, createMailFolder, createtestFolder, deleteMessage, forwardEmail, getAllFolders, getDrafts, getDraftsList, getEmailById, getEmailById2, getEmailList, getEmails, getFolders, getInbox, getInboxList, getJunk, getJunkList, getList, getSent, getTrash, getTrashList, getUserWeekCalendar, gettestFolderList, listAttachment, messageDone, messageRead, messageUnRead, replyAllEmail, replyMessage, testInbox, } from './GraphService';
import { useAppContext } from './AppContext';
import { Controller, useController, useForm } from "react-hook-form";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import React from "react";
import './email.css'

import 'react-quill/dist/quill.snow.css'; // import styles
import ReactQuill from 'react-quill';


export default function Test() {
    const app = useAppContext();
    const [editorState, setEditorState] = useState();
    const [emails, setEmails] = useState([]);
    const [emailItems, setEmailItems] = useState<Message[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Message>();
    const [selectedLine, setSelectedLine] = useState(null);
    const [details, setDetails] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenFolders, setIsOpenFolders] = useState(false);
    const [email, setEmail] = useState('');
    const [isOpenCreateFolders, setIsOpenCreateFolders] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [inputs, setInputs] = useState({});
    const [value, setValue] = useState('');

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],

            ['clean']                                         // remove formatting button
        ]
    };

    const handleClick2 = () => {
        setIsOpenFolders(!isOpenFolders);
    };
    const handleClick3 = () => {
        setIsOpenCreateFolders(!isOpenCreateFolders);
    };

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

    // <ReturnSnippet>
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(weekStart);

    let emailBody: React.SetStateAction<string>;
    const handleLineClick = (index: any) => {
        setSelectedLine(selectedLine === index ? null : index);
    };

    const handleClick = () => {
        setIsOpen(!isOpen);
        emailBody = "";
        setEmail(emailBody)
    };

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


    const [unreadItemCount, setUnreadItemCount] = useState(0);
    const [draftCount, setDraftCount] = useState(0);
    const [unreadJunkCount, setUnreadJunkCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            const drafts = await getDrafts(app.authProvider!);
            const totalDrafts = drafts.totalItemCount
            setDraftCount(totalDrafts)
            const messages = await getInbox(app.authProvider!);
            const unreadCount = messages.unreadItemCount
            setUnreadItemCount(unreadCount);
            const junk = await getJunk(app.authProvider!);
            const unreadJunk = junk.unreadItemCount
            setUnreadJunkCount(unreadJunk);
        };

        fetchUnreadCount();
    }, []);

    type Folder = {
        id: any;
        name: string;
        // Add other properties here
    };

    const [folders, setFolders] = useState<Folder[]>([]);

    useEffect(() => {
        const fetchFolders = async () => {
            const fetchedFolders = await getAllFolders(app.authProvider!);
            //console.log(fetchedFolders, 'fetchedfolders'); // Log the fetched folders to the console

            // Check if fetchedFolders.value is an array and it has items
            if (Array.isArray(fetchedFolders.value) && fetchedFolders.value.length > 0) {
                // Extract the folders array from the fetchedFolders object
                const foldersArray = fetchedFolders.value.map((folder: any) => ({ name: folder.displayName, ...folder }));
                // console.log(foldersArray, 'foldersArray')
                setFolders(foldersArray);
            }
        }; 

        fetchFolders();
    }, []);

    async function GetEmailsFromFolder(name: any) {
        console.log('Function parameters:', name);

        let folderName = name.toLowerCase();
        if (folderName === 'deleted items') {
            folderName = 'deleteditems'
        }
        if (folderName === 'junk email') {
            folderName = 'junkemail'
        }
        if (folderName === 'sent items') {
            folderName = 'sentitems'
        }
        if (folderName === 'conversation history') {
            folderName = 'conversationhistory'
        }

        const drafts = await getFolders(app.authProvider!, folderName);
        const response = await getList(app.authProvider!, folderName);

        console.log('Folder name:', folderName);
        console.log('Drafts:', drafts);
        console.log('Response:', response);
        setEmails(response.value);
    }


    // tabIndex = {- 1}
    //onBlur = {() => { messageDone(app.authProvider!, message.id) }}


    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [intent, setIntent] = useState('')

    const onSubmit = async (data: any) => {
        if (intent === 'reply') {
            let toAddress = data.toAddress
            let id = data.messageId
            let body = data.body
            const reply = await replyMessage(app.authProvider!, id, toAddress, body);
            return reply
        }
        if (intent === 'replyAll') {
            let id = data.messageId
            let body = data.body
            const reply = await replyAllEmail(app.authProvider!, id, body);
            return reply
        }
        if (intent === 'forward') {
            let id = data.messageId
            let body = data.body
            let toAddress = data.toAddress
            const reply = await forwardEmail(app.authProvider!, id, body, toAddress);
            return reply
        }
        if (intent === 'draft') {
            let id = data.messageId
            let body = data.body
            let toAddress = data.toAddress
            const reply = await forwardEmail(app.authProvider!, id, body, toAddress);
            return reply
        }
        if (intent === 'template') {
            let id = data.messageId
            let body = data.body
            let toAddress = data.toAddress
            const reply = await forwardEmail(app.authProvider!, id, body, toAddress);
            return reply
        }

        console.log(data);
    };

    const DropdownMenuDemo = (message: any) => {
        return (
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button
                        className="cursor-pointer hover:text-[#02a9ff]  p-2  w-[35px] h-[35px] inline-flex items-center justify-center outline-none hover:bg-violet3 "
                        aria-label="Customise options"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="min-w-[220px] bg-white border rounded p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                        sideOffset={5}
                    >
                        <DropdownMenu.Item className=" cursor-pointer hover:text-[#02a9ff] group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
                            Reply
                            <div className="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-reply"><polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" /></svg>

                            </div>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className=" cursor-pointer hover:text-[#02a9ff] group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
                            Reply All
                            <div className="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-reply-all"><polyline points="7 17 2 12 7 7" /><polyline points="12 17 7 12 12 7" /><path d="M22 18v-2a4 4 0 0 0-4-4H7" /></svg>
                            </div>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            className=" cursor-pointer hover:text-[#02a9ff] group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                        >
                            Forward
                            <div className="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-forward"><polyline points="15 17 20 12 15 7" /><path d="M4 18v-2a4 4 0 0 1 4-4h12" /></svg>
                            </div>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            className="group  cursor-pointer hover:text-[#02a9ff] text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                        >
                            Save Draft
                            <div className="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8">
                                <RiDraftLine />
                            </div>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            className="group  cursor-pointer hover:text-[#02a9ff] text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                        >
                            Save Template
                            <div className="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8">
                                <HiOutlineTemplate />
                            </div>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            onClick={() => {
                                messageUnRead(app.authProvider!, message.id);
                            }}
                            className="group  cursor-pointer hover:text-[#02a9ff] text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
                        >
                            Mark as Unread
                            <div className="ml-auto pl-[20px] text-mauve11 group-data-[highlighted]:text-white group-data-[disabled]:text-mauve8">
                                <HiOutlineTemplate />
                            </div>
                        </DropdownMenu.Item>


                        <DropdownMenu.Arrow className="fill-white" />
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        );
    };

    const button = document.getElementById('myButton');
    const button2 = document.getElementById('myButton2');
    const button3 = document.getElementById('myButton3');
    const button4 = document.getElementById('myButton4');
    const button5 = document.getElementById('myButton5');
    const button6 = document.getElementById('button6');
    if (button5) {
        button5.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(2px)';
        });

        button5.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-2px)';
        });
    }
    if (button) {
        button.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(2px)';
        });

        button.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-2px)';
        });
    }
    if (button2) {
        button2.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(2px)';
        });

        button2.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-2px)';
        });
    }
    if (button3) {
        button3.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(2px)';
        });

        button3.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-2px)';
        });
    }
    if (button4) {
        button4.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(2px)';
        });

        button4.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-2px)';
        });
    }
    if (button6) {
        button6.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(2px)';
        });

        button6.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-2px)';
        });
    }


    return (
        <div className="flex h-[100%] Mainwidth bg-[#5cdb95]">
            <div className="md:w-[200px] sm:w-12 p-4 sidebarContent rounded h-[97%]  ">

                <div className="">
                    <button
                        id="myButton"
                        style={{ transition: 'transform 0.1s' }}

                        className="mh-8 justify-between  hover:text-[#02a9ff]  p-1 text-[14px]   focus:transform focus:translate-y-[-10px] "
                        onClick={() => {
                            const name = "inbox";
                            handleClicktestInbox();
                        }}
                    >
                        <div className="flex w-full items-left  ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-inbox"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>
                            <span className='ml-1 hidden md:block'>
                                Inbox
                            </span>
                            <span className='ml-1 hidden md:block'>
                                ({unreadItemCount})
                            </span>
                        </div>
                    </button>
                </div>
                <div className="">
                    <button
                        id="myButton2"
                        style={{ transition: 'transform 0.1s' }}

                        className="mh-8 justify-between  hover:text-[#02a9ff]  p-1 text-[14px]  focus:transform focus:translate-y-[-10px] "
                        onClick={() => {
                            const name = "drafts";
                            GetEmailsFromFolder(name);
                        }}
                    >
                        <div className="flex w-full items-left  ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-square"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" /></svg>
                            <span className='ml-1 hidden md:block'>
                                Drafts
                            </span>

                        </div>
                    </button>
                </div>
                <div className="">
                    <button id="myButton3"
                        style={{ transition: 'transform 0.1s' }}

                        className="mh-8 justify-between  hover:text-[#02a9ff]  p-1 text-[14px]  focus:transform focus:translate-y-[-10px] "
                        onClick={() => {
                            const name = "snoozed";
                            GetEmailsFromFolder(name);
                        }}
                    >
                        <div className="flex w-full items-left  ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock-2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 10" /></svg>
                            <span className='ml-1 hidden md:block'>
                                Snoozed
                            </span>
                        </div>
                    </button>
                </div>
                <div className="">
                    <button id="myButton4"
                        style={{ transition: 'transform 0.1s' }}

                        className="mh-8 justify-between  hover:text-[#02a9ff]  p-1 text-[14px]  focus:transform focus:translate-y-[-10px] "
                        onClick={() => {
                            const name = "junkemail";
                            GetEmailsFromFolder(name);
                        }}
                    >
                        <div className="mt-3 flex w-full items-left  ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-alert"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                            <span className='ml-1 hidden md:block'>
                                Junk ({unreadJunkCount})
                            </span>
                        </div>
                    </button>
                </div>
                <div className=" hidden md:block mt-2">
                    <button id="myButton5"
                        style={{ transition: 'transform 0.1s' }}

                        className="mh-8 justify-between  hover:text-[#02a9ff] p-1 text-[14px]  focus:transform focus:translate-y-[-10px] "
                    >
                        All Folders
                    </button>
                    <div className={`  ${isOpenFolders ? 'block' : 'hidden'}`}>
                        {folders.map((folder, index) => {
                            const folderName = folder.name;
                            return (
                                <div className='cursor-pointer hover:text-[#02a9ff]' key={index} onClick={() => GetEmailsFromFolder(folderName)}>
                                    {folderName}
                                </div>
                            );
                        })}
                    </div>

                    <div className=" hidden md:block mt-2">
                        <button onClick={handleClick3} className=" bg-transparent  p-1 text-[14px] text-left hover:text-[#02a9ff]">
                            Create Folder
                        </button>
                        <div className={`${isOpenCreateFolders ? 'block' : 'hidden'}`}>
                            <Input name='displayName' type='text' placeholder='Folder Name' value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                            <button onClick={() => createMailFolder(app.authProvider!, displayName)} id="myButton"
                                style={{ transition: 'transform 0.1s' }}

                                className="mh-8 justify-between  hover:text-[#02a9ff] border-2 border-[#edf5e1] p-2 rounded  focus:transform focus:translate-y-[-10px] shadow-[0_2px_10px] ">
                                Create
                            </button>
                        </div>

                    </div>
                    <button
                        id="myButton"
                        style={{ transition: 'transform 0.1s' }}
                        className="mh-8 justify-between  hover:text-[#02a9ff]  p-1 text-[14px]   focus:transform focus:translate-y-[-10px] "
                        onClick={app.signOut!}
                    >
                            <span className='ml-1 hidden md:block'>
                                Sign-out
                            </span>
                            
                    </button>
                </div>
            </div>

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

                                                        <div className={`relative mx-auto mt-[20px] text-[12px] max-h-[50vh] overflow-y-scroll transition-all duration-500 ml-3 mr-3 text-[#f1f6ff] ${isOpen ?   'h-[50vh]' : 'h-[50vh] '}`}> 
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
                                                                        <RiDraftLine />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            let intentValue = 'template';
                                                                            setIntent(intentValue);
                                                                        }} type="submit" className="cursor-pointer p-2 hover:text-[#02a9ff]">
                                                                        <HiOutlineTemplate />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className={` mb-3  ${isOpen ? 'block' : 'hidden'}`}>
                                                                <Input type='text' placeholder='Subject' defaultValue={message.subject}
                                                                    {...register("subject")} />
                                                                <input type="hidden" {...register('body')} value={value} />

                                                                <div className="border rounded  mt-3  mb-3 w-[95%] mx-auto richEditor ">
                                                                    <ReactQuill
                                                                        theme="snow"
                                                                        modules={modules}
                                                                        value={value} onChange={setValue}// directly use the new content
                                                                    />
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
        </div>
    );
}