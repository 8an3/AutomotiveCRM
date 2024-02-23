import { useLoaderData } from '@remix-run/react'
import { Button } from "~/components/ui/index"
import { utilsLoader } from './actions'
import jsPDF from 'jspdf'
import { json } from '@remix-run/node'


export let loader = utilsLoader

export function ModelPageSpyder() {
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
		<Button onClick={Click} className="h-5 border border-slate12  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border" type="submit" content="update">
			Model Page
		</Button>
	)
}

export function PrintSpecSpyder() {
	const { finance } = useLoaderData()

	const Click1 = () => {
		let url = ''
		if (finance.model.includes('spark')) {
			url =
				'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-REC-SPA-TRIXX-SPEC-DPS-ENNA_LR.pdf'
		} else if (finance.model.includes('gti white')) {
			url =
				'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-REC-GTI-SPEC-DPS-ENNA_LR.pdf'
		} else if (finance.model.includes('gti se')) {
			url =
				'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-REC-GTI-SE-SPEC-DPS-ENNA_LR.pdf'
		} else if (finance.model.includes('gtx limited')) {
			url =
				'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-TOUR-GTX-LTD-SPEC-DPS-ENNA_LR.pdf'
		} else if (finance.model.includes('gtr')) {
			url =
				'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-PERF-GTR-SPEC-DPS-ENNA_LR.pdf'
		} else if (finance.model.includes('gtx')) {
			url =
				'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-TOUR-GTX-SPEC-DPS-ENNA_LR.pdf'
		} else if (finance.model.includes('rtx')) {
			url =
				'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-PERF-RXT-X-SPEC-DPS-ENNA_LR.pdf'
		} else if (finance.model.includes('rxp')) {
			url =
				'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-PERF-RXP-X-SPEC-DPS-ENNA_LR.pdf'
		} else if (finance.model.includes('wake')) {
			url =
				'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-TOW-WAKE-SPEC-DPS-ENNA_LR.pdf'
		} else if (finance.model.includes('wake pro')) {
			url =
				'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-TOW-WAKE-PRO-SPEC-DPS-ENNA_LR.pdf'
		} else if (finance.model.includes('fishpro scout')) {
			url =
				'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-FISH-FP-SCOUT-SPEC-DPS-ENNA_LR.pdf'
		} else if (finance.model.includes('fishpro sport')) {
			url =
				'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-FISH-FP-SPORT-SPEC-DPS-ENNA_LR.pdf'
		} else if (finance.model.includes('fishpro trophy')) {
			url =
				'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-FISH-FP-TROPHY-SPEC-DPS-ENNA_LR.pdf'
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
		<Button onClick={Click1} className="h-5 border border-slate12  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border" type="submit" content="update">
			Print Spec
		</Button>
	)
}
