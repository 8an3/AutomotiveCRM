import { useLoaderData } from '@remix-run/react'
import { Button } from "~/components/ui/index"
import { utilsLoader } from './actions'
import jsPDF from 'jspdf'

export let loader = utilsLoader

export function ModelPageSeaDoo() {
    const { modelData } = useLoaderData()
    const Click = () => {
        var selectedModelName = ''
        if (modelData.model.includes('Commander')) {
            selectedModelName = '/commander.html'
        } else if (modelData.model.includes('Maverick Trail')) {
            selectedModelName = '/maverick-trail.html'
        } else if (modelData.model.includes('Maverick Sport')) {
            selectedModelName = '/maverick-sport.html'
        } else if (modelData.model.includes('Maverick X3')) {
            selectedModelName = '/maverick-x3.html'
        } else if (modelData.model.includes('Maverick R')) {
            selectedModelName = '/maverick-r.html'
        } else {
            selectedModelName = '.html'
        }
        var baseUrl = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles'
        var modelUrl = baseUrl + selectedModelName
        window.open(modelUrl, '_blank')
    }
    return (
        <Button onClick={Click} className="h-5" type="submit" content="update">
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
        <Button onClick={Click1} className="h-5" type="submit" content="update">
            Print Spec
        </Button>
    )
}
/*

*/
