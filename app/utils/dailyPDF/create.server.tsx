import { prisma } from "~/libs";

export async function saveDailyWorkPlan({
  userEmail,
  todaysGoalGuest,
  todaysActualGuest,
  differenceGuest,
  monthsGoalGuest,
  todaysGoalTestDrives,
  todaysActualTestDrives,
  differenceTestDrives,
  monthsGoalTestDrives,
  todaysGoalWriteUps,
  todaysActualWriteUps,
  differenceWriteUps,
  monthsGoalWriteUps,
  todaysGoalDeliveries,
  todaysActualDeliveries,
  differenceDeliveries,
  monthsGoalDeliveries,
}) {
  try {
    const finance = await prisma.dailyPDF.create({
      data: {
        userEmail,
        todaysGoalGuest,
        todaysActualGuest,
        differenceGuest,
        monthsGoalGuest,
        todaysGoalTestDrives,
        todaysActualTestDrives,
        differenceTestDrives,
        monthsGoalTestDrives,
        todaysGoalWriteUps,
        todaysActualWriteUps,
        differenceWriteUps,
        monthsGoalWriteUps,
        todaysGoalDeliveries,
        todaysActualDeliveries,
        differenceDeliveries,
        monthsGoalDeliveries,
      },
    });
    //console.log('finance created successfully')
    return finance;
  } catch (error) {
    console.error("Error creating Dashboard:", error);
    throw error;
  }
}
