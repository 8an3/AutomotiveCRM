import { prisma } from "~/libs";


export async function createFinanceCheckClientDFirst(financeData, dashData, email, clientData, financeId, userId) {
  const existingClientFile = await prisma.clientfile.findUnique({
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
  const updateFinance = prisma.finance.update({
    where: {
      id: finance.id,
    },
    data: {
      dashboardId: dashboard.id,
    },
  });


  console.log("Finance and Dashboard records created successfully");

  return { finance, dashboard, clientFile, updateFinance };
}



export async function financeWithDashboard(financeData, dashData) {
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

  return { finance, dashboard };
}

export async function createClientFileRecord(clientData, financeId, userId, email) {
  try {
    // Check if a clientFile with the given email already exists
    const existingClientFile = await prisma.clientfile.findUnique({
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

    console.log("ClientFile record created successfully");
    return clientFile;
  } catch (error) {
    console.error("Error creating ClientFile record:", error);
    throw error;
  }
}


export async function logCommunications({ ...data }) {
  try {
    const finance = await prisma.communications.create({
      data: {
        ...data,
      },
    });
    //console.log('finance created successfully')
    return finance;
  } catch (error) {
    console.error("Error creating Dashboard:", error);
    throw error;
  }
}
export async function createUCDAForm({
  financeId,
  seenOwnership,
  originalOwner,
  vinChecked,
  orignialVinPlate,
  registeredLien,
  totalLoss,
  theftRecovery,
  manuWarrCancelled,
  outOfProv,
  usVehicle,
  dailyRental,
  fireDmg,
  waterDmg,
  policeCruiser,
  paintedBodyPanels,
  absInoperable,
  polutionInoperable,
  repairsTransmission,
  repairsSuspSubframe,
  repairsFuelSystem,
  repairsPowerTrain,
  repairsECU,
  repairsElectrical,
  repairsStructuralFrameDamage,
  alteredOrRepaired,
  decalsBadges,
  dmgExcess3000,
}) {
  try {
    const UCDAForm = await prisma.uCDAForm.create({
      data: {
        financeId,
        seenOwnership,
        originalOwner,
        vinChecked,
        orignialVinPlate,
        registeredLien,
        totalLoss,
        theftRecovery,
        manuWarrCancelled,
        outOfProv,
        usVehicle,
        dailyRental,
        fireDmg,
        waterDmg,
        policeCruiser,
        paintedBodyPanels,
        absInoperable,
        polutionInoperable,
        repairsTransmission,
        repairsSuspSubframe,
        repairsFuelSystem,
        repairsPowerTrain,
        repairsECU,
        repairsElectrical,
        repairsStructuralFrameDamage,
        alteredOrRepaired,
        decalsBadges,
        dmgExcess3000,
      },
    });
    console.log('UCDAForm created successfully')
    return UCDAForm;
  } catch (error) {
    console.error("Error creating UCDAForm:", error);
    throw error;
  }
}
export async function createBMWOptions({ finance }) {
  try {
    const finance2 = await prisma.bmwMotoOptions.create({
      data: {
        financeId: finance.id,
      },
    });
    //console.log('finance created successfully')
    return finance2;
  } catch (error) {
    console.error("Error creating finance:", error);
    throw error;
  }
}
export async function createBMWOptions2({ ...data }) {
  try {
    const finance = await prisma.bmwMotoOptions2.create({
      data: {
        ...data,
      },
    });
    //console.log('finance created successfully')
    return finance;
  } catch (error) {
    console.error("Error creating finance:", error);
    throw error;
  }
}
export async function createFinanceManitou({
  financeId,
  email,
  BEandTR,
  intColor1,
  licensingMan,
  licensingManTr,
  dts,
  verado,
  motor,
  sigPkgCruise,
  biminiCr,
  wallCol,
  wallColCr,
  colorCruise,
  furnitureColor,
  sigPkgExplore,
  selPkgExplore,
  tubesExplore,
  colorExplore,
  wallColorExplore,
  sigPkgLX,
  selRFXPkgLX,
  selRFXWPkgLX,
  blkPkg,
  blkPkgLX,
  wallGraphic,
  colMatchedFiberLX,
  powderCoatingLX,
  blackAnoLX,
  premiumJLLX,
  JLTowerLX,
  wallColorLX,
  wallGraphicLX,
  wallGraphicAccentLX,
  fibreGlassPodsLX,
  powderCoatLX,
  signature,
  select,
  tubeColor,
  furnitureLX,
  flooringLX,
  blackoutPkgXT,
  signaturePkgXT,
  premAudioPkg,
  XTPremiumcolor,
  JLPremiumxt,
  JlPremiumAudio,
  fibreglassFrontXT,
  WallGraphicXT,
  powderCoatXT,
  furnitureXT,
  battery,
  propeller,
  gps,
  saltwaterPkg,
  baseInst,
  cupHolder,
  multiHolder,
  cooler13,
  coolerExtension,
  coolerBag14,
  singleHolder,
  stemwareHolder,
  cargoBox10,
  cargoBox20,
  cargoBox30,
  rodHolder,
  batteryCharger,
  bowFillerBench,
  portAquaLounger,
  skiTowMirror,
}) {
  try {
    const finance = await prisma.finManOptions.create({
      data: {
        financeId,
        email,
        BEandTR,
        intColor1,
        licensingMan,
        licensingManTr,
        dts,
        verado,
        motor,
        sigPkgCruise,
        biminiCr,
        wallCol,
        wallColCr,
        colorCruise,
        furnitureColor,
        sigPkgExplore,
        selPkgExplore,
        tubesExplore,
        colorExplore,
        wallColorExplore,
        sigPkgLX,
        selRFXPkgLX,
        selRFXWPkgLX,
        blkPkg,
        blkPkgLX,
        wallGraphic,
        colMatchedFiberLX,
        powderCoatingLX,
        blackAnoLX,
        premiumJLLX,
        JLTowerLX,
        wallColorLX,
        wallGraphicLX,
        wallGraphicAccentLX,
        fibreGlassPodsLX,
        powderCoatLX,
        signature,
        select,
        tubeColor,
        furnitureLX,
        flooringLX,
        blackoutPkgXT,
        signaturePkgXT,
        premAudioPkg,
        XTPremiumcolor,
        JLPremiumxt,
        JlPremiumAudio,
        fibreglassFrontXT,
        WallGraphicXT,
        powderCoatXT,
        furnitureXT,
        battery,
        propeller,
        gps,
        saltwaterPkg,
        baseInst,
        cupHolder,
        multiHolder,
        cooler13,
        coolerExtension,
        coolerBag14,
        singleHolder,
        stemwareHolder,
        cargoBox10,
        cargoBox20,
        cargoBox30,
        rodHolder,
        batteryCharger,
        bowFillerBench,
        portAquaLounger,
        skiTowMirror,
      },
    });
    console.log("created options");
    //console.log('finance created successfully')
    return finance;
  } catch (error) {
    console.error("Error creating finance:", error);
    throw error;
  }
}
