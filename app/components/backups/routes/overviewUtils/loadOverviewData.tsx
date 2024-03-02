import financeFormSchema from './utils/financeFormSchema';

import { DataFunctionArgs, json } from "@remix-run/node";
import { prisma } from "~/libs";

import { requireUserId } from "~/utils/session.server";
import {
    getLatestFinance2,
    getLatestFinanceManitou,
    getLatestFinance,
    getDataByModelManitou,
    getDataKawasaki,
    getDataBmwMoto,
    getDataTriumph,
    getDataCanamSXS,
    getDataSkidoo,
    getDataSwitch,
    getDataSeadoo,
    getDataSpyder,
    getDataSuzuki,
    getDataHarley,
    getDataCanam,
    getDataYamaha,
    getDataKtm,
    getDataIndian,
    getDataByModelCanam,
} from '~/utils/quote/quote.server';


export async function loadOverviewData(email, brand) {
    let financeData;
    let modelData;
    if (brand === 'Manitou') {
        const finance = await getLatestFinanceManitou(email)
        const modelData = await getDataByModelManitou(finance);
        return json({ ok: true, modelData, finance })
    }
    if (brand === 'Kawasaki') {
        const finance = await getLatestFinance(email)
        const modelData = await getDataKawasaki(finance);
        return json({ ok: true, modelData, finance })
    }
    if (brand === 'BMW-Motorrad') {
        const finance = await getLatestFinance(email)
        const modelData = await getDataBmwMoto(finance);
        return json({ ok: true, modelData, finance })
    }
    if (brand === 'Triumph') {
        const finance = await getLatestFinance(email)
        const modelData = await getDataTriumph(finance);
        return json({ ok: true, modelData, finance })
    }
    if (brand === 'Can-Am-SXS') {
        const finance = await getLatestFinance(email)
        const modelData = await getDataCanamSXS(finance);
        return json({ ok: true, modelData, finance })
    }
    if (brand === 'Ski-Doo') {
        const finance = await getLatestFinance(email)
        const modelData = await getDataSkidoo(finance);
        return json({ ok: true, modelData, finance })
    }
    if (brand === 'Switch') {
        const finance = await getLatestFinance(email)
        const modelData = await getDataSwitch(finance);
        return json({ ok: true, modelData, finance })
    }
    if (brand === 'Sea-Doo') {
        const finance = await getLatestFinance(email)
        const modelData = await getDataSeadoo(finance);
        return json({ ok: true, modelData, finance })
    }
    if (brand === 'Spyder') {
        const finance = await getLatestFinance(email)
        const modelData = await getDataSpyder(finance);
        return json({ ok: true, modelData, finance })
    }
    if (brand === 'Suzuki') {
        const finance = await getLatestFinance(email)
        const modelData = await getDataSuzuki(finance);
        return json({ ok: true, modelData, finance })
    }
    if (brand === 'Harley-Davidson') {
        const finance = await getLatestFinance(email)
        const modelData = await getDataHarley(finance);
        return json({ ok: true, modelData, finance })
    }
    if (brand === 'Can-Am') {
        const finance = await getLatestFinance(email)
        const modelData = await getDataCanam(finance);
        return json({ ok: true, modelData, finance })
    }
    if (brand === 'Yamaha') {
        const finance = await getLatestFinance(email)
        const modelData = await getDataYamaha(finance);
        return json({ ok: true, modelData, finance })
    }
    if (brand === 'KTM') {
        const finance = await getLatestFinance(email)
        const modelData = await getDataKtm(finance);
        return json({ ok: true, modelData, finance })
    }
    if (brand === 'Indian') {
        const finance = await getLatestFinance(email)
        const modelData = await getDataIndian(finance);
        return json({ ok: true, modelData, finance })
    }

    //console.log(brand, email, financeData, modelData)

    return { financeData, modelData };
}
