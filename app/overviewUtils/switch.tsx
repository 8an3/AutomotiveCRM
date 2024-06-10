import { useLoaderData } from '@remix-run/react'
import { Button } from "~/components/ui/index"
import { utilsLoader } from './actions'
import jsPDF from 'jspdf'


export let loader = utilsLoader


export function ModelPageSwitch() {
	const { modelData } = useLoaderData()

	const Click = () => {
		//console.log('Button clicked!')

		var selectedModelName = ''

		if (modelData.model.includes('sport')) {
			selectedModelName = 'switch-sport.html'
		} else if (modelData.model.includes('cruise')) {
			selectedModelName = 'switch-cruise.html'
		} else {
			selectedModelName = 'switch.html'
		}
		var baseUrl = 'https://www.sea-doo.com/ca/en/pontoons/'
		var modelUrl = baseUrl + selectedModelName
		window.open(modelUrl, '_blank')
	}
	return (
		<p onClick={Click} type="submit" content="update">
			Model Page
		</p>
	)
}

export function PrintSpecSwitch() {
	const { modelData } = useLoaderData()

	const Click1 = () => {
		let url = ''
		if (modelData.model.includes('switch cruise')) {
			url =
				'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-SWIC-SPEC-DPS-ENNA_LR.pdf'
		} else if (modelData.model.includes('switch sport')) {
			url =
				'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-SWIS-SPEC-DPS-ENNA_LR.pdf'
		} else
			url =
				'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-SWI-SPEC-DPS-ENNA_LR.pdf'

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
