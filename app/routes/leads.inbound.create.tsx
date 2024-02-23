// In your route file
import { PrismaClient } from "@prisma/client";
import { type ActionFunction } from "@remix-run/node";

let prisma = new PrismaClient();

// post
export let action: ActionFunction = async ({ request }) => {
  let data = await request.json();
  console.log(data)
  let clientfile = await prisma.clientfile.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!clientfile) {
    clientfile = await prisma.clientfile.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        postal: data.postal,
        province: data.province,
        dl: data.dl,
        typeOfContact: data.typeOfContact,
        timeToContact: data.timeToContact,
      },
    });
  }
  let finance = await prisma.finance.create({
    data: {
      clientfileId: clientfile.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      name: data.name,
      address: data.address,
      city: data.city,
      postal: data.postal,
      province: data.province,
      dl: data.dl,
      typeOfContact: data.typeOfContact,
      timeToContact: data.timeToContact,
      deposit: data.deposit,
      desiredPayments: data.desiredPayments,
      stockNum: data.stockNum,
      options: data.options,
      accessories: data.accessories,
      year: data.year,
      brand: data.brand,
      model: data.model,
      model1: data.model1,
      color: data.color,
      modelCode: data.modelCode,
      msrp: data.msrp,
      tradeValue: data.tradeValue,
      tradeDesc: data.tradeDesc,
      tradeColor: data.tradeColor,
      tradeYear: data.tradeYear,
      tradeMake: data.tradeMake,
      tradeVin: data.tradeVin,
      tradeTrim: data.tradeTrim,
      tradeMileage: data.tradeMileage,
      trim: data.trim,
      vin: data.vin,
    },
  });
  console.log(finance)

  let dashboard = await prisma.dashboard.create({
    data: {
      financeId: finance.id,
      clientfileId: clientfile.id,
    },
  });
  console.log(dashboard)

  await prisma.finance.update({
    where: {
      id: finance.id,
    },
    data: {
      financeId: finance.id,
      dashboardId: dashboard.id,
      clientfileId: clientfile.id,
    }
  })

  await prisma.notificationsUser.create({
    data: {
      title: `New Lead: ${finance.firstName} ${finance.lastName}`,
      read: 'false',
      type: 'New Lead',
      content: `${finance.year} ${finance.brand} ${finance.model}`,
      userId: '007',
      financeId: finance.id,
      clientfileId: clientfile.id,
    },
  });

  return new Response(null, { status: 200 });
};
