import { prisma } from "~/libs";

export async function updateFinance(updatingFinanceId, financeData) {
  try {
    console.log(updatingFinanceId, 'financeId inside servre')
    if (updatingFinanceId) {
      console.log('updatingFinanceId INSDIE THE IF ', updatingFinanceId)
      const finance = await prisma.finance.update({
        where: {
          id:
            updatingFinanceId

        },
        data: { ...financeData },
      });
      console.log('Updated Finance successfully')
      return finance;
    } else {
      console.log('did not update finance')
    }

  } catch (error) {
    console.error("Error updating Finance:", error);
    throw error;
  }
}

export async function updateFinanceWithDashboard(financeId, financeData, dashData) {
  try {
    // Update the finance record
    const finance = await prisma.finance.update({
      where: {
        id: financeId,
      },
      data: { ...financeData },
    });

    // Update the dashboard record
    const dashboard = await prisma.dashboard.update({
      where: {
        financeId: financeId, // Assuming the financeId is also the id of the dashboard
      },
      data: { ...dashData, }
    });

    console.log("Finance and Dashboard records updated successfully");

    return { finance, dashboard };
  } catch (error) {
    console.error("An error occurred while updating the records:", error);
    throw error;  // re-throw the error so it can be handled by the caller
  }
}

export async function updateClientFileRecord(clientFileId, clientData, financeId, userId) {
  try {
    const clientFile = await prisma.clientfile.update({
      where: {
        id: clientFileId,
      },
      data: {
        ...clientData,
        financeId: financeId,
        userId: userId,
      },
    });
    console.log("ClientFile record updated successfully");
    return clientFile;
  } catch (error) {
    console.error("Error updating ClientFile record:", error);
    throw error;
  }
}

export async function updateBMWOptions({
  financeId,
  passengerKitLowSeat,
  comfortPsgrSeat,
  m1000rMPkg,
  m1000rTitEx,
  desOption,
  m1000rrMPkg,
  s1000rrRacePkg,
  s1000rrRacePkg2,
  f7gsConn,
  f8gsDblSeat,
  r12rtAudioSystem,
  f9xrHandProtectors,
  r12gsCrossGld,
  r12gsSpSusp,
  r12gsProtBar,
  r12gsCrossBlk,
  audioSystem,
  highShield,
  psgrKit,
  alarm,
  color,
  chain,
  comfortPkg,
  touringPkg,
  activePkg,
  dynamicPkg,
  offTire,
  keyless,
  headlightPro,
  shiftAssPro,
  tpc,
  cruise,
  windshield,
  handleBar,
  extraHighSeat,
  alumTank1,
  alumTank2,
  classicW,
  silencer,
  chromedExhaust,
  crossW,
  highSeat,
  lowKitLowSeat,
  lowSeat,
  mPsgrSeat,
  aeroPkg719,
}) {
  try {
    const finance = await prisma.bmwMotoOptions.update({
      data: {
        passengerKitLowSeat,
        financeId,
        comfortPsgrSeat,
        m1000rMPkg,
        m1000rTitEx,
        desOption,
        m1000rrMPkg,
        s1000rrRacePkg,
        s1000rrRacePkg2,
        f7gsConn,
        f8gsDblSeat,
        r12rtAudioSystem,
        f9xrHandProtectors,
        r12gsCrossGld,
        r12gsSpSusp,
        r12gsProtBar,
        r12gsCrossBlk,
        audioSystem,
        highShield,
        psgrKit,
        alarm,
        color,
        chain,
        comfortPkg,
        touringPkg,
        activePkg,
        dynamicPkg,
        offTire,
        keyless,
        headlightPro,
        shiftAssPro,
        tpc,
        cruise,
        windshield,
        handleBar,
        extraHighSeat,
        alumTank1,
        alumTank2,
        classicW,
        silencer,
        chromedExhaust,
        crossW,
        highSeat,
        lowKitLowSeat,
        lowSeat,
        mPsgrSeat,
        aeroPkg719,
      },
      where: { financeId: financeId },
    });
    //console.log('finance created successfully')
    return finance;
  } catch (error) {
    console.error("Error creating finance:", error);
    throw error;
  }
}
export async function updateBMWOptions2({
  financeId,
  comfortSeat,
  designW,
  loweringKit,
  forgedWheels,
  carbonWheels,
  centerStand,
  billetPack1,
  billetPack2,
  heatedSeat,
  lugRack,
  lugRackBrackets,
  chargeSocket,
  auxLights,
  mLightBat,
  carbonPkg,
  enduroPkg,
  sportShield,
  sportWheels,
  sportSeat,
  brownBench,
  brownSeat,
  handleRisers,
  lgihtsPkg,
  fogLights,
  pilSeatCover,
  lapTimer,
  floorLight,
  blackBench,
  hillStart,
  floorboards,
  reverse,
  forkTubeTrim,
  spokedW,
  lockGasCap,
  aeroWheel,
  psgrBench719,
  blackS719,
  aero719,
  pinstripe,
  designPkgBL,
  benchseatlow,
  iconWheel,
  centreStand,
  tubeHandle,
  classicWheels,
  blackContrastwheel,
  silverContastWheel,
  silverWheel,
  activeCruise,
  blackPowertrain,
  blackWheel,
}) {
  try {
    const finance = await prisma.bmwMotoOptions2.update({
      data: {
        comfortSeat,
        designW,
        loweringKit,
        forgedWheels,
        carbonWheels,
        centerStand,
        billetPack1,
        billetPack2,
        heatedSeat,
        lugRack,
        lugRackBrackets,
        chargeSocket,
        auxLights,
        mLightBat,
        carbonPkg,
        enduroPkg,
        sportShield,
        sportWheels,
        sportSeat,
        brownBench,
        brownSeat,
        handleRisers,
        lgihtsPkg,
        fogLights,
        pilSeatCover,
        lapTimer,
        floorLight,
        blackBench,
        hillStart,
        floorboards,
        reverse,
        forkTubeTrim,
        spokedW,
        lockGasCap,
        aeroWheel,
        psgrBench719,
        blackS719,
        aero719,
        pinstripe,
        designPkgBL,
        benchseatlow,
        iconWheel,
        centreStand,
        tubeHandle,
        classicWheels,
        blackContrastwheel,
        silverContastWheel,
        silverWheel,
        activeCruise,
        blackPowertrain,
        blackWheel,
      },
      where: { financeId: financeId },
    });
    //console.log('finance created successfully')
    return finance;
  } catch (error) {
    console.error("Error creating finance:", error);
    throw error;
  }
}

