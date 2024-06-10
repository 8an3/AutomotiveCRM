import { useLoaderData } from '@remix-run/react'
import { Button, Separator } from "~/components/ui/index"
import { utilsLoader } from './actions'
import jsPDF from 'jspdf'



export let loader = utilsLoader

export function ModelPageManitou() {
  const { modelData } = useLoaderData()

  const Click = () => {
    //console.log('Button clicked!')

    var selectedModelName = ''
    if (modelData.model.includes('cruise')) {
      selectedModelName = 'value/cruise.html'
    } else if (modelData.model.includes('explore')) {
      selectedModelName = 'recreation/explore.html'
    } else if (modelData.model.includes('lx')) {
      selectedModelName = 'sport/lx.html'
    } else {
      selectedModelName = 'luxury/xt.html'
    }
    var baseUrl = 'https://www.manitoupontoonboats.com/ca/en/models/'
    var modelUrl = baseUrl + selectedModelName
    window.open(modelUrl, '_blank')
  }
  return (
    <p onClick={Click} type="submit" content="update">
      Model Page
    </p>
  )
}

// -- skidoo
export function PrintSpecManitou() {
  const { modelData } = useLoaderData()

  const Click1 = () => {
    let url = ''
    if (modelData.model.includes('cruise')) {
      url =
        'https://www.manitoupontoonboats.com/content/dam/global/en/manitou/my23/assets/spec-sheets/MANITOU-MY23-VAL-Cruise-Specs-8.5x11-ENCA.pdf'
    } else if (modelData.model.includes('explore')) {
      url =
        'https://www.manitoupontoonboats.com/content/dam/global/en/manitou/my23/assets/spec-sheets/MANITOU-MY23-REC-Explore-Specs-8.5x11-HRES-ENCA.pdf'
    } else if (modelData.model.includes('lx')) {
      url =
        'https://www.manitoupontoonboats.com/content/dam/global/en/manitou/my23/assets/spec-sheets/MANITOU-MY23-SRT-LX-Specs-8.5x11-HRES-ENCA.pdf'
    } else
      url =
        'https://www.manitoupontoonboats.com/content/dam/global/en/manitou/my23/assets/spec-sheets/MANITOU-MY23-LXR-XT-Specs-8.5x11-HRES-ENCA.pdf'
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
    <p onClick={Click1} type="submit" content="update">
      Print Spec
    </p >
  )
}
