import { LoaderFunction, json } from "@remix-run/node"
import { prisma } from "~/libs"

export async function loader({ request, params }: LoaderFunction) {
  const email = params.techEmail
  console.log(email, 'tech reloader')

  let allServiceApts = await prisma.workOrderApts.findMany({
    where: { techEmail: email },
    select: {
      id: true,
      tech: true,
      techEmail: true,
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
          note: true,
          closedAt: true,
          createdAt: true,
          updatedAt: true,
          Clientfile: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
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
            }
          }
        }
      }
    }
  })

  const formattedData = allServiceApts.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
    isDraggable: true,
  }));


  return formattedData

}
