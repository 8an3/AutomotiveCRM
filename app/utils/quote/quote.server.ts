import { prisma } from "~/libs";

export async function QuoteServer(
  clientData,
  financeId,
  email,
  financeData,
  dashData
) {

  const user = await prisma.user.findUnique({ where: { email: clientData.userEmail } })
  delete clientData.userEmail

  try {
    // Check if a clientFile with the given email already exists
    const existingClientFile = await prisma.clientfile.findUnique({
      where: {
        email: email,
      },
    });
    let clientFileId;
    // If a clientFile with the given email already exists, use its id
    if (existingClientFile) {
      clientFileId = existingClientFile.id;
      console.log(
        clientFileId,
        "ClientFile record already exists. Skipping creation."
      );
      clientFileId = newClientFile.id;
      console.log(clientFileId, "ClientFile record created successfully");
      const finance = await prisma.finance.create({
        data: financeData,
      });
      const dashboard = await prisma.dashboard.create({
        data: {
          ...dashData,
          clientfileId: clientFileId,

          financeId: finance.id, // Assuming the financeId is a foreign key in the dashboard table
        },
      });
      const addFinanceId = await prisma.finance.update({
        where: {
          id: finance.id,
        },
        data: {
          dashboardId: dashboard.id,
          financeId: finance.id,
          clientfileId: clientFileId,
        },
      });
      return { finance, dashboard, addFinanceId };
    }




    // If a clientFile with the given email does not exist, create a new one
    if (!existingClientFile) {
      console.log('!existingClientFile')
      const newClientFile = await prisma.clientfile.create({
        data: {
          ...clientData,
          userId: user.id,
        }
      });
      clientFileId = newClientFile.id;
      console.log(clientFileId, "ClientFile record created successfully");
      const finance = await prisma.finance.create({
        data: {
          ...financeData,
          userEmail: user.email,
        }
      });

      const dashboard = await prisma.dashboard.create({
        data: {
          ...dashData,
          userEmail: user.email,

          clientfileId: clientFileId,
          financeId: finance.id, // Assuming the financeId is a foreign key in the dashboard table
        },
      });

      const addFinanceId = await prisma.finance.update({
        where: {
          id: finance.id,
        },
        data: {
          userEmail: user.email,

          dashboardId: dashboard.id,
          financeId: finance.id,
          clientfileId: clientFileId,
        },
      });
      console.log('addFinanceId', addFinanceId)
      const addFinanceId2 = await prisma.clientfile.update({
        where: {
          id: clientFileId
        },
        data: {
          userId: user.id,

          financeId: finance.id
        }
      })
      console.log('addFinanceId2', addFinanceId2)
      return { finance, dashboard, addFinanceId, addFinanceId2 };
    }
    // If a clientFile with the given email does not exist, create a new one
  } catch (error) {
    console.error("Error creating ClientFile record:", error);
    // Consider throwing the error or handling it in a way that's appropriate for your application
  }
}
