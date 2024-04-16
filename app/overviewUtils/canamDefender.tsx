import { useLoaderData } from '@remix-run/react'
import { Button } from "~/components/ui/index"
import { utilsLoader } from './actions'
import jsPDF from 'jspdf'

export let loader = utilsLoader

export function ModelPageSeaDoo() {
    const { modelData } = useLoaderData()
    const Click = () => {
        var spec = ''
        if (modelData.model.includes('DEFENDER PRO LIMITED')) {
        } else if (modelData.model.includes('DEFENDER PRO XT')) {
        } else if (modelData.model.includes('DEFENDER PRO DPS')) {
        } else if (modelData.model.includes('DEFENDER 6X6 LIMITED')) {
        } else if (modelData.model.includes('DEFENDER 6X6 XT')) {
        }
        else if (modelData.model.includes('Maverick')) {
            spec = 'maverick'
        } else if (modelData.model.includes('Maverick')) {
            spec = 'maverick'
        } else if (modelData.model.includes('Maverick')) {
            spec = 'maverick'
        } else if (modelData.model.includes('Maverick')) {
            spec = 'maverick'
        }
        else if (modelData.model.includes('Maverick')) {
        } else if (modelData.model.includes('Maverick')) {
            spec = 'maverick'
        } else if (modelData.model.includes('Maverick')) {
            spec = 'maverick'
        } else if (modelData.model.includes('Maverick')) {
            spec = 'maverick'
        }
        else if (modelData.model.includes('Maverick')) {
            spec = 'maverick'
        } else if (modelData.model.includes('Maverick')) {
            spec = 'maverick'
        } else if (modelData.model.includes('Maverick')) {
            spec = 'maverick'
        } else if (modelData.model.includes('Maverick')) {
            spec = 'maverick'
        } else {
            spec = 'defender.html'
        }
        var baseUrl = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles'
        var modelUrl = baseUrl + spec
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
        var spec = ''
        if (modelData.model.includes('DEFENDER PRO LIMITED')) {
            url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-PRO-LTD-ENNA-HR.pdf'
            spec = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_pro-limited'

        } else if (modelData.model.includes('DEFENDER PRO XT')) {
            url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-PRO-XT-ENNA-HR.pdf'
            spec = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_pro-xt'
        }
        else if (modelData.model.includes('DEFENDER PRO DPS')) {
            url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-PRO-DPS-ENNA-HR.pdf'
            spec = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_pro-dps'
        }
        else if (modelData.model.includes('DEFENDER 6X6 LIMITED')) {
            url = 'tehttps://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-6x6-LTD-ENNA-HR.pdfst'
            spec = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_6x6-limited'
        }
        else if (modelData.model.includes('DEFENDER 6X6 XT')) {
            url = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-6x6-XT-ENNA-HR.pdf'
            spec = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_6x6-xt'
        }
        else if (modelData.model.includes('DEFENDER 6X6 DPS')) {
            url = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_6x6-dps'
            spec = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-6x6-DPS-ENNA-HR.pdf'
        }
        else if (modelData.model.includes('DEFENDER MAX X MR WITH HALF DOORS')) {
            url = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_max-x%20mr%20with%20half%20doors'
            spec = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-MAX-Xmr-Doors-ENNA-HR.pdf'
        }
        else if (modelData.model.includes('DEFENDER MAX X MR')) {
            url = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_max-x%20mr'
            spec = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-MAX-Xmr-ENNA-HR.pdf'
        }



        else if (modelData.model.includes('DEFENDER MAX LIMITED')) {
            url = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_max-limited'
            spec = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-MAX-LTD-ENNA-HR.pdf'
        }
        else if (modelData.model.includes('DEFENDER MAX LONE STAR CAB')) {
            url = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_max-lone%20star%20cab'
            spec = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-MAX-%20LoneStar-CAB-ENNA-HR.pdf'
        }
        else if (modelData.model.includes('DEFENDER MAX LONE STAR')) {
            url = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_max-lone%20star'
            spec = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-MAX-LoneStar-ENNA-HR.pdf'
        }
        else if (modelData.model.includes('DEFENDER MAX XT')) {
            url = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_max-xt'
            spec = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-MAX-XT-ENNA-HR.pdf'
        }
        else if (modelData.model.includes('DEFENDER MAX DPS')) {
            url = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_max-dps'
            spec = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-MAX-DPS-HD7-HD9-HD10-ENNA-HR.pdf'
        }
        else if (modelData.model.includes('DEFENDER MAX')) {
            url = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_max'
            spec = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-MAX-ENNA-HR.pdf'
        }
        else if (modelData.model.includes('DEFENDER X MR WITH HALF DOORS')) {
            url = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_x-mr%20with%20half%20doors'
            spec = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-Xmr-Doors-ENNA-HR.pdf'
        }
        else if (modelData.model.includes('DEFENDER X MR')) {
            url = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_x-mr'
            spec = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-Xmr-ENNA-HR.pdf'
        }
        else if (modelData.model.includes('DEFENDER LIMITED')) {
            url = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_limited'
            spec = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-LTD-ENNA-HR.pdf'
        }
        else if (modelData.model.includes('DEFENDER DPS CAB')) {
            url = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_dps-cab'
            spec = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-DPS-CAB-ENNA-HR.pdf'
        }
        else if (modelData.model.includes('DEFENDER DPS CAB')) {
            url = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_xt'
            spec = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-XT-HD7-HD9-HD10-ENNA-HR.pdf'
        }
        else if (modelData.model.includes('DEFENDER DPS')) {
            url = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender_dps'
            spec = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/comparison-sheets/ssv/ORV-SSV-MY24-Can-Am-Comparison-Sheets-DEFENDER-DPS-HD9-HD10-COMBINED-EN.pdf'
        }
        else if (modelData.model.includes('DEFENDER')) {
            url = 'https://can-am.brp.com/off-road/ca/en/models/side-by-side-vehicles/defender.html#defender'
            spec = 'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my24/assets/spec-sheets/ssv/defender/ORV-SSV-MY24-SPEC-DEF-ENNA-HR.pdf'
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
