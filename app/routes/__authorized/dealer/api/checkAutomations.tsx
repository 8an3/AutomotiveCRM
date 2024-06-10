import { prisma } from '~/libs';

const sendReminder = async (email, message, customer) => {
  const notifications = await prisma.notificationsUser.create({
    data: {
      userEmail: String(email),
      title: 'Appointment Reminder!',
      content: message,
      type: "updates",
      financeId: String(customer.financeId),
      clientfileId: String(customer.clientfileId),
    }
  })
  return notifications
};

const checkReminders = async () => {
  const currentTime = new Date();
  const twentyFourHoursFromNow = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);

  const users = await prisma.automations.findMany({
    where: { isEnabled: true },
  });

  for (const user of users) {
    const { userEmail } = user;

    // Fetch appointments for the user
    const appointments = await prisma.clientApts.findMany({
      where: {
        userEmail,
        start: {
          gte: currentTime,
          lte: twentyFourHoursFromNow,
        },
      },
    });

    for (const appointment of appointments) {
      const appointmentTime = new Date(appointment.time);
      const timeDifference = (appointmentTime - currentTime) / (1000 * 60); // Difference in minutes

      if (timeDifference <= reminderTime) {
        let clientfileId
        const customer = await prisma.finance.findUnique({ where: { financeId: appointment.financeId } })
        if (!customer.clientfileId) {
          const clientfile = await prisma.clientfile.findUnique({ where: { email: customer.email } })
          clientfileId = clientfile.id
        }
        const user = await prisma.users.findUnique({ where: { id: userId } });
        sendReminder(user.email, `@ ${appointment.start}, ${appointment.note || ''}`, customer);
      }
    }
  }
};

export default async function handler(req, res) {
  await checkReminders();
  res.status(200).json({ message: 'Reminders checked and sent if any' });
}
