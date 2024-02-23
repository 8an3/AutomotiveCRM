import { useLoaderData } from "@remix-run/react"
import { PrintSpecKawasaki } from "./kawasaki"
import { PrintSpecSkiDoo } from "./skidoo"
import { PrintSpecSpyder } from "./spyder"
import { PrintSpecTriumph } from "./triumph"
import { PrintSpecSwitch } from "./switch"
import { PrintSpecManitou } from "./manitou"
import { PrintSpecCanAm } from './canam'

export default function UrlSelect(financeData) {
    //console.log(financeData.model)
    let url = ''
    if (financeData.model.includes('spark')) {
        url =
            'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-REC-GTI-SPEC-ENNA-Page-PDFx.pdf'
    } else if (financeData.model.includes('gti white')) {
        url =
            'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-REC-GTI-SE-SPEC-ENNA-Page-PDFx.pdf'
    } else if (financeData.model.includes('gti se')) {
        url =
            'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-TOUR-GTX-LTD-SPEC-ENNA-Page-PDFx.pdf'
    } else if (financeData.model.includes('gtx limited')) {
        url =
            'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-PERF-GTR-X-SPEC-ENNA-Page-PDFx.pdf'
    } else if (financeData.model.includes('gtr')) {
        url =
            'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-TOUR-GTX-SPEC-ENNA-Page-PDFx.pdf'
    } else if (financeData.model.includes('gtx')) {
        url =
            'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-PERF-RXT-X-SPEC-ENNA-Page-PDFx.pdf'
    } else if (financeData.model.includes('rtx')) {
        url =
            'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-PERF-RXP-X-SPEC-ENNA-Page-PDFx.pdf'
    } else if (financeData.model.includes('rxp')) {
        url =
            'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-TOW-WAKE-SPEC-ENNA-Page-PDFx.pdf'
    } else if (financeData.model.includes('wake')) {
        url =
            'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-TOW-WAKE-PRO-SPEC-ENNA-Page-PDFx.pdf'
    } else if (financeData.model.includes('wake pro')) {
        url =
            'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-FISH-FP-SCOUT-SPEC-ENNA-Page-PDFx.pdf'
    } else if (financeData.model.includes('fishpro scout')) {
        url =
            'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-FISH-FP-SPORT-SPEC-ENNA-Page-PDFx.pdf'
    } else if (financeData.model.includes('fishpro sport')) {
        url =
            'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-FISH-FP-TROPHY-SPEC-ENNA-Page-PDFx.pdf'
    } else if (financeData.model.includes('fishpro trophy')) {
        url =
            'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-FISH-FP-TROPHY-SPEC-DPS-ENNA_LR.pdf'
    } else if (financeData.model.includes('explorer')) {
        url =
            'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-ADV-EXP-PRO-SPEC-ENNA-Page-PDFx.pdf'
    }
    else if (financeData.model.includes('trixx')) {
        url = 'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-REC-SPA-TRIXX-SPEC-ENNA-Page-PDFx.pdf'
    }

    else if (financeData.brand === 'Can-Am') {
        return PrintSpecCanAm(financeData)
    }

    else if (financeData.brand === 'Kawasaki') {
        return PrintSpecKawasaki(financeData)
    }
    else if (financeData.brand === 'Ski-Doo') {
        return PrintSpecSkiDoo(financeData)
    }
    else if (financeData.brand === 'Spyder') {
        return PrintSpecSpyder(financeData)
    }
    else if (financeData.brand === 'Suzuki') {
        return null
    }
    else if (financeData.brand === 'Triumph') {
        return PrintSpecTriumph(financeData)
    }
    else if (financeData.brand === 'Switch') {
        return PrintSpecSwitch(financeData)
    }
    else if (financeData.brand === 'Manitou') {
        return PrintSpecManitou(financeData)
    }
    else if (financeData.brand === 'BMW Motorrad') {
        return ("https://www.bmw-motorrad.ca/en/experience/2023-spec-sheets.html")
    }
    else if (financeData.brand === 'Harley-Davidson') {
        return null
    }
    return (url)
}
