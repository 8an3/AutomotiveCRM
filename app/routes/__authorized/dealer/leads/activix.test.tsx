import { type LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { useState, useEffect } from 'react'
import { GetUser } from "~/utils/loader.server";
import { prisma } from "~/libs";
import { getSession } from '~/sessions/auth-session.server';
import { CreateLeadActivix, GetLeads } from "~/routes/__authorized/dealer/api/activix";
import { Unauthorized } from "~/routes/__authorized/dealer/email/server";
const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"

async function CallActi() {
  try {
    const response = await axios.get(`https://api.crm.activix.ca/v2/leads?filter[created_at]=2024-03-21&include[]=emails&include[]=phones&include[]=vehicles&include[]=advisor&include[]=account&include[]=communications`, {
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

export async function loader({ request, params }) {
  try {
    const session2 = await getSession(request.headers.get("Cookie"));
    const email = session2.get("email");
    const user = await GetUser(email)
    if (!user) {
      console.error("User not found");
      return redirect('/login');
    }

    const harleyModels = await prisma.harley.findMany();
    const canamModels = await prisma.canam.findMany();

    console.log("Harley Models:", harleyModels);
    console.log("Can-Am Models:", canamModels);

    const harleyModelNames = harleyModels.map(model => model?.model).filter(Boolean);
    const canamModelNames = canamModels.map(model => model?.model).filter(Boolean);


    const modelList = {
      'Harley-Davidson': harleyModelNames,
      'Can-Am': canamModelNames,
    };

    console.log("Model List:", modelList);

    return json({ modelList });
  } catch (error) {
    console.error("Error in loader:", error);
    return error;
  }
}

export default function CheckThis() {
  const { modelList } = useLoaderData();
  console.log(modelList, 'modelList')
  const [selectedType, setSelectedType] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [models, setModels] = useState([]);

  useEffect(() => {
    if (modelList) {
      // Extract models from modelList based on selectedType
      const selectedModels = modelList[selectedType] || [];
      setModels(selectedModels);
    }
  }, [modelList, selectedType]);

  console.log(models, 'models');

  // Function to handle change in the brand dropdown
  const handleTypeChange = (event) => {
    const selectedType = event.target.value;
    setSelectedType(selectedType);
    // Populate the second dropdown based on the selected brand
    if (selectedType && modelList && modelList[selectedType]) {
      setModels(modelList[selectedType]);
    } else {
      setModels([]);
    }
  };
  return (
    <div>
      <div className='flex justify-between mt-3 xs:grid xs:grid-cols-1'>
        <select value={selectedType} onChange={handleTypeChange}
          className="rounded border-0 ml-2 mr-2 bg-white px-3 py-3 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
        >
          <option value="">Select Brand</option>

          {/* Map over the brand options */}
          {modelList && Object.keys(modelList).map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        {selectedType && (
          <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}
            className="mx-auto  rounded border-0 ml-2 mr-2 bg-white px-3 py-3 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
          >
            <option value="">Select Model</option>

            {/* Map over the models of the selected brand */}
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        )}

      </div>
    </div>
  )
}


async function CreateCompleteEvent() {
  const leadId = 43280101
  const getEvent = await axios.get(
    `https://api.crm.activix.ca/v2/leads/${leadId}?include[]=events`,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  // Handle successful response
  console.log('Response:', getEvent.data.data.events);
  const lastEventId = getEvent.data.data.events[0].id
  const description = 'test';
  const startAt = new Date();
  startAt.setMinutes(startAt.getMinutes() - 5);
  const completed = startAt.toISOString().replace(/\.\d{3}Z$/, '-04:00');
  console.log(completed);

  const updated = await axios.post(`https://api.crm.activix.ca/v2/events`,
    {
      lead_id: lastEventId,
      completed: true,
      completed_at: completed,
      end_at: getEvent.data.data.events[0].end_at,
      start_at: getEvent.data.data.events[0].start_at,
      title: getEvent.data.data.events[0].title,
      type: getEvent.data.data.events[0].type,
      owner_id: 143041,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
    });
  const error = updated.response.data.errors;
  console.log(error);
  console.log(updated)
}
async function CreateAndCompleteEvent() {
  const leadId = 43314827//response.data.data.id;

  const getEvent = await axios.get(
    `https://api.crm.activix.ca/v2/leads/${leadId}?include[]=events`,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  // Handle successful response
  console.log('Response:', getEvent.data.data.events);
  const lastEventId = getEvent.data.data.events[0].id
  const description = 'test';
  const startAt = new Date();
  startAt.setMinutes(startAt.getMinutes() - 5);
  const completed = startAt.toISOString().replace(/\.\d{3}Z$/, '-04:00');
  console.log(completed);

  const updated = await axios.put(`https://api.crm.activix.ca/v2/events/32939459`,
    {
      lead_id: 43280101, //lastEventId,
      completed: true,
      completed_at: '2024-03-21T21:00:14+00:00',
      end_at: '2024-03-21T21:00:16+00:00',// getEvent.data.data.events[0].end_at,
      start_at: '2024-03-21T21:00:15+00:00', //getEvent.data.data.events[0].start_at,
      title: 'F/U on the Low Rider ST - Color - FXLRS',//getEvent.data.data.events[0].title,
      type: 'appointment',// getEvent.data.data.events[0].type,
      owner_id: 143041,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
    });
  console.log(updated.data, 'getEvents')
  console.dir(updated.data, 'getEvents')
  return null
}
async function GetSingleLead() {
  try {
    const response = await axios.get(
      `https://api.crm.activix.ca/v2/leads/43808652?include[]=phones&include[]=emails&include[]=vehicles&include[]=events&include[]=advisor&include[]=account&include[]=communications&include[]=tasks`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = response.data.data;

    console.log("Customer ID:", data.id);
    console.log("Customer Name:", `${data.first_name} ${data.last_name}`);
    console.log("Emails:");
    console.log('Advisor - ', data.advisor);

    data.emails.forEach(email => {
      console.log("  -", email.id);
      console.log("  -", email.address);
    });

    data.communications.forEach(email => {
      console.log("  -", email.id);
      console.log("  -", email.lead_id);
      console.log("  -", email.method);
      console.log("  -", email.type);
      console.log("  -", email.description);
      console.log("  -", email.email_subject);
      console.log("  -", email.email_body);
      console.log("  -", email.email_user);
    });

    console.log("Phones:");
    data.phones.forEach(phone => {
      console.log("  -", phone.id);
      console.log("  -", phone.number);
    });

    console.log("Vehicles:");
    data.vehicles.forEach(vehicle => {
      console.log("  - Vehicle ID:", vehicle.id);
      console.log("    Make:", vehicle.make);
      console.log("    Model:", vehicle.model);
    });

    console.log("Events:");
    data.events.forEach(event => {
      console.log("  - Event ID:", event.id);
      console.log("    Title:", event.title);
      console.log("    Type:", event.type);
    });

    return data;
  } catch (error) {
    console.error('Error:', error);
    return null; // Return null or handle the error accordingly
  }
}


export function CustomerDetails() {
  const { callData } = useLoaderData()
  const [customerData, setCustomerData] = useState(callData);

  return (
    <div className="bg-black text-white p-4 text-center">
      {customerData && (
        <>
          <div>
            <h1 className='mt-5'>Customer ID: {customerData.id}</h1>
            <h2 className='mt-5'>Customer Name: {`${customerData.first_name} ${customerData.last_name}`}</h2>
            <h3 className='mt-5'>Emails:</h3>
            {customerData.emails.map(email => (
              <div key={email.id}>
                <p>ID: {email.id}</p>
                <p>Address: {email.address}</p>
              </div>
            ))}
            <h3 className='mt-5'>Communications:</h3>
            {customerData.communications.map(communication => (
              <div key={communication.id}>
                <p>ID: {communication.id}</p>
                <p>Lead ID: {communication.lead_id}</p>
                <p>Method: {communication.method}</p>
                <p>Type: {communication.type}</p>
                <p>Description: {communication.description}</p>
                <p>Email Subject: {communication.email_subject}</p>
                <p>Email Body: {communication.email_body}</p>
                <p>Email User: {communication.email_user}</p>
              </div>
            ))}
            <h3 className='mt-5'>phones:</h3>
            {customerData.phones.map(email => (
              <div key={email.id}>
                <p>ID: {email.id}</p>
                <p>Address: {email.number}</p>
              </div>
            ))}
            <h3 className='mt-5'>vehicles:</h3>
            {customerData.vehicles.map(email => (
              <div key={email.id}>
                <p>Vehicle ID: {email.id}</p>
                <p>Make: {email.make}</p>
                <p>Model: {email.model}</p>
              </div>
            ))}
            <h3 className='mt-5'>events:</h3>
            {customerData.events.map(email => (
              <div key={email.id}>
                <p>events ID: {email.id}</p>
                <p>lead_id: {email.lead_id}</p>
                <p>owner_id: {email.owner_id}</p>
                <p>title: {email.title}</p>
                <p>type: {email.type}</p>
                <p>start_at: {email.start_at}</p>
              </div>
            ))}
            <h3 className='mt-5'>tasks:</h3>
            {customerData.tasks.map(email => (
              <div key={email.id}>
                <p>events ID: {email.id}</p>
                <p>lead_id: {email.lead_id}</p>
                <p>owner_id: {email.owner_id}</p>
                <p>title: {email.title}</p>
                <p>type: {email.type}</p>
                <p>date: {email.date}</p>
              </div>
            ))}

          </div>
        </>
      )}
    </div>
  );
}

// to get a lead with data
/** await axios.put(
    `https://api.crm.activix.ca/v2/lead-emails/42132008`,
    {
      "address": "test@gmail.com",
      "type": "home",
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
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
    }); */
/** const response = await axios.get(
    `https://api.crm.activix.ca/v2/leads/43570588?include[]=phones&include[]=emails&include[]=vehicles`,

    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
    .then(response => {
      const data = response.data.data; // Accessing the 'data' property of the response

      // Logging customer details
      console.log("Customer ID:", data.id);
      console.log("Customer Name:", `${data.first_name} ${data.last_name}`);
      console.log("Emails:");
      data.emails.forEach(email => {
        console.log("  -", email.id); // Assuming email is a property of each email object
        console.log("  -", email.address); // Assuming email is a property of each email object
      });
      console.log("Phones:");
      data.phones.forEach(phone => {
        console.log("  -", phone.id); // Assuming phone_number is a property of each phone object
        console.log("  -", phone.number); // Assuming phone_number is a property of each phone object
      });
      console.log("Vehicles:");
      data.vehicles.forEach(vehicle => {
        console.log("  - Vehicle ID:", vehicle.id); // Assuming id is a property of each vehicle object
        console.log("    Make:", vehicle.make); // Assuming make is a property of each vehicle object
        console.log("    Model:", vehicle.model); // Assuming model is a property of each vehicle object
        // Add more properties as needed
      });
    })
    .catch(error => {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
    }); */

export async function SyncImport(user) {

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
              activixId: data.id.toString(),
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
              promised_date: data.promised_date,
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
               keyword: data.keyword,*/



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
      async function CreateActvix() {
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
            where: { id: finance.financeId },
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
            where: { id: finance.theRealActId },
            data: {
              activixId: data.id.toString(),
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
              promised_date: data.promised_date,
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
}


export function Activixtest() {
  const { activixData } = useLoaderData();

  // Check if activixData exists and contains data
  if (!activixData || !activixData.data || !Array.isArray(activixData.data)) {
    return <p>No data available</p>;
  }

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

              {/* Add more lead fields as needed */}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

/*
export async function loader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
const user = await GetUser(email)
  if (!user) { redirect('/login'); }

  async function CallActi() {
    try {
      const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"

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
  // msync export
  const record = await prisma.finance.findMany({
    where: {userEmail: user?.email, actvixData: { not: null } },
  })
  async function postToActivix(record) {
    const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"
    try {
      const response = await axios.post('https://api.crm.activix.ca/v2/leads', {
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      console.log('Posted data to Activix API:', response.data);
    } catch (error) { console.error('Error posting data to Activix API:', error); }
  }
  postToActivix(record)
  async function processRecords() {
    for (const record of newLoadsCrm) {
      if (!record.actvixData || !record.actvixData.id) {
        await CallActi();
      }
    }
  }

  // Call the function to start processing the records
  processRecords();
  // sync import
  const activixData = await CallActi();
  if (!activixData || !activixData.data) {
    throw new Error("Failed to fetch ActivixData or missing data");

    const dataObjects = activixData.data;
    for (const data of dataObjects) {
      if (!data.emails || data.emails.length === 0 || !data.emails[0].address) {
        console.log(`Record with id ${data.id} does not have an email address. Skipping...`);
        continue;
      }

      const existsInDatabase = await checkFieldInDatabase(data.id); /

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
                activixId: data.id.toString(),
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
                promised_date: data.promised_date,
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
        async function CreateActvix() {
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
              where: { id: finance.financeId },
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
              where: { id: finance.theRealActId },
              data: {
                activixId: data.id.toString(),
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
                promised_date: data.promised_date,
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
  }

        return user;
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
}

*/
const data = {
  data: [
    {
      id: 32939459,
      lead_id: 43280101,
      owner_id: 143041,
      created_at: '2024-03-20T21:00:14+00:00',
      end_at: '2024-03-22T01:30:15+00:00',
      start_at: '2024-03-22T01:00:15+00:00',
      updated_at: '2024-03-20T21:00:15+00:00',
      canceled: false,
      completed: false,
      completed_at: '',
      confirmed: false,
      description: null,
      no_show: false,
      priority: 'normal',
      title: 'F/U on the Low Rider ST - Color - FXLRS',
      type: 'appointment'
    },
    {
      id: 32936238,
      lead_id: 43570588,
      owner_id: 143041,
      created_at: '2024-03-20T19:57:24+00:00',
      end_at: '2024-03-23T00:27:24+00:00',
      start_at: '2024-03-22T23:57:24+00:00',
      updated_at: '2024-03-20T19:57:24+00:00',
      canceled: false,
      completed: false,
      completed_at: '',
      confirmed: false,
      description: null,
      no_show: false,
      priority: 'normal',
      title: 'F/U on the Road Glide',
      type: 'appointment'
    },
    {
      id: 32916739,
      lead_id: 42138417,
      owner_id: 143041,
      created_at: '2024-03-20T16:19:10+00:00',
      end_at: '2024-03-21T20:49:11+00:00',
      start_at: '2024-03-21T20:19:11+00:00',
      updated_at: '2024-03-20T16:19:11+00:00',
      canceled: false,
      completed: false,
      completed_at: '',
      confirmed: false,
      description: null,
      no_show: false,
      priority: 'normal',
      title: 'F/U on the M3',
      type: 'appointment'
    },
    {
      id: 32916122,
      lead_id: 43314827,
      owner_id: 143041,
      created_at: '2024-03-20T16:06:19+00:00',
      end_at: '2024-03-22T20:36:19+00:00',
      start_at: '2024-03-22T20:06:19+00:00',
      updated_at: '2024-03-20T16:06:19+00:00',
      canceled: false,
      completed: false,
      completed_at: '',
      confirmed: false,
      description: null,
      no_show: false,
      priority: 'normal',
      title: 'F/U on the Nightster - Vivid Black - RH975',
      type: 'appointment'
    },
    {
      id: 32914420,
      lead_id: 43315031,
      owner_id: 143041,
      created_at: '2024-03-20T15:36:31+00:00',
      end_at: '2024-03-21T20:06:31+00:00',
      start_at: '2024-03-21T19:36:31+00:00',
      updated_at: '2024-03-20T15:36:32+00:00',
      canceled: false,
      completed: false,
      completed_at: '',
      confirmed: false,
      description: null,
      no_show: false,
      priority: 'normal',
      title: 'F/U on the Nightster - Color - RH975',
      type: 'appointment'
    },
    {
      id: 32910591,
      lead_id: 43318738,
      owner_id: 143041,
      created_at: '2024-03-20T14:41:00+00:00',
      end_at: '2024-03-21T19:11:00+00:00',
      start_at: '2024-03-21T18:41:00+00:00',
      updated_at: '2024-03-20T14:41:00+00:00',
      canceled: false,
      completed: false,
      completed_at: '',
      confirmed: false,
      description: null,
      no_show: false,
      priority: 'normal',
      title: 'F/U on the Nightster - Vivid Black - RH975',
      type: 'appointment'
    },
    {
      id: 32910095,
      lead_id: 42132008,
      owner_id: 143041,
      created_at: '2024-03-20T14:33:00+00:00',
      end_at: '2024-03-25T19:03:01+00:00',
      start_at: '2024-03-25T18:33:01+00:00',
      updated_at: '2024-03-20T14:33:00+00:00',
      canceled: false,
      completed: false,
      completed_at: '',
      confirmed: false,
      description: null,
      no_show: false,
      priority: 'normal',
      title: 'F/U on the DeLorean',
      type: 'appointment'
    },
    {
      id: 32908521,
      lead_id: 42132008,
      owner_id: 143041,
      created_at: '2024-03-20T14:01:03+00:00',
      end_at: '2024-03-24T18:31:02+00:00',
      start_at: '2024-03-24T18:01:02+00:00',
      updated_at: '2024-03-20T14:01:03+00:00',
      canceled: false,
      completed: false,
      completed_at: '',
      confirmed: false,
      description: null,
      no_show: false,
      priority: 'normal',
      title: 'F/U on the DeLorean',
      type: 'appointment'
    },
    {
      id: 32907305,
      lead_id: 42132008,
      owner_id: 143041,
      created_at: '2024-03-20T13:35:46+00:00',
      end_at: '2024-03-23T02:30:00+00:00',
      start_at: '2024-03-23T02:00:00+00:00',
      updated_at: '2024-03-20T13:35:46+00:00',
      canceled: false,
      completed: false,
      completed_at: '',
      confirmed: false,
      description: null,
      no_show: false,
      priority: 'normal',
      title: 'F/U on the DeLorean',
      type: 'appointment'
    },
    {
      id: 32894624,
      lead_id: 43407584,
      owner_id: 143041,
      created_at: '2024-03-20T08:59:48+00:00',
      end_at: '2024-03-21T13:29:49+00:00',
      start_at: '2024-03-21T12:59:49+00:00',
      updated_at: '2024-03-20T08:59:48+00:00',
      canceled: false,
      completed: false,
      completed_at: '',
      confirmed: false,
      description: null,
      no_show: false,
      priority: 'normal',
      title: 'F/U on the null',
      type: 'appointment'
    }
  ],
}
