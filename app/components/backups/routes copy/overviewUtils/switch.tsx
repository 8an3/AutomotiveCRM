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
		<Button onClick={Click} className="h-5 border border-slate12  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border" type="submit" content="update">
			Model Page
		</Button>
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
		<Button onClick={Click1} className="h-5 border border-slate12  cursor-pointer hover:text-[#02a9ff] p-5 hover:border-[#02a9ff] hover:border" type="submit" content="update">
			Print Spec
		</Button>
	)
}
