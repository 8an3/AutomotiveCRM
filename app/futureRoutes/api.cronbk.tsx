import { prisma } from '~/libs';


//export const config = { runtime: 'edge', };

// so we need to get all appointments for the next 24 hours
async function GetAppointments() {
  const appointments = await prisma.clientApts.findMany({
    where: {
      start: {
        gte: new Date(),
        lt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });
  return appointments;
}
// we need to get all automations that are in the database
async function GetAutomations() {
  const automations = await prisma.automation.findMany();
  return automations;
}
// we need to get to compate all the auotmatoins against the appointments and see if any of the appointments match the automation

// the appointments that match the automation need to activate the function that is in the automation



export default async function handler() {

}
/**
 *  "crons": [
    {
      "path": "/api/cron",
      "schedule": "* * * * *"
    }
  ]
}
 */
