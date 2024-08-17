import { json, type LoaderFunction } from "@remix-run/node";
import { prisma } from "~/libs";

export async function loader({ request, params }: LoaderFunction) {
  const dept = params.dept
  const page = params.page;
  const perPage = Number(params.perPage) || 1;

  const skip = (page - 1) * perPage;
  const take = perPage
  let getData;
  if (dept === 'sales') {
    getData = await SalesDept(page, perPage, skip, take,)
  }
  if (dept === 'client') {
    getData = await Client(page, perPage, skip, take,)
  }
  if (dept === 'accessories') {
    getData = await ServiceDept(page, perPage, skip, take,)
  }
  if (dept === 'parts') {
    getData = await ServiceDept(page, perPage, skip, take)
  }
  if (dept === 'service') {
    getData = await ServiceDept(page, perPage, skip, take)
  }
  // console.log(getData, 'getData')
  return getData
}
async function ServiceDept(page, perPage, skip, take) {
  try {
    const finance = await prisma.workOrder.findMany({
      select: {
        workOrderId: true,
        unit: true,
        mileage: true,
        vin: true,
        tag: true,
        motor: true,
        color: true,
        budget: true,
        waiter: true,
        totalLabour: true,
        totalParts: true,
        subTotal: true,
        total: true,
        writer: true,
        userEmail: true,
        tech: true,
        techEmail: true,
        notes: true,
        customerSig: true,
        status: true,
        location: true,
        quoted: true,
        paid: true,
        remaining: true,
        FinanceUnitId: true,
        ServiceUnitId: true,
        financeId: true,
        clientfileId: true,
        note: true,
        closedAt: true,
        createdAt: true,
        updatedAt: true,
        Clientfile: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            financeId: true,
            userId: true,
            firstName: true,
            lastName: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            postal: true,
            province: true,
            dl: true,
            typeOfContact: true,
            timeToContact: true,
            conversationId: true,
            billingAddress: true,
          }
        }
      },
      skip,
      take,
    });

    const total = await prisma.workOrder.count({});

    return json({
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
      finance,
    });
  } catch (error) {
    console.error("Error loading orders:", error);
    return json({ error: 'Error loading orders' }, { status: 500 });
  }
}
async function Client(page, perPage, skip, take) {
  try {
    const finance = await prisma.clientfile.findMany({
      skip,
      take
    });

    const total = await prisma.clientfile.count({});

    return json({
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
      finance,
    });
  } catch (error) {
    console.error("Error loading orders:", error);
    return json({ error: 'Error loading orders' }, { status: 500 });
  }
}
async function SalesDept(page, perPage, skip, take) {
  try {
    const finance = await prisma.finance.findMany({
      skip,
      take
    });

    const total = await prisma.finance.count({});

    return json({
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
      finance,
    });
  } catch (error) {
    console.error("Error loading orders:", error);
    return json({ error: 'Error loading orders' }, { status: 500 });
  }
}
