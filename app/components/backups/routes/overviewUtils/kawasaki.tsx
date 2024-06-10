import { useLoaderData } from '@remix-run/react'
import { Button } from "~/components/ui/index"
import { utilsLoader } from './actions'
import jsPDF from 'jspdf'



export let loader = utilsLoader


export function ModelPageKawasaki() {
	const { modelData } = useLoaderData()

	const Click = () => {
		//console.log('Button clicked!')
		var selectedModelName = ''
		if (modelData.model.includes('KX65')) {
			selectedModelName = 'motorcycle/kx/youth-mx/kx65'
		} else if (modelData.model.includes('KX85')) {
			selectedModelName = 'motorcycle/kx/youth-mx/kx85'
		} else if (modelData.model.includes('KX112')) {
			selectedModelName = 'motorcycle/kx/youth-mx/kx112'
		} else if (modelData.model.includes('KX250')) {
			selectedModelName = 'motorcycle/kx/full-size-mx/kx250'
		} else if (modelData.model.includes('KX450')) {
			selectedModelName = 'motorcycle/kx/full-size-mx/kx450'
		} else if (modelData.model.includes('KX450SR')) {
			selectedModelName = 'motorcycle/kx/full-size-mx/kx450SR'
		} else if (modelData.model.includes('KX250X')) {
			selectedModelName = 'motorcycle/kx/full-size-x/kx250X'
		} else if (modelData.model.includes('KLX110R')) {
			selectedModelName = 'motorcycle/klx/off-road/klx110R'
		} else if (modelData.model.includes('KLX140R')) {
			selectedModelName = 'motorcycle/klx/off-road/klx140R'
		} else if (modelData.model.includes('KLX230R')) {
			selectedModelName = 'motorcycle/klx/off-road/klx230R'
		} else if (modelData.model.includes('KLX300R')) {
			selectedModelName = 'motorcycle/klx/off-road/klx300R'
		} else if (modelData.model.includes('KLX230')) {
			selectedModelName = 'motorcycle/klx/on-off-road/klx230'
		} else if (modelData.model.includes('KLX300')) {
			selectedModelName = 'motorcycle/klx/off-road/klx300'
		} else if (modelData.model.includes('VULCAN S ')) {
			selectedModelName = 'motorcycle/vulcan/sport-cruiser/vulcan-s'
		} else if (modelData.model.includes('VULCAN 900')) {
			selectedModelName = 'motorcycle/vulcan/classic-cruiser/vulcan-900'
		} else if (modelData.model.includes('VULCAN 1700 VAQUERO')) {
			selectedModelName =
				'motorcycle/kvulcan/bagger-cruiser/vulcan-1700-vaquero'
		} else if (modelData.model.includes('VULCAN 1700 VOYAGER')) {
			selectedModelName =
				'motorcycle/vulcan/touring-cruiser/vulcan-1700-voyager'
		} else if (modelData.model.includes('EMILINATOR')) {
			selectedModelName = 'motorcycle/eliminator/street-cruiser/eliminator'
		} else if (modelData.model.includes('CONCOURSE')) {
			selectedModelName = 'motorcycle/concours/supersport-touring/concours-14'
		} else if (modelData.model.includes('W800')) {
			selectedModelName = 'motorcycle/w/retro-classic/w800'
		} else if (modelData.model.includes('VERSYS-X 300')) {
			selectedModelName = 'motorcycle/versys/adventure-touring/versys-x-300'
		} else if (modelData.model.includes('VERSYS 650')) {
			selectedModelName = 'motorcycle/kversys/adventure-touring/versys-650'
		} else if (modelData.model.includes('VERSYS 1000')) {
			selectedModelName = 'versys/adventure-touring/versys-1000-lt'
		} else if (modelData.model.includes('Z H2')) {
			selectedModelName = 'motorcycle/z/z-hypersport/z-h2'
		} else if (modelData.model.includes('Z400')) {
			selectedModelName = 'motorcycle/z/supernaked/z400-abs'
		} else if (modelData.model.includes('Z650 ')) {
			selectedModelName = 'motorcycle/z/supernaked/z650'
		} else if (modelData.model.includes('Z900')) {
			selectedModelName = 'motorcycle/z/supernaked/z900'
		} else if (modelData.model.includes('Z650RS')) {
			selectedModelName = 'motorcycle/z/retro-sport/z650rs'
		} else if (modelData.model.includes('Z900RS ')) {
			selectedModelName = 'motorcycle/z/retro-sport/z900rs'
		} else if (modelData.model.includes('Z125 PRO')) {
			selectedModelName = 'motorcycle/z/mini-naked/z125-pro'
		} else if (modelData.model.includes('NINJA H2 SX')) {
			selectedModelName = 'motorcycle/ninja/hypersport/ninja-h2-sx'
		} else if (modelData.model.includes('NINJA H2')) {
			selectedModelName = 'motorcycle/ninja/hypersport/ninja-h2'
		} else if (modelData.model.includes('NINJA H2R')) {
			selectedModelName = 'motorcycle/ninja/hypersport/ninja-h2r'
		} else if (modelData.model.includes('NINJA ZX-4R')) {
			selectedModelName = 'motorcycle/ninja/supersport/ninja-zx-4r'
		} else if (modelData.model.includes('NINJA ZX-6R')) {
			selectedModelName = 'motorcycle/ninja/supersport/ninja-zx-6r'
		} else if (modelData.model.includes('INJA ZX-10R')) {
			selectedModelName = 'motorcycle/ninja/supersport/ninja-zx-10r'
		} else if (modelData.model.includes('NINJA ZX-14R')) {
			selectedModelName = 'motorcycle/ninja/supersport/ninja-zx-14r'
		} else if (modelData.model.includes('NINJA 400 ')) {
			selectedModelName = 'motorcycle/ninja/sport/ninja-400'
		} else if (modelData.model.includes('NINJA 650')) {
			selectedModelName = 'motorcycle/ninja/sport/ninja-650'
		} else if (modelData.model.includes('NINJA 1000SX')) {
			selectedModelName = 'motorcycle/ninja/sport/ninja-1000sx'
		} else if (modelData.model.includes('KFX50')) {
			selectedModelName = 'atv/kfx/youth/kfx50'
		} else if (modelData.model.includes('KSX90')) {
			selectedModelName = 'atv/kfx/youth/kfx90'
			// missed brtue force 300
		} else if (modelData.model.includes('BRUTE FORCE 750')) {
			selectedModelName =
				'atv/atv-utility-recreation/utility-recreation/brute-force-750-4x4i'
		} else if (modelData.model.includes('TERYX KRX 1000')) {
			selectedModelName =
				'side-x-side/teryx/teryx-2-passenger-sport/teryx-krx-1000'
		} else if (modelData.model.includes('TERYX KRX4 1000')) {
			selectedModelName =
				'side-x-side/teryx/teryx-4-passenger-sport/teryx-krx4-1000'
			// missed teryx
		} else if (modelData.model.includes('TERYX4')) {
			selectedModelName =
				'side-x-side/teryx/teryx-4-passenger-recreation/teryx4'
		} else if (modelData.model.includes('MULE 4010 TRANS 4X4')) {
			selectedModelName = 'side-x-side/mule/2-to4-passenger/mule-4010-trans4x4'
		} else if (modelData.model.includes('MULE SX')) {
			selectedModelName = 'side-x-side/mule/2-passenger/mule-sx'
		} else if (modelData.model.includes('MULE 4010 4X4')) {
			selectedModelName = 'side-x-side/mule/2-passenger/mule-4010-4x4'
		} else if (modelData.model.includes('MULE PRO-MX')) {
			selectedModelName = 'side-x-side/mule/2-passenger/mule-pro-mx'
		} else if (modelData.model.includes('MULE PRO-FXT 1000')) {
			selectedModelName = 'side-x-side/mule/3-to6-passenger/mule-pro-fxt-1000'
		} else if (modelData.model.includes('MULE PRO-FXT')) {
			selectedModelName = 'side-x-side/mule/3-to6-passenger/mule-pro-fxt'
		} else if (modelData.model.includes('MULE PRO-DXT DIESEL')) {
			selectedModelName = 'side-x-side/mule/3-to6-passenger/mule-pro-dxt-diesel'
		} else if (modelData.model.includes('MULE PRO-FX 1000')) {
			selectedModelName = 'side-x-side/mule/3-passenger/mule-pro-fx-1000'
		} else if (modelData.model.includes('MULE PRO-FXR 1000')) {
			selectedModelName = 'side-x-side/mule/3-passenger/mule-pro-fxr-1000'
		} else if (modelData.model.includes('MULE PRO-FX')) {
			selectedModelName = 'side-x-side/mule/3-passenger/mule-pro-fx'
		} else if (modelData.model.includes('MULE PRO-DX DIESEL')) {
			selectedModelName = 'side-x-side/mule/3-passenger/mule-pro-dx-diesel'
		} else if (modelData.model.includes('MULE PRO-FXR 1000')) {
			selectedModelName = 'side-x-side/mule/3-passenger/mule-pro-fxr      '
		} else if (modelData.model.includes('JET SKI SX-R 160')) {
			selectedModelName = 'watercraft/jet-ski/stand-up/jet-ski-sx-r-160'
		} else if (modelData.model.includes('JET SKI ULTRA 160')) {
			selectedModelName =
				'watercraft/jet-ski/jet-ski-3-passenger/jet-ski-ultra-160'
		} else if (modelData.model.includes('JET SKI ULTRA LX')) {
			selectedModelName =
				'watercraft/jet-ski/jet-ski-3-passenger/jet-ski-ultra-lx'
		} else if (modelData.model.includes('JET SKI STX 160')) {
			selectedModelName =
				'watercraft/jet-ski/jet-ski-3-passenger/jet-ski-stx-160'
		} else if (modelData.model.includes('JET SKI ULTRA 310LX')) {
			selectedModelName =
				'watercraft/jet-ski/jet-ski-3-passenger-supercharged/jet-ski-ultra-310lx'
		} else if (modelData.model.includes('JET SKI ULTRA 310X')) {
			selectedModelName =
				'watercraft/jet-ski/jet-ski-3-passenger-supercharged/jet-ski-ultra-310x'
		} else {
			selectedModelName = ''
		}
		var baseUrl = 'https://www.kawasaki.ca/en-ca/'
		var modelUrl = baseUrl + selectedModelName
		window.open(modelUrl, '_blank')
	}
	return (
		<Button onClick={Click} className="h-5 border border-slate12  cursor-pointer hover:text-primary p-5 hover:border-primary hover:border" type="submit" content="update">
			Model Page
		</Button>
	)
}

export function PrintSpecKawasaki() {
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
		</p>
	)
}
