import { useLoaderData } from "@remix-run/react"
import { utilsLoader } from "./actions"
import { ModelPageCanAm } from "./canam"
import { ModelPageSeaDoo } from "./seadoo"
import { ModelPageKawasaki } from "./kawasaki"
import { ModelPageSkiDoo } from "./skidoo"
import { ModelPageSpyder } from "./spyder"
import { ModelPageSuzuki } from "./suzuki"
import { ModelPageTriumph } from "./triumph"
import { ModelPageSwitch } from "./switch"
import { ModelPageManitou } from "./manitou"
import { ModelPageHD } from './hd'
import { ModelPageBMWMoto } from "./bmwmoto"
import { Button } from "~/components"
export let loader = utilsLoader

export function ModelPage() {
    const { finance } = useLoaderData()

    if (finance.brand === 'Can-Am') {
        return ModelPageCanAm()
    }
    if (finance.brand === 'Can-Am-SXS') {
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
    if (finance.brand === 'Harley-Davidson') {
        return (
            <ModelPageHD />
        )
    }
    if (finance.brand === 'Indian') {
        return (
            <p disabled className="h-5    cursor-pointer hover:text-primary p-5 " type="submit" content="update">
                Under Construction
            </p>
        )
    }
    if (finance.brand === 'Yamaha') {
        return (
            <p disabled className="h-5    cursor-pointer hover:text-primary p-5 " type="submit" content="update">
                Under Construction
            </p>
        )
    }
    if (finance.brand === 'KTM') {
        return (
            <p disabled className="h-5    cursor-pointer hover:text-primary p-5 " type="submit" content="update">
                Under Construction
            </p>
        )
    }
}
