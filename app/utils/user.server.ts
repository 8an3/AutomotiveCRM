import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/libs";


export type { User } from "@prisma/client";

export async function getUserById(userId: User["id"]) {
  const id = userId
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"],
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function updateUser({
  name, username, email, phone, returning, subscriptionId, customerId
}) {
  try {
    const userUpdate = await prisma.user.update({
      data: {
        name, username, email, phone, returning, subscriptionId, customerId

      },
      where: { email: email },
    })
    console.log('userUpdated !!!!',)
    return userUpdate;
  } catch (error) {
    console.error('Error retrieving sales data:', error);
    throw new Error('Failed to retrieve sales data');
  } finally {
    await prisma.$disconnect();
  }
}


export async function updateDealerFees({
  userOMVIC,
  dealerName,
  userLoanProt,
  userTireandRim,
  userGap,
  userServicespkg,
  lifeDisability,
  rustProofing,
  userTax,
  userMarketAdj,
  userFinance,
  userDemo,
  userGasOnDel,
  userOther,
  userAirTax,
  userTireTax,
  userGovern,
  userPDI,
  userExtWarr,
  userLicensing,
  userAdmin,
  userFreight,
  userCommodity,
  vinE,
  userLabour,
  destinationCharge,

  omvicNumber,
  dealerPhone,
  dealerProv,
  dealerAddress,
  email,
}) {
  //console.log(email, 'in prisma')
  const DealerFees = await prisma.dealer.update({
    data: {
      userOMVIC,
      dealerName,
      dealerPhone,
      dealerProv,
      dealerAddress,
      userLoanProt,
      userTireandRim,
      userGap,
      userServicespkg,
      lifeDisability,
      rustProofing,
      userTax,
      userMarketAdj,
      userFinance,
      userDemo,
      userGasOnDel,
      userOther,
      userAirTax,
      userTireTax,
      userGovern,
      userPDI,
      userExtWarr,
      userLicensing,
      userAdmin,
      userFreight,
      userCommodity,
      vinE,
      userLabour,
      destinationCharge,
    },
    where: {
      id: 1,
    },
  });
  console.log("userUpdated !!!!");
  return DealerFees;
}

export async function createDealerFees({ ...data }) {
  try {
    const finance = await prisma.dealer.create({
      data: {
        ...data,
      },

    });
    console.log('dealer topions created successfully')
    return finance;
  } catch (error) {
    console.error("Error creating finance:", error);
    throw error;
  }
}

export async function getDealerFeesbyEmailAdmin() {
  return prisma.dealer.findUnique({ where: { id: 1 } });
}
export async function getDealerFeesbyEmail(email) {
  return prisma.dealer.findUnique({ where: { userEmail: email } });
}

export async function createDealerfees({ ...data }) {
  try {
    const finance = await prisma.dealer.create({
      data: {
        ...data,
      },
    });
    console.log('finance created successfully')
    return finance;
  } catch (error) {
    console.error("Error creating finance:", error);
    throw error;
  }
}

export async function createDealerfeesAdmin({ ...data }) {
  try {
    const finance = await prisma.dealer.create({
      data: {
        ...data,
      },
    });
    console.log('finance created successfully')
    return finance;
  } catch (error) {
    console.error("Error creating finance:", error);
    throw error;
  }
}
