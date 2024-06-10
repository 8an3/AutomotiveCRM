import React, { useEffect, useState, } from 'react';
import { Badge, Button, Input, Label, Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui";
import { Form, Link, useActionData, useLoaderData, useNavigation, } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { FaCheck } from "react-icons/fa";

import { scriptsLoader, scriptsAction } from '~/components/actions/scriptsAL';
import { Copy } from 'lucide-react';
import { ButtonLoading } from "~/components/ui/button-loading";
import { Toaster, toast } from 'sonner'
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { type ActionFunction, defer } from '@remix-run/node';
import { prisma } from '~/libs';
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area"

export const meta = () => {
  return [
    { title: "Toolbox - Dealer Sales Assistant" },
    {
      property: "og:title",
      content: "Your very own assistant!",
    },
    {
      name: "description",
      content: "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
      keywords: 'Automotive Sales, dealership sales, automotive CRM',

    },
  ];
};

function Loading() {
  return (
    <ul>
      {Array.from({ length: 12 }).map((_, i) => (
        <li key={i}>
          <div className="spinner" />
        </li>
      ))}
    </ul>
  )
}
export let loader = scriptsLoader
export const action: ActionFunction = async ({ request }) => {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);

  const template = await prisma.emailTemplates.create({
    data: {
      name: formData.name,
      body: formData.body,
      title: formData.title,
      category: formData.category,
      userEmail: formData.userEmail,
      dept: formData.dept,
      type: 'text / email',
    },
  });
  return template;
}
export default function Shight() {
  const { user, scripts } = useLoaderData();
  console.log(user, scripts, 'scritps')
  const copyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(''), 3000); // Reset after 3 seconds
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };
  const [copiedText, setCopiedText] = useState('');
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, [])

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Closes');
  const [subcategories, setSubcategories] = useState(scripts.reduce((unique, mail) => {
    if (!unique.includes(mail.subCat)) {
      unique.push(mail.subCat);
    }
    return unique;
  }, [])); function handleEmailClick(category) {
    setSelectedCategory(category);
    const sameCategoryMails = scripts.filter(item => item.category === category);
    const uniqueSubcategories = sameCategoryMails.reduce((unique, item) => {
      if (!unique.includes(item.subCat)) {
        unique.push(item.subCat);
      }
      return unique;
    }, []);
    setSubcategories(uniqueSubcategories);
  }
  function handleSubCatLisstClick(mail) {
    setSelectedRecord(mail);
  }
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/user/dashboard/scripts";

  const [selectedCategorySize, setSelectedCategorySize] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState(false);
  const [selectedScript, setSelectedScript] = useState(false);

  const handleCategoryClick = () => {
    setSelectedCategorySize(true);
    setSelectedSubcategory(false);
    setSelectedScript(false);
  };

  const handleSubcategoryClick = () => {
    setSelectedCategorySize(false);
    setSelectedSubcategory(true);
    setSelectedScript(false);
  };

  const handleScriptClick = () => {
    setSelectedCategorySize(false);
    setSelectedSubcategory(false);
    setSelectedScript(true);
  };

  return (
    <>
      <div className=" mx-auto flex h-[80vh] text-foreground  ">
        <Card className={` mx-2 transition delay-300 duration-1000  ease-in-out ${selectedCategorySize ? 'grow' : 'w-[15%]'} `}        >
          <CardHeader onClick={handleCategoryClick} className='cursor-pointer'>
            <CardTitle>Category</CardTitle>
          </CardHeader>
          {selectedCategorySize && (
            <>
              <CardContent className="space-y-2 ">
                <div className="h-auto max-h-[700px] space-y-1 overflow-y-auto  ">
                  {scripts.reduce((unique, mail) => {
                    if (!unique.some(item => item.category === mail.category)) {
                      unique.push(mail);
                    }
                    return unique;
                  }, []).map((mail, index) => (
                    <div key={index} className="m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-primary  hover:text-primary active:border-primary" onClick={() => {
                      handleSubcategoryClick();
                      handleEmailClick(mail.category)
                    }}>
                      <div className="m-2 flex items-center justify-between">
                        <p className="text-lg font-bold text-[#fff]">{mail.category}</p>
                      </div>
                    </div>
                  ))}

                </div>
              </CardContent>
              <CardFooter>
                <p>Your ability to close increases with the amount of tools at your disposal. A mechanic without a tire iron wouldnt be able to change a tire. So why dont more sales people take better care of their scripts, closes, and such?</p>
              </CardFooter>
            </>
          )}
        </Card>

        <Card
          className={`mx-2 transition delay-300 duration-1000  ease-in-out ${selectedSubcategory ? 'grow' : 'w-[15%]'} `}
        >
          <CardHeader onClick={handleSubcategoryClick} className='cursor-pointer'>
            <CardTitle>Sub-category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedSubcategory && (
              <div className='h-auto max-h-[70vh] overflow-y-auto'>
                <div className=" space-y-1  ">
                  {subcategories.map((subCat, index) => (
                    <div
                      key={index}
                      className="m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-primary hover:text-primary active:border-primary"
                      onClick={() => {
                        handleSubCatLisstClick(scripts.find((mail) => mail.subCat === subCat));
                        handleScriptClick();
                      }}
                    >
                      <div className="m-2 flex items-center justify-between">
                        <p className="text-lg font-bold text-[#fff]">{subCat}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>


        <Card className={`mx-2  transition delay-300 duration-1000 ease-in-out ${selectedScript ? 'grow' : 'w-[15%]'} `}        >
          <CardHeader onClick={handleScriptClick} className='cursor-pointer'>
            <CardTitle>Script</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 ">
            {selectedScript && (
              <div className="h-auto max-h-[70vh] overflow-y-auto">
                {selectedRecord && (
                  <div className="">
                    <div className="m-2 mx-auto w-[95%]   hover:border-primary  hover:text-primary active:border-primary">
                      <div className="m-2  items-center justify-between p-2 text-foreground">
                        <p className='text-[20px]'>{selectedRecord.category}: {selectedRecord.subCat}</p>
                        <div className='flex justify-between text-[16px]  text-[#fff]'>
                          <p className='text-[20px]'>{selectedRecord.name}</p>
                        </div>
                        <p className='mt-5'>{selectedRecord.content}</p>
                        <div className='mt-5 flex  items-center justify-between text-[#fff]'>
                          <div className='flex' >
                            <Button variant='outline' className="cursor-pointer bg-transparent text-foreground  hover:border-primary hover:bg-transparent hover:text-primary" onClick={() => copyText(selectedRecord.content)} >

                              {copiedText !== selectedRecord.content && <Copy strokeWidth={1.5} className="text-lg hover:text-primary" />}
                              {copiedText === selectedRecord.content && <FaCheck strokeWidth={1.5} className="text-lg hover:text-primary" />}
                            </Button>

                          </div>
                          <Form method='post'>
                            <input type='hidden' name='name' value={selectedRecord.name} />
                            <input type='hidden' name='body' value={selectedRecord.content} />
                            <input type='hidden' name='category' value={selectedRecord.category} />
                            <input type='hidden' name='userEmail' value={user.email} />
                            <input type='hidden' name='subject' value='Copied from scripts' />
                            <input type='hidden' name='title' value='Copied from scripts' />
                            <input type='hidden' name='dept' value='sales' />
                            <ButtonLoading
                              size="lg"
                              name='intent'
                              value='createTemplate'
                              type='submit'
                              isSubmitting={isSubmitting}
                              onClick={() => {
                                toast.message('Helping you become the hulk of sales...')
                              }}
                              loadingText="Loading..."
                              className="w-auto cursor-pointer border-white bg-transparent text-foreground hover:border-primary hover:bg-transparent hover:text-primary"
                            >
                              Save As Template
                            </ButtonLoading>
                          </Form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </>
  )
}

/**
 *   <>
      <div className=" mx-auto flex h-[85%] w-[95%] border border-[#262626]">
        <div className="sidebar w-[25%] border-r border-[#262626]">
          <div className="border-b border-[#262626]">
            <p className="text-bold  p-2 text-lg text-[#fff]">
              Category
            </p>
          </div>
          <div className="border-b border-[#262626]">
            <div className="h-auto max-h-[950px] overflow-y-auto border-b border-[#262626]">
              {scripts.reduce((unique, mail) => {
                if (!unique.some(item => item.category === mail.category)) {
                  unique.push(mail);
                }
                return unique;
              }, []).map((mail, index) => (
                <div key={index} className="m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-primary  hover:text-primary active:border-primary" onClick={() => handleEmailClick(mail.category)}>
                  <div className="m-2 flex items-center justify-between">
                    <p className="text-lg font-bold text-[#fff]">{mail.category}</p>
                  </div>
                </div>
              ))}

            </div>
            <p className="text-sm text-foreground p-2">
              Your ability to close increases with the amount of tools at your
              disposal. A mechanic without a tire iron wouldnt be able to change
              a tire. So why dont more sales people take better care of their
              scripts, closes, and such?
            </p>
          </div>
        </div>
        <div className="emailList w-[25%] border-r border-[#262626]">
          <div className="border-b border-[#262626]">
            <p className="text-bold  p-2 text-lg text-[#fff]">
              Sub-category
            </p>
          </div>
          <div className="h-auto max-h-[950px] overflow-y-auto">
            {subcategories.map((subCat, index) => (
              <div key={index} className="m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-primary  hover:text-primary active:border-primary" onClick={() => handleSubCatLisstClick(scripts.find(mail => mail.subCat === subCat))}>
                <div className="m-2 flex items-center justify-between">
                  <p className="text-lg font-bold text-[#fff]">{subCat}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="email flex h-full w-[50%]  flex-col">
          <div className="border-b border-[#262626]">
            <p className="text-bold  p-2 text-lg text-[#fff]">
              Script
            </p>
          </div>
          <div className="flex justify-between  border-[#262626]">
            {selectedRecord && (
              <div className="h-auto max-h-[950px] overflow-y-auto">
                <div className="m-2 mx-auto w-[95%]   hover:border-primary  hover:text-primary active:border-primary">
                  <div className="m-2  items-center justify-between p-2 text-foreground">

                    <p className='text-[20px]'>{selectedRecord.category}: {selectedRecord.subCat}</p>

                    <div className='flex justify-between text-[16px]  text-[#fff]'>
                      <p className='text-[20px]'>{selectedRecord.name}</p>

                    </div>
                    <p className='mt-5'>{selectedRecord.content}</p>
                    <div className='flex justify-between  text-[#fff] mt-5 items-center'>
                      <div className='flex' >
                        <button className="cursor-pointer text-foreground" onClick={() => copyText(selectedRecord.content)} >
                          <Copy strokeWidth={1.5} />
                        </button>
                        {copiedText === selectedRecord.content && <div>Copied!</div>}
                      </div>
                      <Form method='post'>
                        <input type='hidden' name='name' value={selectedRecord.name} />
                        <input type='hidden' name='body' value={selectedRecord.content} />
                        <input type='hidden' name='category' value={selectedRecord.category} />
                        <input type='hidden' name='userEmail' value={user.email} />
                        <input type='hidden' name='subject' value='Copied from scripts' />
                        <input type='hidden' name='title' value='Copied from scripts' />
                        <input type='hidden' name='dept' value='sales' />

                        <ButtonLoading
                          size="lg"
                          name='intent'
                          value='createTemplate'
                          type='submit'
                          isSubmitting={isSubmitting}
                          onClick={() => {
                            toast.message('Helping you become the hulk of sales...')
                          }}
                          loadingText="Loading..."
                          className="w-auto cursor-pointer  hover:text-primary hover:border-primary text-foreground border-white"
                        >
                          Save As Template
                        </ButtonLoading>
                      </Form>

                    </div>




                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
 */


/*** template for other layours like thi sone
 *
export default function Shight() {
  const { user, } = useLoaderData();
  const email = user.email
  const name = user.name
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef(0);
  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, [])

  const scripts = [
    {
      email: "",
      name: "",
      content: "",
      category: "Closes",
      subCatLisst: 'close',
    },
    {
      email: "",
      name: "",
      content: "I hope you're having a great day! I wanted to check in and see if you had any further questions or concerns about the Street Glide. We've had a lot of interest in this model and I want to make sure you don't miss out on the opportunity to own one at the price we discussed. If you're ready to move forward, please let me know and I'll be happy to assist you with the purchase process.",
      category: "Closes",
      subCatLisst: 'close',
    },
    {
      email: "",
      name: "",
      content: " I noticed you haven't responded to my previous email, and I wanted to check in and see if you have any further questions about the Street Glide. When you're ready to move forward with your purchase, we're offering a limited-time promotional rate for people that qualify. Let me know if you're interested and we can discuss next steps.",
      category: "Closes",
      subCatLisst: 'close',
    },
    {
      email: "",
      name: "",
      content: "I understand that purchasing a motorcycle can be a big decision, but I want to remind you that the Street Glide is currently available at the price we discussed. I would be happy to go over all te features it has again with you. Would this afternoon work for you or would tomorrow fit your schedule better?",
      category: "Closes",
      subCatLisst: 'close',
    },
    {
      email: "",
      name: "",
      content: "To ensure that you have the opportunity to view and secure the unit, I recommend placing a deposit to reserve it until it arrives. This way, you'll prevent anyone else from purchasing it before you've had a chance to see it. The best part is, if you don't like it when you see it, you'll receive a full deposit refund. On the other hand, if you fall in love with it, you won't miss the opportunity to make it yours.",
      category: "Closes",
      subCatLisst: 'close',
    },
    {
      email: "",
      name: "",
      content: "I take pride in being the best salesperson I can be and assisting as many people in my community as possible. It's clear that you may have some reservations about the current deal. If you don't mind sharing, I'd love to know what we can adjust or improve to make it a more attractive offer for you. Your feedback is invaluable, and I'm here to work together on a solution that meets your needs and expectations.",
      category: "Closes",
      subCatLisst: 'close',
    },
    {
      email: "",
      name: "",
      content: "I understand that deciding on a motorcycle purchase is a significant decision. However, I'd like to emphasize that the Street Glide is currently available at the agreed-upon price we discussed. To help you make an informed decision, I'm thrilled to offer you the opportunity for a test drive. This will allow you to personally experience the motorcycle's exceptional features and performance. Could we arrange a test drive for you this afternoon? Alternatively, if your schedule is more accommodating, tomorrow would also work perfectly. Your comfort and satisfaction are our top priorities, and I'm here to assist you in making the right choice for your needs.",
      category: "Closes",
      subCatLisst: 'testDrives',
    },
    {
      email: "",
      name: "",
      content: "I understand that choosing the perfect motorcycle is a significant decision, one that can truly enhance your life. Imagine the Street Glide as more than just a motorcycle; it's your ticket to unforgettable adventures and cherished moments with family and friends.  Picture yourself cruising the curvy roads. With the Street Glide, you're not just buying a motorcycle; you're investing in unforgettable memories and quality time with loved ones. The price we discussed today is an incredible opportunity to bring these dreams to life. I'd love to arrange a test drive, so you can personally experience the excitement and freedom this motorcycle offers. Would this afternoon or tomorrow be a better time for you? Your happiness and the enrichment of your life are our utmost priorities, and I'm here to make that happen.",
      category: "Closes",
      subCatLisst: 'emotional',
    },
    {
      email: "",
      name: "",
      content: "I completely understand that making a decision like this can be a significant step. Many of our customers have been in the same position, and they've shared some incredible stories with us.  Customers who purchased the Street Glide have told us how it transformed their weekends and vacations. They found that it added a new dimension to their family time, creating memories that they'll cherish forever.  One of our recent customers, John, initially had similar reservations. However, after taking the Street Glide for a test drive, he couldn't resist its appeal. He mentioned how it rekindled his love for the open road and brought his family closer together.  Another customer, Sarah, told us how she discovered hidden backcountry roads and beautiful spots she never knew existed before owning this motorcycle.  It's stories like these that remind us how life-changing the Street Glide can be. We'd love to help you create your own memorable experiences. If you're open to it, I can schedule a test drive for you. Would this afternoon or tomorrow work better for you?",
      category: "Closes",
      subCatLisst: 'felt',
    },
    {
      email: "",
      name: "",
      content: "I understand that you might have some concerns, and I appreciate your diligence in making the right decision. Let me address a few common questions and concerns that customers often have:  Price: Some customers worry about the cost. However, the Street Glide is not just an expense; it's an investment in your lifestyle and enjoyment. Plus, the price we've discussed today is a fantastic offer.  Maintenance: Maintenance can be a concern. Rest assured that H-D is known for its reliability, and we offer maintenance plans that will keep your motorcycle in top condition without any hassle.  Safety: Safety is paramount. The Street Glide is equipped with state-of-the-art safety features.  Resale Value: Some wonder about the resale value. H-D tend to hold their value well over time, and we can provide you with insights on how to maintain that value.  Time Commitment: You might be concerned about the time needed to enjoy your motorcycle. Remember, the Street Glide is designed to enhance your free time, allowing you to create wonderful memories without extensive commitments.  I'm here to address any specific concerns you may have. Your comfort and confidence in your decision are of utmost importance to us. Is there a particular concern you'd like to discuss or any additional information you need before moving forward?",
      category: "Closes",
      subCatLisst: 'problem',
    },
    {
      email: "",
      name: "dsa",
      content: "Present the customer with two options and ask them to choose. It's as simple as that.",
      category: "Closes",
      subCatLisst: 'alternative',
    },
    {
      email: "",
      name: "",
      content: "To move forward with your purchase, we would need a $500 deposit and a picture of your driver's license. This will allow us to initiate the process for our finance manager to go over the application with you.  We understand that making a financial commitment is an important step, and we want you to feel comfortable. If you're hesitant about putting money down for financing, please know that it's perfectly okay. In fact, we have a flexible approach, and we'll refund the deposit when you come to pick up your new bike.  We genuinely want to make this process as smooth and convenient for you as possible. Could you please let us know which payment option you're most comfortable with?",
      category: "Closes",
      subCatLisst: 'alternative',
    },
    {
      email: "",
      name: "",
      content: "It seems like you might have some concerns about the deal we're working on, and I truly value your feedback. My goal is to ensure that you're completely satisfied with your purchase. I can't make guarantees, but I'm more than willing to take your conditions and present them to my manager. I've had a long-standing working relationship with him, and I know how and when to approach him to explore options that can meet your needs, within reasonable boundaries, of course.  Your satisfaction is of the utmost importance to us, and we're committed to finding a solution that works for you. What would it take to make this deal align better with your expectations? Please share your conditions, and I'll do my best to advocate for you",
      category: "Closes",
      subCatLisst: 'directs',
    },
    {
      email: "",
      name: "",
      content: "To ensure you have the opportunity to see and buy it, I recommend placing a deposit to reserve the unit until it arrives. This way, you'll have peace of mind knowing that no one else can purchase it before you have a chance to make a decision. The best part is, if you happen to dislike it when you see it, you'll receive a full refund of your deposit. On the other hand, if you fall in love with it, you won't miss out on the chance to make it yours. It's a win-win scenario that allows you the time and flexibility to make an informed choice. Would you like to go ahead and place a deposit to secure the unit?",
      category: "Closes",
      subCatLisst: 'directs',
    },
    {
      email: "",
      name: "dsa",
      content: "Ask the customer questions to gauge their level of interest.",
      category: "Closes",
      subCatLisst: 'trial',
    },
    {
      email: "",
      name: "dsa",
      content: "Summarize the key benefits of the product and ask for the sale.",
      category: "Closes",
      subCatLisst: 'summary',
    },
    {
      email: "",
      name: "dsa",
      content: "If your worried about the finance numbers we can sit you down with our finance manager and he can go over the deal with you and see what rate we can go for before you fully commit. That way you have all the information to make an informed decision.",
      category: "Closes",
      subCatLisst: 'close',
    },
  ]
  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    console.log(email)
    SetToRead(email)
    setReply(false)
  };
  const CategoryList = ({ scripts, }) => {
    return (
      <div className="h-auto max-h-[970px] overflow-y-auto">
        {scripts.map((mail) => (
          <div key={mail.id} className="m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-primary  hover:text-primary active:border-primary" onClick={() => handleEmailClick(mail)}>
            <div className="m-2 flex items-center justify-between">
              <p className="text-lg font-bold text-[#fff]">{mail.category}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  const SubCatLisst = ({ scripts, }) => {
    return (
      <div className="h-auto max-h-[970px] overflow-y-auto">
        {scripts.map((mail) => (
          <div key={mail.id} className="m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-primary  hover:text-primary active:border-primary" onClick={() => handleEmailClick(mail)}>
            <div className="m-2 flex items-center justify-between">
              <p className="text-lg font-bold text-[#fff]">{mail.subCat}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  const ScriptsList = ({ scripts, }) => {
    const copyText = (text) => {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedText(text);
          setTimeout(() => setCopiedText(''), 3000); // Reset after 3 seconds
        })
        .catch((error) => {
          console.error('Failed to copy text: ', error);
        });
    };
    return (
      <div className="h-auto max-h-[970px] overflow-y-auto">
        {scripts.map((mail) => (
          <div key={mail.id} className="m-2 mx-auto w-[95%] cursor-pointer rounded-md border border-[#ffffff4d] hover:border-primary  hover:text-primary active:border-primary" onClick={() => handleEmailClick(mail)}>


            <div className="m-2 flex items-center justify-between">
              <p className="text-lg font-bold text-[#fff]">{mail.name}</p>
            </div>
            <p className="my-2 ml-2 text-sm text-[#ffffffc9]">{mail.content}</p>
            <button
              className="cursor-pointer"
              onClick={() => copyText(mail.content)}
            >
              <Copy strokeWidth={1.5} />

            </button>
            <div className="flex">
              <Badge className="m-2 border-[#fff] text-[#fff]">{mail.category}</Badge>
              <Badge className="m-2 border-[#fff] text-[#fff]">{mail.subCatLisst}</Badge>

            </div>

          </div>
        ))}


      </div>
    );
  };
  return (
    <>
      <div className="border-1 mx-auto flex h-[95%] w-[95%] border border-[#262626]">
        <div className="sidebar w-[25%] border-r border-[#262626]">
          <div className="border-b border-[#262626]">
            <CategoryList scripts={scripts} />
          </div>
        </div>
        <div className="emailList w-[25%] border-r border-[#262626]">
          <div className=" ">
            <div>
              <Input name="search" placeholder="Search" className='m-2 mx-auto w-[95%] border border-[#ffffff4d] bg-[#000] text-[#fff] focus:border-primary' />
            </div>
            <SubCatLisst scripts={scripts} />
          </div>
        </div>
        <div className="email flex h-full w-[50%]  flex-col">
          <div className="flex justify-between border-b border-[#262626]">

            <ScriptsList scripts={scripts} />
          </div>
        </div>
      </div>
    </>
  )
}

 */
