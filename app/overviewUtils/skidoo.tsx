import { useLoaderData } from '@remix-run/react'
import { Button } from "~/components/ui/index"
import { utilsLoader } from './actions'
import jsPDF from 'jspdf'


export let loader = utilsLoader

export function ModelPageSkiDoo() {
	const { modelData } = useLoaderData()

	const Click = () => {
		//console.log('Button clicked!')
		// Perform additional actions or logic here

		var selectedModelName = ''
		if (modelData.model.includes('summit')) {
			selectedModelName = 'deep-snow/summit.html'
		} else if (modelData.model.includes('renegade')) {
			selectedModelName = 'trail/renegade.html'
		} else if (modelData.model.includes('mxz')) {
			selectedModelName = 'trail/mxz.html'
		} else if (modelData.model.includes('grand touring')) {
			selectedModelName = 'trail/grand-touring.html'
		} else if (modelData.model.includes('backcountry')) {
			selectedModelName = 'crossover/backcountry.html'
		} else if (modelData.model.includes('expedition')) {
			selectedModelName = 'crossover/expedition.html'
		} else if (modelData.model.includes('skandic')) {
			selectedModelName = 'sport-utility/skandic.html'
		} else if (modelData.model.includes('tundra')) {
			selectedModelName = 'sport-utility/tundra.html'
		} else if (modelData.model.includes('summit neo')) {
			selectedModelName = 'mid-sized/summit-neo.html'
		} else if (modelData.model.includes('mxz neo')) {
			selectedModelName = 'mid-sized/mxz-neo.html'
		} else {
			selectedModelName = 'youth/mxz-120-200.html'
		}
		var baseUrl = 'https://www.ski-doo.com/ca/en/models/'
		var modelUrl = baseUrl + selectedModelName
		window.open(modelUrl, '_blank')
	}
	return (
		<Button onClick={Click} className="h-5 border border-slate12  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border" type="submit" content="update">
			Model Page
		</Button>
	)
}

// -- skidoo
export function PrintSpecSkiDoo() {
	const { loanValues } = useLoaderData()

	const Click1 = () => {
		let url = ''
		if (loanValues.model.includes('Summit X with Expert Package')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-SUM-X-EXP-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('explore')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-SUM-X-SPEC-ENNA-Page-PDFx.pdff'
		} else if (
			loanValues.model.includes('SUMMIT ADRENALINE WITH EDGE PACKAGE')
		) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-SUM-ADRENALINE-EDGE-PACK-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('SUMMIT ADRENALINE')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-SUM-ADRENALINE-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('Freeride')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-FREE-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('Renegade X-RS')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-REN-X-RS-SPEC-ENNA-Page-PDFx.pdf'
		} else if (
			loanValues.model.includes('Renegade Adrenaline with Enduro Package')
		) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-REN-ADRENALINE-ENDURO-PACK-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('Renegade Adrenaline')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-REN-ADRENALINE-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('Renegade Sport')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-REN-SPORT-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('Renegade X')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-REN-X-SPEC-ENNA-Page-PDFx.pdf'
		} else if (
			loanValues.model.includes('MXZ Adrenaline with Blizzard Package')
		) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-MXZ-ADRENALINE-BLIZZARD-PACK-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('mxz adrenaline')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-MXZ-ADRENALINE-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('MXZ Sport')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-MXZ-SPORT-SPEC-ENNA-Page-PDFx.pdf'
		} else if (
			loanValues.model.includes('Grand Touring LE with Luxury Package')
		) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-GT-LE-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('Grand Touring LE')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-GT-LE-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('Grand Touring Sport')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-GT-SPORT-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('Backcountry Adrenaline')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-BCK-ADRENALINE-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('Backcountry Sport')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-EXP-LE-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('Expedition LE')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-EXP-LE-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('Expedition Xtreme')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-EXP-XTREME-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('Expedition Sport')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-EXP-SPORT-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('Skandic LE')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-SKA-SE-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('Skandic Sport')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-SKA-SPORT-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('Tundra LE')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-TUN-LE-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('Tundra Sport')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-TUN-SPORT-SPEC-ENNA-Page-PDFx.pdf'
		} else if (loanValues.model.includes('Summit NEO')) {
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-SUM-NEO-SPEC-ENNA-Page-PDFx.pdf'
		} else
			url =
				'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-SUM-NEO-SPEC-ENNA-Page-PDFx.pdf'
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
