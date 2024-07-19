import { json, type ActionFunction, createCookie, type LoaderFunction, redirect, defer } from "@remix-run/node";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { findDashboardDataById, findQuoteById, getDataBmwMoto, getDataByModel, getDataByModelManitou, getDataHarley, getDataKawasaki, getDataTriumph, getLatestBMWOptions, getLatestBMWOptions2, getLatestOptionsManitou, getRecords, } from "~/utils/finance/get.server";
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { deleteFinanceNote } from "~/utils/financeNote/delete.server";
import UpdateStatus from "../dashboard/calls/actions/UpdateStatus";
import DeleteCustomer from "../dashboard/calls/actions/DeleteCustomer";
import { updateFinanceNote } from "~/utils/client/updateFinanceNote.server";
import { prisma } from "~/libs";
import { deleteFinanceAppts } from "~/utils/financeAppts/delete.server";
import UpdateAppt from "../dashboard/calls/actions/updateAppt";
import updateFinanceNotes from "../dashboard/calls/actions/updateFinanceNote";
import CreateAppt from "../dashboard/calls/actions/createAppt";
import updateFinance23 from "../dashboard/calls/actions/updateFinance";
import { createfinanceApt } from "~/utils/financeAppts/create.server";
import { model } from "~/models";
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { updateFinance, updateFinanceWithDashboard } from "~/utils/finance/update.server"
import { getSession as sixSession, commitSession as sixCommit, } from '~/utils/misc.user.server'
import { DataForm } from '../dashboard/calls/actions/dbData';
import { GetUser } from "~/utils/loader.server";
import { getSession as getOrder, commitSession as commitOrder, } from '~/sessions/user.client.server'
import { createFinanceManitou, createBMWOptions, createBMWOptions2, createClientFileRecord, financeWithDashboard, } from "~/utils/finance/create.server";
import { QuoteServerActivix } from '~/utils/quote/quote.server';
import twilio from 'twilio';
import axios from "axios";
import emitter from '~/routes/__authorized/dealer/emitter';
import { checkForMobileDevice, getToken, CompleteLastAppt, TwoDays, FollowUpApt, ComsCount, QuoteServer } from './shared'


export async function dashboardLoader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
  const user = await GetUser(email)
  console.log(user, email, 'dashboard laoder')
  if (!user) { redirect('/login') }
  const proxyPhone = '+12176347250'
  const deFees = await getDealerFeesbyEmail(user.email);
  const session = await sixSession(request.headers.get("Cookie"));
  const sliderWidth = session.get("sliderWidth");
  const getTemplates = await prisma.emailTemplates.findMany({ where: { userEmail: user.email, }, });
  const finance = await prisma.finance.findMany({ where: { userEmail: user?.email }, });
  const urlSegmentsDashboard = new URL(request.url).pathname.split("/");
  const dashBoardCustURL = urlSegmentsDashboard.slice(0, 3).join("/");
  const financeNotes = await prisma.financeNote.findMany({ orderBy: { createdAt: "desc" }, });
  const conversations = await prisma.previousComms.findMany({ orderBy: { createdAt: "desc" }, });
  const getWishList = await prisma.wishList.findMany({ orderBy: { createdAt: 'desc', }, where: { userId: user?.id } });

  const fetchLatestNotes = async (webLeadData) => {
    const promises = webLeadData.map(async (webLeadData) => {
      try {
        const latestNote = await prisma.financeNote.findFirst({
          where: { financeId: webLeadData.financeId },
          orderBy: { createdAt: 'desc' },
        });
        return latestNote;
      } catch (error) {
        console.error('Error fetching note:', error);
        return null;
      }
    });

    return Promise.all(promises);
  };
  const latestNotes = await fetchLatestNotes(finance);

  const wishList = await prisma.wishList.findMany({ where: { userId: user?.id }, })
  const inventory = await prisma.inventoryMotorcycle.findMany({
    select: { make: true, model: true, status: true, }
  })

  function calculateSimilarity(modelName1, modelName2, make) {
    let components1
    if (make === 'Harley-Davidson') {
      components1 = modelName1.split(' - ')[2].toLowerCase();
    } else {
      components1 = modelName1.split(' - ').map(component => component.toLowerCase());
    }
    const components2 = modelName2.split(' ')[0].toLowerCase()

    const multiSearchAtLeastN = (text, searchWords, minimumMatches) => (
      searchWords.some(word => text.includes(word) && --minimumMatches <= 0)
    );
    let name = modelName2.toLowerCase()
    let spl = name.split(' - ');
    let passed = multiSearchAtLeastN(modelName1.toLowerCase(), spl, 1);
    // console.log(name, modelName1.toLowerCase(), 'checking final verification ')
    //  console.log(passed);
    return passed
  }
  const filteredEmailsSet = new Set();

  async function processWishList() {
    for (const wishListItem of wishList) {
      for (const inventoryItem of inventory) {
        const similarityScore = calculateSimilarity(wishListItem.model, inventoryItem.model, inventoryItem.make);
        if (
          wishListItem.notified !== 'true' &&
          wishListItem.brand === inventoryItem.make &&
          similarityScore === true
          // && inventoryItem.status === 'available'
        ) {
          filteredEmailsSet.add(`${wishListItem.email} -- ${wishListItem.model}`);
          if (!wishListItem.notified) {
            await prisma.notificationsUser.create({
              data: {
                title: `Bike found for ${wishListItem.firstName} ${wishListItem.lastName}`,
                content: `${wishListItem.model} just came in - ${wishListItem.email} ${wishListItem.phone}`,
                read: 'false',
                type: 'updates',
                from: 'Wish List Update',
                userId: user?.id,
              }
            });
            await prisma.wishList.update({
              where: { id: wishListItem.id },
              data: { notified: 'true' }
            });
          }
        }
      }
    }
  }
  const wishlistMatches = processWishList().then(() => {
    // Handle completion if needed
  }).catch(error => {
    console.error('Error processing wish list:', error);
  });

  const getDemoDay = await prisma.demoDay.findMany({ orderBy: { createdAt: 'desc', }, where: { userEmail: 'skylerzanth@outlook.com' } });


  const webLeadData = await prisma.finance.findMany({
    where: { OR: [{ userEmail: null }, { userEmail: '' }], },
  });


  let callToken;
  let username = 'skylerzanth'//localStorage.getItem("username") ?? "";
  let password = 'skylerzanth1234'//localStorage.getItem("password") ?? "";
  if (username.length > 0 && password.length > 0) {
    const token = await getToken(username, password)
    callToken = token
  }

  const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2';
  const authToken = 'd38e2fd884be4196d0f6feb0b970f63f';
  const godClient = require('twilio')(accountSid, authToken);
  const client = godClient

  let convoList = {}
  let conversationSid;
  let participantSid;
  let userSid;
  let conversationChatServiceSid;
  let newToken;

  const firstTime = await prisma.twilioSMSDetails.findUnique({ where: { userEmail: 'skylerzanth@gmail.com', } })//user?.email } })

  //  console.log(callToken, 'callToken')

  if (!firstTime) {
    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    async function performOperations() {
      try {
        // Create a conversation
        const conversation = await client.conversations.v1.conversations.create({ friendlyName: 'My test' });
        const conversationSid = conversation.sid;

        // Fetch conversation details
        await delay(50);
        try {
          const fetchedConversation = await client.conversations.v1.conversations(conversationSid).fetch();
          conversationChatServiceSid = fetchedConversation.body;
        } catch (error) { console.error('Error fetching conversation:', error); }

        // Create a participant/customer
        await delay(50);
        try {
          const participant = await client.conversations.v1.conversations(conversationSid).participants.create({
            'messagingBinding.address': `+1${user?.phone}`, // customers number
            'messagingBinding.proxyAddress': proxyPhone,
          });
          participantSid = participant.sid;
        } catch (error) { console.error('Error creating participant:', error); }

        // Create a user // need tog et rid of this when when wqe use this to create convos
        await delay(50);
        try {
          const createdUser = await client.conversations.v1.users.create({ identity: `${username}` });
          userSid = createdUser.sid;
        } catch (error) { console.error('Error creating user:', error); }

        // Create a participant for the user/employee
        await delay(50);
        try {
          const userParticipant = await client.conversations.v1.conversations(conversationSid)
            .participants
            .create({ identity: `${username}` });
          userSid = userParticipant.sid
        } catch (error) { console.error('Error creating user:', error); }

        // List user conversations
        await delay(50);
        try {
          convoList = await client.conversations.v1.users(userSid).userConversations.list({ limit: 50 });
          //   userConversations.forEach(u => console.log(u.friendlyName));
        } catch (error) { console.error('Error creating user:', error); }


      } catch (error) { console.error('Error performing operations:', error); }
    }

    // Call the function
    performOperations();

    await prisma.twilioSMSDetails.create({
      data: {
        conversationSid: conversationSid,
        participantSid: participantSid,
        userSid: userSid,
        username: username,
        userEmail: 'skylerzanth@gmail.com', // email,
        passClient: password,
        proxyPhone: proxyPhone,
      }
    })

  }
  let getConvos;

  if (!Array.isArray(convoList) || convoList.length === 0) {
    getConvos = await client.conversations.v1.users(`${username}`).userConversations.list({ limit: 50 });
    // .then(userConversations => userConversations.forEach(u => console.log(u.friendlyName)))
    convoList = getConvos;
  }


  const conversation = await prisma.getConversation.findFirst({
    where: { userEmail: 'skylerzanth@gmail.com'/*user.email*/ },
    orderBy: {
      createdAt: 'desc', // or updatedAt: 'desc'
    },
  });
  let getText
  if (conversation) {
    const storeObject = JSON.parse(conversation.jsonData);
    // console.log(storeObject);

    // Extract conversationSid from the first object in the array
    const conversationSid = storeObject[0].conversationSid;

    if (conversationSid) {
      //  console.log(conversationSid, 'channels');
      getText = await client.conversations.v1.conversations(conversationSid)
        .messages
        .list({ limit: 200 });
    } else {
      console.log('conversationSid is undefined');
    }
  }

  const userAgent = request.headers.get('User-Agent');
  const isMobileDevice = checkForMobileDevice(userAgent);
  /*
   */
  console.log(user, email, ';user')
  const rotationList = await prisma.user.findMany()

  return json({
    ok: true,
    getDemoDay,
    finance,
    deFees,
    sliderWidth,
    user,
    financeNotes,
    latestNotes,
    dashBoardCustURL,
    getWishList,
    conversations,
    webLeadData,
    getTemplates,
    request,
    wishlistMatches,
    callToken,
    convoList, username, newToken, password, getText, isMobileDevice, email,
    rotationList
  }, { headers: { "Set-Cookie": await commitSession(session2), }, })
}

export const dashboardAction: ActionFunction = async ({ request, }) => {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
  const user = await GetUser(email)
  if (!user) {
    redirect('/login')
  }
  const userId = user?.id;
  const intent = formPayload.intent;
  switch (intent) {
    case 'rotateSalesQueue':
      const firstPerson = await prisma.user.findFirst({
        where: {
          positions: {
            some: {
              position: 'Sales'
            }
          }
        },
        orderBy: { order: 'asc' }
      });

      if (!firstPerson) return;

      const otherPeople = await prisma.user.findMany({
        where: {
          positions: {
            some: {
              position: 'Sales'
            }
          }
        },
        orderBy: { order: 'asc' }
      });

      await prisma.user.update({
        where: { id: firstPerson.id },
        data: { order: otherPeople.length + 1 },
      });

      for (let i = 0; i < otherPeople.length; i++) {
        await prisma.user.update({
          where: { id: otherPeople[i].id },
          data: { order: i + 1 },
        });
      }
      const updatedSalesPeople = await prisma.user.findMany({
        orderBy: { order: 'asc' },
      });
      return updatedSalesPeople
      break;
    case 'rotateFinanceQueue':
      const firstFinance = await prisma.user.findFirst({
        where: {
          positions: {
            some: {
              position: 'Finance Manager'
            }
          }
        },
        orderBy: { order: 'asc' }
      });

      if (!firstFinance) return;

      const otherFinance = await prisma.user.findMany({
        where: {
          positions: {
            some: {
              position: 'Finance Manager'
            }
          }
        },
        orderBy: { order: 'asc' }
      });


      await prisma.user.update({
        where: { id: firstFinance.id },
        data: { order: otherFinance.length + 1 },
      });

      for (let i = 0; i < otherFinance.length; i++) {
        await prisma.user.update({
          where: { id: otherFinance[i].id },
          data: { order: i + 1 },
        });
      }
      const updatedFinance = await prisma.user.findMany({
        orderBy: { order: 'asc' },
      });
      return updatedFinance
      break;
    case 'resetQueue':
      const salesPeople = await prisma.user.findMany({
        where: {
          positions: {
            some: {
              position: 'Sales'
            }
          }
        },
        orderBy: { order: 'asc' }
      });

      const totalUsers = salesPeople.length;

      const orderNumbers = Array.from({ length: totalUsers }, (_, index) => index + 1);

      for (let i = 0; i < totalUsers; i++) {
        await prisma.user.update({
          where: { id: salesPeople[i].id },
          data: { order: orderNumbers[i] },
        });
      }

      const updatedSalesPeople3 = await prisma.user.findMany({
        orderBy: { order: 'asc' },
      });

      return json({ updatedSalesPeople3 });
    case 'resetQueueFinance':

      const financeManagers = await prisma.user.findMany({
        where: {
          positions: {
            some: {
              position: 'Finance Manager'
            }
          }
        },
        orderBy: { order: 'asc' }
      });
      const totalFinance = financeManagers.length;


      const orderNumbersFinance = Array.from({ length: totalFinance }, (_, index) => index + 1);

      for (let i = 0; i < totalFinance; i++) {
        await prisma.user.update({
          where: { id: financeManagers[i].id },
          data: { order: orderNumbersFinance[i] },
        });
      }

      const updatedFinance2 = await prisma.user.findMany({
        orderBy: { order: 'asc' },
      });

      return json({ updatedFinance2 });
    case 'navToFinanceFile':
      const clientfileId = formData.clientfileId
      const getFile = await prisma.finance.findFirst({
        where: { clientfileId: clientfileId }
      })
      return redirect(`/dealer/customer/${clientfileId}/${getFile?.id}`)
      break;
    case 'reading':
      const isRead = await prisma.notificationRead.updateMany({
        where: {
          notificationId: formData.id,
          userEmail: user.email
        },
        data: {
          read: true
        }
      });
      return isRead
    case 'financeTurnover':
      const claim = await prisma.lockFinanceTerminals.create({
        data: {
          financeId: formData.financeId,
          salesEmail: user?.email,
          locked: true
        }
      });
      const finance = await prisma.finance.update({
        where: { id: formData.financeId },
        data: { customerState: 'financeTurnover' }
      })
      const data = { locked: true, financeId: formData.id, salesEmail: user?.email, lockedId: claim.id };
      console.log('Publishing data:', data);
      emitter.emit('LOCKED_STATUS', data);
      return json({ claim, finance })
    case 'responseClientTurnover':
      const update = await prisma.lockFinanceTerminals.update({
        where: {
          id: formData.lockId,
        },
        data: {
          locked: false,
        },
      });
      return update
    case 'claimTurnover':
      const deleteWishList = await prisma.wishList.delete({
        where: {
          id: formData.rowId,
        },
      })
      return deleteWishList
      break;
    case 'deleteWishList':
      return null
      break;
    case 'wishListConvert':
      try {
        const clientfile = await prisma.clientfile.findUnique({ where: { email: formData.email, }, });
        const convert = await prisma.finance.create({
          data: {
            clientfileId: clientfile?.id,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            name: formData.name,
            brand: formData.brand,
            model: formData.model,
            userEmail: formData.userEmail,
          }
        })
        return convert
      } catch (error) {
        const clientfile = await prisma.clientfile.create({
          data: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            name: formData.name,
            userId: user.id,
          },
        });
        const convert = await prisma.finance.create({
          data: {
            clientfileId: clientfile.id,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            name: formData.name,
            brand: formData.brand,
            model: formData.model,
            userEmail: formData.userEmail,
          }
        })
        return json({ convert, clientfile })
      }
      break;
    case 'editWishList':
      const addtoWishList = await prisma.wishList.update({
        where: {
          id: formData.rowId,
        },
        data: {
          userId: formData.userId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          wishListNotes: formData.wishListNotes,
        }
      })
      return addtoWishList
    case 'createEmailTemplate':
      const template = await prisma.emailTemplates.create({
        data: {
          body: formData.body,
          subject: formData.subject,
          category: 'New template',
          subCat: 'Need to update',
          userEmail: user?.email,
          dept: 'sales',
          type: 'Text / Email',
        },
      });
      return template;
      break;
    case 'addWishList':
      const addtoWishList2 = await prisma.wishList.create({
        data: {
          userId: formData.userId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          brand: formData.brand,
          model: formData.model,
          brand2: formData.brand2,
          model2: formData.model2,
          wishListNotes: formData.notes,
        }
      })
      return addtoWishList2
      break;
    case 'selectBrand':
      console.log(formData.phone)
      const sessionOrder = await getOrder(request.headers.get("Cookie"));
      sessionOrder.set("firstName", formData.firstName);
      sessionOrder.set("lastName", formData.lastName);
      sessionOrder.set("phone", formData.phone);
      sessionOrder.set("email", formData.email);
      sessionOrder.set("address", formData.address);
      sessionOrder.set("financeId", formData.financeId);
      sessionOrder.set("activixId", formData.activixId);
      return redirect(`/quote/${formData.selectBrand}`, {
        headers: {
          "Set-Cookie": await commitOrder(sessionOrder),
        },
      });
      break;
    case 'addDemoDay':
      const addtoWishList3 = await prisma.demoDay.create({
        data: {
          userEmail: formData.userEmail,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          brand: formData.brand,
          model: formData.model,
          brand2: formData.brand2,
          model2: formData.model2,
          leadNote: formData.notes,
        }
      })
      return addtoWishList3
      break;
    case 'demoDayConvert':
      try {
        const clientfile = await prisma.clientfile.findUnique({ where: { email: formData.email, }, });
        const convert = await prisma.finance.create({
          data: {
            clientfileId: clientfile?.id,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            name: formData.name,
            brand: formData.brand,
            model: formData.model,
            userEmail: formData.userEmail,
          }
        })
        return convert
      } catch (error) {
        const clientfile = await prisma.clientfile.create({
          data: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            name: formData.name,
            userId: user.id,
          },
        });
        const convert = await prisma.finance.create({
          data: {
            clientfileId: clientfile.id,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            name: formData.name,
            brand: formData.brand,
            model: formData.model,
            userEmail: formData.userEmail,
          }
        })
        return json({ convert, clientfile })
      }
      break;
    case 'demoDayDelete':
      const edit = await prisma.demoDay.delete({
        where: {
          id: formData.id,
        }
      })
      return edit
      break;
    case 'demoDayEdit':
    case 'clientTurnover':
      const create = await prisma.lockFinanceTerminals.create({
        data: {
          locked: true,
          financeId: formData.financeId,
          salesEmail: user.email,
          customerName: formData.customerName,
          unit: formData.unit,
          response: false,

        }
      })
      return json({ create })
  }
  const clientfileId = formData.clientfileId;
  let financeId = formData?.financeId;
  const session66 = await sixSession(request.headers.get("Cookie"));
  session66.set("financeId", financeId);
  session66.set("clientfileId", clientfileId);
  const serializedSession = await sixCommit(session66);

  let pickUpDate;
  if (pickUpDate === null || pickUpDate === undefined) {
    pickUpDate = "To Be Det.";
  }
  const id = formData?.id;
  const to = formData.customerEmail
  const text = formData.customContent
  const subject = formData.subject
  const tokens = formData.tokens
  const followUpDay = formData.followUpDay
  let date = new Date();
  let brand = formPayload.brand
  const apptId = formData.id;
  let customerState = formData.customerState;
  if (customerState === "Pending") {
    customerState = "Attempted";
  }
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  let { clientData, dashData, financeData } = DataForm(formData);

  switch (intent) {
    case 'newLead':
      const activixActivated = user?.activixActivated
      if (activixActivated === 'yes') {
        await QuoteServerActivix(clientData, financeId, email, financeData, dashData)
      }
      const create = await QuoteServer(formData)
      return create
    case 'EmailClient':
      const comdata = {
        financeId: formData.financeId,
        userEmail: user?.email,
        content: formData.customContent,
        title: formData.subject,
        direction: formData.direction,
        result: formData.customerState,
        subject: formData.subject,
        type: 'Email',
        userName: user?.name,
        date: new Date().toISOString(),
      }
      const sendEmail = await SendEmail(user, to, subject, text, tokens)
      const setComs = await prisma.communicationsOverview.create({ data: comdata, });
      const saveComms = await ComsCount(financeId, 'Email')
      return json({ sendEmail, saveComms, formData, setComs, })
      break;
    case 'callClient':
      const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2'
      const authToken = 'd38e2fd884be4196d0f6feb0b970f63f'
      const client = require('twilio')(accountSid, authToken);
      const comdata2 = {
        financeId: formData.financeId,
        userEmail: user?.email,
        content: formData.customContent,
        title: formData.subject,
        direction: formData.direction,
        result: formData.customerState,
        subject: formData.subject,
        type: 'Phone',
        userName: user?.name,
        date: new Date().toISOString(),
      }
      const callCLient = await client.calls
        .create({
          twiml: '<Response><Say>Ahoy, World!</Say></Response>',
          to: `+1${user.phone}`,
          from: '+12176347250'
        })
        .then(call => console.log(call.sid));
      const date56 = new Date();

      const setComs2 = await prisma.finance.update({
        where: { id: formData.financeId },
        data: {
          Phone: formData.Phone += 1,
          lastContact: date56.toLocaleDateString('en-US', options)
        },
      });
      return json({ callCLient, formData, setComs2, })//, redirect(`/dummyroute`)
      break;
    case 'textQuickFU':
      console.log('hit textquick fu')
      const completeApt3 = await CompleteLastAppt(userId, financeId)
      const doTGwoDays = await TwoDays(followUpDay, formData, financeId, user)
      // const setComs = await CreateCommunications(comdata)
      const comdata3 = {
        financeId: formData.financeId,
        userId: formData.userId,
        content: formData.note,
        title: formData.title,
        direction: formData.direction,
        result: formData.resultOfcall,
        subject: formData.messageContent,
        type: 'Text',
        userName: user?.name,
        date: new Date().toISOString(),
      }
      const setComs3 = await prisma.communicationsOverview.create({
        data: comdata3,
      });
      const saveComms3 = await ComsCount(financeId, 'SMS')
      return json({ doTGwoDays, completeApt3, setComs3, saveComms3 });
      break;
    case '2DaysFromNow':
      const followUpDay2 = parseInt(formData.followUpDay1);
      console.log('followUpDay:', followUpDay2);
      function addDays(days) {
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + days);
        return currentDate;
      }
      financeId = formData?.financeId;
      const completeApt = await CompleteLastAppt(formData, user)
      let newDate = addDays(followUpDay2);
      const date = new Date(newDate);

      const apptDate = date.toLocaleDateString('en-US', options)
      const todaysDate = new Date()
      const lastContacted = todaysDate.toLocaleDateString('en-US', options)
      const finance = await prisma.finance.update({
        where: { id: formData.financeId },
        data: {
          clientfileId: formData.clientfileId,
          lastContact: lastContacted,
          status: formData.status,
          customerState: formData.customerState,
          timesContacted: formData.timesContacted,
          nextAppointment: apptDate,
          followUpDay: apptDate,

        },
      });
      const createFollowup = await prisma.clientApts.create({
        data: {
          financeId: formData.financeId,
          userEmail: formData.userEmail || '',
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          lastName: formData.lastName,
          firstName: formData.firstName,
          brand: formData.brand,
          unit: formData.unit,
          note: formData.note,
          apptType: formData.apptType,
          apptStatus: formData.apptStatus,
          completed: 'no',
          contactMethod: formData.contactMethod,
          end: String(new Date(new Date(apptDate).getTime() + 45 * 60000)),
          title: formData.title,
          start: String(apptDate),
          userId: user?.id,
          description: formData.description,
          resourceId: Number(formData.resourceId),
          userName: user?.name,
        }
      })
      return json({ finance, completeApt, createFollowup, });
      break;
    case 'completeApt':
      console.log('completeApt')
      const complete = CompleteLastAppt(userId, financeId)
      const addFU = formData.addFU
      const addDetailedFU = formData.addDetailedFU

      if (addFU === 'on') {
        const followUpDay3 = formData.followUpDay
        const twoDays = await TwoDays(followUpDay3, formData, financeId, user)
        return json({ complete, twoDays })
      }
      if (addDetailedFU === 'yes') {
        const followup = await FollowUpApt(formData, user, userId)
        return json({ complete, followup })
      }
      return null
    case 'scheduleFUp':
      console.log(formData, 'formData')

      let dateModal = new Date(formData.value);
      const year = dateModal.getFullYear();
      const month = String(dateModal.getMonth() + 1).padStart(2, '0');
      const day = String(dateModal.getDate()).padStart(2, '0');
      const hours = Number(formData.hours);
      const minutes = Number(formData.minutes);
      dateModal.setHours(hours, minutes);
      const dateTimeString = `${year}-${month}-${day}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00.000`;
      const date66 = new Date(dateTimeString);
      const options2 = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      const apptDate66 = date66.toLocaleDateString('en-US', options2)
      const todaysDate66 = new Date()
      const completeApt66 = await CompleteLastAppt(userId, financeId)
      console.log(completeApt66, 'CompleteLastAppt')

      const updating = await prisma.finance.update({
        where: { id: formData.financeId },
        data: {
          lastContact: todaysDate66.toLocaleDateString('en-US', options2),
          status: formData.status,
          customerState: formData.customerState,
          result: formData.result,
          timesContacted: formData.timesContacted,
          nextAppointment: apptDate66,
          followUpDay: apptDate66,

        },
      });
      console.log(updating, 'updating')
      const apptDat66 = date66.toLocaleDateString('en-US', options2)
      const createFollowup66 = await prisma.clientApts.create({
        data: {
          financeId: formData.financeId,
          userEmail: formData.userEmail,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          lastName: formData.lastName,
          firstName: formData.firstName,
          brand: formData.brand,
          unit: formData.unit,
          note: formData.note,
          apptType: formData.apptType,
          apptStatus: formData.apptStatus,
          completed: 'no',
          contactMethod: formData.contactMethod,
          end: String(new Date(new Date(apptDat66).getTime() + 45 * 60000)),
          title: formData.title,
          start: String(apptDat66),
          userId: user?.id,
          description: formData.description,
          resourceId: Number(formData.resourceId),
          userName: user?.name,
        }
      })
      console.log(createFollowup66, 'creating followup')
      return json({ updating, completeApt66, createFollowup66, });
    case 'updateFinance':
      console.log(formData, ' update finance data')

      const determineCustomerState = (formData) => {
        switch (true) {
          case formData.customerState === 'Pending':
            return 'Pending';
          case formData.customerState === 'Attempted':
            return 'Attempted';
          case formData.customerState === 'Reached':
            return 'Reached';
          case formData.customerState === 'Lost':
            return 'Lost';
          case formData.sold === 'on':
            return 'sold';
          case formData.depositMade === 'on':
            return 'depositMade';
          case formData.turnOver === 'on':
            return 'turnOver';
          case formData.financeApp === 'on':
            return 'financeApp';
          case formData.approved === 'on':
            return 'approved';
          case formData.signed === 'on':
            return 'signed';
          case formData.pickUpSet === 'on':
            return 'pickUpSet';
          case formData.delivered === 'on':
            return 'delivered';
          case formData.refund === 'on':
            return 'refund';
          case formData.funded === 'on':
            return 'funded';
          default:
            return null;
        }
      };
      const customerState = determineCustomerState(formData);

      let pickUpDate = ''
      if (formData.pickUpDate) {
        pickUpDate = new Date(formData.pickUpDate).toISOString()
      }
      let lastContact = new Date().toISOString()
      async function UpdateFinanceData(formData) {
        const updating = await prisma.finance.update({
          where: { id: formData.financeId },
          data: {
            clientfileId: formData.clientfileId,
            activixId: formData.activixId,
            theRealActId: formData.theRealActId,
            financeManager: formData.financeManager,
            email: formData.email,
            firstName: formData.firstName,
            mileage: formData.mileage,
            lastName: formData.lastName,
            phone: formData.phone,
            name: formData.name,
            address: formData.address,
            city: formData.city,
            postal: formData.postal,
            province: formData.province,
            dl: formData.dl,
            typeOfContact: formData.typeOfContact,
            timeToContact: formData.timeToContact,
            iRate: formData.iRate,
            months: formData.months,
            discount: formData.discount,
            total: formData.total,
            onTax: formData.onTax,
            on60: formData.on60,
            biweekly: formData.biweekly,
            weekly: formData.weekly,
            weeklyOth: formData.weeklyOth,
            biweekOth: formData.biweekOth,
            oth60: formData.oth60,
            weeklyqc: formData.weeklyqc,
            biweeklyqc: formData.biweeklyqc,
            qc60: formData.qc60,
            deposit: formData.deposit,
            biweeklNatWOptions: formData.biweeklNatWOptions,
            weeklylNatWOptions: formData.weeklylNatWOptions,
            nat60WOptions: formData.nat60WOptions,
            weeklyOthWOptions: formData.weeklyOthWOptions,
            biweekOthWOptions: formData.biweekOthWOptions,
            oth60WOptions: formData.oth60WOptions,
            biweeklNat: formData.biweeklNat,
            weeklylNat: formData.weeklylNat,
            nat60: formData.nat60,
            qcTax: formData.qcTax,
            otherTax: formData.otherTax,
            totalWithOptions: formData.totalWithOptions,
            otherTaxWithOptions: formData.otherTaxWithOptions,
            desiredPayments: formData.desiredPayments,
            freight: formData.freight,
            admin: formData.admin,
            commodity: formData.commodity,
            pdi: formData.pdi,
            discountPer: formData.discountPer,
            userLoanProt: formData.userLoanProt,
            userTireandRim: formData.userTireandRim,
            userGap: formData.userGap,
            userExtWarr: formData.userExtWarr,
            userServicespkg: formData.userServicespkg,
            deliveryCharge: formData.deliveryCharge,
            vinE: formData.vinE,
            lifeDisability: formData.lifeDisability,
            rustProofing: formData.rustProofing,
            userOther: formData.userOther,
            paintPrem: formData.paintPrem,
            licensing: formData.licensing,
            stockNum: formData.stockNum,
            options: formData.options,
            accessories: formData.accessories,
            labour: formData.labour,
            year: formData.year,
            brand: formData.brand,
            model: formData.model,
            model1: formData.model1,
            color: formData.color,
            modelCode: formData.modelCode,
            msrp: formData.msrp,
            userEmail: formData.userEmail,
            tradeValue: formData.tradeValue,
            tradeDesc: formData.tradeDesc,
            tradeColor: formData.tradeColor,
            tradeYear: formData.tradeYear,
            tradeMake: formData.tradeMake,
            tradeVin: formData.tradeVin,
            tradeTrim: formData.tradeTrim,
            tradeMileage: formData.tradeMileage,
            tradeLocation: formData.tradeLocation,
            trim: formData.trim,
            vin: formData.vin,
            leadNote: formData.leadNote,
            sendToFinanceNow: formData.sendToFinanceNow,
            dealNumber: formData.dealNumber,
            bikeStatus: formData.bikeStatus,
            lien: formData.lien,
            dob: formData.dob,
            othTax: formData.othTax,
            optionsTotal: formData.optionsTotal,
            lienPayout: formData.lienPayout,
            referral: formData.referral,
            visited: formData.visited,
            bookedApt: formData.bookedApt,
            aptShowed: formData.aptShowed,
            aptNoShowed: formData.aptNoShowed,
            testDrive: formData.testDrive,
            metService: formData.metService,
            metManager: formData.metManager,
            metParts: formData.metParts,
            sold: formData.sold,
            depositMade: formData.depositMade,
            refund: formData.refund,
            turnOver: formData.turnOver,
            financeApp: formData.financeApp,
            approved: formData.approved,
            signed: formData.signed,
            pickUpSet: formData.pickUpSet,
            demoed: formData.demoed,
            delivered: formData.delivered,
            lastContact: formData.lastContact,
            status: formData.status,
            customerState: formData.customerState,
            result: formData.result,
            timesContacted: formData.timesContacted,
            nextAppointment: formData.nextAppointment,
            followUpDay: formData.followUpDay,
            deliveryDate: formData.deliveryDate,
            deliveredDate: formData.deliveredDate,
            notes: formData.notes,
            visits: formData.visits,
            progress: formData.progress,
            metSalesperson: formData.metSalesperson,
            metFinance: formData.metFinance,
            financeApplication: formData.financeApplication,
            pickUpDate: formData.pickUpDate,
            pickUpTime: formData.pickUpTime,
            depositTakenDate: formData.depositTakenDate,
            docsSigned: formData.docsSigned,
            tradeRepairs: formData.tradeRepairs,
            seenTrade: formData.seenTrade,
            lastNote: formData.lastNote,
            applicationDone: formData.applicationDone,
            licensingSent: formData.licensingSent,
            liceningDone: formData.liceningDone,
            refunded: formData.refunded,
            cancelled: formData.cancelled,
            lost: formData.lost,
            dLCopy: formData.dLCopy,
            insCopy: formData.insCopy,
            testDrForm: formData.testDrForm,
            voidChq: formData.voidChq,
            loanOther: formData.loanOther,
            signBill: formData.signBill,
            ucda: formData.ucda,
            tradeInsp: formData.tradeInsp,
            customerWS: formData.customerWS,
            otherDocs: formData.otherDocs,
            urgentFinanceNote: formData.urgentFinanceNote,
            funded: formData.funded,
            leadSource: formData.leadSource,
            financeDeptProductsTotal: formData.financeDeptProductsTotal,
            bank: formData.bank,
            loanNumber: formData.loanNumber,
            idVerified: formData.idVerified,
            dealerCommission: formData.dealerCommission,
            financeCommission: formData.financeCommission,
            salesCommission: formData.salesCommission,
            firstPayment: formData.firstPayment,
            loanMaturity: formData.loanMaturity,
            InPerson: formData.InPerson,
            Phone: formData.Phone,
            SMS: formData.SMS,
            Email: formData.Email,
            Other: formData.Other,
          }
        })
        return json({ updating })
      }
      switch (brand) {
        case "Manitou":
          const updatingManitouFinance = await UpdateFinanceData(formData);
          return json({ updatingManitouFinance });
        case "Switch":
          const updatingSwitchFinance = await UpdateFinanceData(formData);
          return json({ updatingSwitchFinance });
        case "BMW-Motorrad":
          const updatingBMWMotoFinance = await UpdateFinanceData(formData);
          return json({ updatingBMWMotoFinance });
        default:
          try {
            const finance = await UpdateFinanceData(formData)
            return { finance };
          } catch (error) {
            console.error("An error occurred while updating the records:", error);
            throw error;
          }
      }
      break;
    case 'updateFinanceWanted':

      const fullName = user.username;
      const words = fullName.split(' ');
      const firstName = words[0];
      const lastName = words[1];

      const updateLocal = await prisma.finance.update({
        where: { id: formData.financeId },
        data: {
          activixId: formData.activixId,
          theRealActId: formData.theRealActId,
          financeManager: formData.financeManager,
          email: formData.email,
          firstName: formData.firstName,
          mileage: formData.mileage,
          lastName: formData.lastName,
          phone: formData.phone,
          name: formData.name,
          address: formData.address,
          city: formData.city,
          postal: formData.postal,
          province: formData.province,
          dl: formData.dl,
          typeOfContact: formData.typeOfContact,
          timeToContact: formData.timeToContact,
          iRate: formData.iRate,
          months: formData.months,
          discount: formData.discount,
          total: formData.total,
          onTax: formData.onTax,
          on60: formData.on60,
          biweekly: formData.biweekly,
          weekly: formData.weekly,
          weeklyOth: formData.weeklyOth,
          biweekOth: formData.biweekOth,
          oth60: formData.oth60,
          weeklyqc: formData.weeklyqc,
          biweeklyqc: formData.biweeklyqc,
          qc60: formData.qc60,
          deposit: formData.deposit,
          biweeklNatWOptions: formData.biweeklNatWOptions,
          weeklylNatWOptions: formData.weeklylNatWOptions,
          nat60WOptions: formData.nat60WOptions,
          weeklyOthWOptions: formData.weeklyOthWOptions,
          biweekOthWOptions: formData.biweekOthWOptions,
          oth60WOptions: formData.oth60WOptions,
          biweeklNat: formData.biweeklNat,
          weeklylNat: formData.weeklylNat,
          nat60: formData.nat60,
          qcTax: formData.qcTax,
          otherTax: formData.otherTax,
          totalWithOptions: formData.totalWithOptions,
          otherTaxWithOptions: formData.otherTaxWithOptions,
          desiredPayments: formData.desiredPayments,
          freight: formData.freight,
          admin: formData.admin,
          commodity: formData.commodity,
          pdi: formData.pdi,
          discountPer: formData.discountPer,
          userLoanProt: formData.userLoanProt,
          userTireandRim: formData.userTireandRim,
          userGap: formData.userGap,
          userExtWarr: formData.userExtWarr,
          userServicespkg: formData.userServicespkg,
          deliveryCharge: formData.deliveryCharge,
          vinE: formData.vinE,
          lifeDisability: formData.lifeDisability,
          rustProofing: formData.rustProofing,
          userOther: formData.userOther,
          paintPrem: formData.paintPrem,
          licensing: formData.licensing,
          stockNum: formData.stockNum,
          options: formData.options,
          accessories: formData.accessories,
          labour: formData.labour,
          year: formData.year,
          brand: formData.brand,
          model: formData.model,
          model1: formData.model1,
          color: formData.color,
          modelCode: formData.modelCode,
          msrp: formData.msrp,
          userEmail: formData.userEmail,
          tradeValue: formData.tradeValue,
          tradeDesc: formData.tradeDesc,
          tradeColor: formData.tradeColor,
          tradeYear: formData.tradeYear,
          tradeMake: formData.tradeMake,
          tradeVin: formData.tradeVin,
          tradeTrim: formData.tradeTrim,
          tradeMileage: formData.tradeMileage,
          tradeLocation: formData.tradeLocation,
          trim: formData.trim,
          vin: formData.vin,
          leadNote: formData.leadNote,
          sendToFinanceNow: formData.sendToFinanceNow,
          dealNumber: formData.dealNumber,
          bikeStatus: formData.bikeStatus,
          lien: formData.lien,
          dob: formData.dob,
          othTax: formData.othTax,
          optionsTotal: formData.optionsTotal,
          lienPayout: formData.lienPayout,
          referral: formData.referral,
          visited: formData.visited,
          bookedApt: formData.bookedApt,
          aptShowed: formData.aptShowed,
          aptNoShowed: formData.aptNoShowed,
          testDrive: formData.testDrive,
          metService: formData.metService,
          metManager: formData.metManager,
          metParts: formData.metParts,
          sold: formData.sold,
          depositMade: formData.depositMade,
          refund: formData.refund,
          turnOver: formData.turnOver,
          financeApp: formData.financeApp,
          approved: formData.approved,
          signed: formData.signed,
          pickUpSet: formData.pickUpSet,
          demoed: formData.demoed,
          delivered: formData.delivered,
          lastContact: formData.lastContact,
          status: formData.status,
          customerState: formData.customerState,
          result: formData.result,
          timesContacted: formData.timesContacted,
          nextAppointment: formData.nextAppointment,
          followUpDay: formData.followUpDay,
          deliveredDate: formData.deliveredDate,
          notes: formData.notes,
          visits: formData.visits,
          progress: formData.progress,
          metSalesperson: formData.metSalesperson,
          metFinance: formData.metFinance,
          financeApplication: formData.financeApplication,
          pickUpDate: formData.pickUpDate,
          pickUpTime: formData.pickUpTime,
          depositTakenDate: formData.depositTakenDate,
          docsSigned: formData.docsSigned,
          tradeRepairs: formData.tradeRepairs,
          seenTrade: formData.seenTrade,
          lastNote: formData.lastNote,
          applicationDone: formData.applicationDone,
          licensingSent: formData.licensingSent,
          liceningDone: formData.liceningDone,
          refunded: formData.refunded,
          cancelled: formData.cancelled,
          lost: formData.lost,
          dLCopy: formData.dLCopy,
          insCopy: formData.insCopy,
          testDrForm: formData.testDrForm,
          voidChq: formData.voidChq,
          loanOther: formData.loanOther,
          signBill: formData.signBill,
          ucda: formData.ucda,
          tradeInsp: formData.tradeInsp,
          customerWS: formData.customerWS,
          otherDocs: formData.otherDocs,
          urgentFinanceNote: formData.urgentFinanceNote,
          funded: formData.funded,
        }
      })

      return json({ updateLocal })
    case 'createQuote':
      console.log("creating quote");
      return redirect(`/quote/${brand}/${financeId}`);
    case 'updateStatus':
      delete formData.brand;
      const dashboard = await prisma.finance.update({
        where: {
          id: formData.id,
        },
        data: {
          status: formData.status,
        }
      });
      return json({ dashboard });
      return null
    case 'clientProfile':
      console.log(clientfileId, financeId, 'dashboard calls')
      return redirect(`/customer/${clientfileId}/${financeId}`, {
        headers: {
          "Set-Cookie": serializedSession,
        },
      });
    case 'returnToQuote':
      return redirect(`/overview/customer/${financeId}`);
    case 'addAppt':
      const createAppt77 = await CreateAppt(formData);
      const completeCall77 = await CompleteLastAppt(userId, financeId);
      return json({ completeCall77, createAppt77 });
    case 'deleteApt':
      const newFormData = { ...formData };
      delete newFormData.intent;
      const deleteNote = await deleteFinanceAppts(newFormData);
      return json({ deleteNote });
      return null
    case 'updateFinanceAppt':
      const updateApt = await UpdateAppt(formData, apptId);
      return json({ updateApt });
    case 'AddCustomer':
      const create77 = await QuoteServer(formData)
      return create77
    case 'deleteCustomer':
      const deleteCust = await DeleteCustomer({ formData, formPayload });
      return json({ deleteCust });
    case 'saveFinanceNote':
      const createFinanceNotes = await prisma.financeNote.create({
        data: {
          body: formData.body,
          userEmail: formData.userEmail,
          clientfileId: formData.clientfileId,
          userName: formData.userName,
          financeId: formData.financeId,
        },
      });
      return createFinanceNotes;
    case 'updateFinanceNote':
      const updateNote = await updateFinanceNote(financeId, formData);
      return json({ updateNote });
    case 'deleteFinanceNote':
      const deleteNote88 = await deleteFinanceNote(id);
      return json({ deleteNote88 });
    default:
      break;
  }

  return null;
};
