import { prisma } from "~/libs";


export async function getClientFileByEmail(financeEmail) {
  try {
    const clientFile = await prisma.clientfile.findUnique({
      where: {
        email: financeEmail,
      },
    });

    if (!clientFile) {
      console.log("No client file found with this email");
      return null;
    }

    return clientFile.id;
  } catch (error) {
    console.error("Error fetching client file by email:", error);
    throw error;
  }
}


export async function getClientFileById(clientfileId) {
  try {
    const clientFile = await prisma.clientfile.findUnique({
      where: { id: clientfileId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        postal: true,
        province: true,
        dl: true,
        typeOfContact: true,
        timeToContact: true,
        conversationId: true,
        billingAddress: true,
        AccOrder: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            userEmail: true,
            userName: true,
            dept: true,
            sellingDept: true,
            total: true,
            discount: true,
            discPer: true,
            paid: true,
            paidDate: true,
            status: true,
            workOrderId: true,
            note: true,
            financeId: true,
            clientfileId: true,
            AccessoriesOnOrders: {
              select: {
                id: true,
                quantity: true,
                accOrderId: true,
                status: true,
                orderNumber: true,
                OrderInvId: true,
                accessoryId: true,
                service: true,
                hour: true,
                accessory: {
                  select: {
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    partNumber: true,
                    brand: true,
                    name: true,
                    price: true,
                    cost: true,
                    quantity: true,
                    minQuantity: true,
                    description: true,
                    category: true,
                    subCategory: true,
                    onOrder: true,
                    distributer: true,
                    location: true,
                    note: true,
                    workOrderSuggestion: true,
                  },
                },
              },
            },
            Payments: {
              select: {
                id: true,
                createdAt: true,
                paymentType: true,
                cardType: true,
                amountPaid: true,
                cardNum: true,
                receiptId: true,
                financeId: true,
                userEmail: true,
                accOrderId: true,
                workOrderId: true,
              },
            },
            AccHandoff: {
              select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                sendTo: true,
                handOffTime: true,
                status: true,
                sendToCompleted: true,
                completedTime: true,
                notes: true,
                handOffDept: true,
                AccOrderId: true,
              },
            }
          }
        },
        Finance: {
          select: {
            financeManager: true,
            userEmail: true,
            userName: true,
            financeManagerName: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            name: true,
            address: true,
            city: true,
            postal: true,
            province: true,
            dl: true,
            typeOfContact: true,
            timeToContact: true,
            dob: true,
            othTax: true,
            optionsTotal: true,
            lienPayout: true,
            leadNote: true,
            sendToFinanceNow: true,
            dealNumber: true,
            iRate: true,
            months: true,
            discount: true,
            total: true,
            onTax: true,
            on60: true,
            biweekly: true,
            weekly: true,
            weeklyOth: true,
            biweekOth: true,
            oth60: true,
            weeklyqc: true,
            biweeklyqc: true,
            qc60: true,
            deposit: true,
            biweeklNatWOptions: true,
            weeklylNatWOptions: true,
            nat60WOptions: true,
            weeklyOthWOptions: true,
            biweekOthWOptions: true,
            oth60WOptions: true,
            biweeklNat: true,
            weeklylNat: true,
            nat60: true,
            qcTax: true,
            otherTax: true,
            totalWithOptions: true,
            otherTaxWithOptions: true,
            desiredPayments: true,
            admin: true,
            commodity: true,
            pdi: true,
            discountPer: true,
            userLoanProt: true,
            userTireandRim: true,
            userGap: true,
            userExtWarr: true,
            userServicespkg: true,
            deliveryCharge: true,
            vinE: true,
            lifeDisability: true,
            rustProofing: true,
            userOther: true,
            referral: true,
            visited: true,
            bookedApt: true,
            aptShowed: true,
            aptNoShowed: true,
            testDrive: true,
            metService: true,
            metManager: true,
            metParts: true,
            sold: true,
            depositMade: true,
            refund: true,
            turnOver: true,
            financeApp: true,
            approved: true,
            signed: true,
            pickUpSet: true,
            demoed: true,
            lastContact: true,
            status: true,
            customerState: true,
            result: true,
            timesContacted: true,
            nextAppointment: true,
            followUpDay: true,
            deliveryDate: true,
            delivered: true,
            deliveredDate: true,
            notes: true,
            visits: true,
            progress: true,
            metSalesperson: true,
            metFinance: true,
            financeApplication: true,
            pickUpDate: true,
            pickUpTime: true,
            depositTakenDate: true,
            docsSigned: true,
            tradeRepairs: true,
            seenTrade: true,
            lastNote: true,
            applicationDone: true,
            licensingSent: true,
            liceningDone: true,
            refunded: true,
            cancelled: true,
            lost: true,
            dLCopy: true,
            insCopy: true,
            testDrForm: true,
            voidChq: true,
            loanOther: true,
            signBill: true,
            ucda: true,
            tradeInsp: true,
            customerWS: true,
            otherDocs: true,
            urgentFinanceNote: true,
            funded: true,
            leadSource: true,
            financeDeptProductsTotal: true,
            bank: true,
            loanNumber: true,
            idVerified: true,
            dealerCommission: true,
            financeCommission: true,
            salesCommission: true,
            firstPayment: true,
            loanMaturity: true,
            quoted: true,
            InPerson: true,
            Phone: true,
            SMS: true,
            Email: true,
            Other: true,
            paintPrem: true,
            licensing: true,
            stockNum: true,
            options: true,
            accessories: true,
            freight: true,
            labour: true,
            year: true,
            brand: true,
            mileage: true,
            model: true,
            model1: true,
            color: true,
            modelCode: true,
            msrp: true,
            trim: true,
            vin: true,
            bikeStatus: true,
            invId: true,
            motor: true,
            tag: true,
            tradeValue: true,
            tradeDesc: true,
            tradeColor: true,
            tradeYear: true,
            tradeMake: true,
            tradeVin: true,
            tradeTrim: true,
            tradeMileage: true,
            tradeLocation: true,
            lien: true,
            id: true,
            activixId: true,
            theRealActId: true,
            createdAt: true,
            updatedAt: true,
            clientfileId: true,

            /// bmwMotoOptions: {          select: {          }        },
            financeStorage: {
              select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                url: true,
                filePath: true,
              }
            },
            clientApts: {
              select: {
                id: true,
                financeId: true,
                title: true,
                start: true,
                end: true,
                contactMethod: true,
                completed: true,
                apptStatus: true,
                apptType: true,
                note: true,
                unit: true,
                brand: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                address: true,
                userEmail: true,
                userId: true,
                description: true,
                userName: true,
                attachments: true,
                direction: true,
                resultOfcall: true,
                resourceId: true,
                activixId: true,
                activixNoteId: true,
                createdAt: true,
                updatedAt: true,
                isPublished: true,
              }
            },
            //  finManOptions: { select: {  } },
            //   uCDAForm: { select: {} },
            // FinCanOptions: { select: {} },
            //  Comm: { select: {} },
            //  FinanceDeptProducts: { select: {} },
            // FinanceTradeUnit: { select: {} },
            FinanceUnit: {
              select: {
                paintPrem: true,
                licensing: true,
                stockNum: true,
                options: true,
                accessories: true,
                freight: true,
                labour: true,
                year: true,
                brand: true,
                mileage: true,
                model: true,
                model1: true,
                color: true,
                modelCode: true,
                msrp: true,
                trim: true,
                vin: true,
                bikeStatus: true,
                invId: true,
                location: true,
                id: true,
                createdAt: true,
                updatedAt: true,
                WorkOrders: {
                  select: {
                    unit: true,
                    mileage: true,
                    vin: true,
                    tag: true,
                    motor: true,
                    budget: true,
                    totalLabour: true,
                    totalParts: true,
                    subTotal: true,
                    total: true,
                    writer: true,
                    tech: true,
                    notes: true,
                    customerSig: true,
                    status: true,
                    location: true,
                    quoted: true,
                    workOrderId: true,
                    createdAt: true,
                    updatedAt: true,
                    AccOrders: {
                      select: {
                        id: true,
                        createdAt: true,
                        updatedAt: true,
                        userEmail: true,
                        userName: true,
                        //  attachedId: true,
                        dept: true,
                        total: true,
                        discount: true,
                        discPer: true,
                        status: true,
                        clientfileId: true,
                        workOrderId: true,
                        financeId: true,
                        AccessoriesOnOrders: {
                          select: {
                            id: true,
                            quantity: true,
                            accOrderId: true,
                            status: true,
                            orderNumber: true,
                            accessory: {
                              select: {
                                id: true,
                                createdAt: true,
                                updatedAt: true,
                                partNumber: true,
                                brand: true,
                                name: true,
                                price: true,
                                cost: true,
                                quantity: true,
                                description: true,
                                category: true,
                                subCategory: true,
                                onOrder: true,
                                distributer: true,
                                location: true,
                                note: true,
                              },
                            },
                          },
                        },
                        Payments: {
                          select: {
                            id: true,
                            createdAt: true,
                            accOrderId: true,
                            paymentType: true,
                            amountPaid: true,
                            cardNum: true,
                            receiptId: true,
                            userEmail: true,
                          },
                        },
                        AccHandoff: {
                          select: {
                            id: true,
                            createdAt: true,
                            updatedAt: true,
                            status: true,
                            sendTo: true,
                            sendToCompleted: true,
                            handOffTime: true,
                            completedTime: true,
                            notes: true,
                          },
                        },
                      },
                    },
                  }
                },
              }
            },
            AccOrders: {
              select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                userEmail: true,
                userName: true,
                dept: true,
                sellingDept: true,
                total: true,
                discount: true,
                discPer: true,
                paid: true,
                paidDate: true,
                status: true,
                workOrderId: true,
                note: true,
                financeId: true,
                clientfileId: true,
                AccessoriesOnOrders: {
                  select: {
                    id: true,
                    quantity: true,
                    accOrderId: true,
                    status: true,
                    orderNumber: true,
                    OrderInvId: true,
                    accessoryId: true,
                    service: true,
                    hour: true,
                    accessory: {
                      select: {
                        id: true,
                        createdAt: true,
                        updatedAt: true,
                        partNumber: true,
                        brand: true,
                        name: true,
                        price: true,
                        cost: true,
                        quantity: true,
                        minQuantity: true,
                        description: true,
                        category: true,
                        subCategory: true,
                        onOrder: true,
                        distributer: true,
                        location: true,
                        note: true,
                        workOrderSuggestion: true,
                      },
                    },
                  },
                },
                Payments: {
                  select: {
                    id: true,
                    createdAt: true,
                    paymentType: true,
                    cardType: true,
                    amountPaid: true,
                    cardNum: true,
                    receiptId: true,
                    financeId: true,
                    userEmail: true,
                    accOrderId: true,
                    workOrderId: true,
                  },
                },
                AccHandoff: {
                  select: {
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    sendTo: true,
                    handOffTime: true,
                    status: true,
                    sendToCompleted: true,
                    completedTime: true,
                    notes: true,
                    handOffDept: true,
                    AccOrderId: true,
                  },
                }
              }
            },
            Payments: {
              select: {
                id: true,
                createdAt: true,
                paymentType: true,
                cardType: true,
                amountPaid: true,
                cardNum: true,
                receiptId: true,
                financeId: true,
                userEmail: true,
                accOrderId: true,
                workOrderId: true,
              }
            }
          },
        }
      },
    });

    if (!clientFile) {
      console.log("No client file found with this ID");
      return null;
    }

    return clientFile;
  } catch (error) {
    console.error("Error fetching client file by ID:", error);
    throw error;
  }
}

export async function getFinanceWithDashboard(financeId) {
  // Fetch the finance record
  const finance = await prisma.finance.findUnique({
    where: {
      id: financeId,
    },
  });

  // Fetch the dashboard record
  const dashboard = await prisma.dashboard.findUnique({
    where: {
      financeId: financeId, // Assuming the financeId is also the id of the dashboard
    },
  });

  console.log("Finance and Dashboard records fetched successfully");

  return { finance, dashboard };
}


export async function getRecords(userEmail) {

  const financeWithDashboard = await prisma.finance.findMany({
    where: {
      userEmail: userEmail,
    },
    include: {
      dashboard: true, // Include Dashboard record in the response
    },
  });
  console.log(financeWithDashboard);
  return financeWithDashboard
}
export async function getRecordsForfinanceList(financeEmail) {

  const financeWithDashboard = await prisma.finance.findMany({
    where: {
      email: financeEmail,
    },
    include: {
      dashboard: true, // Include Dashboard record in the response
    },
    orderBy: {
      createdAt: 'desc', // Order records by creation date in descending order
    },
  });
  console.log(financeWithDashboard);
  return financeWithDashboard
}

export async function getRecordsForGlodablSearch(financeEmail) {

  const lastFinanceRecord = await prisma.finance.findFirst({
    where: {
      email: financeEmail,
    }
  });
  if (!lastFinanceRecord) {
    console.log("No finance records found for this client global search");
    return null;
  }
  console.log("Last finance record retrieved successfully globasl search");
  return lastFinanceRecord;
}


export async function getAllFiles() {

  const allResults = await prisma.clientfile.findMany();
  return
}
export async function searchQuotes(searchTerm) {
  try {
    const searched = searchTerm.toLowerCase();
    const results = [];

    // Search the finance table
    const financeResults = await prisma.clientfile.findMany({
      where: {
        OR: [
          { name: { contains: searched } },
          { phone: { contains: searched } },
          { email: { contains: searched } },
        ],
      },
    });
    results.push(...financeResults);

    // Search other tables in a similar way
    // const otherResults = await prisma.otherTable.findMany({ ... });
    // results.push(...otherResults);

    return results;
  } catch (error) {
    console.error("Error performing global search:", error);
    throw new Error("Failed to perform global search");
  }
}
export async function getLatestBMWOptions(financeId) {
  ////console.log('latest fnance', email)
  try {
    const latestFinance = await prisma.bmwMotoOptions.findUnique({
      where: {
        financeId: financeId,
      },
    });
    return latestFinance;
  } catch (error) {
    console.error("Error retrieving latest finance:", error);
    throw new Error("Failed to retrieve latest quote");
  }
}
export async function getLatestBMWOptions2(financeId) {
  ////console.log('latest fnance', email)
  try {
    const latestFinance = await prisma.bmwMotoOptions2.findUnique({
      where: {
        financeId: financeId,
      },
    });
    return latestFinance;
  } catch (error) {
    console.error("Error retrieving latest finance:", error);
    throw new Error("Failed to retrieve latest quote");
  }
}
export async function findDashData(financeId) {
  ////console.log('latest fnance', email)
  try {
    const latestFinance = await prisma.dashboard.findUnique({
      where: {
        financeId: financeId,
      },
    });
    return latestFinance;
  } catch (error) {
    console.error("Error retrieving latest finance:", error);
    throw new Error("Failed to retrieve latest quote");
  }
}
export async function findQuoteById(financeId) {
  ////console.log('latest fnance', email)
  try {
    const latestFinance = await prisma.finance.findUnique({
      where: {
        id: financeId,
      },
    });
    return latestFinance;
  } catch (error) {
    console.error("Error retrieving latest finance:", error);
    throw new Error("Failed to retrieve latest quote");
  }
}
export async function findQuoteByEmail(userEmail) {
  ////console.log('latest fnance', email)
  try {
    const latestFinance = await prisma.finance.findMany({
      where: {
        userEmail: userEmail,
      },
    });
    return latestFinance;
  } catch (error) {
    console.error("Error retrieving latest finance:", error);
    throw new Error("Failed to retrieve latest quote");
  }
}
export async function findDashboardDataById(financeId) {
  ////console.log('latest fnance', email)
  try {
    const latestFinance = await prisma.dashboard.findUnique({
      where: {
        id: financeId,
      },
    });
    return latestFinance;
  } catch (error) {
    console.error("Error retrieving latest finance:", error);
    throw new Error("Failed to retrieve latest quote");
  }
}
export async function getLatestOptionsManitou(email) {
  ////console.log('latest fnance', email)
  try {
    const latestFinance = await prisma.finManOptions.findFirst({
      orderBy: { createdAt: "desc" },
      where: { email: email },
    });

    return latestFinance;
  } catch (error) {
    console.error("Error retrieving latest finance:", error);
    throw new Error("Failed to retrieve latest quote");
  }
}
export async function getFinance22222({ userEmail }) {
  try {
    const financeData = await prisma.finance.findMany({
      where: {
        userEmail: userEmail,
      },
    });
    const dashData = await prisma.dashboard.findMany({
      where: {
        userEmail: userEmail,
      },
    });
    return { dashData, financeData }; // Modify this line
  } catch (error) {
    console.error("Error fetching dashboard entries by financeId:", error);
    throw new Error("Failed to fetch dashboard entries by financeId");
  }
}
export async function getFinance(userEmail) {
  try {
    const financeData = await prisma.finance.findMany({
      where: {
        userEmail: userEmail,
      },
    });
    const dashData = await prisma.dashboard.findMany({
      where: {
        userEmail: financeData.id,
      },
    });

    // Merge financeData and dashData
    const mergedData = financeData.map((financeRecord) => {
      const correspondingDashRecord = dashData.find(dashRecord => dashRecord.financeId === financeRecord.financeId);
      return {
        ...financeRecord,
        ...correspondingDashRecord,
      };
    });
    console.log(mergedData)
    return mergedData;
  } catch (error) {
    console.error("Error fetching dashboard entries by financeId:", error);
    throw new Error("Failed to fetch dashboard entries by financeId");
  }
}
/**
 *
 * @param email export async function getLatestFinance(email) {
  ////console.log('latest fnance', email)
  try {
    const latestFinance = await prisma.finance.findFirst({
      orderBy: { createdAt: "desc" },
      where: { userEmail: email },
    });
    return latestFinance;
  } catch (error) {
    console.error("Error retrieving latest finance:", error);
    throw new Error("Failed to retrieve latest quote");
  }
}
 * @param limit
 * @returns
 */
export async function getLatestFinances5(email, limit = 5) {
  try {
    const latestFinances = await prisma.finance.findMany({
      orderBy: { createdAt: "desc" },
      where: { userEmail: email },
      take: limit, // Limit the number of records to retrieve (default: 5)
    });
    return latestFinances;
  } catch (error) {
    console.error("Error retrieving latest finances:", error);
    throw new Error("Failed to retrieve latest finances");
  }
}
export async function getLatestFinanceManitou(email) {
  try {
    const latestFinanceManitou = await prisma.finance.findFirst({
      orderBy: { createdAt: "desc" },
      where: { userEmail: email },
    });
    if (!latestFinanceManitou) {
      // Handle the case when data is not found
      throw new Error("Finance data not found");
    }
    return latestFinanceManitou;
  } catch (error) {
    console.error("Error retrieving latest finance:", error);
    throw new Error("Failed to retrieve latest finance");
  }
}
export async function getDataByModel(finance) {
  try {
    const result = await prisma.canam.findUnique({
      where: { model: finance.model },
    });
    if (result) {
      console.log("success in getting model");
      return result;
    } else {
      console.log(
        "No matching data found for the provided model value for model"
      );
      return null;
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null;
  }
}
export async function getDataByModelManitou(formData) {
  try {
    const result = await prisma.manitou.findFirst({
      where: {
        model: formData.model,
      },
    });
    if (result) {
      //console.log('success in getting modelManitou')
      return result; // Return the result object
    } else {
      //console.log(
      //'No matching data found for the provided model value modelManitou',
      //)
      return null; // Return null if no data is found
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null; // Return null if an error occurs
  }
}
export async function getDataHarley(formData) {
  try {
    const result = await prisma.harley.findFirst({
      where: {
        model: formData.model,
      },
    });
    if (result) {
      //console.log('success in get modelother')
      return result; // Return the result object
    } else {
      //console.log(
      //		'No matching data found for the provided model value modelother',
      //		)
      return null; // Return null if no data is found
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null; // Return null if an error occurs
  }
}
export async function getDataCanam(formData) {
  try {
    const result = await prisma.canam.findFirst({
      where: {
        model: formData.model,
      },
    });
    if (result) {
      //console.log('success in get modelother')
      return result; // Return the result object
    } else {
      //console.log(
      //		'No matching data found for the provided model value modelother',
      //		)
      return null; // Return null if no data is found
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null; // Return null if an error occurs
  }
}
export async function getDataKawasaki(formData) {
  try {
    const result = await prisma.kawasaki.findFirst({
      where: {
        model: formData.model,
      },
    });
    if (result) {
      //console.log('success in get modelother')
      return result; // Return the result object
    } else {
      //console.log(
      //		'No matching data found for the provided model value modelother',
      //		)
      return null; // Return null if no data is found
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null; // Return null if an error occurs
  }
}
export async function getDataTriumph(finance) {
  try {
    const result = await prisma.triumph.findUnique({
      where: { model: finance.model },
    });
    if (result) {
      console.log("success in getting model");
      return result;
    } else {
      console.log(
        "No matching data found for the provided model value for triunph"
      );
      return null;
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null;
  }
}
export async function getDataBmwMoto(formData) {
  try {
    const result = await prisma.bmwmoto.findFirst({
      where: {
        model: formData.model,
      },
    });
    if (result) {
      //console.log('success in get modelother')
      return result; // Return the result object
    } else {
      //console.log(
      //		'No matching data found for the provided model value modelother',
      //		)
      return null; // Return null if no data is found
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null; // Return null if an error occurs
  }
}
export async function getLatestFinance2(email) {
  const latestFinance = await prisma.finance.findFirst({
    orderBy: { createdAt: "desc" },
    where: { userEmail: email },
  });

  return latestFinance;
}
