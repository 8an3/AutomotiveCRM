import { updateDashData } from "~/utils/dashboard/update.server"

export default async function updateDashboard(formData, financeId) {
  const clientfileId = formData.clientfileId
  const userEmail = formData.userEmail
  const referral = formData.referral
  const visited = formData.visited
  const bookedApt = formData.bookedApt
  const aptShowed = formData.aptShowed
  const aptNoShowed = formData.aptNoShowed
  const testDrive = formData.testDrive
  const metService = formData.metService
  const metManager = formData.metManager
  const metParts = formData.metParts
  const sold = formData.sold
  const depositMade = formData.depositMade
  const refund = formData.refund
  const turnOver = formData.turnOver
  const financeApp = formData.financeApp
  const approved = formData.approved
  const signed = formData.signed
  const pickUpSet = formData.pickUpSet
  const demoed = formData.demoed
  const delivered = formData.delivered
  const lastContact = formData.lastContact
  const status = formData.status
  const customerState = formData.customerState
  const result = formData.result
  const timesContacted = formData.timesContacted
  const nextAppointment = formData.nextAppointment
  const completeCall = formData.completeCall
  const followUpDay = formData.followUpDay
  const state = formData.state
  const deliveredDate = formData.deliveredDate
  const notes = formData.notes
  const visits = formData.visits
  const progress = formData.progress
  const metSalesperson = formData.metSalesperson
  const metFinance = formData.metFinance
  const financeApplication = formData.financeApplication
  const pickUpDate = formData.pickUpDate
  const pickUpTime = formData.pickUpTime
  const depositTakenDate = formData.depositTakenDate
  const docsSigned = formData.docsSigned
  const tradeRepairs = formData.tradeRepairs
  const seenTrade = formData.seenTrade
  const lastNote = formData.lastNote
  const dLCopy = formData.dLCopy
  const insCopy = formData.insCopy
  const testDrForm = formData.testDrForm
  const voidChq = formData.voidChq
  const loanOther = formData.loanOther
  const signBill = formData.signBill
  const ucda = formData.ucda
  const tradeInsp = formData.tradeInsp
  const customerWS = formData.customerWS
  const otherDocs = formData.otherDocs
  const urgentFinanceNote = formData.urgentFinanceNote
  const funded = formData.funded
  const countsInPerson = formData.countsInPerson
  const countsPhone = formData.countsPhone
  const countsSMS = formData.countsSMS
  const countsOther = formData.countsOther
  const countsEmail = formData.countsEmail

  const data = {
    clientfileId,
    userEmail,
    referral,
    visited,
    bookedApt,
    aptShowed,
    aptNoShowed,
    testDrive,
    metService,
    metManager,
    metParts,
    sold,
    depositMade,
    refund,
    turnOver,
    financeApp,
    approved,
    signed,
    pickUpSet,
    demoed,
    delivered,
    lastContact,
    status,
    customerState,
    result,
    timesContacted,
    nextAppointment,
    completeCall,
    followUpDay,
    state,
    deliveredDate,
    notes,
    visits,
    progress,
    metSalesperson,
    metFinance,
    financeApplication,
    pickUpDate,
    pickUpTime,
    depositTakenDate,
    docsSigned,
    tradeRepairs,
    seenTrade,
    lastNote,
    dLCopy,
    insCopy,
    testDrForm,
    voidChq,
    loanOther,
    signBill,
    ucda,
    tradeInsp,
    customerWS,
    otherDocs,
    urgentFinanceNote,
    funded,
    countsInPerson,
    countsPhone,
    countsSMS,
    countsOther,
    countsEmail,
  }
  const updateTheD = await updateDashData(financeId, data)
  return updateTheD
}
