import { prisma } from "~/libs";

export async function getLastAppointmentForFinance(financeId) {
  try {
    const appointment = await prisma.clientApts.findFirst({
      where: {
        financeId: financeId,
      },
      orderBy: {
        start: "desc", // replace 'start' with the actual date field in your Appointment model
      },
    });

    if (appointment) {
      const updatedAppointment = await prisma.clientApts.update({
        where: {
          id: appointment.id,
        },
        data: {
          completed: "yes",
        },
      });

      console.log(
        "Fetched and updated last Appointment for Finance successfully"
      );
      return updatedAppointment;
    } else {
      console.log("No appointment found for the provided financeId");
      return null;
    }
  } catch (error) {
    console.error(
      "Error fetching and updating last Appointment for Finance:",
      error
    );
    throw error;
  }
}
