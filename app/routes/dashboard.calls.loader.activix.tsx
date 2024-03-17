import { json, type LoaderFunction } from '@remix-run/node'
import { prisma } from '~/libs';
import { getSession } from "~/sessions/auth-session.server";
import { model } from '~/models'
import { env } from 'process';
import axios from 'axios';

export async function loader({ request, params }: LoaderFunction) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


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
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  await SyncLeadData()
  const dataSet = await GetMergedActivix(email);

  // console.log('dataSet', dataSet)
  return json({ dataSet })
}

export async function GetMergedActivix(userEmail) {
  try {
    const financeData = await prisma.finance.findMany({
      where: {
        userEmail: {
          equals: userEmail,
        },
      },
    });
    ///  console.log('financeData:', financeData); // Debugging line

    const dashData = await prisma.dashboard.findMany({
      where: {
        userEmail: {
          equals: userEmail,
        },
      },
    });

    const activixData = await prisma.activixLead.findMany({
      where: {
        userEmail: {
          equals: userEmail,
        },
      },
    });
    ///console.log('dashData:', dashData); // Debugging line


    const data = await Promise.all(financeData.map(async (financeRecord) => {
      const correspondingDashRecord = dashData.find(dashRecord => dashRecord.financeId === financeRecord.id);

      const comsCounter = await prisma.communications.findUnique({
        where: {
          financeId: financeRecord.id
        },
      });

      const correspondingActivixRecord = activixData.find(activixRecord => activixRecord.financeId === financeRecord.id);

      return {
        ...comsCounter,
        ...correspondingDashRecord,
        ...correspondingActivixRecord,
        ...financeRecord,
      };
    }));
    // console.log(mergedData, 'meghred data')
    return data;
  } catch (error) {
    console.error("Error fetching dashboard entries by financeId:", error);
    throw new Error("Failed to fetch dashboard entries by financeId");
  }
}

export async function SyncLeadData() {
  const endpoint = 'leads';
  const accessToken = env.API_ACTIVIX;

  try {
    const response = await axios.get(`https://api.crm.activix.ca/v2/${endpoint}?include[]=emails&include[]=phones&include[]=vehicles`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    //   console.log(response.data.data)
    const activixDataList = response.data.data; // Access response.data directly
    for (const activixData of activixDataList) {
      let clientfile = await prisma.clientfile.findUnique({ where: { email: activixData.emails[0].address } })
      if (clientfile && !clientfile.id) {
        console.log('step3')
        clientfile = await prisma.clientfile.create({
          data: {
            firstName: activixData.first_name,
            lastName: activixData.last_name,
            name: activixData.first_name + ' ' + activixData.last_name,
            email: activixData.emails[0].address,
            phone: activixData.phones[0].number,
            address: activixData.address_line1,
            city: activixData.city,
            province: activixData.province,
          }
        })
      }
      //   console.log(clientfile, 'clientfile')

      let finance = await prisma.finance.findUnique({ where: { activixId: activixData.id.toString() } })
      if (!finance) {
        //  console.log('step4')
        finance = await prisma.finance.create({
          data: {
            firstName: activixData.first_name,
            lastName: activixData.last_name,
            email: activixData.emails[0].address,
            phone: activixData.phones[0].number,
            name: activixData.first_name + ' ' + activixData.last_name,
            address: activixData.address_line1,
            city: activixData.city,
            province: activixData.province,
            stockNum: activixData.vehicles[0].stock,
            options: activixData.vehicles[0].comment,
            accessories: activixData.vehicles[0].accessories,
            year: activixData.vehicles[0].year,
            brand: activixData.vehicles[0].make,
            model: activixData.vehicles[0].model,
            color: activixData.vehicles[0].color_exterior,
            msrp: activixData.vehicles[0].price,
            tradeValue: activixData.vehicles[0].value,
            trim: activixData.vehicles[0].trim,
            vin: activixData.vehicles[0].vin,
          }
        })
        //   console.log(finance, 'finance')
        let savedActivix = await prisma.activixLead.findUnique({ where: { id: activixData.id.toString() } })
        if (!savedActivix) {
          savedActivix = await prisma.activixLead.create({
            data: {
              financeId: finance.id,
              id: activixData.id.toString(),
              account_id: activixData.account_id.toString(),
              customer_id: activixData.customer_id.toString(),
              source_id: activixData.source_id,
              Integer: activixData.Integer,
              provider_id: activixData.provider_id,
              appointment_date: activixData.appointment_date,
              phone_appointment_date: activixData.phone_appointment_date,
              available_date: activixData.available_date,
              be_back_date: activixData.be_back_date,
              birth_date: activixData.birth_date,
              call_date: activixData.call_date,
              created_at: activixData.created_at,
              csi_date: activixData.csi_date,
              delivered_date: activixData.delivered_date,
              deliverable_date: activixData.deliverable_date,
              delivery_date: activixData.delivery_date,
              home_presented_date: activixData.home_presented_date,
              paperwork_date: activixData.paperwork_date,
              presented_date: activixData.presented_date,
              promised_date: activixData.promised_date,
              financed_date: activixData.financed_date,
              road_test_date: activixData.road_test_date,
              home_road_test_date: activixData.home_road_test_date,
              sale_date: activixData.sale_date,
              take_over_date: activixData.take_over_date,
              unsubscribe_all_date: activixData.unsubscribe_all_date,
              unsubscribe_call_date: activixData.unsubscribe_call_date,
              unsubscribe_email_date: activixData.unsubscribe_email_date,
              unsubscribe_sms_date: activixData.unsubscribe_sms_date,
              updated_at: activixData.updated_at,
              address_line1: activixData.address_line1,
              address_line2: activixData.address_line2,
              business: activixData.business,
              business_name: activixData.business_name,
              campaign: activixData.campaign,
              city: activixData.city,
              civility: activixData.civility,
              country: activixData.country,
              created_method: activixData.created_method,
              credit_approved: activixData.credit_approved.toString(),
              dealer_tour: activixData.dealer_tour,
              division: activixData.division,
              financial_institution: activixData.financial_institution,
              first_name: activixData.first_name,
              form: activixData.form,
              funded: activixData.funded,
              gender: activixData.gender.toString(),
              inspected: activixData.inspected.toString(),
              keyword: activixData.keyword,
              last_name: activixData.last_name,
              locale: activixData.locale,
              navigation_history: activixData.navigation_history,
              postal_code: activixData.postal_code,
              progress_state: activixData.progress_state,
              provider: activixData.provider,
              province: activixData.province,
              qualification: activixData.qualification,
              rating: activixData.rating,
              referrer: activixData.referrer,
              result: activixData.result,
              search_term: activixData.search_term,
              second_contact: activixData.second_contact,
              second_contact_civility: activixData.second_contact_civility,
              segment: activixData.segment,
              source: activixData.source,
              status: activixData.status,
              type: activixData.type,
              walk_around: activixData.walk_around.toString(),
              comment: activixData.comment,
              advisor: activixData.advisor,
              delivered_by: activixData.delivered_by,
              emails: activixData.emails && activixData.emails.length > 0 ? activixData.emails[0].address : null,
              emails2: activixData.emails && activixData.emails.length > 1 ? activixData.emails[1].address : null,
              phones: activixData.phones && activixData.phones.length > 0 ? activixData.phones[0].number : null,
              phones2: activixData.phones && activixData.phones.length > 1 ? activixData.phones[1].number : null,
              phones3: activixData.phones && activixData.phones.length > 2 ? activixData.phones[2].number : null,
            }
          })
        }
        //     console.log(savedActivix, 'savedActivix')
        let dashboard = await prisma.dashboard.findUnique({ where: { financeId: finance.id, } })
        if (dashboard === null) {
          dashboard = await prisma.dashboard.create({
            data: {
              financeId: finance.id,
              customerState: activixData.result,
              status: activixData.status
            }
          })
        }
        //   console.log(dashboard, 'dashboard')
        const updateFinance = await prisma.finance.update({
          where: { id: finance.id, },
          data: {
            activixId: savedActivix.id,
            clientfileId: clientfile.id,
            dashboardId: dashboard.id,
          }
        })
        return updateFinance
      }
      // need to set update functions
      else {
        finance = await prisma.finance.update({
          where: { id: finance.id },
          data: {
            firstName: activixData.first_name,
            lastName: activixData.last_name,
            email: activixData.emails[0].address,
            phone: activixData.phones[0].number,
            name: activixData.first_name + ' ' + activixData.last_name,
            address: activixData.address_line1,
            city: activixData.city,
            province: activixData.province,
            stockNum: activixData.vehicles[0].stock,
            options: activixData.vehicles[0].comment,
            accessories: activixData.vehicles[0].accessories,
            year: activixData.vehicles[0].year,
            brand: activixData.vehicles[0].make,
            model: activixData.vehicles[0].model,
            color: activixData.vehicles[0].color_exterior,
            msrp: activixData.vehicles[0].price,
            tradeValue: activixData.vehicles[0].value,
            trim: activixData.vehicles[0].trim,
            vin: activixData.vehicles[0].vin,
          }
        })
        let savedActivix = await prisma.activixLead.update({
          where: { id: activixData.id.toString() },
          data: {
            financeId: finance.id,
            id: activixData.id.toString(),
            account_id: activixData.account_id.toString(),
            customer_id: activixData.customer_id.toString(),
            source_id: activixData.source_id,
            Integer: activixData.Integer,
            provider_id: activixData.provider_id,
            appointment_date: activixData.appointment_date,
            phone_appointment_date: activixData.phone_appointment_date,
            available_date: activixData.available_date,
            be_back_date: activixData.be_back_date,
            birth_date: activixData.birth_date,
            call_date: activixData.call_date,
            created_at: activixData.created_at,
            csi_date: activixData.csi_date,
            delivered_date: activixData.delivered_date,
            deliverable_date: activixData.deliverable_date,
            delivery_date: activixData.delivery_date,
            home_presented_date: activixData.home_presented_date,
            paperwork_date: activixData.paperwork_date,
            presented_date: activixData.presented_date,
            promised_date: activixData.promised_date,
            financed_date: activixData.financed_date,
            road_test_date: activixData.road_test_date,
            home_road_test_date: activixData.home_road_test_date,
            sale_date: activixData.sale_date,
            take_over_date: activixData.take_over_date,
            unsubscribe_all_date: activixData.unsubscribe_all_date,
            unsubscribe_call_date: activixData.unsubscribe_call_date,
            unsubscribe_email_date: activixData.unsubscribe_email_date,
            unsubscribe_sms_date: activixData.unsubscribe_sms_date,
            updated_at: activixData.updated_at,
            address_line1: activixData.address_line1,
            address_line2: activixData.address_line2,
            business: activixData.business,
            business_name: activixData.business_name,
            campaign: activixData.campaign,
            city: activixData.city,
            civility: activixData.civility,
            country: activixData.country,
            created_method: activixData.created_method,
            credit_approved: activixData.credit_approved.toString(),
            dealer_tour: activixData.dealer_tour,
            division: activixData.division,
            financial_institution: activixData.financial_institution,
            first_name: activixData.first_name,
            form: activixData.form,
            funded: activixData.funded,
            gender: activixData.gender.toString(),
            inspected: activixData.inspected.toString(),
            keyword: activixData.keyword,
            last_name: activixData.last_name,
            locale: activixData.locale,
            navigation_history: activixData.navigation_history,
            postal_code: activixData.postal_code,
            progress_state: activixData.progress_state,
            provider: activixData.provider,
            province: activixData.province,
            qualification: activixData.qualification,
            rating: activixData.rating,
            referrer: activixData.referrer,
            result: activixData.result,
            search_term: activixData.search_term,
            second_contact: activixData.second_contact,
            second_contact_civility: activixData.second_contact_civility,
            segment: activixData.segment,
            source: activixData.source,
            status: activixData.status,
            type: activixData.type,
            walk_around: activixData.walk_around.toString(),
            comment: activixData.comment,
            advisor: activixData.advisor,
            delivered_by: activixData.delivered_by,
            emails: activixData.emails && activixData.emails.length > 0 ? activixData.emails[0].address : null,
            emails2: activixData.emails && activixData.emails.length > 1 ? activixData.emails[1].address : null,
            phones: activixData.phones && activixData.phones.length > 0 ? activixData.phones[0].number : null,
            phones2: activixData.phones && activixData.phones.length > 1 ? activixData.phones[1].number : null,
            phones3: activixData.phones && activixData.phones.length > 2 ? activixData.phones[2].number : null,
          }
        })
        let dashboard = await prisma.dashboard.update({
          where: { financeId: finance.id },
          data: {
            financeId: finance.id,
            customerState: activixData.result,
            status: activixData.status
          }
        })
        return json({ finance, savedActivix, dashboard })
      }
    }
    console.log('step1');
    // Now you can use activixDataList
  } catch (error) {
    console.error('Full error object:', error);
    console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
    console.error(`Error status: ${error.response.status}`);
    console.error('Error response:', error.response.data);
  }
}


/**
 export async function SyncLeadData() {
 const endpoint = 'leads';
 const accessToken = env.API_ACTIVIX;

 try {
 const response = await axios.get(`https://api.crm.activix.ca/v2/${endpoint}?include[]=emails&include[]=phones&include[]=vehicles`, {
 headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${accessToken}`, },
 });
 console.log(response.data.data)
 const activixDataList = response.data.data; // Access response.data directly
 for (const activixData of activixDataList) {
 let clientfile = await prisma.clientfile.findUnique({ where: { email: activixData.emails[0].address } })
 console.log(activixData.phones)
 console.log(activixData.emails)
 console.log(activixData.vehicles)
 if (clientfile === undefined || clientfile === null) {
 console.log('step3')

 clientfile = await prisma.clientfile.create({
 data: {
 firstName: activixData.first_name,
 lastName: activixData.last_name,
 name: activixData.first_name + ' ' + activixData.last_name,
 email: activixData.emails[0].address,
 phone: activixData.phones[0].number,
 address: activixData.address_line1,
 city: activixData.city,
 province: activixData.province,
 }
 })

 }
 let finance = await prisma.finance.findUnique({ where: { activixId: activixData.id.toString() } })
 if (!finance) {
 console.log('step4')
 finance = await prisma.finance.create({
 data: {
 firstName: activixData.first_name,
 lastName: activixData.last_name,
 email: activixData.emails[0].address,
 phone: activixData.phones[0].number,
 name: activixData.first_name + ' ' + activixData.last_name,
 address: activixData.address_line1,
 city: activixData.city,
 province: activixData.province,
 stockNum: activixData.vehicles[0].stock,
 options: activixData.vehicles[0].comment,
 accessories: activixData.vehicles[0].accessories,
 year: activixData.vehicles[0].year,
 brand: activixData.vehicles[0].make,
 model: activixData.vehicles[0].model,
 color: activixData.vehicles[0].color_exterior,
 msrp: activixData.vehicles[0].price,
 tradeValue: activixData.vehicles[0].value,
 trim: activixData.vehicles[0].trim,
 vin: activixData.vehicles[0].vin,
 }
 })
 let savedActivix = await prisma.activixLead.findUnique({ where: { id: activixData.id.toString() } })
 if (!savedActivix) {
 savedActivix = await prisma.activixLead.create({
 data: {
 financeId: finance.id,
 id: activixData.id.toString(),
 account_id: activixData.account_id.toString(),
 customer_id: activixData.customer_id.toString(),
 source_id: activixData.source_id,
 Integer: activixData.Integer,
 provider_id: activixData.provider_id,
 appointment_date: activixData.appointment_date,
 phone_appointment_date: activixData.phone_appointment_date,
 available_date: activixData.available_date,
 be_back_date: activixData.be_back_date,
 birth_date: activixData.birth_date,
 call_date: activixData.call_date,
 created_at: activixData.created_at,
 csi_date: activixData.csi_date,
 delivered_date: activixData.delivered_date,
 deliverable_date: activixData.deliverable_date,
 delivery_date: activixData.delivery_date,
 home_presented_date: activixData.home_presented_date,
 paperwork_date: activixData.paperwork_date,
 presented_date: activixData.presented_date,
 promised_date: activixData.promised_date,
 financed_date: activixData.financed_date,
 road_test_date: activixData.road_test_date,
 home_road_test_date: activixData.home_road_test_date,
 sale_date: activixData.sale_date,
 take_over_date: activixData.take_over_date,
 unsubscribe_all_date: activixData.unsubscribe_all_date,
 unsubscribe_call_date: activixData.unsubscribe_call_date,
 unsubscribe_email_date: activixData.unsubscribe_email_date,
 unsubscribe_sms_date: activixData.unsubscribe_sms_date,
 updated_at: activixData.updated_at,
 address_line1: activixData.address_line1,
 address_line2: activixData.address_line2,
 business: activixData.business,
 business_name: activixData.business_name,
 campaign: activixData.campaign,
 city: activixData.city,
 civility: activixData.civility,
 country: activixData.country,
 created_method: activixData.created_method,
 credit_approved: activixData.credit_approved.toString(),
 dealer_tour: activixData.dealer_tour,
 division: activixData.division,
 financial_institution: activixData.financial_institution,
 first_name: activixData.first_name,
 form: activixData.form,
 funded: activixData.funded,
 gender: activixData.gender.toString(),
 inspected: activixData.inspected.toString(),
 keyword: activixData.keyword,
 last_name: activixData.last_name,
 locale: activixData.locale,
 navigation_history: activixData.navigation_history,
 postal_code: activixData.postal_code,
 progress_state: activixData.progress_state,
 provider: activixData.provider,
 province: activixData.province,
 qualification: activixData.qualification,
 rating: activixData.rating,
 referrer: activixData.referrer,
 result: activixData.result,
 search_term: activixData.search_term,
 second_contact: activixData.second_contact,
 second_contact_civility: activixData.second_contact_civility,
 segment: activixData.segment,
 source: activixData.source,
 status: activixData.status,
 type: activixData.type,
 walk_around: activixData.walk_around.toString(),
 comment: activixData.comment,
 advisor: activixData.advisor,
 delivered_by: activixData.delivered_by,
 emails: activixData.emails && activixData.emails.length > 0 ? activixData.emails[0].address : null,
 emails2: activixData.emails && activixData.emails.length > 1 ? activixData.emails[1].address : null,
 phones: activixData.phones && activixData.phones.length > 0 ? activixData.phones[0].number : null,
 phones2: activixData.phones && activixData.phones.length > 1 ? activixData.phones[1].number : null,
 phones3: activixData.phones && activixData.phones.length > 2 ? activixData.phones[2].number : null,
 }
 })
 }
 let dashboard = await prisma.dashboard.findUnique({ where: { financeId: finance.id, } })
 if (!savedActivix) {
 dashboard = await prisma.dashboard.create({
 data: {
 financeId: finance.id,
 customerState: activixData.result,
 status: activixData.status
 }
 })
 }
 const updateFinance = await prisma.finance.update({
 where: { id: finance.id, },
 data: {
 activixId: savedActivix.id,
 clientfileId: clientfile.id,
 dashboardId: dashboard.id,
 }
 })
 return updateFinance
 }
 // need to set update functions
 else return null
 }
 console.log('step1');
 // Now you can use activixDataList
 } catch (error) {
 console.error('Full error object:', error);
 console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
 console.error(`Error status: ${error.response.status}`);
 console.error('Error response:', error.response.data);
 }
 }

 */
