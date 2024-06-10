import { json } from '@remix-run/node';
import { Resend } from 'resend';
import { prisma } from '~/libs';
import React from 'react';
import { CronEmail } from './email';

const resend = new Resend('re_YFCDynPp_5cod9FSRkrbS6kfmRsoqSsBS'); // Replace with process.env.resend_API_KEY if using environment variables

const sendReminder = async (email, message, customer) => {
  try {
    const notification = await prisma.notificationsUser.create({
      data: {
        userEmail: email,
        title: 'Appointment Reminder!',
        content: message,
        type: 'updates',
        financeId: customer.financeId,
        clientfileId: customer.clientfileId,
      },
    });
    console.log('Reminder sent:', notification);
  } catch (error) {
    console.error('Failed to send reminder:', error);
    throw new Error('Failed to send reminder');
  }
};

const sendEmail = async (user, email, message, appointment) => {
  const data = await resend.emails.send({
    from: "Sales <sales@resend.dev>",
    reply_to: user?.email,
    to: [email],
    subject: message,
    react: <CronEmail message={message} user={user} appointment={appointment} />,
  });

  return json({ data });
};

const checkReminders = async (users, apptType) => {
  try {
    const currentTime = new Date();
    const twentyFourHoursFromNow = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);

    for (const user of users) {
      const { userEmail } = user;

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
        const customer = await prisma.finance.findUnique({
          where: { financeId: appointment.financeId },
        });

        if (customer && customer.clientfileId) {
          if (apptType === 'appt24before') {
            await sendReminder(userEmail, `Appt @ ${appointment.start}, ${appointment.note || ''}`, customer);

            if (appointment.contactMethod === 'In person') {
              const message = `Hello ${appointment.firstName}, I just wanted to remind you of your appointment coming up, ${appointment.start}. If any questions or concerns arise before our appointment let me know and I will be more than happy to address them. See you then!`;
              await sendEmail(user, userEmail, message, appointment);
            }
          }

          if (apptType === 'pickUp24before') {
            await sendReminder(userEmail, `Pick up at @ ${appointment.start}, ${appointment.note || ''}`, customer);
            const message = `Hello ${appointment.firstName}, I just wanted to remind you of your pick up coming up, ${appointment.start}. If there are items you need to finalize your financing be sure to bring them along tomorrow as I would not want you to delay the pick up in any way on this big day! If any questions or concerns arise before our appointment let me know and I will be more than happy to address them. See you then!`;
            await sendEmail(user, userEmail, message, appointment);
          }
        }
      }
    }
    console.log('Reminders checked and sent if any');
  } catch (error) {
    console.error('Error checking reminders:', error);
    throw new Error('Error checking reminders');
  }
};

export async function loader({ request, params }) {
  await processAutomations();
  return json({ message: 'Automations completed...' });
}

const processAutomations = async () => {
  try {
    await handleAutomationType('appt24before');
    await handleAutomationType('pickUp24before');
    //  await handleAutomationType('noFollowup');
    //  await handleAutomationType('askForReferral');
    // await handleAutomationType('oneYearAnni');
    //  await handleAutomationType('del7days');
    //   await handleAutomationType('afterDelTY');
    // await handleAutomationType('afterHoursClosed');

  } catch (error) {
    console.error('Error processing automations:', error);
  }
};

const handleAutomationType = async (type) => {
  const automations = await prisma.automations.findMany({
    where: { [type]: 'yes' },
  });

  try {
    await checkReminders(automations, type);
  } catch (error) {
    console.error(`Error checking reminders for ${type}:`, error);
  }
};


