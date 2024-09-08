// import IndeterminateCheckbox, {fuzzyFilter, fuzzySort,login , getToken, invariant, Loading, checkForMobileDevice, TableMeta,Filter,DebouncedInput, defaultColumn, getTableMeta  } from '~/components/actions/shared'
import axios from "axios";
import { prisma } from "~/libs";
import updateFinance23 from "../dashboard/calls/actions/updateFinance";
import { createfinanceApt } from "~/utils/financeAppts/create.server";
import { json, type ActionFunction, createCookie, type LoaderFunction, redirect, defer } from "@remix-run/node";
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { GetUser } from "~/utils/loader.server";
import { createFinanceManitou, createBMWOptions, createBMWOptions2, createClientFileRecord, financeWithDashboard, } from "~/utils/finance/create.server";
import React, { useState, useReducer, useEffect, forwardRef, useRef, } from 'react'
import { Form, useFetcher, useSubmit } from "@remix-run/react";
import { flushSync } from "react-dom";
import {
  rankItem,
  compareItems,
  RankingInfo,
} from '@tanstack/match-sorter-utils'
import {
  ColumnDef,
  FilterFn,
  SortingFn,
  sortingFns,
} from '@tanstack/react-table'
import {
  Button, Input, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/index";
import { FastArrowLeft, FastArrowRight, ArrowLeft, ArrowRight, LogOut, Dashboard, Settings, AddDatabaseScript, MailIn, InputField, MoneySquare, Map } from "iconoir-react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { toast } from "sonner";


// sms
export function checkForMobileDevice(userAgent) {
  const mobileDevicePatterns = ['iPhone', 'Android', 'Mobile'];
  return mobileDevicePatterns.some(pattern => userAgent.includes(pattern));
}
export async function getToken(
  username: string,
  password: string
): Promise<string> {
  const requestAddress = 'https://dsatokenservice-4995.twil.io/token-service'
  if (!requestAddress) {
    throw new Error(
      "REACT_APP_ACCESS_TOKEN_SERVICE_URL is not configured, cannot login"
    );
  }

  try {
    const response = await axios.get(requestAddress, {
      params: { identity: 'skylerzanth', password: 'skylerzanth1234' },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error(error.response.data ?? "Authentication error.");
    }

    console.error(`ERROR received from ${requestAddress}: ${error}\n`);
    throw new Error(`ERROR received from ${requestAddress}: ${error}\n`);
  }
}
async function login(
  username: string,
  password: string,
  setToken: (token: string) => void
): Promise<string> {
  try {
    const token = await getToken(username.trim(), password);
    if (token === "") {
      return "Received an empty token from backend.";
    }

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    setToken(token);

    return "";
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }
    return message;
  }
}


// actions
export async function CompleteLastAppt(formData, user) {
  console.log('CompleteLastAppt')
  const lastApt = await prisma.clientApts.findFirst({
    where: { financeId: formData.financeId },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (lastApt) {
    let apptId = lastApt?.id;
    const data = {
      completed: 'yes',
      userId: user.id,
    }
    const finance = await prisma.clientApts.update({
      data: {
        ...data,
      },
      where: {
        id: apptId,
      },
    });
    return finance
  }
}
export async function TwoDays(followUpDay3, formData, financeId, user) {
  const lastContact = new Date().toISOString();
  let customerState = formData.customerState;
  if (customerState === "Pending") {
    customerState = "Attempted";
  }


  const followUpDay2 = parseInt(followUpDay3);
  console.log('followUpDay:', followUpDay2);  // Add this line

  function addDays(days) {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    return currentDate;
  }

  let newDate = addDays(followUpDay2);
  newDate = new Date(newDate).toISOString();
  console.log('financeId:', financeId);  // Add this line

  let clientAptsData = {
    title: formData.title,
    start: newDate,

    //end: formData.end,
    contactMethod: formData.contactMethod,
    completed: formData.completed,
    apptStatus: formData.apptStatus,
    apptType: formData.apptType,
    note: formData.note,
    unit: formData.unit,
    brand: formData.brand,
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
    financeId: formData.financeId,
    //description,
    userName: user?.name,
    messageTitle: 'Contacted by Instant Function',

    direction: 'Outgoing',
    resultOfcall: 'Attempted',
    userId: user.Id,
  };
  const userId = user.Id
  const formPayload = formData
  const nextAppointment = newDate
  const followUpDay = newDate
  const formData3 = { ...formData, nextAppointment, followUpDay, lastContact, customerState, }
  const updating = await updateFinance23(financeId, formData, formPayload);
  const createFollowup = await createfinanceApt(user, clientAptsData, formData)
  const completeApt = await CompleteLastAppt(userId, financeId)
  //  console.log('hittind 2 days from noiw', formData, followUpDay, completeApt, createClientFinanceAptData)
  return json({ updating, completeApt, createFollowup });
}
export async function FollowUpApt(formData, user, userId) {
  const lastContact = new Date().toISOString();
  let customerState = formData.customerState;
  if (customerState === "Pending") {
    customerState = "Attempted";
  }

  let newDate = new Date(formData.followUpDay1).toISOString();

  let clientAptsData = {
    title: formData.title,
    start: newDate,

    //end: formData.end,
    contactMethod: formData.contactMethod,
    completed: formData.completed,
    apptStatus: formData.apptStatus,
    apptType: formData.apptType,
    note: formData.note,
    unit: formData.unit,
    brand: formData.brand,
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
    financeId: formData.financeId,
    //description,
    userName: user?.name,
    messageTitle: 'Contacted by Instant Function',

    direction: 'Outgoing',
    resultOfcall: 'Attempted',
    userId,
  };

  let financeId = formData?.financeId;

  const nextAppointment = newDate
  const followUpDay = newDate
  const formData3 = { ...formData, nextAppointment, followUpDay, lastContact, customerState, }
  const updating = await updateFinance23(financeId, formData3, formData);


  const createFollowup = await createfinanceApt(financeId, clientAptsData, formData3)


  const completeApt = await CompleteLastAppt(userId, financeId)
  //  console.log('hittind 2 days from noiw', formData, followUpDay, completeApt, createClientFinanceAptData)
  return json({ updating, completeApt, createFollowup });
}
export async function ComsCount(financeId, commType) {
  const record = await prisma.communications.findUnique({
    where: { financeId: financeId },
  });
  if (record) {
    await prisma.communications.update({
      where: { financeId: financeId },
      data: { [commType]: record[commType] + 1 },
    });
  } else {
    await prisma.communications.create({
      data: { financeId: financeId, [commType]: 1 },
    });
  }
  return json({ ok: true });
}
export async function QuoteServer(formData) {
  const brand = formData.brand
  try {
    const clientfile = await prisma.clientfile.findUnique({ where: { email: formData.email, }, });
    async function CreateFinance() {
      await prisma.finance.create({
        data: {
          clientfileId: clientfile.id,
          activixId: formData.activixId,
          theRealActId: formData.theRealActId,
          financeManager: formData.financeManager,
          email: formData.email,
          firstName: formData.firstName,
          mileage: formData.mileage,
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
          tradeLocation: formData.tradeLocation,
          trim: formData.trim,
          vin: formData.vin,
          leadNote: formData.leadNote,
          sendToFinanceNow: formData.sendToFinanceNow,
          dealNumber: formData.dealNumber,
          bikeStatus: formData.bikeStatus,
          lien: formData.lien,
          dob: formData.dob,
          othTax: formData.othTax,
          optionsTotal: formData.optionsTotal,
          lienPayout: formData.lienPayout,
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
          lastContact: formData.lastContact,
          status: formData.status,
          customerState: formData.customerState,
          result: formData.result,
          timesContacted: formData.timesContacted,
          nextAppointment: formData.nextAppointment,
          followUpDay: formData.followUpDay,
          deliveredDate: formData.deliveredDate,
          notes: formData.notes,
          visits: formData.visits,
          progress: formData.progress,
          metSalesperson: formData.metSalesperson,
          metFinance: formData.metFinance,
          financeApplication: formData.financeApplication,
          pickUpDate: formData.pickUpDate,
          pickUpTime: formData.pickUpTime,
          depositTakenDate: formData.depositTakenDate,
          docsSigned: formData.docsSigned,
          tradeRepairs: formData.tradeRepairs,
          seenTrade: formData.seenTrade,
          lastNote: formData.lastNote,
          applicationDone: formData.applicationDone,
          licensingSent: formData.licensingSent,
          liceningDone: formData.liceningDone,
          refunded: formData.refunded,
          cancelled: formData.cancelled,
          lost: formData.lost,
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
          //  leadSource: formData.leadSource,
          // InPerson: formData.InPerson,
          // Phone: formData.Phone,
          // SMS: formData.SMS,
          // Email: formData.Email,
          // Other: formData.Other,
        }
      })
    }
    const create = CreateFinance()
    switch (brand) {
      case "Used":
        return json({ create })
      case "Switch":
        await createFinanceManitou(formData)
        return json({ create })
      case "Manitou":
        await createFinanceManitou(formData)
        return json({ create })
      case "BMW-Motorrad":
        await createBMWOptions(formData)
        return json({ create })
      default:
        return json({ create })
    }
  } catch (error) {
    let createClientfile = async () => {
      const clientfile = await prisma.clientfile.create({
        data: {
          userId: formData.userId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postal: formData.postal,
          province: formData.province,
        }
      })
      return clientfile
    }
    async function CreateFinance() {
      await prisma.finance.create({
        data: {
          clientfileId: clientfile.id,
          activixId: formData.activixId,
          theRealActId: formData.theRealActId,
          financeManager: formData.financeManager,
          email: formData.email,
          firstName: formData.firstName,
          mileage: formData.mileage,
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
          tradeLocation: formData.tradeLocation,
          trim: formData.trim,
          vin: formData.vin,
          leadNote: formData.leadNote,
          sendToFinanceNow: formData.sendToFinanceNow,
          dealNumber: formData.dealNumber,
          bikeStatus: formData.bikeStatus,
          lien: formData.lien,
          dob: formData.dob,
          othTax: formData.othTax,
          optionsTotal: formData.optionsTotal,
          lienPayout: formData.lienPayout,
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
          lastContact: formData.lastContact,
          status: formData.status,
          customerState: formData.customerState,
          result: formData.result,
          timesContacted: formData.timesContacted,
          nextAppointment: formData.nextAppointment,
          followUpDay: formData.followUpDay,
          deliveredDate: formData.deliveredDate,
          notes: formData.notes,
          visits: formData.visits,
          progress: formData.progress,
          metSalesperson: formData.metSalesperson,
          metFinance: formData.metFinance,
          financeApplication: formData.financeApplication,
          pickUpDate: formData.pickUpDate,
          pickUpTime: formData.pickUpTime,
          depositTakenDate: formData.depositTakenDate,
          docsSigned: formData.docsSigned,
          tradeRepairs: formData.tradeRepairs,
          seenTrade: formData.seenTrade,
          lastNote: formData.lastNote,
          applicationDone: formData.applicationDone,
          licensingSent: formData.licensingSent,
          liceningDone: formData.liceningDone,
          refunded: formData.refunded,
          cancelled: formData.cancelled,
          lost: formData.lost,
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
          //  leadSource: formData.leadSource,
          // InPerson: formData.InPerson,
          // Phone: formData.Phone,
          // SMS: formData.SMS,
          // Email: formData.Email,
          // Other: formData.Other,
        }
      })
    }
    const createFile = createClientfile()
    const create = CreateFinance()
    switch (brand) {
      case "Used":
        return json({ createFile, create })
      case "Switch":
        await createFinanceManitou(formData)
        return json({ createFile, create })
      case "Manitou":
        await createFinanceManitou(formData)
        return json({ createFile, create })
      case "BMW-Motorrad":
        await createBMWOptions(formData)
        return json({ createFile, create })
      default:
        return json({ createFile, create })
    }
  }
}


// data table
export const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the ranking info
  addMeta(itemRank)

  // Return if the item should be filtered in/out
  return itemRank.passed
}
export const fuzzySort = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]! as RankingInfo,
      rowB.columnFiltersMeta[columnId]! as RankingInfo
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
export function invariant(condition: any, message: string | (() => string),): asserts condition {
  if (!condition) {
    throw new Error(typeof message === 'function' ? message() : message)
  }
}
export function Loading() {
  return (
    <ul>
      {Array.from({ length: 12 }).map((_, i) => (
        <li key={i}>
          <div className="spinner" />
        </li>
      ))}
    </ul>
  )
}
export type TableMeta = {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void
}
export const getTableMeta = (setData: React.Dispatch<React.SetStateAction<Person[]>>, skipAutoResetPageIndex: () => void) =>
  ({
    updateData: (rowIndex, columnId, value) => {
      // Skip age index reset until after next rerender
      skipAutoResetPageIndex()
      setData(old =>
        old.map((row, index) => {
          if (index !== rowIndex) return row

          return {
            ...old[rowIndex]!,
            [columnId]: value,
          }
        })
      )
    },
  }) as TableMeta

export function Filter({ column, table, }: { column: Column<any, unknown>, table: Table<any> }) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  return typeof firstValue === 'number' ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${column.getFacetedMinMaxValues()?.[0]
            ? `(${column.getFacetedMinMaxValues()?.[0]})`
            : ''
            }`}
          className="w-24 rounded border shadow"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${column.getFacetedMinMaxValues()?.[1]
            ? `(${column.getFacetedMinMaxValues()?.[1]})`
            : ''
            }`}
          className="w-24 rounded border shadow"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={value => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 rounded border shadow"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  )
}
export function DebouncedInput({ value: initialValue, onChange, debounce = 500, ...props }: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <Input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}
export const defaultColumn = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue()
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      ; (table.options.meta as TableMeta).updateData(index, id, value)
    }

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    return (
      <input
        value={value as string}
        onChange={e => setValue(e.target.value)}
        onBlur={onBlur}
      />
    )
  },
}
type Props = { indeterminate?: boolean } & React.HTMLProps<HTMLInputElement>
interface DataTablePaginationProps<TData> {
  table: Table<TData>
}
export function DataTablePagination<TData>({ table, }: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2 mt-3">
      <div className="flex-1 text-sm text-foreground hidden md:block">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-foreground hidden md:block">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px] cursor-pointer border border-slate1 text-foreground">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="bg-background text-foreground">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm hover:text-primary text-foreground bg-background capitalize cursor-pointer  font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button

            className="h-7 p-0  cursor-pointer hover:text-primary text-foreground bg-transparent hover:bg-transparent "

            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <svg width="20px" height="20px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.85355 3.85355C7.04882 3.65829 7.04882 3.34171 6.85355 3.14645C6.65829 2.95118 6.34171 2.95118 6.14645 3.14645L2.14645 7.14645C1.95118 7.34171 1.95118 7.65829 2.14645 7.85355L6.14645 11.8536C6.34171 12.0488 6.65829 12.0488 6.85355 11.8536C7.04882 11.6583 7.04882 11.3417 6.85355 11.1464L3.20711 7.5L6.85355 3.85355ZM12.8536 3.85355C13.0488 3.65829 13.0488 3.34171 12.8536 3.14645C12.6583 2.95118 12.3417 2.95118 12.1464 3.14645L8.14645 7.14645C7.95118 7.34171 7.95118 7.65829 8.14645 7.85355L12.1464 11.8536C12.3417 12.0488 12.6583 12.0488 12.8536 11.8536C13.0488 11.6583 13.0488 11.3417 12.8536 11.1464L9.20711 7.5L12.8536 3.85355Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
          </Button>
          <Button

            className="h-7 p-0  cursor-pointer hover:text-primary text-foreground text-foreground bg-transparent hover:bg-transparent "
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <svg width="20px" height="20px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
          </Button>
          <Button

            className="h-8 w-15 p-0  cursor-pointer hover:text-primary text-foreground text-foreground bg-transparent hover:bg-transparent"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <svg width="20px" height="20px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
          </Button>
          <Button

            className=" h-8 w-15 p-0 lg:flex  cursor-pointer hover:text-primary text-foreground text-foreground bg-transparent hover:bg-transparent"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <svg width="20px" height="20px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.14645 11.1464C1.95118 11.3417 1.95118 11.6583 2.14645 11.8536C2.34171 12.0488 2.65829 12.0488 2.85355 11.8536L6.85355 7.85355C7.04882 7.65829 7.04882 7.34171 6.85355 7.14645L2.85355 3.14645C2.65829 2.95118 2.34171 2.95118 2.14645 3.14645C1.95118 3.34171 1.95118 3.65829 2.14645 3.85355L5.79289 7.5L2.14645 11.1464ZM8.14645 11.1464C7.95118 11.3417 7.95118 11.6583 8.14645 11.8536C8.34171 12.0488 8.65829 12.0488 8.85355 11.8536L12.8536 7.85355C13.0488 7.65829 13.0488 7.34171 12.8536 7.14645L8.85355 3.14645C8.65829 2.95118 8.34171 2.95118 8.14645 3.14645C7.95118 3.34171 7.95118 3.65829 8.14645 3.85355L11.7929 7.5L8.14645 11.1464Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
          </Button>
        </div>
      </div>
    </div>
  )
}


// other
export default function IndeterminateCheckbox({ indeterminate, className = '', ...rest }: Props) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])
  // p-3
  return (
    <div className="inline-flex items-center">
      <label className="relative flex items-center  rounded-full cursor-pointer" htmlFor="blue">
        <input type="checkbox"
          id="blue"
          ref={ref}

          className={className + '  peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10'}
          {...rest}
        />
        <span
          className="absolute text-foreground transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
            stroke="currentColor" strokeWidth="1">
            <path fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"></path>
          </svg>
        </span>
      </label>
    </div>
  )
}
export let SaveButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  return (
    <button
      ref={ref}
      // this makes it so the button takes focus on clicks in safari I can't
      // remember if this is the proper workaround or not, it's been a while!
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#clicking_and_focus
      // https://bugs.webkit.org/show_bug.cgi?id=22261
      tabIndex={0}
      {...props}
      className="text-sm rounded-lg text-left p-2 font-medium text-white bg-brand-blue"
    />
  );
});
export let CancelButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
  return (
    <Button
      ref={ref}
      type="button"
      tabIndex={0}
      {...props}
      className="text-sm rounded-[6px] text-left p-2 font-medium hover:bg-slate-200 focus:bg-slate-200"
    />
  );
});
export function EditableText({
  children,
  fieldName,
  value,
  inputClassName,
  inputLabel,
  buttonClassName,
  buttonLabel,
}: {
  children: React.ReactNode;
  fieldName: string;
  value: string;
  inputClassName: string;
  inputLabel: string;
  buttonClassName: string;
  buttonLabel: string;
}) {
  let fetcher = useFetcher();
  let [edit, setEdit] = useState(false);
  let inputRef = useRef<HTMLInputElement>(null);
  let buttonRef = useRef<HTMLButtonElement>(null);

  // optimistic update
  if (fetcher.formData?.has(fieldName)) {
    value = String(fetcher.formData.get("name"));
  }

  return edit ? (
    <fetcher.Form
      method="post"
      onSubmit={() => {
        flushSync(() => {
          setEdit(false);
        });
        toast.success(`Saving ${fieldName}...`, {
          description: `With ${value}.`,
        })
        buttonRef.current?.focus();
      }}

    >
      {children}
      <Input
        required
        ref={inputRef}
        type="text"
        aria-label={inputLabel}
        name={fieldName}
        defaultValue={value}
        className={`w-full bg-background border border-border text-foreground rounded-[6px] ${inputClassName}`}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            flushSync(() => {
              setEdit(false);
            });
            buttonRef.current?.focus();
          }
        }}
        onBlur={(event) => {
          if (
            inputRef.current?.value !== value &&
            inputRef.current?.value.trim() !== ""
          ) {
            fetcher.submit(event.currentTarget);
          }
          setEdit(false);
        }}
      />
    </fetcher.Form>
  ) : (
    <button
      aria-label={buttonLabel}
      type="button"
      ref={buttonRef}
      onClick={() => {
        flushSync(() => {
          setEdit(true);
        });
        inputRef.current?.select();
      }}
      className={`cursor-pointer ${buttonClassName}`}
    >
      {value || <span className="text-foreground italic ">Edit</span>}
    </button>
  );
}


export function SimplerStaticVersion() {
  return (
    <p>Not working contact support...</p>
  )
}
export async function GetMergedWithActivix(financeId) {
  try {
    const financeData = await prisma.finance.findUnique({ where: { id: financeId, }, });
    const activixData = await prisma.activixLead.findUnique({ where: { financeId: financeId } })
    const newData = {
      ...activixData,
      ...financeData,
    };
    console.log('newData:', newData);
    return newData
    return newData;
  } catch (error) {
    console.error("Error fetching dashboard entries by financeId:", error);
    throw new Error("Failed to fetch dashboard entries by financeId");
  }
}
export async function PullActivix(financeData) {
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"
  async function CallActi() {
    try {
      const response = await axios.get(`https://api.crm.activix.ca/v2/leads/${financeData.activixId}?include[]=emails&include[]=phones&include[]=vehicles&include[]=events`, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${accessToken}`, }
      });
      return response.data; // Return response data directly
    } catch (error) {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
      throw error; // Throw error to be caught by the caller
    }
  }
  const formData = await CallActi();
  try {
    const activixIdString = formData?.id.toString()
    const findFinance = await prisma.finance.findFirst({ where: { activixId: activixIdString } })
    const financeData = await prisma.finance.update({
      where: { id: findFinance?.id },
      data: {
        firstName: formData.first_name,
        lastName: formData.last_name,
        name: formData.first_name + ' ' + formData.last_name,
        email: formData.emails[0].address,
        phone: formData.phones[0].number,
        address: formData.address_line1,
        city: formData.city,
        postal: formData.postal_code,
        province: formData.province,
        year: formData.vehicles[1].year,
        brand: formData.vehicles[1].make,
        model: formData.vehicles[1].model,
        model1: formData.model1,
        color: formData.vehicles[1].color_exterior,
        modelCode: formData.modelCode,
        msrp: formData.vehicles[1].price,
        tradeValue: formData.vehicles[0].price,
        tradeDesc: formData.vehicles[0].model,
        tradeColor: formData.vehicles[0].color_exterior,
        tradeYear: formData.vehicles[0].year,
        tradeMake: formData.vehicles[0].make,
        tradeVin: formData.vehicles[0].vin,
        tradeTrim: formData.vehicles[0].trim,
        tradeMileage: formData.vehicles[0].odometer || '',
        trim: formData.vehicles[1].trim,
        vin: formData.vehicles[1].vin,
      }
    })
    const dashboardData = await prisma.dashboard.update({
      where: { id: financeData.dashboardId },
      data: {
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
        status: formData.status,
        customerState: formData.state,
        result: formData.result,
        timesContacted: formData.timesContacted,
        nextAppointment: formData.nextAppointment,
        followUpDay: formData.followUpDay,
        state: formData.state,
        deliveredDate: formData.deliveredDate,
        notes: formData.notes,
        visits: formData.visits,
        progress: formData.progress,
        metSalesperson: formData.metSalesperson,
        metFinance: formData.metFinance,
        financeApplication: formData.financeApplication,
        pickUpDate: formData.pickUpDate,
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
    })
    const data = formData
    const activixData = await prisma.activixLead.update({
      where: { id: financeData.theRealActId, },
      data: {
        account_id: data.account_id.toString(),
        customer_id: data.customer_id.toString(),
        appointment_date: data.appointment_date,
        phone_appointment_date: data.phone_appointment_date,
        available_date: data.available_date,
        be_back_date: data.be_back_date,
        call_date: data.call_date,
        created_at: data.created_at,
        csi_date: data.csi_date,
        delivered_date: data.delivered_date,
        deliverable_date: data.deliverable_date,
        delivery_date: data.delivery_date,
        paperwork_date: data.paperwork_date,
        presented_date: data.presented_date,
        //   promised_date: data.promised_date,
        financed_date: data.financed_date,
        road_test_date: data.road_test_date,
        home_road_test_date: data.home_road_test_date,
        sale_date: data.sale_date,
        updated_at: data.updated_at,
        address_line1: data.address_line1,
        city: data.city,
        civility: data.civility,
        country: data.country,
        credit_approved: data.credit_approved ? data.credit_approved.toString() : null,
        dealer_tour: data.creditdealer_tour_approved ? data.dealer_tour.toString() : null,
        financial_institution: data.financial_institution,
        first_name: data.first_name,
        funded: data.funded ? data.funded.toString() : null,
        inspected: data.inspected ? data.inspected.toString() : null,
        last_name: data.last_name,
        postal_code: data.postal_code,
        province: data.province,
        result: data.result,
        status: data.status,
        type: data.type,
        walk_around: data.walk_around ? data.walk_around.toString() : null,
        comment: data.comment,
        delivered_by: data.delivered_by,
        emails: data.emails[0].address,
        phones: data.phones[0].number,
        financeId: data.financeId,
        userEmail: user?.email,

        /**home_presented_date: data.home_presented_date,
         birth_date: data.birth_date,
         source_id: data.source_id,
         Integer: data.Integer,
         provider_id: data.provider_id,
         unsubscribe_all_date: data.unsubscribe_all_date,
         unsubscribe_call_date: data.unsubscribe_call_date,
         unsubscribe_email_date: data.unsubscribe_email_date,
         unsubscribe_sms_date: data.unsubscribe_sms_date,
         advisor: data.advisor,
         take_over_date: data.take_over_date,
         search_term: data.search_term,
         gender: data.gender,
         form: data.form,
         division: data.division,
         created_method: data.created_method,
         campaign: data.campaign,
         address_line2: data.address_line2,
         business: data.business,
         business_name: data.business_name,
         second_contact: data.second_contact,
         second_contact_civility: data.second_contact_civility,
         segment: data.segment,
         source: data.source,
         qualification: data.qualification,
         rating: data.rating,
         referrer: data.referrer,
         provider: data.provider,
         progress_state: data.progress_state,
         locale: data.locale,
         navigation_history: data.navigation_history,
         keyword: data.keyword,*/

      }
    })

    return { financeData, activixData, dashboardData };
  } catch (error) {
    console.error('Error:', error);
  } finally {
    console.log("This code always runs, regardless of whether there was an error or not.");
  }
  return null
}
