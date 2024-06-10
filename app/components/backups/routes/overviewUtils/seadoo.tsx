import { useLoaderData } from '@remix-run/react'
import { Button } from "~/components/ui/index"
import { utilsLoader } from './actions'
import jsPDF from 'jspdf'




export let loader = utilsLoader

export function ModelPageSeaDoo() {
  const { modelData } = useLoaderData()

  const Click = () => {
    //console.log('Button clicked!')
    // Perform additional actions or logic here

    var selectedModelName = ''
    if (modelData.model.includes('spark')) {
      selectedModelName = 'rec-lite/spark-trixx.html'
    } else if (modelData.model.includes('gti white')) {
      selectedModelName = 'recreation/gti.html'
    } else if (modelData.model.includes('gti se')) {
      selectedModelName = 'recreation/gti-se.html'
    } else if (modelData.model.includes('gtx')) {
      selectedModelName = 'touring/gtx.html'
    } else if (modelData.model.includes('gtx limited')) {
      selectedModelName = 'touring/gtx-limited.html'
    } else if (modelData.model.includes('gtr')) {
      selectedModelName = 'performance/gtr.html'
    } else if (modelData.model.includes('rxt')) {
      selectedModelName = 'performance/rxt-x.html'
    } else if (modelData.model.includes('rxp')) {
      selectedModelName = 'performance/rxp-x.html'
    } else if (modelData.model.includes('wake')) {
      selectedModelName = 'tow-sports/wake.html'
    } else if (modelData.model.includes('wake™ pro')) {
      selectedModelName = 'tow-sports/wake-pro.html'
    } else if (modelData.model.includes('fishpro scout')) {
      selectedModelName = 'sport-fishing/fishpro-scout.html'
    } else if (modelData.model.includes('fishpro sport')) {
      selectedModelName = 'sport-fishing/fishpro-sport.html'
    } else if (modelData.model.includes('fishprotm trophy')) {
      selectedModelName = 'sport-fishing/fishpro-trophy.html'
    } else {
      selectedModelName = 'adventure/explorer-pro.html'
    }
    var baseUrl = 'https://www.sea-doo.com/ca/en/models/'
    var modelUrl = baseUrl + selectedModelName
    window.open(modelUrl, '_blank')
  }
  return (
    <Button onClick={Click} className="h-5 border border-slate12  cursor-pointer hover:text-primary p-5 hover:border-primary hover:border" type="submit" content="update">
      Model Page
    </Button>
  )
}

// -- seadoo
export function PrintSpecSeaDoo() {
  const { modelData } = useLoaderData()

  const Click1 = () => {
    let url = ''
    if (modelData.model.includes('spark')) {
      url =
        'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-REC-GTI-SPEC-ENNA-Page-PDFx.pdf'
    } else if (modelData.model.includes('gti white')) {
      url =
        'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-REC-GTI-SE-SPEC-ENNA-Page-PDFx.pdf'
    } else if (modelData.model.includes('gti se')) {
      url =
        'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-TOUR-GTX-LTD-SPEC-ENNA-Page-PDFx.pdf'
    } else if (modelData.model.includes('gtx limited')) {
      url =
        'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-PERF-GTR-X-SPEC-ENNA-Page-PDFx.pdf'
    } else if (modelData.model.includes('gtr')) {
      url =
        'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-TOUR-GTX-SPEC-ENNA-Page-PDFx.pdf'
    } else if (modelData.model.includes('gtx')) {
      url =
        'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-PERF-RXT-X-SPEC-ENNA-Page-PDFx.pdf'
    } else if (modelData.model.includes('rtx')) {
      url =
        'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-PERF-RXP-X-SPEC-ENNA-Page-PDFx.pdf'
    } else if (modelData.model.includes('rxp')) {
      url =
        'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-TOW-WAKE-SPEC-ENNA-Page-PDFx.pdf'
    } else if (modelData.model.includes('wake')) {
      url =
        'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-TOW-WAKE-PRO-SPEC-ENNA-Page-PDFx.pdf'
    } else if (modelData.model.includes('wake pro')) {
      url =
        'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-FISH-FP-SCOUT-SPEC-ENNA-Page-PDFx.pdf'
    } else if (modelData.model.includes('fishpro scout')) {
      url =
        'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-FISH-FP-SPORT-SPEC-ENNA-Page-PDFx.pdf'
    } else if (modelData.model.includes('fishpro sport')) {
      url =
        'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-FISH-FP-TROPHY-SPEC-ENNA-Page-PDFx.pdf'
    } else if (modelData.model.includes('fishpro trophy')) {
      url =
        'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-FISH-FP-TROPHY-SPEC-DPS-ENNA_LR.pdf'
    } else if (modelData.model.includes('explorer')) {
      url =
        'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-ADV-EXP-PRO-SPEC-ENNA-Page-PDFx.pdf'
    }
    else if (modelData.model.includes('trixx')) {
      url = 'https://www.sea-doo.com/content/dam/global/en/sea-doo/my24/documents/specs-sheets/na/en/SEA-MY24-REC-SPA-TRIXX-SPEC-ENNA-Page-PDFx.pdf'
    }
    if (url) {
      downloadFile(url)
    }
  }
  function downloadFile(url) {
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', '') // Empty value for the download attribute triggers automatic download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  return (
    <ponClick = { Click1 }   type = "submit" content = "update">
      Print Spec
    </p >
  )
}
/*

*/
