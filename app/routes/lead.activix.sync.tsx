import { type LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { prisma } from "~/libs";
import { getSession } from '~/sessions/auth-session.server';
import { CreateLeadActivix, UpdateLead } from "./api.activix";


const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"
async function CallActi() {
  try {

    const response = await axios.get(`https://api.crm.activix.ca/v2/leads?include[]=emails&include[]=phones&include[]=vehicles`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
    });

    return response.data; // Return response data directly
  } catch (error) {
    console.error('Full error object:', error);
    console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
    console.error(`Error status: ${error.response.status}`);
    console.error('Error response:', error.response.data);
    throw error; // Throw error to be caught by the caller
  }
}


async function synchronizeDataWithActivix(user) {
  const errors = []; // Array to store errors

  try {
    const activixData = await CallActi();
    if (!activixData || !activixData.data) {
      throw new Error("Failed to fetch ActivixData or missing data");
    }

    for (const data of activixData.data) {
      if (!data || !data.emails || data.emails.length === 0 || !data.emails[0].address) {
        const error = `Record with id ${data?.id} does not have an email address. Skipping...`;
        console.log(error);
        errors.push(error); // Store the error in the array
        continue;
      }

      const existsInDatabase = await checkFieldInDatabase(data.id);
      console.log('Syncing to local database...');

      try {
        if (existsInDatabase) {
          await updateRecordInDatabase(data, user);
        } else {
          await createRecordInDatabase(data, user);
        }

        const localList = await prisma.finance.findMany({ where: { userEmail: user.email } });

        // Match data.id to localList.activixId to decide whether to update or create in the external API
        const match = localList.find(localItem => localItem.activixId === data.id.toString());

        console.log('Syncing to external API...');

        if (match) {
          await updateRecordInExternalAPI(match, user);
        } else {
          await createRecordInExternalAPI(data, user);
        }
      } catch (error) {
        console.error('Error synchronizing data:', error);
        errors.push(error); // Store the error in the array
      }
    }

    console.log('Data synchronization complete.');

    // Log all errors at the end
    if (errors.length > 0) {
      console.error('Errors during synchronization:', errors);
    }
  } catch (error) {
    console.error('Error synchronizing data:', error);
    errors.push(error); // Store the error in the array
    throw error;
  }
}


export async function loader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      subscriptionId: true,
      customerId: true,
      returning: true,
      phone: true,
      dealer: true,
      position: true,
      roleId: true,
      profileId: true,
      omvicNumber: true,
      role: { select: { symbol: true, name: true } },
    },
  });
  if (!user) { redirect('/login'); }
  await synchronizeDataWithActivix(user);
  return redirect('/leads/activix')
}

async function checkFieldInDatabase(id) {
  const record = await prisma.finance.findFirst({ where: { activixId: id.toString(), }, });
  return !!record;
}
async function updateRecordInDatabase(data, user) {
  const formData = data
  try {
    const financeData = await prisma.finance.update({
      where: { activixId: formData.id.toString() },
      data: {
        firstName: formData.first_name,
        lastName: formData.last_name,
        name: formData.first_name + ' ' + formData.last_name,
        email: formData.emails[0].address,
        phone: formData.phones[0].number,
        address: formData.address_line1,
        city: formData.city,
        postal: formData.postal_code,
        province: formData.province,
        year: formData.vehicles[1].year,
        brand: formData.vehicles[1].make,
        model: formData.vehicles[1].model,
        model1: formData.model1,
        color: formData.vehicles[1].color_exterior,
        modelCode: formData.modelCode,
        msrp: formData.vehicles[1].price,
        userEmail: user?.email,
        tradeValue: formData.vehicles[0].price,
        tradeDesc: formData.vehicles[0].model,
        tradeColor: formData.vehicles[0].color_exterior,
        tradeYear: formData.vehicles[0].year,
        tradeMake: formData.vehicles[0].make,
        tradeVin: formData.vehicles[0].vin,
        tradeTrim: formData.vehicles[0].trim,
        tradeMileage: formData.vehicles[0].odometer,
        trim: formData.vehicles[1].trim,
        vin: formData.vehicles[1].vin,
        activixId: data.id.toString(),
      }
    })
    const dashboardData = await prisma.dashboard.update({
      where: { financeId: financeData.id },
      data: {
        userEmail: user?.email,
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
        status: 'Active',
        customerState: 'Attempted',
        result: formData.result,
        timesContacted: formData.timesContacted,
        nextAppointment: formData.nextAppointment,
        completeCall: formData.completeCall,
        followUpDay: formData.followUpDay,
        state: formData.state,
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
        countsInPerson: formData.countsInPerson,
        countsPhone: formData.countsPhone,
        countsSMS: formData.countsSMS,
        countsOther: formData.countsOther,
        countsEmail: formData.countsEmail,
      }
    })
    const activixData = await prisma.activixLead.update({
      where: { activixId: financeData.activixId },
      data: {
        actvixId: data.id.toString(),
        account_id: data.account_id.toString(),
        customer_id: data.customer_id.toString(),
        appointment_date: data.appointment_date,
        phone_appointment_date: data.phone_appointment_date,
        available_date: data.available_date,
        be_back_date: data.be_back_date,
        call_date: data.call_date,
        created_at: data.created_at,
        csi_date: data.csi_date,
        delivered_date: data.delivered_date,
        deliverable_date: data.deliverable_date,
        delivery_date: data.delivery_date,
        paperwork_date: data.paperwork_date,
        presented_date: data.presented_date,
        //   promised_date: data.promised_date,
        financed_date: data.financed_date,
        road_test_date: data.road_test_date,
        home_road_test_date: data.home_road_test_date,
        sale_date: data.sale_date,
        updated_at: data.updated_at,
        address_line1: data.address_line1,
        city: data.city,
        civility: data.civility,
        country: data.country,
        credit_approved: data.credit_approved ? data.credit_approved.toString() : null,
        dealer_tour: data.creditdealer_tour_approved ? data.dealer_tour.toString() : null,
        financial_institution: data.financial_institution,
        first_name: data.first_name,
        funded: data.funded ? data.funded.toString() : null,
        inspected: data.inspected ? data.inspected.toString() : null,
        last_name: data.last_name,
        postal_code: data.postal_code,
        province: data.province,
        result: data.result,
        status: data.status,
        type: data.type,
        walk_around: data.walk_around ? data.walk_around.toString() : null,
        comment: data.comment,
        delivered_by: data.delivered_by,
        emails: data.emails[0].address,
        phones: data.phones[0].number,
        financeId: data.financeId,
        userEmail: user?.email,

        /**home_presented_date: data.home_presented_date,
         birth_date: data.birth_date,
         source_id: data.source_id,
         Integer: data.Integer,
         provider_id: data.provider_id,
         unsubscribe_all_date: data.unsubscribe_all_date,
         unsubscribe_call_date: data.unsubscribe_call_date,
         unsubscribe_email_date: data.unsubscribe_email_date,
         unsubscribe_sms_date: data.unsubscribe_sms_date,
         advisor: data.advisor,
         take_over_date: data.take_over_date,
         search_term: data.search_term,
         gender: data.gender,
         form: data.form,
         division: data.division,
         created_method: data.created_method,
         campaign: data.campaign,
         address_line2: data.address_line2,
         business: data.business,
         business_name: data.business_name,
         second_contact: data.second_contact,
         second_contact_civility: data.second_contact_civility,
         segment: data.segment,
         source: data.source,
         qualification: data.qualification,
         rating: data.rating,
         referrer: data.referrer,
         provider: data.provider,
         progress_state: data.progress_state,
         locale: data.locale,
         navigation_history: data.navigation_history,
         keyword: data.keyword,*/



      }
    })
    await prisma.finance.update({
      where: { id: financeData.id },
      data: {
        dashboardId: dashboardData.id,
        financeId: financeData.id,
        theRealActId: activixData.id,
      }
    })
    console.log(financeData, activixData, dashboardData)
    return { financeData, activixData, dashboardData };
  } catch (error) {
    console.error('Error:', error);
  } finally {
    console.log("This code always runs, regardless of whether there was an error or not.");
  }
  return user;
}
async function createRecordInDatabase(data, user) {
  const formData = data

  try {
    console.log(`Record with id ${data.id} does not exist in the finance database`);
    const formData = data;
    console.log(formData, 'formdata')
    const nameParts = user.username.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    console.log(formData, 'formdata')
    try {
      let clientFile = await prisma.clientfile.findUnique({ where: { email: formData.emails[0].address } })
      if (!clientFile) {
        clientFile = await prisma.clientfile.create({
          data: {
            userId: user?.id,
            firstName: formData.first_name,
            lastName: formData.last_name,
            name: formData.first_name + ' ' + formData.last_name,
            email: formData.emails[0].address,
            phone: formData.phones[0].number,
            address: formData.address_line1,
            city: formData.city,
            postal: formData.postal_code,
            province: formData.province,
          }
        })

      }
      const financeData = await prisma.finance.create({
        data: {
          firstName: formData.first_name,
          lastName: formData.last_name,
          name: formData.first_name + ' ' + formData.last_name,
          email: formData.emails[0].address,
          phone: formData.phones[0].number,
          address: formData.address_line1,
          city: formData.city,
          postal: formData.postal_code,
          province: formData.province,
          year: formData.vehicles[1].year,
          brand: formData.vehicles[1].make,
          model: formData.vehicles[1].model,
          model1: formData.model1,
          color: formData.vehicles[1].color_exterior,
          modelCode: formData.modelCode,
          msrp: formData.vehicles[1].price,
          userEmail: user?.email,
          tradeValue: formData.vehicles[0].price,
          tradeDesc: formData.vehicles[0].model,
          tradeColor: formData.vehicles[0].color_exterior,
          tradeYear: formData.vehicles[0].year,
          tradeMake: formData.vehicles[0].make,
          tradeVin: formData.vehicles[0].vin,
          tradeTrim: formData.vehicles[0].trim,
          tradeMileage: formData.vehicles[0].odometer,
          trim: formData.vehicles[1].trim,
          vin: formData.vehicles[1].vin,
          activixId: data.id.toString(),

        }
      })
      const dashboardData = await prisma.dashboard.create({
        data: {
          clientfileId: clientFile.id,
          financeId: financeData.id,
          userEmail: user?.email,
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
          status: 'Active',
          customerState: 'Attempted',
          result: formData.result,
          timesContacted: formData.timesContacted,
          nextAppointment: formData.nextAppointment,
          completeCall: formData.completeCall,
          followUpDay: formData.followUpDay,
          state: formData.state,
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
          countsInPerson: formData.countsInPerson,
          countsPhone: formData.countsPhone,
          countsSMS: formData.countsSMS,
          countsOther: formData.countsOther,
          countsEmail: formData.countsEmail,
        }
      })
      const activixData = await prisma.activixLead.create({
        data: {
          actvixId: data.id.toString(),
          account_id: data.account_id.toString(),
          customer_id: data.customer_id.toString(),
          appointment_date: data.appointment_date,
          phone_appointment_date: data.phone_appointment_date,
          available_date: data.available_date,
          be_back_date: data.be_back_date,
          call_date: data.call_date,
          created_at: data.created_at,
          csi_date: data.csi_date,
          delivered_date: data.delivered_date,
          deliverable_date: data.deliverable_date,
          delivery_date: data.delivery_date,
          paperwork_date: data.paperwork_date,
          presented_date: data.presented_date,
          //   promised_date: data.promised_date,
          financed_date: data.financed_date,
          road_test_date: data.road_test_date,
          home_road_test_date: data.home_road_test_date,
          sale_date: data.sale_date,
          updated_at: data.updated_at,
          address_line1: data.address_line1,
          city: data.city,
          civility: data.civility,
          country: data.country,
          credit_approved: data.credit_approved ? data.credit_approved.toString() : null,
          dealer_tour: data.creditdealer_tour_approved ? data.dealer_tour.toString() : null,
          financial_institution: data.financial_institution,
          first_name: data.first_name,
          funded: data.funded ? data.funded.toString() : null,
          inspected: data.inspected ? data.inspected.toString() : null,
          last_name: data.last_name,
          postal_code: data.postal_code,
          province: data.province,
          result: data.result,
          status: data.status,
          type: data.type,
          walk_around: data.walk_around ? data.walk_around.toString() : null,
          comment: data.comment,
          delivered_by: data.delivered_by,
          emails: data.emails[0].address,
          phones: data.phones[0].number,
          financeId: data.financeId,
          userEmail: user?.email,

          /**home_presented_date: data.home_presented_date,
           birth_date: data.birth_date,
           source_id: data.source_id,
           Integer: data.Integer,
           provider_id: data.provider_id,
           unsubscribe_all_date: data.unsubscribe_all_date,
           unsubscribe_call_date: data.unsubscribe_call_date,
           unsubscribe_email_date: data.unsubscribe_email_date,
           unsubscribe_sms_date: data.unsubscribe_sms_date,
           advisor: data.advisor,
           take_over_date: data.take_over_date,
           search_term: data.search_term,
           gender: data.gender,
           form: data.form,
           division: data.division,
           created_method: data.created_method,
           campaign: data.campaign,
           address_line2: data.address_line2,
           business: data.business,
           business_name: data.business_name,
           second_contact: data.second_contact,
           second_contact_civility: data.second_contact_civility,
           segment: data.segment,
           source: data.source,
           qualification: data.qualification,
           rating: data.rating,
           referrer: data.referrer,
           provider: data.provider,
           progress_state: data.progress_state,
           locale: data.locale,
           navigation_history: data.navigation_history,
           keyword: data.keyword,*/



        }
      })
      await prisma.finance.update({
        where: { id: financeData.id },
        data: {
          dashboardId: dashboardData.id,
          clientfileId: clientFile.id,
          financeId: financeData.id,
          theRealActId: activixData.id,
        }
      })
      console.log(financeData, activixData, dashboardData)
      return { financeData, activixData, dashboardData };
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      // Any cleanup or final actions can be placed here
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function updateRecordInExternalAPI(data, user) {
  const finance = data
  const updateData = await UpdateLead(finance)
  return updateData
}
async function createRecordInExternalAPI(data, user) {
  const finance = data
  const updateData = await CreateLeadActivix(finance, user)
  return updateData
}

/**
 *
 *
 * async function SyncExport(user, data) {

  // Fetch local finance records for the user
  const localCustomerList = await prisma.finance.findMany({ where: { userEmail: user.email, activixId: null } });


  // Process each lead from the Activix API
  const updatePromises = [];
  for (const activixData of data) {
    console.log(activixData, data.data, 'actvix data in export')
    const activixId = activixData.id;
    let isMatchFound = false;

    // Check if there's a matching finance record in localCustomerList
    for (const finance of localCustomerList) {
      const financeActiId = parseInt(finance.activixId);
      if (activixId === financeActiId) {
        isMatchFound = true;
        console.log(`Updated finance record for Activix ID: ${activixData.id}`);
        updatePromises.push(UpdateLead(finance)); // Assuming UpdateLead function updates the lead
        break;
      }
    }

    // If no match is found, create a new lead record
    if (!isMatchFound) {
      console.log(`No match found for Activix ID: ${activixData.id}`);
      console.log(`Created finance record for Activix ID: ${activixData.id}`);
      updatePromises.push(CreateLeadActivix(activixData, user)); // Assuming CreateLeadActivix function creates a new lead
    }
    return redirect('/leads/activix')
  }

  // Wait for all update promises to resolve
  await Promise.all(updatePromises);
}

async function ActivixImport(user) {

  // sync import
  const activixData = await CallActi();
  if (!activixData || !activixData.data) {
    throw new Error("Failed to fetch ActivixData or missing data");
  }
  const dataObjects = activixData.data;
  for (const data of dataObjects) {
    if (!data.emails || data.emails.length === 0 || !data.emails[0].address) {
      console.log(`Record with id ${data.id} does not have an email address. Skipping...`);
      continue;
    }

    const existsInDatabase = await checkFieldInDatabase(data.id)

    if (!existsInDatabase) {
      // Perform creation logic only if the record does not exist in the database
      console.log(`Record with id ${data.id} does not exist in the finance database`);
      const formData = data;
      const nameParts = user.username.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      console.log(formData, 'formdata')
      async function CreateActvix() {
        try {
          let clientFile = await prisma.clientfile.findUnique({ where: { email: formData.emails[0].address } })
          if (!clientFile) {
            clientFile = await prisma.clientfile.create({
              data: {
                userId: user?.id,
                firstName: formData.first_name,
                lastName: formData.last_name,
                name: formData.first_name + ' ' + formData.last_name,
                email: formData.emails[0].address,
                phone: formData.phones[0].number,
                address: formData.address_line1,
                city: formData.city,
                postal: formData.postal_code,
                province: formData.province,
              }
            })

          }
          const financeData = await prisma.finance.create({
            data: {
              firstName: formData.first_name,
              lastName: formData.last_name,
              name: formData.first_name + ' ' + formData.last_name,
              email: formData.emails[0].address,
              phone: formData.phones[0].number,
              address: formData.address_line1,
              city: formData.city,
              postal: formData.postal_code,
              province: formData.province,
              year: formData.vehicle[0].year,
              brand: formData.vehicle[0].make,
              model: formData.vehicle[0].model,
              model1: formData.model1,
              color: formData.vehicle[0].color_exterior,
              modelCode: formData.modelCode,
              msrp: formData.vehicle[0].price,
              userEmail: user?.email,
              tradeValue: formData.vehicle[1].price,
              tradeDesc: formData.vehicle[1].model,
              tradeColor: formData.vehicle[1].color_exterior,
              tradeYear: formData.vehicle[1].year,
              tradeMake: formData.vehicle[1].make,
              tradeVin: formData.vehicle[1].vin,
              tradeTrim: formData.vehicle[1].trim,
              tradeMileage: formData.vehicle[1].odometer,
              trim: formData.vehicle[0].trim,
              vin: formData.vehicle[0].vin,
            }
          })
          const dashboardData = await prisma.dashboard.create({
            data: {
              userEmail: user?.email,
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
              status: 'Active',
              customerState: 'Attempted',
              result: formData.result,
              timesContacted: formData.timesContacted,
              nextAppointment: formData.nextAppointment,
              completeCall: formData.completeCall,
              followUpDay: formData.followUpDay,
              state: formData.state,
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
              countsInPerson: formData.countsInPerson,
              countsPhone: formData.countsPhone,
              countsSMS: formData.countsSMS,
              countsOther: formData.countsOther,
              countsEmail: formData.countsEmail,
            }
          })
          const activixData = await prisma.activixLead.create({
            data: {
              actvixId: data.id.toString(),
              account_id: data.account_id.toString(),
              customer_id: data.customer_id.toString(),
              appointment_date: data.appointment_date,
              phone_appointment_date: data.phone_appointment_date,
              available_date: data.available_date,
              be_back_date: data.be_back_date,
              call_date: data.call_date,
              created_at: data.created_at,
              csi_date: data.csi_date,
              delivered_date: data.delivered_date,
              deliverable_date: data.deliverable_date,
              delivery_date: data.delivery_date,
              paperwork_date: data.paperwork_date,
              presented_date: data.presented_date,
              //  promised_date: data.promised_date,
              financed_date: data.financed_date,
              road_test_date: data.road_test_date,
              home_road_test_date: data.home_road_test_date,
              sale_date: data.sale_date,
              updated_at: data.updated_at,
              address_line1: data.address,
              city: data.city,
              civility: data.civility,
              country: data.country,
              credit_approved: data.credit_approved ? data.credit_approved.toString() : null,
              dealer_tour: data.creditdealer_tour_approved ? data.dealer_tour.toString() : null,
              financial_institution: data.financial_institution,
              first_name: data.firstName,
              funded: data.funded ? data.funded.toString() : null,
              inspected: data.inspected ? data.inspected.toString() : null,
              last_name: data.lastName,
              postal_code: data.postal,
              province: data.province,
              result: data.result,
              status: data.status,
              type: data.type,
              walk_around: data.walk_around ? data.walk_around.toString() : null,
              comment: data.comment,
              delivered_by: data.delivered_by,
              emails: data.email,
              phones: data.phone,
              financeId: data.financeId,
              userEmail: user?.email,

              /**home_presented_date: data.home_presented_date,
               birth_date: data.birth_date,
               source_id: data.source_id,
               Integer: data.Integer,
               provider_id: data.provider_id,
               unsubscribe_all_date: data.unsubscribe_all_date,
               unsubscribe_call_date: data.unsubscribe_call_date,
               unsubscribe_email_date: data.unsubscribe_email_date,
               unsubscribe_sms_date: data.unsubscribe_sms_date,
               advisor: data.advisor,
               take_over_date: data.take_over_date,
               search_term: data.search_term,
               gender: data.gender,
               form: data.form,
               division: data.division,
               created_method: data.created_method,
               campaign: data.campaign,
               address_line2: data.address_line2,
               business: data.business,
               business_name: data.business_name,
               second_contact: data.second_contact,
               second_contact_civility: data.second_contact_civility,
               segment: data.segment,
               source: data.source,
               qualification: data.qualification,
               rating: data.rating,
               referrer: data.referrer,
               provider: data.provider,
               progress_state: data.progress_state,
               locale: data.locale,
               navigation_history: data.navigation_history,
               keyword: data.keyword,



              }
            })
            await prisma.finance.update({
              where: { id: financeData.id },
              data: {
                clientfileId: clientFile.id,
                dashboardId: dashboardData.id,
                financeId: financeData.id,
                theRealActId: activixData.id,
              }
            })


            // Returning the relevant data
            console.log(financeData, activixData, dashboardData)
            return { financeData, activixData, dashboardData };
          } catch (error) {
            // Handle errors here
            console.error(error);
            throw error; // rethrow the error for handling at a higher level if needed
          }
        }
        CreateActvix()
      }
      else {
        // Perform creation logic only if the record does not exist in the database
        console.log(`Record with id ${data.id} does not exist in the finance database`);
        const formData = data;
        const nameParts = user.username.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        console.log(formData, 'formdata')
        async function UpdateACtvix() {
          try {

            const financeData = await prisma.finance.update({
              where: { activixId: formData.id },
              data: {
                firstName: formData.first_name,
                lastName: formData.last_name,
                name: formData.first_name + ' ' + formData.last_name,
                email: formData.emails[0].address,
                phone: formData.phones[0].number,
                address: formData.address_line1,
                city: formData.city,
                postal: formData.postal_code,
                province: formData.province,
                year: formData.vehicle[0].year,
                brand: formData.vehicle[0].make,
                model: formData.vehicle[0].model,
                model1: formData.model1,
                color: formData.vehicle[0].color_exterior,
                modelCode: formData.modelCode,
                msrp: formData.vehicle[0].price,
                userEmail: user?.email,
                tradeValue: formData.vehicle[1].price,
                tradeDesc: formData.vehicle[1].model,
                tradeColor: formData.vehicle[1].color_exterior,
                tradeYear: formData.vehicle[1].year,
                tradeMake: formData.vehicle[1].make,
                tradeVin: formData.vehicle[1].vin,
                tradeTrim: formData.vehicle[1].trim,
                tradeMileage: formData.vehicle[1].odometer,
                trim: formData.vehicle[0].trim,
                vin: formData.vehicle[0].vin,
              }
            })
            const dashboardData = await prisma.dashboard.update({
              where: { id: financeData.id },
              data: {
                userEmail: user?.email,
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
                status: 'Active',
                customerState: 'Attempted',
                result: formData.result,
                timesContacted: formData.timesContacted,
                nextAppointment: formData.nextAppointment,
                completeCall: formData.completeCall,
                followUpDay: formData.followUpDay,
                state: formData.state,
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
                countsInPerson: formData.countsInPerson,
                countsPhone: formData.countsPhone,
                countsSMS: formData.countsSMS,
                countsOther: formData.countsOther,
                countsEmail: formData.countsEmail,
              }
            })
            const activixData = await prisma.activixLead.update({
              where: { id: formData.id },
              data: {
                financeId: financeData.financeId,
                dashboardData: data.dashboardData,

                clientfileId: financeData.financeId,
                actvixId: data.id.toString(),
                account_id: data.account_id.toString(),
                customer_id: data.customer_id.toString(),
                appointment_date: data.appointment_date,
                phone_appointment_date: data.phone_appointment_date,
                available_date: data.available_date,
                be_back_date: data.be_back_date,
                call_date: data.call_date,
                created_at: data.created_at,
                csi_date: data.csi_date,
                delivered_date: data.delivered_date,
                deliverable_date: data.deliverable_date,
                delivery_date: data.delivery_date,
                paperwork_date: data.paperwork_date,
                presented_date: data.presented_date,
                //  promised_date: data.promised_date,
                financed_date: data.financed_date,
                road_test_date: data.road_test_date,
                home_road_test_date: data.home_road_test_date,
                sale_date: data.sale_date,
                updated_at: data.updated_at,
                address_line1: data.address,
                city: data.city,
                civility: data.civility,
                country: data.country,
                credit_approved: data.credit_approved ? data.credit_approved.toString() : null,
                dealer_tour: data.creditdealer_tour_approved ? data.dealer_tour.toString() : null,
                financial_institution: data.financial_institution,
                first_name: data.firstName,
                funded: data.funded ? data.funded.toString() : null,
                inspected: data.inspected ? data.inspected.toString() : null,
                last_name: data.lastName,
                postal_code: data.postal,
                province: data.province,
                result: data.result,
                status: data.status,
                type: data.type,
                walk_around: data.walk_around ? data.walk_around.toString() : null,
                comment: data.comment,
                delivered_by: data.delivered_by,
                emails: data.email,
                phones: data.phone,
                financeId: data.financeId,
                userEmail: user?.email,

                /**home_presented_date: data.home_presented_date,
                 birth_date: data.birth_date,
                 source_id: data.source_id,
                 Integer: data.Integer,
                 provider_id: data.provider_id,
                 unsubscribe_all_date: data.unsubscribe_all_date,
                 unsubscribe_call_date: data.unsubscribe_call_date,
                 unsubscribe_email_date: data.unsubscribe_email_date,
                 unsubscribe_sms_date: data.unsubscribe_sms_date,
                 advisor: data.advisor,
                 take_over_date: data.take_over_date,
                 search_term: data.search_term,
                 gender: data.gender,
                 form: data.form,
                 division: data.division,
                 created_method: data.created_method,
                 campaign: data.campaign,
                 address_line2: data.address_line2,
                 business: data.business,
                 business_name: data.business_name,
                 second_contact: data.second_contact,
                 second_contact_civility: data.second_contact_civility,
                 segment: data.segment,
                 source: data.source,
                 qualification: data.qualification,
                 rating: data.rating,
                 referrer: data.referrer,
                 provider: data.provider,
                 progress_state: data.progress_state,
                 locale: data.locale,
                 navigation_history: data.navigation_history,
                 keyword: data.keyword,



              }
            })
            await prisma.finance.update({
              where: { id: financeData.id },
              data: {
                dashboardId: dashboardData.id,
                financeId: financeData.id,
                theRealActId: activixData.id,
              }
            })


            // Returning the relevant data
            console.log(financeData, activixData, dashboardData)
            return { financeData, activixData, dashboardData };
          }
          catch (error) {
            // Handle errors here
            console.error(error);
            throw error; // rethrow the error for handling at a higher level if needed
          }
        }
      }
      async function checkFieldInDatabase(id) {
        const record = await prisma.finance.findFirst({
          where: {
            theRealActId: id.toString(),
          },
        });
        return !!record; // Return true if the record exists, false otherwise
      }
    }
  }export default function Activixtest() {
  const { activixData } = useLoaderData();
  if (!activixData || !activixData.data || !Array.isArray(activixData.data)) { return <p>No data available</p>; }
  return (
    <div className='text-white bg-black'>
      <h1>Activix Data</h1>
      <div className='w-[90%] mt-[25px]'>
        <ul>
          {activixData.data.map((lead, index) => (
            <li key={index} className='grid grid-cols-4 mb-5 mx-auto'>
              <div>
                <p>{lead.first_name} {lead.last_name}</p>
                <hr className="solid" />
              </div>
              <p>ID: {lead.id}</p>
              <p>Name: {lead.name}</p>
              <p>Email: {lead.email}</p>
              <p>id: {lead.id}</p>
              <p>account_id: {lead.account_id}</p>
              <p>customer_id: {lead.customer_id}</p>
              <p>source_id: {lead.source_id}</p>
              <p>provider_id: {lead.provider_id}</p>
              <p>appointment_date: {lead.appointment_date}</p>
              <p>appointment_event_id: {lead.appointment_event_id}</p>
              <p>phone_appointment_date: {lead.phone_appointment_date}</p>
              <p>available_date: {lead.available_date}</p>
              <p>be_back_date: {lead.be_back_date}</p>
              <p>birth_date: {lead.birth_date}</p>
              <p>call_date: {lead.call_date}</p>
              <p>created_at: {lead.created_at}</p>
              <p>csi_date: {lead.csi_date}</p>
              <p>deliverable_date: {lead.deliverable_date}</p>
              <p>delivered_date: {lead.delivered_date}</p>
              <p>delivery_date: {lead.delivery_date}</p>
              <p>funded: {lead.funded}</p>
              <p>end_service_date: {lead.end_service_date}</p>
              <p>home_presented_date: {lead.home_presented_date}</p>
              <p>last_visit_date: {lead.last_visit_date}</p>
              <p>next_visit_date: {lead.next_visit_date}</p>
              <p>open_work_order_date: {lead.open_work_order_date}</p>
              <p>paperwork_date: {lead.paperwork_date}</p>
              <p>planned_pick_up_date: {lead.planned_pick_up_date}</p>
              <p>presented_date: {lead.presented_date}</p>
              <p>promised_date: {lead.promised_date}</p>
              <p>refinanced_date: {lead.refinanced_date}</p>
              <p>repair_date: {lead.repair_date}</p>
              <p>road_test_date: {lead.road_test_date}</p>
              <p>home_road_test_date: {lead.home_road_test_date}</p>
              <p>sale_date: {lead.sale_date}</p>
              <p>take_over_date: {lead.take_over_date}</p>
              <p>unsubscribe_all_date: {lead.unsubscribe_all_date}</p>
              <p>unsubscribe_call_date: {lead.unsubscribe_call_date}</p>
              <p>unsubscribe_email_date: {lead.unsubscribe_email_date}</p>
              <p>unsubscribe_sms_date: {lead.unsubscribe_sms_date}</p>
              <p>updated_at: {lead.updated_at}</p>
              <p>work_order_closure_date: {lead.work_order_closure_date}</p>
              <p>work_order_partial_closure_date: {lead.work_order_partial_closure_date}</p>
              <p>address_line1: {lead.address_line1}</p>
              <p>address_line2: {lead.address_line2}</p>
              <p>credit_approved: {lead.credit_approved}</p>
              <p>average_spending: {lead.average_spending}</p>
              <p>business: {lead.business}</p>
              <p>business_name: {lead.business_name}</p>
              <p>city: {lead.city}</p>
              <p>civility: {lead.civility}</p>
              <p>code: {lead.code}</p>
              <p>comment: {lead.comment}</p>
              <p>country: {lead.country}</p>
              <p>created_method: {lead.created_method}</p>
              <p>dealer_tour: {lead.dealer_tour}</p>
              <p>division: {lead.division}</p>
              <p>financial_institution: {lead.financial_institution}</p>
              <p>first_name: {lead.first_name}</p>
              <p>gender: {lead.gender}</p>
              <p>inspected: {lead.inspected}</p>
              <p>invoiced: {lead.invoiced}</p>
              <p>last_name: {lead.last_name}</p>
              <p>locale: {lead.locale}</p>
              <p>loyalty: {lead.loyalty}</p>
              <p>odometer_last_visit: {lead.odometer_last_visit}</p>
              <p>postal_code: {lead.postal_code}</p>
              <p>prepaid: {lead.prepaid}</p>
              <p>prepared: {lead.prepared}</p>
              <p>province: {lead.province}</p>
              <p>qualification: {lead.qualification}</p>
              <p>rating: {lead.rating}</p>
              <p>reached_client: {lead.reached_client}</p>
              <p>repair_order: {lead.repair_order}</p>
              <p>result: {lead.result}</p>
              <p>second_contact: {lead.second_contact}</p>
              <p>second_contact_civility: {lead.second_contact_civility}</p>
              <p>segment: {lead.segment}</p>
              <p>service_cleaned: {lead.service_cleaned}</p>
              <p>service_interval_km: {lead.service_interval_km}</p>
              <p>service_monthly_km: {lead.service_monthly_km}</p>
              <p>source: {lead.source}</p>
              <p>progress_state: {lead.progress_state}</p>
              <p>status: {lead.status}</p>
              <p>storage: {lead.storage}</p>
              <p>type: {lead.type}</p>
              <p>walk_around: {lead.walk_around}</p>
              <p>work_order: {lead.work_order}</p>
              <p>referrer: {lead.referrer}</p>
              <p>search_term: {lead.search_term}</p>
              <p>keyword: {lead.keyword}</p>
              <p>navigation_history: {lead.navigation_history || 'N/A'}</p>
              <p>campaign: {lead.campaign || 'N/A'}</p>
              <p>response_time: {lead.response_time || 'N/A'}</p>
              <p>first_update_time: {lead.first_update_time || 'N/A'}</p>
              <p>customer: {lead.customer ? lead.customer.someField : 'N/A'}</p>
              <p>emails: {lead.emails[0].address ? lead.emails.join(', ') : 'N/A'}</p>
              <p>phones: {lead.phones[0].number ? lead.phones.join(', ') : 'N/A'}</p>

              </li>
              ))}
            </ul>
          </div>

        </div>
      );
    }
     */
