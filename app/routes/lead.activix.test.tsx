import { type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { prisma } from "~/libs";
import { getSession } from '~/sessions/auth-session.server';
import { CreateLeadActivix } from "./api.activix";
// loader function
export async function loader({ request, params }: LoaderFunction) {

}


/**
 *
 * const session2 = await getSession(request.headers.get("Cookie"));
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
  const formData = {
    firstName: 'Hiracheo',
    lastName: 'Kane',
    email: 'hieracheokane@gmail.com',
    phone: '6137977145',
    brand: 'H-D',
    model: 'Road Glide',
    year: '2024',
    color: 'Black',
    vin: '5HDASFDASF5645165',
    price: '32499',
    tradeMake: 'BMW',
    tradeDesc: 'S1000RR',
    tradeYear: '2020',
    tradeVin: '32SDFG54SGDSDF777',
    tradeColor: 'BLACK',
    tradeMileage: '5252',
  }
  const sendLead = await CreateLeadActivix(formData, user)
  console.log(sendLead)
  return sendLead */
