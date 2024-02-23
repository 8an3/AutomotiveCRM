import { prisma } from "~/libs";

export async function createClientFinanceApt(
  financeData, dashData, email, clientData, financeId, userId
) {
  const existingClientFile = await prisma.clientApts.findUnique({
    where: {
      email: email,
    },
  });

  // If a clientFile with the given email already exists, return null
  if (existingClientFile) {
    return null;
  }

  // If a clientFile with the given email doesn't exist, create a new one
  const clientFile = await prisma.clientfile.create({
    data: {
      ...clientData,
      financeId: financeId,
      userId: userId,
    },
  });
  // Create the finance record
  const finance = await prisma.finance.create({
    data: financeData,
  });

  // Create the dashboard record
  const dashboard = await prisma.dashboard.create({
    data: {
      ...dashData,
      financeId: finance.id, // Assuming the financeId is a foreign key in the dashboard table
    },
  });

  console.log("Finance and Dashboard records created successfully");

  return { finance, dashboard, clientFile };
}
