import { useLoaderData } from "@remix-run/react"
import { utilsLoader } from "~/overviewUtils/actions"
import { ModelPageCanAm } from "./canam"
import { ModelPageSeaDoo } from "./seadoo"
import { ModelPageKawasaki } from "./kawasaki"
import { ModelPageSkiDoo } from "./skidoo"
import { ModelPageSpyder } from "./spyder"
import { ModelPageSuzuki } from "./suzuki"
import { ModelPageTriumph } from "./triumph"
import { ModelPageSwitch } from "./switch"
import { ModelPageManitou } from "./manitou"

export let loader = utilsLoader

export function ModelPage() {
    const { finance } = useLoaderData()

    if (finance.brand === 'Can-Am') {
        return ModelPageCanAm()
    }
    if (finance.brand === 'Sea-Doo') {
        return ModelPageSeaDoo()
    }
    if (finance.brand === 'Kawasaki') {
        return ModelPageKawasaki()
    }
    if (finance.brand === 'Ski-Doo') {
        return ModelPageSkiDoo()
    }
    if (finance.brand === 'Spyder') {
        return ModelPageSpyder()
    }
    if (finance.brand === 'Suzuki') {
        return ModelPageSuzuki()
    }
    if (finance.brand === 'Triumph') {
        return ModelPageTriumph()
    }
    if (finance.brand === 'Switch') {
        return ModelPageSwitch()
    }
    if (finance.brand === 'Manitou') {
        return ModelPageManitou()
    }
    if (finance.brand === 'BMW-Motorrad') {
        return ModelPageBMWMoto()
    }
}
