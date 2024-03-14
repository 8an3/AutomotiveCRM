import { type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { prisma } from "~/libs";

// loader function
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

  if (!user) {
    redirect('/login')
  }

  try {
    const accessToken = process.env.API_ACTIVIX;
    const response = await axios.get(`https://api.crm.activix.ca/v2/leads?include[]=emails&include[]=phones`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
    });

    return { activixData: response.data }; // Return response data

  } catch (error) {
    console.error('Full error object:', error);
    console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
    console.error(`Error status: ${error.response.status}`);
    console.error('Error response:', error.response.data);
    throw error; // Throw error to be caught by the caller
  }
}

// Activixtest component
export default function Activixtest({ activixData }: { activixData: any }) {
  console.log(activixData); // Check if data is received

  // Render activixData here
}


export default function Activixtest() {
  const { activixData } = useLoaderData();

  return (
    <div>
      <h1>Activix Data</h1>
      <ul>
        {activixData.map((data, index) => (
          <li key={index}>
            <p>ID: {data.id}</p>
            <p>Name: {data.name}</p>
            {/* Add more data fields as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
}
