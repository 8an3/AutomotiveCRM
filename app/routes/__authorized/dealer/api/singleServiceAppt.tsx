import { json, type LoaderFunction, } from '@remix-run/node';
import { prisma } from "~/libs";

export async function loader({ request, params }: LoaderFunction) {
  const url = new URL(request.url);
  const apptId = url.searchParams.get("apptId") || '';
  const appt = await prisma.workOrderApts.findUnique({
    where: { id: apptId },
    select: {
      id: true,
      tech: true,
      writer: true,
      start: true,
      end: true,
      title: true,
      workOrderId: true,
      completed: true,
      resourceId: true,
      unit: true,
      mileage: true,
      vin: true,
      tag: true,
      motor: true,
      color: true,
      location: true,
      WorkOrder: {
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
            }
          }
        }
      }
    }
  })
  console.log(url, apptId, appt, 'singleAppt')
  return json({ appt })
}
