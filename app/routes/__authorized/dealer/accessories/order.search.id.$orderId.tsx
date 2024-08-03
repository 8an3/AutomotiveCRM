import { LoaderFunction } from "@remix-run/node";
import { prisma } from "~/libs";

export async function loader({ request, params }: LoaderFunction) {
  const id = params.orderId
  const order = await prisma.accOrder.findUnique({
    where: { id: id },
    select: {
      id: true,
      createdAt: true,
      userEmail: true,
      fulfilled: true,
      total: true,
      clientfileId: true,
      discount: true,
      discPer: true,
      Clientfile: {
        select: {
          id: true,
          financeId: true,
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
        },
      },
      AccessoriesOnOrders: {
        select: {
          id: true,
          quantity: true,
          accOrderId: true,
          accessoryId: true,
          accessory: {
            select: {
              accessoryNumber: true,
              brand: true,
              name: true,
              price: true,
              cost: true,
              quantity: true,
              description: true,
              category: true,
              subCategory: true,
              onOrder: true,
              distributer: true,
              location: true,
            },
          },
        },
      },
      Payments: {
        select: {
          id: true,
          paymentType: true,
          cardNum: true,
          amountPaid: true,
          receiptId: true,
          accOrderId: true,
        },
      },
    },
  });
  return order
}
