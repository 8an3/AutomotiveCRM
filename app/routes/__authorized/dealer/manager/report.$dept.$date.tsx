import { LoaderFunction } from "@remix-run/node"
import { prisma } from "~/libs"


export async function loader({ request, params }: LoaderFunction) {
  const date = new Date(params.date)
  const dept = params.dept
  let result;
  let getIt
  if (dept === 'Service') {
    getIt = await prisma.workOrder.findMany({
      where: { status: 'Closed' }
    });
    result = getIt.filter((workOrder) => {
      const closedDate = new Date(workOrder.closedAt);
      return (
        closedDate.getFullYear() === date.getFullYear() &&
        closedDate.getMonth() === date.getMonth() &&
        closedDate.getDate() === date.getDate()
      );
    });
  }
  if (dept === 'Accessories') {
    getIt = await prisma.accOrder.findMany({
      where: { paid: true, sellingDept: 'Accessories' },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        userEmail: true,
        userName: true,
        dept: true,
        sellingDept: true,
        total: true,
        discount: true,
        discPer: true,
        paid: true,
        paidDate: true,
        status: true,
        workOrderId: true,
        note: true,
        financeId: true,
        clientfileId: true,
        Payments: {
          select: {
            id: true,
            createdAt: true,
            paymentType: true,
            cardType: true,
            amountPaid: true,
            cardNum: true,
            receiptId: true,
            financeId: true,
            userEmail: true,
            accOrderId: true,
            workOrderId: true,
          }
        }
      }
    });
    result = getIt.filter((accOrder) => {
      const closedDate = new Date(accOrder.paidDate);
      return (
        closedDate.getFullYear() === date.getFullYear() &&
        closedDate.getMonth() === date.getMonth() &&
        closedDate.getDate() === date.getDate()
      );
    });
  }
  if (dept === 'Parts') {
    getIt = await prisma.accOrder.findMany({
      where: { paid: true, sellingDept: 'Parts' },
    });
    result = getIt.filter((accOrder) => {
      const closedDate = new Date(accOrder.paidDate);
      return (
        closedDate.getFullYear() === date.getFullYear() &&
        closedDate.getMonth() === date.getMonth() &&
        closedDate.getDate() === date.getDate()
      );
    });
  }
  if (dept === 'Sales') {
    getIt = await prisma.finance.findMany({
      where: { delivered: 'true' },
    });
    result = getIt.filter((finance) => {
      const closedDate = new Date(finance.deliveredDate);
      return (
        closedDate.getFullYear() === date.getFullYear() &&
        closedDate.getMonth() === date.getMonth() &&
        closedDate.getDate() === date.getDate()
      );
    });
  }

  return result;
}
