/**import { prisma } from "~/libs";

//export const config = { runtime: 'edge', };


export default async function handler(request: Request) {
  const userAppointments = await prisma.clientApts.findMany({
    where: {
      start: {
        gte: new Date(), // Appointments starting from now
        lte: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Appointments within the next 24 hours
      },
    },
  });

  const notifications = [];

  for (const appointment of userAppointments) {
    // Create user notification for each appointment
    const notification = await prisma.notificationsUser.create({
      data: {
        userId: appointment.userId,
        title: `${appointment.firstName} ${appointment.lastName} on the ${appointment.unit} @ ${appointment.start}`,
        content: `${appointment.content}`,
        read: 'false',
        type: 'updates',
        financeId: appointment.financeId,
      },
    });

    console.log(`Notification created: ${notification.id}`);

    notifications.push(notification);
  }

  return notifications;
}
 */
