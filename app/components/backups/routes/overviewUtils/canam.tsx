import { useLoaderData } from '@remix-run/react'
import { Button } from "~/components/ui/index"
import { utilsLoader } from './actions'
import jsPDF from 'jspdf'



export let loader = utilsLoader

// -- CanAm ATV
export const ModelPageCanAm = () => {
  const { modelData } = useLoaderData()

  const Click = () => {
    //console.log('Button clicked!')
    // Perform additional actions or logic here
    var selectedModelName = ''

    if (modelData.model.includes('outlander')) {
      selectedModelName = 'outlander.html#dps'
    } else if (modelData.model.includes('renegade')) {
      selectedModelName = 'renegade.html'
    } else if (modelData.model.includes('outlander pro')) {
      selectedModelName = 'outlander-pro.html'
    } else {
      selectedModelName = 'luxury/xt.html'
    }
    var baseUrl =
      'https://can-am.brp.com/off-road/ca/en/models/all-terrain-vehicles/'
    var modelUrl = baseUrl + selectedModelName
    window.open(modelUrl, '_blank')
  }
  return (
    <Button onClick={Click} className="h-5 border border-slate12  cursor-pointer hover:text-primary p-5 hover:border-primary hover:border" type="submit" content="update">
      Model Page
    </Button>
  )
}

// -- -- -- print spec sheet after model selection
export function PrintSpecCanAm() {
  const { modelData, session } = useLoaderData()

  const Click1 = async () => {
    //console.log('Button clicked!')
    let url = ''
    //--- brp ---///
    if (modelData.model.includes('renegade x mr 1000')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/renegade/ORV-ATV-MY24-SPEC-REN-Xmr-1000R-ENNA-HR.pdf'
    } else if (modelData.model().includes('renegade x xc')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/renegade/ORV-ATV-MY24-SPEC-REN-Xxc-ENNA-HR.pdf'
    } else if (modelData.model.includes('renegade x mr 650')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/renegade/ORV-ATV-MY24-SPEC-REN-Xmr-650-ENNA-HR.pdf'
    } else if (modelData.model === 'renegade') {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/renegade/ORV-ATV-MY24-SPEC-REN-ENNA-HR.pdf'
    }
    else if (modelData.model.includes('OUTLANDER MAX 6X6 XT 1000')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander/ORV-ATV-MY24-SPEC-MAX-6x6-XT-1000-ENNA-HR.pdf'
    } else if (modelData.model.includes('OUTLANDER MAX 6X6 DPS 650')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander/ORV-ATV-MY24-SPEC-OUT-MAX-6x6-DPS-650-ENNA-HR.pdf'
    } else if (modelData.model.includes('OUTLANDER MAX 6X6 DPS 450')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander/ORV-ATV-MY24-SPEC-OUT-MAX-6x6-DPS-450-ENNA-HR.pdf'
    } else if (modelData.model.includes('OUTLANDER MAX LIMITED')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander/ORV-ATV-MY24-SPEC-OUT-MAX-LTD-ENNA-HR.pdf'
    } else if (modelData.model.includes('OUTLANDER MAX XT-P')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander/ORV-ATV-MY24-SPEC-OOUT-MAX-XT-P-ENNA-HR.pdf#'
    } else if (modelData.model.includes('OUTLANDER MAX XT')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander/ORV-ATV-MY24-SPEC-OUT-MAX-XT-850-1000R-ENNA-HR.pdf'
    } else if (modelData.model.includes('OUTLANDER MAX DPS')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander/ORV-ATV-MY24-SPEC-OUT-MAX-DPS-ENNA-HR.pdf'
    } else if (modelData.model.includes('OUTLANDER X MR 1000R')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander/ORV-ATV-MY24-SPEC-OUT-Xmr-1000R-ENNA-HR.pdf'
    } else if (modelData.model.includes('OUTLANDER X MR 850')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander/ORV-ATV-MY24-SPEC-OUT-Xmr-850-ENNA-HR.pdf'
    } else if (modelData.model.includes('OUTLANDER X XC')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander/ORV-ATV-MY24-SPEC-OUT-Xxc-ENNA-HR.pdf'
    } else if (modelData.model.includes('OUTLANDER XT-P')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander/ORV-ATV-MY24-SPEC-OUT-XT-P-ENNA-HR.pdf'
    }
    else if (modelData.model.includes('OUTLANDER HUNTING EDITION 850')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander/ORV-ATV-MY24-SPEC-OUT-HuntingEdition-ENNA-HR.pdf'
    }
    else if (modelData.model.includes('OUTLANDER XT')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander/ORV-ATV-MY24-SPEC-OUT-XT-850-1000R-ENNA-HR.pdf'
    }
    else if (modelData.model.includes('OUTLANDER DPS')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander/ORV-ATV-MY24-SPEC-OUT-DPS-850-ENNA-HR.pdf'
    }
    else if (modelData.model.includes('OUTLANDER')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander/ORV-ATV-MY24-SPEC-OUT-850-ENNA-HR.pdf'
    }
    else if (modelData.model.includes('OUTLANDER PRO XU')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander-pro/ORV-ATV-MY24-SPEC-OUT-PRO-XU-ENNA-HR.pdf'
    }
    else if (modelData.model.includes('OUTLANDER PRO HUNTING EDITION')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander-pro/ORV-ATV-MY24-SPEC-OUT-PRO-HuntingEdition-ENNA-HR.pdf'
    }
    else if (modelData.model.includes('OUTLANDER PRO')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander-pro/ORV-ATV-MY24-SPEC-OUT-PRO-ENNA-HR.pdf'
    }
    else if (modelData.model.includes('OUTLANDER MAX XT 700')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander-500-700/ORV-ATV-MY24-SPEC-OUT-MAX-XT-700-ENNA-HR.pdf'
    }
    else if (modelData.model.includes('OUTLANDER MAX DPS 500/700')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander-500-700/ORV-ATV-MY24-SPEC-OUT-MAX-DPS-500-700-ENNA-HR.pdf'
    }
    else if (modelData.model.includes('OUTLANDER X MR 700')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander-500-700/ORV-ATV-MY24-SPEC-OUT-Xmr-700-ENNA-HR.pdf'
    }
    else if (modelData.model.includes('OUTLANDER XT 700')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander-500-700/ORV-ATV-MY24-SPEC-OUT-XT-700-ENNA-HR.pdf'
    }
    else if (modelData.model.includes('OUTLANDER DPS 500/700')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander-500-700/ORV-ATV-MY24-SPEC-OUT-DPS-500-700-ENNA-HR.pdf'
    }
    else if (modelData.model.includes('OUTLANDER 500/700')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander-500-700/ORV-ATV-MY24-SPEC-OUT-500-700-ENNA-HR.pdf'
    }
    else if (modelData.model.includes('OUTLANDER 500 2WD')) {
      url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/atv/outlander-500-700/ORV-ATV-MY24-SPEC-OUT-500-2WD-ENNA-HR.pdf'
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
