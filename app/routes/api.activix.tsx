import { json, type LoaderFunction, } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { model } from "~/models";
import { getSession, } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";

import axios from 'axios';
import { toast } from "sonner"


const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"



// need update vehicle and need to add vehicle id to my db for reference qwhen updating
export async function UpdateFinanceRecord(activixData, finance) {

  let updateFinance
  try {
    updateFinance = await prisma.finance.update({
      where: { id: finance.id },
      data: {
        email: activixData.email[0].address,
        firstName: activixData.first_name,
        lastName: activixData.last_name,
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
      },
    });
    console.log('found finance record', updateFinance);
  } catch (error) {
    console.error('Error updating finance:', error);
    return json({ error: 'Error in Prisma operation' });
  }
  let updateClientfile
  try {
    updateClientfile = await prisma.clientfile.update({
      where: { id: finance.clientfileId },
      data: {
        firstName: activixData.first_name,
        lastName: activixData.last_name,
        phone: activixData.phones[0].number,
        name: activixData.first_name + ' ' + activixData.last_name,
        email: activixData.email[0].address,
        address: activixData.address_line1,
        city: activixData.city,
        province: activixData.province,
      },
    });
    console.log('found finance record', updateClientfile);
  } catch (error) {
    console.error('Error updating finance:', error);
    return json({ error: 'Error in Prisma operation' });
  }
  let updateDash
  try {
    updateDash = await prisma.dashboard.update({
      where: { financeId: finance.id },
      data: {
        customerState: activixData.result,
        status: activixData.status
      }
    })
    console.log('found finance record', updateDash);
  } catch (error) {
    console.error('Error updating finance:', error);
    return json({ error: 'Error in Prisma operation' });
  }
  console.log(`Updated ${finance.name}'s record`);
  return ({ updateDash, updateClientfile, updateFinance })
}

export async function CreateFinanceRecoprd(activixData, finance) {
  console.log('creaeted finance record');
  console.log(finance, 'from update', activixData)

  let clientfile = await prisma.clientfile.findUnique({ where: { email: activixData.emails[0].address } });
  if (!clientfile) {
    clientfile = await prisma.clientfile.create({
      data: {
        firstName: activixData.first_name,
        lastName: activixData.last_name,
        phone: activixData.phones[0].number,
        name: activixData.first_name + ' ' + activixData.last_name,
        email: activixData.email[0].address,
        address: activixData.address_line1,
        city: activixData.city,
        province: activixData.province,
      }
    })
  }
  const financeData = await prisma.finance.findUnique({ where: { activixId: activixData.id } })

  if (!financeData) {
    const createFinance = await prisma.finance.create({
      data: {

        email: activixData.email[0].address,
        firstName: activixData.first_name,
        lastName: activixData.last_name,
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
    const savedActivix = await prisma.activixLead.create({
      data: {
        financeId: finance.id,
        account_id: activixData.account_id,
        customer_id: activixData.customer_id,
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
        credit_approved: activixData.credit_approved,
        dealer_tour: activixData.dealer_tour,
        division: activixData.division,
        financial_institution: activixData.financial_institution,
        first_name: activixData.first_name,
        form: activixData.form,
        funded: activixData.funded,
        gender: activixData.gender,
        inspected: activixData.inspected,
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
        walk_around: activixData.walk_around,
        comment: activixData.comment,
        advisor: activixData.advisor,
        delivered_by: activixData.delivered_by,
        emails: activixData.emails[0],
        emails2: activixData.emails[1],
        phones: activixData.phones[0],
        phones2: activixData.phones[1],
        phones3: activixData.phones[2],
      }
    })
    const dashboard = await prisma.dashboard.create({
      data: {
        financeId: finance.id,
        customerState: activixData.result,
        status: activixData.status
      }
    })
    const updateFinance = await prisma.finance.update({
      where: { id: finance.id, },
      data: {
        activixId: savedActivix.id,
        clientfileId: clientfile.id,
        dashboardId: dashboard.id,
      }
    })
    return json({ savedActivix, dashboard, updateFinance, finance, createFinance })
  }
}


export async function SyncLeadData(user, financeData) {
  let currentPage = 1;
  const response = await axios.get(`https://api.crm.activix.ca/v2/leads?include[]=emails&include[]=phones`, {
    params: {
      page: currentPage,
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  });
  const updatePromises = [];
  for (const activixData of response.data.data) {
    const activixId = activixData.id;
    let isMatchFound = false;
    for (const finance of financeData) {
      const financeActiId = parseInt(finance.activixId);
      isMatchFound = false;
      if (activixId === financeActiId) {
        isMatchFound = true;
        console.log(`Updated finance record for Activix ID: ${activixData.id}`);
        updatePromises.push(UpdateFinanceRecord(activixData, finance));
        break;
      }
    }
    if (!isMatchFound) {
      console.log(`No match found for Activix ID: ${activixData.id}`);
      for (const finance of financeData) {
        console.log(`created finance record for Activix ID: ${activixData.id}`);
        updatePromises.push(CreateFinanceRecoprd(activixData, finance));
        break;
      }
    }
  }
  await Promise.all(updatePromises);
}


export async function GetAccount() {
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"

  const account = await axios.get(`https://api.crm.activix.ca/v2/account`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }).then(response => {
    console.log(response.data);
  })
    .catch(error => {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
    });

  return account
}
export async function GetLeads() {

  const endpoint = 'leads'

  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"
  const response = await axios.get(`https://api.crm.activix.ca/v2/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  )
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
    });


  return response

}
export async function CreateVehicle(body) {
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"
  const response = await axios.post(`https://api.crm.activix.ca/v2/lead-vehicles`, {
    body,
    // lead_id: 42132008,
    //"make": "BMW Motorrad",
    //"model": "S1000RR",
    // "year": 2018,
    // "type": "wanted"
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  )
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
    });


  return response
}
export async function CreateLead(formData, user, createQuoteServer) {
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"

  const nameParts = user.username.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  async function CreateActvix(formData) {
    try {
      let clientFile = await prisma.clientfile.findUnique({ where: { email: formData.email } })
      if (!clientFile) {
        clientFile = await prisma.clientfile.create({
          data: {
            financeId: formData.financeId,
            userId: formData.userId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postal: formData.postal,
            province: formData.province,
            dl: formData.dl,
            typeOfContact: formData.typeOfContact,
            timeToContact: formData.timeToContact,
          }
        })

      }
      const financeData = await prisma.finance.update({
        where: { id: createQuoteServer.finance.id },
        data: {
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
          userEmail: formData.userEmail,
          tradeValue: formData.tradeValue,
          tradeDesc: formData.tradeDesc,
          tradeColor: formData.tradeColor,
          tradeYear: formData.tradeYear,
          tradeMake: formData.tradeMake,
          tradeVin: formData.tradeVin,
          tradeTrim: formData.tradeTrim,
          tradeMileage: formData.tradeMileage,
          trim: formData.trim,
          vin: formData.vin,
        }
      })
      const dashboardData = await prisma.dashboard.update({
        where: { id: createQuoteServer.dashboard.id },
        data: {
          userEmail: formData.userEmail,
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
          activixId: formData.id,
          account_id: formData.account_id,
          customer_id: formData.customer_id,
          appointment_date: formData.appointment_date,
          phone_appointment_date: formData.phone_appointment_date,
          available_date: formData.available_date,
          be_back_date: formData.be_back_date,
          call_date: formData.call_date,
          created_at: formData.created_at,
          csi_date: formData.csi_date,
          delivered_date: formData.delivered_date,
          deliverable_date: formData.deliverable_date,
          delivery_date: formData.delivery_date,
          paperwork_date: formData.paperwork_date,
          presented_date: formData.presented_date,
          promised_date: formData.promised_date,
          financed_date: formData.financed_date,
          road_test_date: formData.road_test_date,
          home_road_test_date: formData.home_road_test_date,
          sale_date: formData.sale_date,
          updated_at: formData.updated_at,
          address_line1: formData.address,
          city: formData.city,
          civility: formData.civility,
          country: formData.country,
          credit_approved: formData.credit_approved,
          dealer_tour: formData.dealer_tour,
          financial_institution: formData.financial_institution,
          first_name: formData.firstName,
          funded: formData.funded,
          inspected: formData.inspected,
          last_name: formData.lastName,
          postal_code: formData.postal,
          province: formData.province,
          result: formData.result,
          status: formData.status,
          type: formData.type,
          walk_around: formData.walk_around,
          comment: formData.comment,
          delivered_by: formData.delivered_by,
          emails: formData.email,
          phones: formData.phone,
          financeId: formData.financeId,
          userEmail: user.email,

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



      // Returning the relevant data
      return { financeData, activixData, dashboardData };
    } catch (error) {
      // Handle errors here
      console.error(error);
      throw error; // rethrow the error for handling at a higher level if needed
    }
  }

  const response = await axios.post(`https://api.crm.activix.ca/v2/leads`,
    {
      "first_name": formData.firstName,
      "last_name": formData.lastName,
      "type": "email",
      "advisor": {
        "first_name": firstName,
        "last_name": lastName
      },
      "emails": [
        {
          "type": "home",
          "address": formData.email,
        }
      ],
      "phones": [
        {
          "number": `+1${formData.phone}`,
          "type": "mobile"
        }
      ],
      "vehicles": [
        {
          "make": formData.brand,
          "model": formData.model,
          "year": formData.year,
          "color_exterior": formData.color,
          "vin": formData.vin,
          "price": formData.msrp,

          "type": "wanted"
        },
        {
          "make": formData.tradeMake,
          "model": formData.tradeDesc,
          "year": formData.tradeYear,
          "vin": formData.tradeVin,
          "color_exterior": formData.tradeColor,
          "mileage": formData.tradeMileage,
          "type": "exchange"
        }
      ]
    }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  )
    .then(response => {
      console.log(response.data);
      const data = response.data
      console.log(data.id, 'api activix add custoemr')
      async function CreateActvix3() {
        const result = await CreateActvix(formData);
        const updateActivix = await prisma.activixLead.update({
          where: { id: result.activixData.id },
          data: {
            activixId: result.activixData.id,
          }
        })
        return updateActivix
      }
      CreateActvix3()
    })
    .catch(error => {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
    });

  console.log(response, 'response')
  return response

}
export async function UpdateLead(formData,) {
  const activixId = await prisma.finance.findUnique({ where: { id: formData.financeId } })
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"

  const response = await axios.put(`https://api.crm.activix.ca/v2/leads/${activixId.activixId}`,
    {
      "first_name": formData.firstName,
      "last_name": formData.lastName,
      "type": "email",
      "emails": [
        {
          "type": "home",
          "address": formData.email,
        }
      ],
      "phones": [
        {
          "number": `+1${formData.phone}`,
          "type": "mobile"
        }
      ],
      "vehicles": [
        {
          "make": formData.brand,
          "model": formData.model,
          "year": formData.year,
          "color_exterior": formData.color,
          "vin": formData.vin,
          "price": formData.msrp,

          "type": "wanted"
        },
        {
          "make": formData.tradeMake,
          "model": formData.tradeDesc,
          "year": formData.tradeYear,
          "vin": formData.tradeVin,
          "color_exterior": formData.tradeColor,
          "mileage": formData.tradeMileage,
          "type": "exchange"
        }
      ]
    }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  ).then(response => {
    console.log(response.data);
  })
    .catch(error => {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
    });


  return response

}
export async function CreateLeadActivix(formData, user) {
  console.log(formData, 'CreateLeadActivix')
  const nameParts = user.username.split(' ');
  const firstName = nameParts[0]; // 'Skyler'
  const lastName = nameParts[1]; // 'Zanth'
  const response = await axios.post(`https://api.crm.activix.ca/v2/leads`,
    {
      "first_name": formData.firstName,
      "last_name": formData.lastName,
      "source_id": 6600,
      "type": "email",
      "advisor": {
        "first_name": firstName,
        "last_name": lastName
      },
      "emails": [
        {
          "type": "home",
          "address": formData.email,
        }
      ],
      "phones": [
        {
          "number": `+1${formData.phone}`,
          "type": "mobile"
        }
      ],
      "vehicles": [
        {
          "make": formData.brand === null ? ' ' : formData.brand,
          "model": formData.model === null ? ' ' : formData.model,
          "year": formData.year === null ? ' ' : formData.year,
          "color_exterior": formData.color === null ? ' ' : formData.color,
          "vin": formData.vin === null ? ' ' : formData.vin,
          "price": formData.msrp === null ? ' ' : formData.msrp,
          "type": "wanted"
        },
        {
          "make": formData.tradeMake === null ? ' ' : formData.tradeMake,
          "model": formData.tradeDesc === null ? ' ' : formData.tradeDesc,
          "year": formData.tradeYear === null ? ' ' : formData.tradeYear,
          "vin": formData.tradeVin === null ? ' ' : formData.tradeVin,
          "color_exterior": formData.tradeColor === null ? ' ' : formData.tradeColor,
          "mileage": formData.tradeMileage === null ? ' ' : formData.tradeMileage,
          "type": "exchange"
        }
      ]
    }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  ).then(response => {
    console.log(response.data);
  })
    .catch(error => {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
    });

  /**{
    data: {
      id: 43570588,
      account_id: 17162,
      customer_id: 41680877,
      source_id: null,
      provider_id: null,
      appointment_date: null,
      appointment_event_id: null,
      phone_appointment_date: null,
      available_date: null,
      be_back_date: null,
      birth_date: null,
      call_date: null,
      created_at: '2024-03-16T07:12:25+00:00',
      csi_date: null,
      deliverable_date: null,
      delivered_date: null,
      delivery_date: null,
      funded: null,
      end_service_date: null,
      home_presented_date: null,
      last_visit_date: null,
      next_visit_date: null,
      open_work_order_date: null,
      paperwork_date: null,
      planned_pick_up_date: null,
      presented_date: null,
      promised_date: null,
      refinanced_date: null,
      repair_date: null,
      road_test_date: null,
      home_road_test_date: null,
      sale_date: null,
      take_over_date: null,
      unsubscribe_all_date: null,
      unsubscribe_call_date: null,
      unsubscribe_email_date: null,
      unsubscribe_sms_date: null,
      updated_at: '2024-03-16T07:12:25+00:00',
      work_order_closure_date: null,
      work_order_partial_closure_date: null,
      address_line1: null,
      address_line2: null,
      credit_approved: false,
      average_spending: 0,
      business: null,
      business_name: null,
      city: null,
      civility: null,
      code: null,
      comment: null,
      country: 'CA',
      created_method: 'api',
      dealer_tour: null,
      division: null,
      financial_institution: null,
      first_name: 'Hiracheo',
      gender: 0,
      inspected: false,
      invoiced: false,
      last_name: 'Kane',
      locale: 'fr',
      loyalty: null,
      odometer_last_visit: null,
      postal_code: null,
      prepaid: null,
      prepared: false,
      province: 'QC',
      qualification: null,
      rating: null,
      reached_client: false,
      repair_order: null,
      result: 'pending',
      second_contact: null,
      second_contact_civility: null,
      segment: null,
      service_cleaned: false,
      service_interval_km: null,
      service_monthly_km: null,
      source: null,
      progress_state: null,
      status: null,
      storage: null,
      type: 'email',
      walk_around: false,
      work_order: null,
      referrer: null,
      search_term: null,
      keyword: null,
      navigation_history: null,
      campaign: null,
      response_time: null,
      first_update_time: null,
      account: {
        id: 17162,
        created_at: '2023-12-14T16:45:54+00:00',
        updated_at: '2023-12-14T16:45:56+00:00',
        name: 'Sandbox - Skyler Zanth'
      },
      advisor: null,
      bdc: null,
      commercial: null,
      service_advisor: null,
      service_agent: null,
      customer: { id: 41680877 },
      emails: [ [Object] ],
      phones: [ [Object] ],
      products: [],
      vehicles: [ [Object], [Object] ]
    }
  } */
  return response
}

export async function UpdateLeadBasic(formData) {
  const activixId = await prisma.finance.findUnique({ where: { id: formData.financeId } })
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"

  const response = await axios.put(`https://api.crm.activix.ca/v2/leads/${formData.activixId}`,
    {
      "first_name": formData.firstName,
      "last_name": formData.lastName,
      "type": "email",

    }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  ).then(response => { console.log(response.data); }).catch(error => {
    console.error('Full error object:', error);
    console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
    console.error(`Error status: ${error.response.status}`);
    console.error('Error response:', error.response.data);
  });

  const emails = await axios.put(`https://api.crm.activix.ca/v2/lead-emails/${formData.activixId}`,
    {
      "type": "home",
      "address": formData.email,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
    }
  ).then(response => { console.log(response.data); }).catch(error => {
    console.error('Full error object:', error);
    console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
    console.error(`Error status: ${error.response.status}`);
    console.error('Error response:', error.response.data);
  });

  const phones = await axios.put(`https://api.crm.activix.ca/v2/lead-phones/${formData.activixId}`,
    {
      "number": `+1${formData.phone}`,
      "type": "mobile"
    }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  ).then(response => { console.log(response.data); }).catch(error => {
    console.error('Full error object:', error);
    console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
    console.error(`Error status: ${error.response.status}`);
    console.error('Error response:', error.response.data);
  });

  const vehicles = await axios.put(`https://api.crm.activix.ca/v2/lead-vehicles/${formData.activixId}`,
    {
      "vehicles": [
        {
          "make": formData.brand,
          "model": formData.model,
          "year": formData.year,
          "color_exterior": formData.color,
          "vin": formData.vin,
          "price": formData.msrp,

          "type": "wanted"
        },
      ]
    }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  ).then(response => { console.log(response.data); }).catch(error => {
    console.error('Full error object:', error);
    console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
    console.error(`Error status: ${error.response.status}`);
    console.error('Error response:', error.response.data);
  });

  return response

}
export async function UpdateLeadPhone(formData) {
  const activixId = await prisma.finance.findUnique({ where: { id: formData.financeId } })
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"

  const phones = await axios.put(`https://api.crm.activix.ca/v2/lead-phones/${formData.activixId}`,
    {
      "number": `+1${formData.phone}`,
      "type": "mobile"
    }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  ).then(response => { console.log(response.data); }).catch(error => {
    console.error('Full error object:', error);
    console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
    console.error(`Error status: ${error.response.status}`);
    console.error('Error response:', error.response.data);
  });
  return phones

}
export async function UpdateLeademail(formData) {
  const activixId = await prisma.finance.findUnique({ where: { id: formData.financeId } })
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"


  const emails = await axios.put(`https://api.crm.activix.ca/v2/lead-emails/${formData.activixId}`,
    {
      "type": "home",
      "address": formData.email,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
    }
  ).then(response => { console.log(response.data); }).catch(error => {
    console.error('Full error object:', error);
    console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
    console.error(`Error status: ${error.response.status}`);
    console.error('Error response:', error.response.data);
  });


  return emails

}
export async function UpdateLeadWantedVeh(formData) {
  const activixId = await prisma.finance.findUnique({ where: { id: formData.financeId } })
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"


  const vehicles = await axios.put(`https://api.crm.activix.ca/v2/lead-vehicles/${formData.activixId}`,
    {
      "make": formData.brand,
      "model": formData.model,
      "year": formData.year,
      "color_exterior": formData.color,
      "vin": formData.vin,
      "price": formData.msrp,
      "type": "wanted"
    }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  ).then(response => { console.log(response.data); }).catch(error => {
    console.error('Full error object:', error);
    console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
    console.error(`Error status: ${error.response.status}`);
    console.error('Error response:', error.response.data);
  });

  return vehicles

}
export async function UpdateLeadEchangeVeh(formData) {
  const activixId = await prisma.finance.findUnique({ where: { id: formData.financeId } })
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"


  const vehicles = await axios.put(`https://api.crm.activix.ca/v2/lead-vehicles/${formData.activixId}`,
    {
      "make": formData.brand,
      "model": formData.model,
      "year": formData.year,
      "color_exterior": formData.color,
      "vin": formData.vin,
      "price": formData.msrp,
      "type": "wanted"
    }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  ).then(response => { console.log(response.data); }).catch(error => {
    console.error('Full error object:', error);
    console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
    console.error(`Error status: ${error.response.status}`);
    console.error('Error response:', error.response.data);
  });

  return vehicles

}
export async function CreateCommunications(formData) {

  const endpoint = 'communications'
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"
  let bodyData = {}
  const date = new Date().toISOString()


  if (formData.contactMethod === 'phone') {
    bodyData = {
      lead_id: formData.activixId,
      "method": "phone",
      "type": "outgoing",
      "call_status": "calling",
      "description": formData.title + ' ' + formData.note,
      "executed_at": date,
      "executed_by": 17162,
    }
  }

  if (formData.contactMethod === 'SMS') {
    bodyData = {
      lead_id: formData.activixId,
      "method": "phone",
      "type": "outgoing",
      "call_status": "attempted",
      "description": `SMS - ${formData.body}`,
      "executed_at": date,
      "executed_by": 17162,
    }
  }
  if (formData.contactMethod === 'email') {
    bodyData = {
      lead_id: formData.activixId,
      "method": "email",
      "type": "outgoing",
      "email_subject": formData.subject,
      "email_body": formData.note,
      "email_user": formData.userEmail,
      "description": formData.customContent,
      "executed_at": date,
      "executed_by": 17162,
    }
  }
  const response = await axios.post(`https://api.crm.activix.ca/v2/${endpoint}`, { bodyData, }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  )
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
    });


  return response
}
export async function UpdateCommunications(formData) {

  const finance = await prisma.finance.findUnique({ where: { id: formData.financeId } })
  const activixId = finance.activixId
  const endpoint = 'communications'
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"
  let bodyData = {}
  const date = new Date().toISOString()

  if (formData.contactMethod === 'phone') {
    bodyData = {
      lead_id: formData.activixId,
      "method": "phone",
      "type": "outgoing",
      "call_status": "calling",
      "description": formData.title + ' ' + formData.note,
      "executed_at": date,
      "executed_by": 17162,
    }
  }

  if (formData.contactMethod === 'SMS') {
    bodyData = {
      lead_id: formData.activixId,
      "method": "phone",
      "type": "outgoing",
      "call_status": "attempted",
      "description": `SMS - ${formData.body}`,
      "executed_at": date,
      "executed_by": 17162,
    }
  }
  if (formData.contactMethod === 'email') {
    bodyData = {
      lead_id: formData.activixId,
      "method": "email",
      "type": "outgoing",
      "email_subject": formData.subject,
      "email_body": formData.note,
      "email_user": formData.userEmail,
      "description": formData.customContent,
      "executed_at": date,
      "executed_by": 17162,
    }
  }
  const response = await axios.put(`https://api.crm.activix.ca/v2/${endpoint}/${activixId}`, { bodyData, }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  )
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
    });


  return response
}
export async function CreateTask(formData) {
  const endpoint = 'tasks'
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"
  const response = await axios.post(`https://api.crm.activix.ca/v2/${endpoint}`,
    {
      "lead_id": formData.activixId,
      "owner": {
        "id": 17162,
      },
      "title": formData.title,
      "type": formData.contactMethod,
      "date": new Date(),
      "description": formData.note,
    }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  )
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
    });


  return response

}
export async function CompleteTask(formData, dateTimeString,) {
  const finance = await prisma.finance.findUnique({ where: { id: formData.financeId } })
  const activixId = finance.activixId
  const endpoint = 'tasks'
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"
  const response = await axios.put(`https://api.crm.activix.ca/v2/${endpoint}/${activixId}`,
    {
      "lead_id": formData.activixId,
      "owner": {
        "id": 17162,
      },
      "completed": true,
      "completed_at": new Date().toISOString(),
      "title": formData.title,
      "type": formData.contactMethod,
      "date": dateTimeString,
      "description": formData.note,
    }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  )
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
    });


  return response

}
export async function UpdateTask(formData, dateTimeString,) {
  const finance = await prisma.finance.findUnique({ where: { id: formData.financeId } })
  const activixId = finance.activixId
  const endpoint = 'tasks'
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"
  const response = await axios.put(`https://api.crm.activix.ca/v2/${endpoint}/${activixId}`,
    {
      "lead_id": formData.activixId,
      "owner": {
        "id": 17162,
      },
      "title": formData.title,
      "type": formData.contactMethod,
      "date": dateTimeString,
      "description": formData.note,
    }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  )
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
    });


  return response

}
export async function ListAllTasks() {
  const endpoint = 'tasks'
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"
  const response = await axios.get(`https://api.crm.activix.ca/v2/${endpoint}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
    }
  )
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
    });


  return response

}
export async function SaveTasks() {
  const actiTasksList = await ListAllTasks();
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email");
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"

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

  const savedTasks = [];

  for (const actiTasks of actiTasksList) {
    const activixLead = await prisma.activixLead.findUnique({
      where: { id: actiTasks.lead_id }
    });

    const task = await prisma.clientApts.create({
      data: {
        financeId: activixLead.financeId,
        title: actiTasks.title,
        start: actiTasks.date,
        contactMethod: actiTasks.contactMethod,
        completed: `${actiTasks.completed}`, // You might want to adjust this based on your logic
        apptType: 'Sales',
        note: actiTasks.description,
        userId: user.id,
        description: actiTasks.description,
        userName: user.name,
        attachments: actiTasks.file,
        resourceId: 1,
        activixId: actiTasks.lead_id,
        activixNoteId: actiTasks.id,
      }
    });

    savedTasks.push(task);
  }

  return savedTasks;
}
export async function CreateNote(formData) {
  const finance = await prisma.finance.findUnique({ where: { id: formData.financeId } })
  const endpoint = `leads/${finance.activixId}/notes`
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"
  const response = await axios.post(`https://api.crm.activix.ca/v2/${endpoint}`,
    {
      "content": formData.customContent,
      "user_id": 17162,
      "lead_id": formData.activixId,
    }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  )
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
    });


  return response

}
export async function UpdateNote(formData) {
  const endpoint = `leads/${finance.activixId}/notes/${formData.noteId}`
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"
  const response = await axios.put(`https://api.crm.activix.ca/v2/${endpoint}`,
    {
      "content": formData.customContent,
      "user_id": 17162,
      "lead_id": formData.activixId,
    }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  )
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
    });


  return response

}

// doesnt work
export async function CreateEvent(body) {
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"
  const response = await axios.post(`https://api.crm.activix.ca/v2/events`, {
    body,
    // lead_id: 42132008,
    // owner: {
    //  first_name: 'Skyler',
    //   last_name: 'Zanth',
    // },
    // title: "Appointment for John",
    // type: "appointment",
    // start_at: "2024-02-15T15:15:00-04:00",
    // end_at: "2024-02-15T16:45:00-04:00",
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    }
  }
  )
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
    });


  return response
}
export default function TestActivix() {
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"

  const { processedDataList } = useLoaderData()

  const [formData, setFormData] = useState({
    activixId: processedDataList.activixId,
    financeManager: processedDataList.financeManager,
    email: processedDataList.email,
    firstName: processedDataList.firstName,
    lastName: processedDataList.lastName,
    phone: processedDataList.phone,
    name: processedDataList.name,
    address: processedDataList.address,
    city: processedDataList.city,
    postal: processedDataList.postal,
    province: processedDataList.province,
    dl: processedDataList.dl,
    typeOfContact: processedDataList.typeOfContact,
    timeToContact: processedDataList.timeToContact,
    iRate: processedDataList.iRate,
    months: processedDataList.months,
    discount: processedDataList.discount,
    total: processedDataList.total,
    onTax: processedDataList.onTax,
    on60: processedDataList.on60,
    biweekly: processedDataList.biweekly,
    weekly: processedDataList.weekly,
    weeklyOth: processedDataList.weeklyOth,
    biweekOth: processedDataList.biweekOth,
    oth60: processedDataList.oth60,
    weeklyqc: processedDataList.weeklyqc,
    biweeklyqc: processedDataList.biweeklyqc,
    qc60: processedDataList.qc60,
    deposit: processedDataList.deposit,
    biweeklNatWOptions: processedDataList.biweeklNatWOptions,
    weeklylNatWOptions: processedDataList.weeklylNatWOptions,
    nat60WOptions: processedDataList.nat60WOptions,
    weeklyOthWOptions: processedDataList.weeklyOthWOptions,
    biweekOthWOptions: processedDataList.biweekOthWOptions,
    oth60WOptions: processedDataList.oth60WOptions,
    biweeklNat: processedDataList.biweeklNat,
    weeklylNat: processedDataList.weeklylNat,
    nat60: processedDataList.nat60,
    qcTax: processedDataList.qcTax,
    otherTax: processedDataList.otherTax,
    totalWithOptions: processedDataList.totalWithOptions,
    otherTaxWithOptions: processedDataList.otherTaxWithOptions,
    desiredPayments: processedDataList.desiredPayments,
    freight: processedDataList.freight,
    admin: processedDataList.admin,
    commodity: processedDataList.commodity,
    pdi: processedDataList.pdi,
    discountPer: processedDataList.discountPer,
    userLoanProt: processedDataList.userLoanProt,
    userTireandRim: processedDataList.userTireandRim,
    userGap: processedDataList.userGap,
    userExtWarr: processedDataList.userExtWarr,
    userServicespkg: processedDataList.userServicespkg,
    deliveryCharge: processedDataList.deliveryCharge,
    vinE: processedDataList.vinE,
    lifeDisability: processedDataList.lifeDisability,
    rustProofing: processedDataList.rustProofing,
    userOther: processedDataList.userOther,
    paintPrem: processedDataList.paintPrem,
    licensing: processedDataList.licensing,
    stockNum: processedDataList.stockNum,
    options: processedDataList.options,
    accessories: processedDataList.accessories,
    labour: processedDataList.labour,
    year: processedDataList.year,
    brand: processedDataList.brand,
    model: processedDataList.model,
    model1: processedDataList.model1,
    color: processedDataList.color,
    modelCode: processedDataList.modelCode,
    msrp: processedDataList.msrp,
    userEmail: processedDataList.userEmail,
    tradeValue: processedDataList.tradeValue,
    tradeDesc: processedDataList.tradeDesc,
    tradeColor: processedDataList.tradeColor,
    tradeYear: processedDataList.tradeYear,
    tradeMake: processedDataList.tradeMake,
    tradeVin: processedDataList.tradeVin,
    tradeTrim: processedDataList.tradeTrim,
    tradeMileage: processedDataList.tradeMileage,
    trim: processedDataList.trim,
    vin: processedDataList.vin,
    leadNote: processedDataList.leadNote,
    sendToFinanceNow: processedDataList.sendToFinanceNow,
    dealNumber: processedDataList.dealNumber,
    bikeStatus: processedDataList.bikeStatus,
    referral: processedDataList.referral,
    visited: processedDataList.visited,
    bookedApt: processedDataList.bookedApt,
    aptShowed: processedDataList.aptShowed,
    aptNoShowed: processedDataList.aptNoShowed,
    testDrive: processedDataList.testDrive,
    metService: processedDataList.metService,
    metManager: processedDataList.metManager,
    metParts: processedDataList.metParts,
    sold: processedDataList.sold,
    depositMade: processedDataList.depositMade,
    refund: processedDataList.refund,
    turnOver: processedDataList.turnOver,
    financeApp: processedDataList.financeApp,
    approved: processedDataList.approved,
    signed: processedDataList.signed,
    pickUpSet: processedDataList.pickUpSet,
    demoed: processedDataList.demoed,
    delivered: processedDataList.delivered,
    lastContact: processedDataList.lastContact,
    status: processedDataList.status,
    customerState: processedDataList.customerState,
    result: processedDataList.result,
    timesContacted: processedDataList.timesContacted,
    nextAppointment: processedDataList.nextAppointment,
    followUpDay: processedDataList.followUpDay,
    deliveredDate: processedDataList.deliveredDate,
    notes: processedDataList.notes,
    visits: processedDataList.visits,
    progress: processedDataList.progress,
    metSalesperson: processedDataList.metSalesperson,
    metFinance: processedDataList.metFinance,
    financeApplication: processedDataList.financeApplication,
    pickUpDate: processedDataList.pickUpDate,
    pickUpTime: processedDataList.pickUpTime,
    depositTakenDate: processedDataList.depositTakenDate,
    docsSigned: processedDataList.docsSigned,
    tradeRepairs: processedDataList.tradeRepairs,
    seenTrade: processedDataList.seenTrade,
    lastNote: processedDataList.lastNote,
    applicationDone: processedDataList.applicationDone,
    licensingSent: processedDataList.licensingSent,
    liceningDone: processedDataList.liceningDone,
    refunded: processedDataList.refunded,
    cancelled: processedDataList.cancelled,
    lost: processedDataList.lost,
    dLCopy: processedDataList.dLCopy,
    insCopy: processedDataList.insCopy,
    testDrForm: processedDataList.testDrForm,
    voidChq: processedDataList.voidChq,
    loanOther: processedDataList.loanOther,
    signBill: processedDataList.signBill,
    ucda: processedDataList.ucda,
    tradeInsp: processedDataList.tradeInsp,
    customerWS: processedDataList.customerWS,
    otherDocs: processedDataList.otherDocs,
  })
  return (
    <div>
      <h1>Your List</h1>
      <ul>
        {formDataList.map((formData, index) => (
          <li key={index}>
            <p>{formData.activixId}</p>
            <p>{formData.financeManager}</p>
            <p>{formData.email}</p>
            <p>{formData.firstName}</p>
            <p>{formData.lastName}</p>
            <p>{formData.phone}</p>
            <p>{formData.name}</p>
            <p>{formData.address}</p>
            <p>{formData.city}</p>
            <p>{formData.postal}</p>
            <p>{formData.province}</p>
            <p>{formData.dl}</p>
            <p>{formData.typeOfContact}</p>
            <p>{formData.timeToContact}</p>
            <p>{formData.iRate}</p>
            <p>{formData.months}</p>
            <p>{formData.discount}</p>
            <p>{formData.total}</p>
            <p>{formData.onTax}</p>
            <p>{formData.on60}</p>
            <p>{formData.biweekly}</p>
            <p>{formData.weekly}</p>
            <p>{formData.weeklyOth}</p>
            <p>{formData.biweekOth}</p>
            <p>{formData.oth60}</p>
            <p>{formData.weeklyqc}</p>
            <p>{formData.biweeklyqc}</p>
            <p>{formData.qc60}</p>
            <p>{formData.deposit}</p>
            <p>{formData.biweeklNatWOptions}</p>
            <p>{formData.weeklylNatWOptions}</p>
            <p>{formData.nat60WOptions}</p>
            <p>{formData.weeklyOthWOptions}</p>
            <p>{formData.biweekOthWOptions}</p>
            <p>{formData.oth60WOptions}</p>
            <p>{formData.biweeklNat}</p>
            <p>{formData.weeklylNat}</p>
            <p>{formData.nat60}</p>
            <p>{formData.qcTax}</p>
            <p>{formData.otherTax}</p>
            <p>{formData.totalWithOptions}</p>
            <p>{formData.otherTaxWithOptions}</p>
            <p>{formData.desiredPayments}</p>
            <p>{formData.freight}</p>
            <p>{formData.admin}</p>
            <p>{formData.commodity}</p>
            <p>{formData.pdi}</p>
            <p>{formData.discountPer}</p>
            <p>{formData.userLoanProt}</p>
            <p>{formData.userTireandRim}</p>
            <p>{formData.userGap}</p>
            <p>{formData.userExtWarr}</p>
            <p>{formData.userServicespkg}</p>
            <p>{formData.deliveryCharge}</p>
            <p>{formData.vinE}</p>
            <p>{formData.lifeDisability}</p>
            <p>{formData.rustProofing}</p>
            <p>{formData.userOther}</p>
            <p>{formData.paintPrem}</p>
            <p>{formData.licensing}</p>
            <p>{formData.stockNum}</p>
            <p>{formData.options}</p>
            <p>{formData.accessories}</p>
            <p>{formData.labour}</p>
            <p>{formData.year}</p>
            <p>{formData.brand}</p>
            <p>{formData.model}</p>
            <p>{formData.model1}</p>
            <p>{formData.color}</p>
            <p>{formData.modelCode}</p>
            <p>{formData.msrp}</p>
            <p>{formData.userEmail}</p>
            <p>{formData.tradeValue}</p>
            <p>{formData.tradeDesc}</p>
            <p>{formData.tradeColor}</p>
            <p>{formData.tradeYear}</p>
            <p>{formData.tradeMake}</p>
            <p>{formData.tradeVin}</p>
            <p>{formData.tradeTrim}</p>
            <p>{formData.tradeMileage}</p>
            <p>{formData.trim}</p>
            <p>{formData.vin}</p>
            <p>{formData.leadNote}</p>
            <p>{formData.sendToFinanceNow}</p>
            <p>{formData.dealNumber}</p>
            <p>{formData.bikeStatus}</p>
            <p>{formData.referral}</p>
            <p>{formData.visited}</p>
            <p>{formData.bookedApt}</p>
            <p>{formData.aptShowed}</p>
            <p>{formData.aptNoShowed}</p>
            <p>{formData.testDrive}</p>
            <p>{formData.metService}</p>
            <p>{formData.metManager}</p>
            <p>{formData.metParts}</p>
            <p>{formData.sold}</p>
            <p>{formData.depositMade}</p>
            <p>{formData.refund}</p>
            <p>{formData.turnOver}</p>
            <p>{formData.financeApp}</p>
            <p>{formData.approved}</p>
            <p>{formData.signed}</p>
            <p>{formData.pickUpSet}</p>
            <p>{formData.demoed}</p>
            <p>{formData.delivered}</p>
            <p>{formData.lastContact}</p>
            <p>{formData.status}</p>
            <p>{formData.customerState}</p>
            <p>{formData.result}</p>
            <p>{formData.timesContacted}</p>
            <p>{formData.nextAppointment}</p>
            <p>{formData.followUpDay}</p>
            <p>{formData.deliveredDate}</p>
            <p>{formData.notes}</p>
            <p>{formData.visits}</p>
            <p>{formData.progress}</p>
            <p>{formData.metSalesperson}</p>
            <p>{formData.metFinance}</p>
            <p>{formData.financeApplication}</p>
            <p>{formData.pickUpDate}</p>
            <p>{formData.pickUpTime}</p>
            <p>{formData.depositTakenDate}</p>
            <p>{formData.docsSigned}</p>
            <p>{formData.tradeRepairs}</p>
            <p>{formData.seenTrade}</p>
            <p>{formData.lastNote}</p>
            <p>{formData.applicationDone}</p>
            <p>{formData.licensingSent}</p>
            <p>{formData.liceningDone}</p>
            <p>{formData.refunded}</p>
            <p>{formData.cancelled}</p>
            <p>{formData.lost}</p>
            <p>{formData.dLCopy}</p>
            <p>{formData.insCopy}</p>
            <p>{formData.testDrForm}</p>
            <p>{formData.voidChq}</p>
            <p>{formData.loanOther}</p>
            <p>{formData.signBill}</p>
            <p>{formData.ucda}</p>
            <p>{formData.tradeInsp}</p>
            <p>{formData.customerWS}</p>
            <p>{formData.otherDocs}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
/**
 *
 * ACCOUNT
{
  id: 17162,
  created_at: '2023-12-14T16:45:54+00:00',
  updated_at: '2023-12-14T16:45:56+00:00',
  name: 'Sandbox - Skyler Zanth'
}
// COMMUNICATIONS
{
  data: {
    id: 58300174,
    lead_id: 42132008,
    user_id: 143041,
    created_by: 143041,
    created_at: '2024-02-15T09:00:32+00:00',    updated_at: '2024-02-15T09:00:32+00:00',    executed_at: '2024-02-15T06:00:00+00:00',
    method: 'phone',
    type: 'outgoing',
    call_duration: null,
    call_phone: null,
    call_status: 'calling',
    description: 'Call made to customer, reached voicemeail.'
  }
}
// VEHCILE
 data: {
    id: 47454845,
    lead_id: 42132008,
    created_at: '2024-02-15T08:36:22+00:00',    end_contract_date: null,
    end_warranty_date: null,
    purchase_date: null,
    recorded_date: null,
    sold_date: null,
    updated_at: '2024-02-15T08:36:22+00:00',    actual_value: null,
    accessories: null,
    allowed_odometer: null,
    balance: 0,
    body_type: null,
    documentation: null,
    budget_max: null,
    budget_min: null,
    cash_down: null,
    category: null,
    category_rv: null,
    certified: false,
    client_number: null,
    color_exterior: null,
    color_interior: null,
    comment: null,
    condition: null,
    driving_wheels: null,
    engine: null,
    extended_warranty: null,
    fuel: null,
    inventory_unit_id: null,
    length_max: null,
    length_min: null,
    license_plate: null,
    make: 'BMW Motorrad',
    modality: null,
    model: 'S1000RR',
    odometer: null,
    offer_number: null,
    option: null,
    order_number: null,
    payment: null,
    payment_with_tax: null,
    payment_frequency: null,
    preparation: null,
    price: null,
    profit: null,
    rate: null,
    recall: null,
    residual: null,
    security_deposit: null,
    sleeping: null,
    sold: null,
    sold_by: null,
    stock: null,
    stock_state: null,
    term: null,
    tire: null,
    transmission: null,
    trim: null,
    type: 'wanted',
    value: null,
    vin: null,
    warranty: null,
    weight: null,
    year: 2018,
    year_max: null,
    year_min: null
  }
}
// LEAD
 * data: {
    id: 42138417,
    account_id: 17162,
    customer_id: 40373004,
    source_id: null,
    provider_id: null,
    appointment_date: null,
    appointment_event_id: null,
    phone_appointment_date: null,
    available_date: null,
    be_back_date: null,
    birth_date: null,
    call_date: null,
    created_at: '2024-02-15T09:08:07+00:00',    csi_date: null,
    deliverable_date: null,
    delivered_date: null,
    delivery_date: null,
    funded: null,
    end_service_date: null,
    home_presented_date: null,
    last_visit_date: null,
    next_visit_date: null,
    open_work_order_date: null,
    paperwork_date: null,
    planned_pick_up_date: null,
    presented_date: null,
    promised_date: null,
    refinanced_date: null,
    repair_date: null,
    road_test_date: null,
    home_road_test_date: null,
    sale_date: null,
    take_over_date: null,
    unsubscribe_all_date: null,
    unsubscribe_call_date: null,
    unsubscribe_email_date: null,
    unsubscribe_sms_date: null,
    updated_at: '2024-02-15T09:08:08+00:00',    work_order_closure_date: null,
    work_order_partial_closure_date: null,
    address_line1: null,
    address_line2: null,
    credit_approved: false,
    average_spending: 0,
    business: null,
    business_name: null,
    city: null,
    civility: null,
    code: null,
    comment: null,
    country: 'CA',
    created_method: 'api',
    dealer_tour: null,
    division: null,
    financial_institution: null,
    first_name: 'Justin',
    gender: 0,
    inspected: false,
    invoiced: false,
    last_name: 'Zanth',
    locale: 'fr',
    loyalty: null,
    odometer_last_visit: null,
    postal_code: null,
    prepaid: null,
    prepared: false,
    province: 'QC',
    qualification: null,
    rating: null,
    reached_client: false,
    repair_order: null,
    result: 'pending',
    second_contact: null,
    second_contact_civility: null,
    segment: null,
    service_cleaned: false,
    service_interval_km: null,
    service_monthly_km: null,
    source: null,
    progress_state: null,
    status: null,
    storage: null,
    type: 'email',
    walk_around: false,
    work_order: null,
    referrer: null,
    search_term: null,
    keyword: null,
    navigation_history: null,
    campaign: null,
    response_time: null,
    first_update_time: null,
    account: {
      id: 17162,
      created_at: '2023-12-14T16:45:54+00:00',
      updated_at: '2023-12-14T16:45:56+00:00',
      name: 'Sandbox - Skyler Zanth'
    },
    advisor: null,
    bdc: null,
    commercial: null,
    service_advisor: null,
    service_agent: null,
    customer: { id: 40373004 },
    emails: [ [Object] ],
    phones: [ [Object] ],
    products: [],
    vehicles: [ [Object], [Object] ]
  }
}
Error: You defined a loader for
  ],
  links: {
    first: 'https://api.crm.activix.ca/v2/leads?page=1',
    last: 'https://api.crm.activix.ca/v2/leads?page=1',
    prev: null,
    next: null
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 1,
    links: [ [Object], [Object], [Object] ],    path: 'https://api.crm.activix.ca/v2/leads',
    per_page: 25,
    to: 1,
    total: 1
  }
}
  const processedDataList = activixDataList.map((activixData) => {
    let data = {
      activixId: activixData.customer_id,
      email: activixData.email[0],
      firstName: activixData.first_name,
      lastName: activixData.last_name,
      phone: activixData.phones[0],
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
    const mergedData = await getMergedFinance(user.email);

    const salesData = {
      financeManager: mergedData.financeManager,
      email: mergedData.email,
      firstName: mergedData.firstName,
      lastName: mergedData.lastName,
      phone: mergedData.phone,
      name: mergedData.first_name + ' ' + mergedData.name,
      address: mergedData.address,
      city: mergedData.city,
      postal: mergedData.postal,
      province: mergedData.province,
      dl: mergedData.dl,
      typeOfContact: mergedData.typeOfContact,
      timeToContact: mergedData.timeToContact,
      iRate: mergedData.iRate,
      months: mergedData.months,
      discount: mergedData.discount,
      total: mergedData.total,
      onTax: mergedData.onTax,
      on60: mergedData.on60,
      biweekly: mergedData.biweekly,
      weekly: mergedData.weekly,
      weeklyOth: mergedData.weeklyOth,
      biweekOth: mergedData.biweekOth,
      oth60: mergedData.oth60,
      weeklyqc: mergedData.weeklyqc,
      biweeklyqc: mergedData.biweeklyqc,
      qc60: mergedData.qc60,
      deposit: mergedData.deposit,
      biweeklNatWOptions: mergedData.biweeklNatWOptions,
      weeklylNatWOptions: mergedData.weeklylNatWOptions,
      nat60WOptions: mergedData.nat60WOptions,
      weeklyOthWOptions: mergedData.weeklyOthWOptions,
      biweekOthWOptions: mergedData.biweekOthWOptions,
      oth60WOptions: mergedData.oth60WOptions,
      biweeklNat: mergedData.biweeklNat,
      weeklylNat: mergedData.weeklylNat,
      nat60: mergedData.nat60,
      qcTax: mergedData.qcTax,
      otherTax: mergedData.otherTax,
      totalWithOptions: mergedData.totalWithOptions,
      otherTaxWithOptions: mergedData.otherTaxWithOptions,
      desiredPayments: mergedData.desiredPayments,
      freight: mergedData.freight,
      admin: mergedData.admin,
      commodity: mergedData.commodity,
      pdi: mergedData.pdi,
      discountPer: mergedData.discountPer,
      userLoanProt: mergedData.userLoanProt,
      userTireandRim: mergedData.userTireandRim,
      userGap: mergedData.userGap,
      userExtWarr: mergedData.userExtWarr,
      userServicespkg: mergedData.userServicespkg,
      deliveryCharge: mergedData.deliveryCharge,
      vinE: mergedData.vinE,
      lifeDisability: mergedData.lifeDisability,
      rustProofing: mergedData.rustProofing,
      userOther: mergedData.userOther,
      paintPrem: mergedData.paintPrem,
      licensing: mergedData.licensing,
      stockNum: mergedData.stockNum,
      options: mergedData.options,
      accessories: mergedData.accessories,
      labour: mergedData.labour,
      year: mergedData.year,
      brand: mergedData.brand,
      model: mergedData.model,
      model1: mergedData.model1,
      color: mergedData.color,
      modelCode: mergedData.modelCode,
      msrp: mergedData.msrp,
      userEmail: mergedData.userEmail,
      tradeValue: mergedData.tradeValue,
      tradeDesc: mergedData.tradeDesc,
      tradeColor: mergedData.tradeColor,
      tradeYear: mergedData.tradeYear,
      tradeMake: mergedData.tradeMake,
      tradeVin: mergedData.tradeVin,
      tradeTrim: mergedData.tradeTrim,
      tradeMileage: mergedData.tradeMileage,
      trim: mergedData.trim,
      vin: mergedData.vin,
      leadNote: mergedData.leadNote,
      sendToFinanceNow: mergedData.sendToFinanceNow,
      dealNumber: mergedData.dealNumber,
      bikeStatus: mergedData.bikeStatus,
      referral: mergedData.referral,
      visited: mergedData.visited,
      bookedApt: mergedData.bookedApt,
      aptShowed: mergedData.aptShowed,
      aptNoShowed: mergedData.aptNoShowed,
      testDrive: mergedData.testDrive,
      metService: mergedData.metService,
      metManager: mergedData.metManager,
      metParts: mergedData.metParts,
      sold: mergedData.sold,
      depositMade: mergedData.depositMade,
      refund: mergedData.refund,
      turnOver: mergedData.turnOver,
      financeApp: mergedData.financeApp,
      approved: mergedData.approved,
      signed: mergedData.signed,
      pickUpSet: mergedData.pickUpSet,
      demoed: mergedData.demoed,
      delivered: mergedData.delivered,
      lastContact: mergedData.lastContact,
      status: mergedData.status,
      customerState: mergedData.customerState,
      result: mergedData.result,
      timesContacted: mergedData.timesContacted,
      nextAppointment: mergedData.nextAppointment,
      followUpDay: mergedData.followUpDay,
      deliveredDate: mergedData.deliveredDate,
      notes: mergedData.notes,
      visits: mergedData.visits,
      progress: mergedData.progress,
      metSalesperson: mergedData.metSalesperson,
      metFinance: mergedData.metFinance,
      financeApplication: mergedData.financeApplication,
      pickUpDate: mergedData.pickUpDate,
      pickUpTime: mergedData.pickUpTime,
      depositTakenDate: mergedData.depositTakenDate,
      docsSigned: mergedData.docsSigned,
      tradeRepairs: mergedData.tradeRepairs,
      seenTrade: mergedData.seenTrade,
      lastNote: mergedData.lastNote,
      applicationDone: mergedData.applicationDone,
      licensingSent: mergedData.licensingSent,
      liceningDone: mergedData.liceningDone,
      refunded: mergedData.refunded,
      cancelled: mergedData.cancelled,
      lost: mergedData.lost,
      dLCopy: mergedData.dLCopy,
      insCopy: mergedData.insCopy,
      testDrForm: mergedData.testDrForm,
      voidChq: mergedData.voidChq,
      loanOther: mergedData.loanOther,
      signBill: mergedData.signBill,
      ucda: mergedData.ucda,
      tradeInsp: mergedData.tradeInsp,
      customerWS: mergedData.customerWS,
      otherDocs: mergedData.otherDocs,
    }

    const dashData = {
      ...salesData,
      ...data,

    }
    return dashData; // Return the processed data for each activixData entry
  });

  return processedDataList; */



// Check if there are more pages to process


/**
 *
 *  for (const activixData of response.data.data) {
         console.log(activixData, 'checkkkk', activixData.id)
         try {
           if (activixData.id) {
             const checkFinance = await prisma.finance.findMany({ where: { userEmail: user.email } })
             let hasMatchingFinance = false;

             for (const financeRecord of checkFinance) {
               // Add your custom logic here to determine a match
               if (financeRecord.activixId === activixData.id) {
                 const finance = await prisma.finance.findUnique({ where: { activixId: activixData.id } })
                 console.log(finance)


                 if (finance) {
                   await prisma.finance.update({
                     where: { id: finance.id }, // Ensure finance.id is not undefined
                     data: {
                       email: activixData.email[0],
                       firstName: activixData.first_name,
                       lastName: activixData.last_name,
                       phone: activixData.phones[0],
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
                     },
                   });

                   // Update clientfile record
                   await prisma.clientfile.update({
                     where: { id: finance.clientfileId },
                     data: {
                       firstName: activixData.first_name,
                       lastName: activixData.last_name,
                       phone: activixData.phones[0],
                       name: activixData.first_name + ' ' + activixData.last_name,
                       email: activixData.email[0],
                       address: activixData.address_line1,
                       city: activixData.city,
                       province: activixData.province,
                     },
                   });
                   await prisma.dashboard.update({
                     where: { id: finance?.dashboardId, },
                     customerState: activixData.result,
                     status: activixData.status
                   })
                 } else {
                   // Handle the case when finance record is not found
                   console.error('Finance record not found for activixId:', activixData.id);
                 }
                 hasMatchingFinance = true;
                 break; // Exit the loop since a match is found
               }
             }

             // Additional code based on the result
             if (hasMatchingFinance) {
               console.log('Match found, do something...');
               const finance = await prisma.finance.findUnique({ where: { activixId: activixData.id } })
               console.log(finance)


               if (finance) {
                 await prisma.finance.update({
                   where: { id: finance.id }, // Ensure finance.id is not undefined
                   data: {
                     email: activixData.email[0],
                     firstName: activixData.first_name,
                     lastName: activixData.last_name,
                     phone: activixData.phones[0],
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
                   },
                 });

                 // Update clientfile record
                 await prisma.clientfile.update({
                   where: { id: finance.clientfileId },
                   data: {
                     firstName: activixData.first_name,
                     lastName: activixData.last_name,
                     phone: activixData.phones[0],
                     name: activixData.first_name + ' ' + activixData.last_name,
                     email: activixData.email[0],
                     address: activixData.address_line1,
                     city: activixData.city,
                     province: activixData.province,
                   },
                 });
                 await prisma.dashboard.update({
                   where: { id: finance?.dashboardId, },
                   customerState: activixData.result,
                   status: activixData.status
                 })
               } else {
                 // Handle the case when finance record is not found
                 console.error('Finance record not found for activixId:', activixData.id);
               }
             } else {
               console.log('No match found, do something else...');
               let clientfile = await prisma.clientfile.findUnique({ where: { email: activixData.emails[0] } });
               if (!clientfile) {
                 clientfile = await prisma.clientfile.create({
                   data: {
                     firstName: activixData.first_name,
                     lastName: activixData.last_name,
                     phone: activixData.phones[0],
                     name: activixData.first_name + ' ' + activixData.last_name,
                     email: activixData.email[0],
                     address: activixData.address_line1,
                     city: activixData.city,
                     province: activixData.province,
                   }
                 })
               }
               let finance = await prisma.finance.findUnique({ where: { activixId: activixData.id } })

               if (!finance) {
                 finance = await prisma.finance.create({
                   data: {

                     email: activixData.email[0],
                     firstName: activixData.first_name,
                     lastName: activixData.last_name,
                     phone: activixData.phones[0],
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
                 const savedActivix = await prisma.activixLead.create({
                   data: {
                     financeId: finance.id,
                     id: activixData.id,
                     account_id: activixData.account_id,
                     customer_id: activixData.customer_id,
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
                     credit_approved: activixData.credit_approved,
                     dealer_tour: activixData.dealer_tour,
                     division: activixData.division,
                     financial_institution: activixData.financial_institution,
                     first_name: activixData.first_name,
                     form: activixData.form,
                     funded: activixData.funded,
                     gender: activixData.gender,
                     inspected: activixData.inspected,
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
                     walk_around: activixData.walk_around,
                     comment: activixData.comment,
                     advisor: activixData.advisor,
                     delivered_by: activixData.delivered_by,
                     emails: activixData.emails[0],
                     emails2: activixData.emails[1],
                     phones: activixData.phones[0],
                     phones2: activixData.phones[1],
                     phones3: activixData.phones[2],
                   }
                 })
                 const dashboard = await prisma.dashboard.create({
                   financeId: finance.id,
                   customerState: activixData.result,
                   status: activixData.status

                 })
                 const updateFinance = await prisma.finance.update({
                   where: {
                     id: finance.id,
                   },
                   data: {
                     activixId: savedActivix.id,
                     clientfileId: clientfile.id,
                     dashboardId: dashboard.id,
                   }
                 })
                 return json({ savedActivix, dashboard, updateFinance, finance })
               }
             }
           }
         } catch (error) {
           console.error('Error processing Activix data:', error);
           // Handle the error as needed, e.g., log it or perform some fallback action
         }
       }
     } catch (error) {
       console.error('Error fetching data:', error);
       break; // Exit the loop in case of an error
     }
     console.log(response.data.data, 'response', currentPage);

   } while (response.data.meta.pagination.current_page < response.data.meta.pagination.total_pages);

   // Return statement should be outside the do-while loop
   return json({ message: 'SyncLeadData completed' });const localLeads = await prisma.finance.findMany({
    where: { activixId: { equals: null } }
  });
 */
