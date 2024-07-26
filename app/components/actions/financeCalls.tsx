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
import { createFinance, createFinanceManitou, createBMWOptions, createBMWOptions2, createClientFileRecord, financeWithDashboard, } from "~/utils/finance/create.server";
import { QuoteServerActivix } from '~/utils/quote/quote.server';
import twilio from 'twilio';
import axios from "axios";
import emitter from '~/routes/__authorized/dealer/emitter';
import { checkForMobileDevice, getToken, CompleteLastAppt, TwoDays, FollowUpApt, ComsCount, QuoteServer } from './shared'

export async function dashboardLoader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  const proxyPhone = '+12176347250'
  //const deFees = await getDealerFeesbyEmail(user.email);
  let deFees = await prisma.dealer.findUnique({ where: { userEmail: email } });
  if (!deFees) {
    deFees = await prisma.dealer.findUnique({
      where: { id: 1 }
    });
  }
  const session = await sixSession(request.headers.get("Cookie"));
  const sliderWidth = session.get("sliderWidth");
  const getTemplates = await prisma.emailTemplates.findMany({ where: { userEmail: user.email, }, });
  const finance = await prisma.finance.findMany({ where: { financeManager: user?.email }, });
  const brand = finance?.brand;
  const urlSegmentsDashboard = new URL(request.url).pathname.split("/");
  const dashBoardCustURL = urlSegmentsDashboard.slice(0, 3).join("/");
  const financeNotes = await prisma.financeNote.findMany({ orderBy: { createdAt: "desc" }, });
  const searchData = await prisma.clientfile.findMany({ orderBy: { createdAt: 'desc', }, });
  const conversations = await prisma.comm.findMany({ orderBy: { createdAt: "desc" }, });
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

  const clientfileRecords = await prisma.clientfile.findMany({
    where: { email: { in: finance.map(financeRecord => financeRecord.email), }, },
  });

  const combinedData = finance.map(financeRecord => {
    const correspondingClientfile = clientfileRecords.find(clientfile => clientfile.email === financeRecord.email);
    return { ...financeRecord, ...correspondingClientfile, };
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
  let products = await prisma.board.findMany({
    where: { name: 'Finance Product Board', },
    include: {
      items: true,
      columns: { orderBy: { order: "asc" } },
    }
  })
  products = products[0]
  const emailTemplatesDropdown = await prisma.emailTemplatesForDropdown.findMany({
    where: { userEmail: email },
  });
  return json({
    ok: true,
    getDemoDay,
    //modelData,
    finance,
    deFees,
    sliderWidth,
    user,
    financeNotes,
    latestNotes,
    dashBoardCustURL,
    getWishList,
    combinedData,
    conversations,
    webLeadData,
    getTemplates,
    request,
    wishlistMatches,
    callToken,
    convoList, username, newToken, password, getText, isMobileDevice, email, products, emailTemplatesDropdown,
    // conversationsData
  }, { headers: { "Set-Cookie": await commitSession(session2), }, })
}

export const dashboardAction: ActionFunction = async ({ request, }) => {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
  console.log(formData)
  const user = await GetUser(email)  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }

  const userId = user?.id;
  const intent = formPayload.intent;
  if (intent === 'demoDayEdit') {
    const addtoWishList = await prisma.demoDay.update({
      where: {
        id: formData.id,
      },
      data: {
        userEmail: formData.userEmail,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        leadNote: formData.leadNote,
        notified: formData.notified,
      }
    })
    return addtoWishList
  }
  if (intent === 'demoDayDelete') {
    const edit = await prisma.demoDay.delete({
      where: {
        id: formData.id,
      }
    })
    return null
  }
  if (intent === 'demoDayConvert') {
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
  }
  if (intent === 'addDemoDay') {
    const addtoWishList = await prisma.demoDay.create({
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
    return addtoWishList
  }
  if (intent === 'selectBrand') {
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
  }
  if (intent === 'addWishList') {
    const addtoWishList = await prisma.wishList.create({
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
        notes: formData.notes,
      }
    })
    return addtoWishList
  }
  if (intent === "createEmailTemplate") {
    const template = await prisma.emailTemplates.create({
      data: {
        name: 'Copied from dashboard',
        body: formData.body,
        title: formData.title,
        subject: formData.subject,
        category: 'To update',
        userEmail: user.email,
        dept: 'sales',
        type: 'Text / Email',
      },
    });
    return template;
  }
  if (intent === 'editWishList') {
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
  }
  if (intent === 'wishListConvert') {
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
    /*
        const convert = await prisma.finance.create({
          data: {
            clientfileId: formData.clientfileId,
            dashboardId: formData.dashboardId,
            financeId: formData.financeId,
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
            leadSource: formData.leadSource,
          }
        })
    */

  }
  if (intent === 'deleteWishList') {
    const deleteWishList = await prisma.wishList.delete({
      where: {
        id: formData.rowId,
      },
    })
    return deleteWishList
  }
  if (intent === 'claimTurnover') {

    const update = await prisma.lockFinanceTerminals.update({
      where: {
        id: 1,
      },
      data: {
        locked: false, // or the value you need
        //financeId: formData.financeId,
      },
    });
    return update
  }
  if (intent === 'financeTurnover') {
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
  }
  if (intent === 'claimClientTurnover') {

    const update = await prisma.lockFinanceTerminals.update({
      where: { id: formData.claimId },
      data: {
        locked: false,
        financeEmail: user?.email,
      }
    })
    const finance = await prisma.finance.update({
      where: { id: formData.financeId },
      data: { financeManager: user?.email }
    })
    return json({ update, finance })
  }
  if (intent === 'responseClientTurnover') {

    const update = await prisma.lockFinanceTerminals.update({
      where: { id: formData.claimId },
      data: {
        locked: false,
        response: true,
        financeEmail: user?.email,
      }
    })
    const finance = await prisma.finance.update({
      where: { id: formData.financeId },
      data: { financeManager: user?.email }
    })
    return json({ update, finance })
  }

  if (intent === 'reading') {
    const isRead = await prisma.notificationsUser.update({
      where: {
        id: notification.id
      },
      data: {
        read: true
      }
    })
    return isRead
  }
  if (intent === 'navToFinanceFile') {
    const clientfileId = formData.clientfileId
    const getFile = await prisma.finance.findFirst({
      where: { clientfileId: clientfileId }
    })
    return redirect(`/dealer/customer/${clientfileId}/${getFile?.id}`)
  }
  const template = formPayload.template;
  const today = new Date();
  let followUpDay = today;
  const clientfileId = formData.clientfileId;
  let date = new Date().toISOString()
  const financeId = formData?.financeId;
  console.log(financeId, 'finance id from dashboard calls')
  const session66 = await sixSession(request.headers.get("Cookie"));
  session66.set("financeId", financeId);
  session66.set("clientfileId", clientfileId);
  const serializedSession = await sixCommit(session66);

  let pickUpDate;
  if (pickUpDate === null || pickUpDate === undefined) {
    pickUpDate = "To Be Det.";
  }
  const id = formData?.id;

  switch (intent) {
    case 'updateClientInfoFinance':
      const finance = await prisma.finance.update({
        where: { id: formData.financeId },
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          postal: formData.postal,
          lastContact: formData.lastContact,
          nextAppointment: formData.nextAppointment,
          deliveryDate: formData.deliveryDate,
          deliveredDate: formData.deliveredDate,
          depositMade: formData.depositMade,
          userEmail: formData.userEmail,
          financeManager: formData.financeManager,
        }
      })
      return finance
    case 'updateFinanceApp':
      const financeApp = await prisma.financeApplication.update({
        where: { id: formData.id },
        data: {
          fullName: formData.fullName,
          dob: formData.dob,
          sin: formData.sin,
          phone: formData.phone,
          email: formData.email,
          streetAddress: formData.streetAddress,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          addressDuration: formData.addressDuration,
          employer: formData.employer,
          job: formData.job,
          employmentStatus: formData.employmentStatus,
          employerAddress: formData.employerAddress,
          employerCity: formData.employerCity,
          employerPostal: formData.employerPostal,
          employerPhone: formData.employerPhone,
          employmentDuration: formData.employmentDuration,
          monthlyGrossIncome: formData.monthlyGrossIncome,
          bankName: formData.bankName,
          branchAddress: formData.branchAddress,
          mortgagePayment: formData.mortgagePayment,
          utilities: formData.utilities,
          propertyTaxes: formData.propertyTaxes,
          loanType: formData.loanType,
          loanMonthlyPayment: formData.loanMonthlyPayment,
          remainingBalance: formData.remainingBalance,
          notes: formData.notes,
        }
      })
      return financeApp;
    case 'createFinanceProduct':
      const financeProduct = await prisma.financeDeptProducts.create({
        data: {
          packageName: formData.packageName,
          packagePrice: Number(formData.packagePrice),
          financeId: formData.financeId,
        }
      })
      return financeProduct;
    case 'updateBankingInfo':
      const bankingInfo = await prisma.finance.update({
        where: { id: formData.id },
        data: {
          bank: formData.bank,
          loanNumber: formData.loanNumber,
          idVerified: formData.idVerified,
          firstPayment: formData.firstPayment,
          loanMaturity: formData.loanMaturity,
          dealerCommission: formData.dealerCommission,
          financeCommission: formData.financeCommission,
          salesCommission: formData.salesCommission,
          financeDeptProductsTotal: formData.financeDeptProductsTotal,
        }
      })
      return bankingInfo;
    case 'empty':
      return null

    default:
      console.log('default reached')
  }

  if (intent === 'newLead') {
    const brand = formData.brand
    const activixActivated = user?.activixActivated
    let { financeId, clientData, dashData, financeData } = DataForm(formData);
    if (activixActivated === 'yes') {
      await QuoteServerActivix(clientData, financeId, email, financeData, dashData)
    }
    const create = await QuoteServer(formData)
    return create
  }
  // calls
  if (intent === "EmailClient") {
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
    const to = formData.customerEmail
    const text = formData.body
    const subject = formData.subject
    const tokens = formData.tokens
    // const completeApt = await CompleteLastAppt(userId, financeId)
    const sendEmail = await SendEmail(user, to, subject, text, tokens)
    const setComs = await prisma.communicationsOverview.create({ data: comdata, });
    const saveComms = await ComsCount(financeId, 'Email')
    console.log('refreshToken',)
    return json({ sendEmail, saveComms, formData, setComs, })//, redirect(`/dummyroute`)
  }
  if (intent === 'callClient') {
    const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2'
    const authToken = 'd38e2fd884be4196d0f6feb0b970f63f'
    const client = require('twilio')(accountSid, authToken);
    const comdata = {
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
    const to = formData.customerEmail
    const text = formData.customContent
    const subject = formData.subject
    const tokens = formData.tokens
    // const completeApt = await CompleteLastAppt(userId, financeId)
    const callCLient = await client.calls
      .create({
        twiml: '<Response><Say>Ahoy, World!</Say></Response>',
        to: `+1${user.phone}`,
        from: '+12176347250'
      })
      .then(call => console.log(call.sid));
    const setComs = await prisma.communicationsOverview.create({ data: comdata, });
    const saveComms = await ComsCount(financeId, 'Email')
    console.log('refreshToken',)
    return json({ callCLient, saveComms, formData, setComs, })//, redirect(`/dummyroute`)
  }
  if (intent === 'textQuickFU') {
    console.log('hit textquick fu')
    const followUpDay3 = formData.followUpDay
    const completeApt = await CompleteLastAppt(userId, financeId)
    const doTGwoDays = await TwoDays(followUpDay3, formData, financeId, user)
    // const setComs = await CreateCommunications(comdata)
    const comdata = {
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
    const setComs = await prisma.communicationsOverview.create({
      data: comdata,
    });
    const saveComms = await ComsCount(financeId, 'SMS')
    return json({ doTGwoDays, completeApt, setComs, saveComms });
  }
  if (intent === "2DaysFromNow") {
    let customerState = formData.customerState;
    if (customerState === "Pending") {
      customerState = "Attempted";
    }
    const followUpDay2 = parseInt(formData.followUpDay1);
    console.log('followUpDay:', followUpDay2);
    function addDays(days) {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + days);
      return currentDate;
    }
    const complete = await CompleteLastAppt(userId, financeId)
    const completeApt = await CompleteLastAppt(userId, financeId)
    //-----------------------
    //  let dateModal = new Date(formData.value);
    let newDate = addDays(followUpDay2);

    date = new Date(newDate);

    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    const apptDate = date.toLocaleDateString('en-US', options)

    console.log(formData.value, date, "date info")

    const todaysDate = new Date()
    const lastContacted = todaysDate.toLocaleDateString('en-US', options)
    //---------------------
    const finance = await prisma.finance.update({
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
        lastContact: lastContacted,
        status: formData.status,
        customerState: formData.customerState,
        result: formData.result,
        timesContacted: formData.timesContacted,
        nextAppointment: apptDate,
        followUpDay: apptDate,
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
      },
    });
    const createFollowup = await prisma.clientApts.create({
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
        end: new Date(new Date(apptDate).getTime() + 45 * 60000),
        title: formData.title,
        start: String(apptDate),
        userId: user?.id,
        description: formData.description,
        resourceId: Number(formData.resourceId),
        userName: user?.name,
      }
    })
    return json({ complete, finance, completeApt, createFollowup, });
  }
  if (intent === "completeApt") {
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

  }
  if (intent === "scheduleFUp") {
    console.log(formData, 'formData')
    const lastContact = new Date().toISOString();
    let customerState = formData.customerState;
    if (customerState === "Pending") {
      customerState = "Attempted";
    }
    let dateModal = new Date(formData.value);
    const year = dateModal.getFullYear();
    const month = String(dateModal.getMonth() + 1).padStart(2, '0');
    const day = String(dateModal.getDate()).padStart(2, '0');
    const hours = formData.hours;
    const minutes = formData.minutes;
    dateModal.setHours(hours, minutes);
    const dateTimeString = `${year}-${month}-${day}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00.000`;
    const date = new Date(dateTimeString);
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    const apptDate = date.toLocaleDateString('en-US', options)
    const todaysDate = new Date()
    const completeApt = await CompleteLastAppt(userId, financeId)
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
        lastContact: todaysDate.toLocaleDateString('en-US', options),
        status: formData.status,
        customerState: formData.customerState,
        result: formData.result,
        timesContacted: formData.timesContacted,
        nextAppointment: apptDate,
        followUpDay: apptDate,
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
      },
    });
    const end = new Date(new Date(date).getTime() + 45 * 60000)
    const createFollowup = await prisma.clientApts.create({
      data: {
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        lastName: formData.lastName,
        firstName: formData.firstName,
        brand: formData.brand,
        unit: formData.unit,
        note: formData.note,
        userEmail: formData.userEmail,
        apptType: formData.apptType,
        apptStatus: formData.apptStatus,
        completed: 'no',
        contactMethod: formData.contactMethod,
        end: end,
        title: formData.title,
        start: apptDate,
        userId: user?.id,
        description: formData.description,
        resourceId: Number(formData.resourceId),
        userName: user?.name,
        financeId: formData.financeId,
      }
    })
    return json({ updating, completeApt, createFollowup, });
  }
  if (intent === "updateFinance") {
    console.log(formData, ' update finance data')

    let brand = formPayload.brand
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
    const date = new Date();

    const financeData = {
      email: formData.email,
      firstName: formData.firstName,
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
      tradeValue: formData.tradeValue,
      tradeDesc: formData.tradeDesc,
      tradeColor: formData.tradeColor,
      tradeYear: formData.tradeYear,
      tradeMake: formData.tradeMake,
      tradeVin: formData.tradeVin,
      tradeTrim: formData.tradeTrim,
      tradeMileage: formData.tradeMileage,
      bikeStatus: formData.bikeStatus,
      trim: formData.trim,
      vin: formData.vin,
      lien: formData.lien,
      userEmail: formData.userEmail,

      applicationDone: formData.applicationDone === 'on' ? date : null,
      licensingSent: formData.licensingSent === 'on' ? date : null,
      liceningDone: formData.liceningDone === 'on' ? date : null,
      cancelled: formData.cancelled === 'on' ? date : null,
      lost: formData.lost === 'on' ? date : null,
      sold: formData.sold === 'on' ? date : null,
      referral: formData.referral === 'on' ? date : null,
      visited: formData.visited === 'on' ? date : null,
      bookedApt: formData.bookedApt === 'on' ? date : null,
      aptShowed: formData.aptShowed === 'on' ? date : null,
      aptNoShowed: formData.aptNoShowed === 'on' ? date : null,
      testDrive: formData.testDrive === 'on' ? date : null,
      metService: formData.metService === 'on' ? date : null,
      metManager: formData.metManager === 'on' ? date : null,
      metParts: formData.metParts === 'on' ? date : null,
      depositMade: formData.depositMade === 'on' ? date : null,
      refund: formData.refund === 'on' ? date : null,
      turnOver: formData.turnOver === 'on' ? date : null,
      financeApp: formData.financeApp === 'on' ? date : null,
      approved: formData.approved === 'on' ? date : null,
      signed: formData.signed === 'on' ? date : null,
      pickUpSet: formData.pickUpSet === 'on' ? date : null,
      demoed: formData.demoed === 'on' ? date : null,
      delivered: formData.delivered === 'on' ? date : null,
      deliveredDate: formData.deliveredDate === 'on' ? date : null,
      docsSigned: formData.docsSigned === 'on' ? date : null,
      funded: formData.funded === 'on' ? date : null,
      seenTrade: formData.seenTrade === 'on' ? date : null,
      financeApplication: formData.financeApplication === 'on' ? date : null,
      metSalesperson: formData.metSalesperson === 'on' ? date : null,
      metFinance: formData.metFinance === 'on' ? date : null,
      signBill: formData.signBill === 'on' ? date : null,
      tradeInsp: formData.tradeInsp === 'on' ? date : null,

      lastContact: lastContact,
      status: formData.status,
      customerState: customerState,
      result: formData.result,
      timesContacted: formData.timesContacted,
      nextAppointment: formData.nextAppointment,
      completeCall: formData.completeCall,
      followUpDay: formData.followUpDay,
      state: formData.state,
      notes: formData.notes,
      visits: formData.visits,
      progress: formData.progress,
      pickUpDate: pickUpDate,
      pickUpTime: formData.pickUpTime,
      depositTakenDate: formData.depositTakenDate,
      tradeRepairs: formData.tradeRepairs,
      lastNote: formData.lastNote,
      dLCopy: formData.dLCopy,
      insCopy: formData.insCopy,
      testDrForm: formData.testDrForm,
      voidChq: formData.voidChq,
      loanOther: formData.loanOther,
      ucda: formData.ucda,
      customerWS: formData.customerWS,
      otherDocs: formData.otherDocs,
      urgentFinanceNote: formData.urgentFinanceNote,
      countsInPerson: formData.countsInPerson,
      countsPhone: formData.countsPhone,
      countsSMS: formData.countsSMS,
      countsOther: formData.countsOther,
      countsEmail: formData.countsEmail,
    }

    switch (brand) {
      case "Manitou":
        const updatingManitouFinance = await updateFinanceWithDashboard(financeId, financeData, dashData);
        return json({ updatingManitouFinance });
      case "Switch":
        const updatingSwitchFinance = await updateFinanceWithDashboard(financeId, financeData, dashData);
        return json({ updatingSwitchFinance });
      case "BMW-Motorrad":
        const updatingBMWMotoFinance = await updateFinanceWithDashboard(financeId, financeData, dashData);
        return json({ updatingBMWMotoFinance });
      default:
        try {
          // Update the finance record
          const finance = await prisma.finance.update({
            where: {
              id: financeId,
            },
            data: {
              ...financeData,
            },
          });
          return { finance };
        } catch (error) {
          console.error("An error occurred while updating the records:", error);
          throw error;  // re-throw the error so it can be handled by the caller
        }
    }
  }
  if (intent === "updateFinanceWanted") {
    const financeData = {
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
      //  leadSource: formData.leadSource,
      // InPerson: formData.InPerson,
      // Phone: formData.Phone,
      // SMS: formData.SMS,
      // Email: formData.Email,
      // Other: formData.Other,
    }
    const fullName = user.username;
    const words = fullName.split(' ');
    const firstName = words[0];
    const lastName = words[1];

    const updateLocal = await prisma.finance.update({
      where: { id: formData.financeId },
      data: { ...financeData, }
    })

    return json({ updateLocal })
  }
  if (intent === "createQuote") {
    console.log("creating quote");
    const brand = formData.brand;
    const financeId = formData.id;
    return redirect(`/quote/${brand}/${financeId}`);
  }
  if (intent === "updateStatus") {
    delete formData.brand;
    //console.log(formData)
    const dashboard = await prisma.finance.update({
      where: {
        id: formData.id, // Assuming the financeId is also the id of the dashboard
      },
      data: {
        status: formData.status,
      }
    });
    return json({ dashboard });
  }
  if (intent === "clientProfile") {

    console.log(clientfileId, financeId, 'dashboard calls')
    return redirect(`/customer/${clientfileId}/${financeId}`, {
      headers: {
        "Set-Cookie": serializedSession,
      },
    });
  }
  if (intent === "returnToQuote") {
    const brand = formData.brand;
    const id = formData.id;
    //   console.log(id, 'id', `/overview/${brand}/${id}`)
    return redirect(`/overview/customer/${financeId}`);
  }
  if (intent === "addAppt") {
    CreateAppt(formData);
    const completeCall = CompleteLastAppt(userId, financeId);
    return CreateAppt;
  }
  if (intent === "deleteApt") {
    const newFormData = { ...formData };
    delete newFormData.intent;
    const deleteNote = await deleteFinanceAppts(newFormData);
    return json({ deleteNote });
  }
  if (intent === "updateFinanceAppt") {
    const apptId = formData.id;
    const updateApt = await UpdateAppt(formData, apptId);
    return json({ updateApt });
  }
  if (intent === "AddCustomer") {
    const create = await QuoteServer(formData)
    return create
  }
  if (intent === "deleteCustomer") {
    await DeleteCustomer({ formData, formPayload });
    return DeleteCustomer;
  }
  if (intent === "saveFinanceNote") {
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
  }
  if (intent === "updateFinanceNote") {
    const updateNote = await updateFinanceNote(financeId, formData);
    return json({ updateNote });
  }
  if (intent === "deleteFinanceNote") {
    const deleteNote = await deleteFinanceNote(id);
    return json({ deleteNote });
  }
  return null;
};
