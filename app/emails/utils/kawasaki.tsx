import { useLoaderData } from '@remix-run/react'
import { Button } from "~/components/ui/index"
import { utilsLoader } from '~/overviewUtils/actions'
import jsPDF from 'jspdf'



export function PrintSpecKawasaki(financeData) {

	//console.log(financeData.model)
	let url = ''
	if (financeData.model.includes('KX65')) {
		url = 'motorcycle/kx/youth-mx/kx65'
	} else if (financeData.model.includes('KX85')) {
		url = 'motorcycle/kx/youth-mx/kx85'
	} else if (financeData.model.includes('KX112')) {
		url = 'motorcycle/kx/youth-mx/kx112'
	} else if (financeData.model.includes('KX250')) {
		url = 'motorcycle/kx/full-size-mx/kx250'
	} else if (financeData.model.includes('KX450')) {
		url = 'motorcycle/kx/full-size-mx/kx450'
	} else if (financeData.model.includes('KX450SR')) {
		url = 'motorcycle/kx/full-size-mx/kx450SR'
	} else if (financeData.model.includes('KX250X')) {
		url = 'motorcycle/kx/full-size-x/kx250X'
	} else if (financeData.model.includes('KLX110R')) {
		url = 'motorcycle/klx/off-road/klx110R'
	} else if (financeData.model.includes('KLX140R')) {
		url = 'motorcycle/klx/off-road/klx140R'
	} else if (financeData.model.includes('KLX230R')) {
		url = 'motorcycle/klx/off-road/klx230R'
	} else if (financeData.model.includes('KLX300R')) {
		url = 'motorcycle/klx/off-road/klx300R'
	} else if (financeData.model.includes('KLX230')) {
		url = 'motorcycle/klx/on-off-road/klx230'
	} else if (financeData.model.includes('KLX300')) {
		url = 'motorcycle/klx/off-road/klx300'
	} else if (financeData.model.includes('VULCAN S ')) {
		url = 'motorcycle/vulcan/sport-cruiser/vulcan-s'
	} else if (financeData.model.includes('VULCAN 900')) {
		url = 'motorcycle/vulcan/classic-cruiser/vulcan-900'
	} else if (financeData.model.includes('VULCAN 1700 VAQUERO')) {
		url = 'motorcycle/kvulcan/bagger-cruiser/vulcan-1700-vaquero'
	} else if (financeData.model.includes('VULCAN 1700 VOYAGER')) {
		url = 'motorcycle/vulcan/touring-cruiser/vulcan-1700-voyager'
	} else if (financeData.model.includes('EMILINATOR')) {
		url = 'motorcycle/eliminator/street-cruiser/eliminator'
	} else if (financeData.model.includes('CONCOURSE')) {
		url = 'motorcycle/concours/supersport-touring/concours-14'
	} else if (financeData.model.includes('W800')) {
		url = 'motorcycle/w/retro-classic/w800'
	} else if (financeData.model.includes('VERSYS-X 300')) {
		url = 'motorcycle/versys/adventure-touring/versys-x-300'
	} else if (financeData.model.includes('VERSYS 650')) {
		url = 'motorcycle/kversys/adventure-touring/versys-650'
	} else if (financeData.model.includes('VERSYS 1000')) {
		url = 'versys/adventure-touring/versys-1000-lt'
	} else if (financeData.model.includes('Z H2')) {
		url = 'motorcycle/z/z-hypersport/z-h2'
	} else if (financeData.model.includes('Z400')) {
		url = 'motorcycle/z/supernaked/z400-abs'
	} else if (financeData.model.includes('Z650 ')) {
		url = 'motorcycle/z/supernaked/z650'
	} else if (financeData.model.includes('Z900')) {
		url = 'motorcycle/z/supernaked/z900'
	} else if (financeData.model.includes('Z650RS')) {
		url = 'motorcycle/z/retro-sport/z650rs'
	} else if (financeData.model.includes('Z900RS ')) {
		url = 'motorcycle/z/retro-sport/z900rs'
	} else if (financeData.model.includes('Z125 PRO')) {
		url = 'motorcycle/z/mini-naked/z125-pro'
	} else if (financeData.model.includes('NINJA H2 SX')) {
		url = 'motorcycle/ninja/hypersport/ninja-h2-sx'
	} else if (financeData.model.includes('NINJA H2')) {
		url = 'motorcycle/ninja/hypersport/ninja-h2'
	} else if (financeData.model.includes('NINJA H2R')) {
		url = 'motorcycle/ninja/hypersport/ninja-h2r'
	} else if (financeData.model.includes('NINJA ZX-4R')) {
		url = 'motorcycle/ninja/supersport/ninja-zx-4r'
	} else if (financeData.model.includes('NINJA ZX-6R')) {
		url = 'motorcycle/ninja/supersport/ninja-zx-6r'
	} else if (financeData.model.includes('INJA ZX-10R')) {
		url = 'motorcycle/ninja/supersport/ninja-zx-10r'
	} else if (financeData.model.includes('NINJA ZX-14R')) {
		url = 'motorcycle/ninja/supersport/ninja-zx-14r'
	} else if (financeData.model.includes('NINJA 400 ')) {
		url = 'motorcycle/ninja/sport/ninja-400'
	} else if (financeData.model.includes('NINJA 650')) {
		url = 'motorcycle/ninja/sport/ninja-650'
	} else if (financeData.model.includes('NINJA 1000SX')) {
		url = 'motorcycle/ninja/sport/ninja-1000sx'
	} else if (financeData.model.includes('KFX50')) {
		url = 'atv/kfx/youth/kfx50'
	} else if (financeData.model.includes('KSX90')) {
		url = 'atv/kfx/youth/kfx90'
		// missed brtue force 300
	} else if (financeData.model.includes('BRUTE FORCE 750')) {
		url = 'atv/atv-utility-recreation/utility-recreation/brute-force-750-4x4i'
	} else if (financeData.model.includes('TERYX KRX 1000')) {
		url = 'side-x-side/teryx/teryx-2-passenger-sport/teryx-krx-1000'
	} else if (financeData.model.includes('TERYX KRX4 1000')) {
		url = 'side-x-side/teryx/teryx-4-passenger-sport/teryx-krx4-1000'
		// missed teryx
	} else if (financeData.model.includes('TERYX4')) {
		url = 'side-x-side/teryx/teryx-4-passenger-recreation/teryx4'
	} else if (financeData.model.includes('MULE 4010 TRANS 4X4')) {
		url = 'side-x-side/mule/2-to4-passenger/mule-4010-trans4x4'
	} else if (financeData.model.includes('MULE SX')) {
		url = 'side-x-side/mule/2-passenger/mule-sx'
	} else if (financeData.model.includes('MULE 4010 4X4')) {
		url = 'side-x-side/mule/2-passenger/mule-4010-4x4'
	} else if (financeData.model.includes('MULE PRO-MX')) {
		url = 'side-x-side/mule/2-passenger/mule-pro-mx'
	} else if (financeData.model.includes('MULE PRO-FXT 1000')) {
		url = 'side-x-side/mule/3-to6-passenger/mule-pro-fxt-1000'
	} else if (financeData.model.includes('MULE PRO-FXT')) {
		url = 'side-x-side/mule/3-to6-passenger/mule-pro-fxt'
	} else if (financeData.model.includes('MULE PRO-DXT DIESEL')) {
		url = 'side-x-side/mule/3-to6-passenger/mule-pro-dxt-diesel'
	} else if (financeData.model.includes('MULE PRO-FX 1000')) {
		url = 'side-x-side/mule/3-passenger/mule-pro-fx-1000'
	} else if (financeData.model.includes('MULE PRO-FXR 1000')) {
		url = 'side-x-side/mule/3-passenger/mule-pro-fxr-1000'
	} else if (financeData.model.includes('MULE PRO-FX')) {
		url = 'side-x-side/mule/3-passenger/mule-pro-fx'
	} else if (financeData.model.includes('MULE PRO-DX DIESEL')) {
		url = 'side-x-side/mule/3-passenger/mule-pro-dx-diesel'
	} else if (financeData.model.includes('MULE PRO-FXR 1000')) {
		url = 'side-x-side/mule/3-passenger/mule-pro-fxr      '
	} else if (financeData.model.includes('JET SKI SX-R 160')) {
		url = 'watercraft/jet-ski/stand-up/jet-ski-sx-r-160'
	} else if (financeData.model.includes('JET SKI ULTRA 160')) {
		url = 'watercraft/jet-ski/jet-ski-3-passenger/jet-ski-ultra-160'
	} else if (financeData.model.includes('JET SKI ULTRA LX')) {
		url = 'watercraft/jet-ski/jet-ski-3-passenger/jet-ski-ultra-lx'
	} else if (financeData.model.includes('JET SKI STX 160')) {
		url = 'watercraft/jet-ski/jet-ski-3-passenger/jet-ski-stx-160'
	} else if (financeData.model.includes('JET SKI ULTRA 310LX')) {
		url = 'watercraft/jet-ski/jet-ski-3-passenger-supercharged/jet-ski-ultra-310lx'
	} else if (financeData.model.includes('JET SKI ULTRA 310X')) {
		url = 'watercraft/jet-ski/jet-ski-3-passenger-supercharged/jet-ski-ultra-310x'
	}
	var baseUrl = 'https://www.kawasaki.ca/en-ca/'
	var modelUrl = baseUrl + url
	return (modelUrl)
}
