import { prisma } from "~/libs";

export async function getAppointmentsForFinance(financeId) {
  try {
    const appointments = await prisma.clientApts.findMany({
      where: {
        financeId: financeId,
      },
      orderBy: {
        start: "desc", // replace 'start' with the actual date field in your Appointment model
      },
    });

    console.log("Fetched Appointments for Finance successfully");
    return appointments;
  } catch (error) {
    console.error("Error fetching Appointments for Finance:", error);
    throw error;
  }
}
