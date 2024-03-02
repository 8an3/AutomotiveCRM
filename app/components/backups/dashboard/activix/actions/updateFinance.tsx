import { json } from "@remix-run/node"
import { updateDashData } from "~/utils/dashboard/update.server"
import { updateFinance, updateFinanceWithDashboard } from "~/utils/finance/update.server"

export default async function updateFinance23(financeId, formData, formPayload,) {

  let brand = formPayload.brand
  let customerState = formData.customerState
  if (formData.customerState === 'Pending') {
    customerState = 'Pending'
  }
  if (formData.customerState === 'Attempted') {
    customerState = 'Attempted'
  }
  if (formData.customerState === 'Reached') {
    customerState = 'Reached'
  }
  if (formData.customerState === 'Lost') {
    customerState = 'Lost'
  }
  if (formData.sold === 'on') {
    customerState = 'sold'
  }
  if (formData.depositMade === 'on') {
    customerState = 'depositMade'
  }
  if (formData.turnOver === 'on') {
    customerState = 'turnOver'
  }
  if (formData.financeApp === 'on') {
    customerState = 'financeApp'
  }
  if (formData.approved === 'on') {
    customerState = 'approved'
  }
  if (formData.signed === 'on') {
    customerState = 'signed'
  }
  if (formData.pickUpSet === 'on') {
    customerState = 'pickUpSet'
  }
  if (formData.delivered === 'on') {
    customerState = 'delivered'
  }
  if (formData.refund === 'on') {
    customerState = 'refund'
  }
  if (formData.funded === 'on') {
    customerState = 'funded'
  }
  let pickUpDate = ''
  if (formData.pickUpDate) {
    pickUpDate = new Date(formData.pickUpDate).toISOString()
  }
  let lastContact = new Date().toISOString()
  brand = formData.brand

  financeId = formData.financeId
  console.log(financeId, 'finaceCheckId')
  const financeData = {

    email: formData.email,
    firstName: formData.firstName,
    lastName: formData.lastName,
    phone: formData.phone,
    name: formData.name,
    address: formData.address,
    city: formData.city,
    postal: formData.postal,
    province: formData.province,
    dl: formData.dl,
    typeOfContact: formData.typeOfContact,
    timeToContact: formData.timeToContact,
    iRate: formData.iRate,
    months: formData.months,
    discount: formData.discount,
    total: formData.total,
    onTax: formData.onTax,
    on60: formData.on60,
    biweekly: formData.biweekly,
    weekly: formData.weekly,
    weeklyOth: formData.weeklyOth,
    biweekOth: formData.biweekOth,
    oth60: formData.oth60,
    weeklyqc: formData.weeklyqc,
    biweeklyqc: formData.biweeklyqc,
    qc60: formData.qc60,
    deposit: formData.deposit,
    biweeklNatWOptions: formData.biweeklNatWOptions,
    weeklylNatWOptions: formData.weeklylNatWOptions,
    nat60WOptions: formData.nat60WOptions,
    weeklyOthWOptions: formData.weeklyOthWOptions,
    biweekOthWOptions: formData.biweekOthWOptions,
    oth60WOptions: formData.oth60WOptions,
    biweeklNat: formData.biweeklNat,
    weeklylNat: formData.weeklylNat,
    nat60: formData.nat60,
    qcTax: formData.qcTax,
    otherTax: formData.otherTax,
    totalWithOptions: formData.totalWithOptions,
    otherTaxWithOptions: formData.otherTaxWithOptions,
    desiredPayments: formData.desiredPayments,
    freight: formData.freight,
    admin: formData.admin,
    commodity: formData.commodity,
    pdi: formData.pdi,
    discountPer: formData.discountPer,
    userLoanProt: formData.userLoanProt,
    userTireandRim: formData.userTireandRim,
    userGap: formData.userGap,
    userExtWarr: formData.userExtWarr,
    userServicespkg: formData.userServicespkg,
    deliveryCharge: formData.deliveryCharge,
    vinE: formData.vinE,
    lifeDisability: formData.lifeDisability,
    rustProofing: formData.rustProofing,
    userOther: formData.userOther,
    paintPrem: formData.paintPrem,
    licensing: formData.licensing,
    stockNum: formData.stockNum,
    options: formData.options,
    accessories: formData.accessories,
    labour: formData.labour,
    year: formData.year,
    brand: formData.brand,
    model: formData.model,
    model1: formData.model1,
    color: formData.color,
    modelCode: formData.modelCode,
    msrp: formData.msrp,
    userEmail: formData.userEmail,
    tradeValue: formData.tradeValue,
    tradeDesc: formData.tradeDesc,
    tradeColor: formData.tradeColor,
    tradeYear: formData.tradeYear,
    tradeMake: formData.tradeMake,
    tradeVin: formData.tradeVin,
    tradeTrim: formData.tradeTrim,
    tradeMileage: formData.tradeMileage,
    trim: formData.trim,
    vin: formData.vin,
  }
  const dashData = {
    userEmail: formData.userEmail,
    referral: formData.referral,
    visited: formData.visited,
    bookedApt: formData.bookedApt,
    aptShowed: formData.aptShowed,
    aptNoShowed: formData.aptNoShowed,
    testDrive: formData.testDrive,
    metService: formData.metService,
    metManager: formData.metManager,
    metParts: formData.metParts,
    sold: formData.sold,
    depositMade: formData.depositMade,
    refund: formData.refund,
    turnOver: formData.turnOver,
    financeApp: formData.financeApp,
    approved: formData.approved,
    signed: formData.signed,
    pickUpSet: formData.pickUpSet,
    demoed: formData.demoed,
    delivered: formData.delivered,
    lastContact: lastContact,
    status: formData.status,
    customerState: customerState,
    result: formData.result,
    timesContacted: formData.timesContacted,
    nextAppointment: formData.nextAppointment,
    completeCall: formData.completeCall,
    followUpDay: formData.followUpDay,
    state: formData.state,
    deliveredDate: formData.deliveredDate,
    notes: formData.notes,
    visits: formData.visits,
    progress: formData.progress,
    metSalesperson: formData.metSalesperson,
    metFinance: formData.metFinance,
    financeApplication: formData.financeApplication,
    pickUpDate: pickUpDate,
    pickUpTime: formData.pickUpTime,
    depositTakenDate: formData.depositTakenDate,
    docsSigned: formData.docsSigned,
    tradeRepairs: formData.tradeRepairs,
    seenTrade: formData.seenTrade,
    lastNote: formData.lastNote,
    dLCopy: formData.dLCopy,
    insCopy: formData.insCopy,
    testDrForm: formData.testDrForm,
    voidChq: formData.voidChq,
    loanOther: formData.loanOther,
    signBill: formData.signBill,
    ucda: formData.ucda,
    tradeInsp: formData.tradeInsp,
    customerWS: formData.customerWS,
    otherDocs: formData.otherDocs,
    urgentFinanceNote: formData.urgentFinanceNote,
    funded: formData.funded,
    countsInPerson: formData.countsInPerson,
    countsPhone: formData.countsPhone,
    countsSMS: formData.countsSMS,
    countsOther: formData.countsOther,
    countsEmail: formData.countsEmail,
  }

  switch (brand) {
    case "Manitou":
      const updatingManitouFinance = await updateFinanceWithDashboard(financeId, financeData, dashData);
      return json({ updatingManitouFinance });
    case "Switch":
      const updatingSwitchFinance = await updateFinanceWithDashboard(financeId, financeData, dashData);
      return json({ updatingSwitchFinance });
    case "BMW-Motorrad":
      const updatingBMWMotoFinance = await updateFinanceWithDashboard(financeId, financeData, dashData);
      return json({ updatingBMWMotoFinance });
    default:
      const update = await updateFinanceWithDashboard(financeId, financeData, dashData);

      return json({ update })
  }
}
