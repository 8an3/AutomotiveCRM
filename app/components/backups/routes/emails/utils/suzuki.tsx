import { useLoaderData } from '@remix-run/react'
import { Button } from "~/components/ui/index"
import { utilsLoader } from '../../overviewUtils/actions'
import jsPDF from 'jspdf'


export let loader = utilsLoader

export function ModelPageSuzuki() {
	const { modelData } = useLoaderData()

	const Click = () => {
		//console.log('Button clicked!')

		var selectedModelName = ''
		if (modelData.model.includes('hayabusa gsx1300rrqm3')) {
			selectedModelName = 'product/2023-hayabusa/'
		} else if (modelData.model.includes('gsx-r')) {
			selectedModelName = 'catalogue/motorcycles/sport/'
		} else if (modelData.model.includes('katana')) {
			selectedModelName = 'product/2023-katana/'
		} else if (modelData.model.includes('gsx-s')) {
			selectedModelName = 'catalogue/motorcycles/street/'
		} else if (modelData.model.includes('v-strom')) {
			selectedModelName = 'catalogue/motorcycles/sport-adventure-tourer/'
		} else if (modelData.model.includes('sv650')) {
			selectedModelName = 'catalogue/motorcycles/street/'
		} else if (modelData.model.includes('dr-z')) {
			selectedModelName = 'catalogue/motorcycles/off-road-motocross/'
		} else if (modelData.model.includes('boulevard')) {
			selectedModelName = 'catalogue/motorcycles/cruiser/'
		} else if (modelData.model.includes('burgman')) {
			selectedModelName = 'catalogue/motorcycles/scooter/'
		} else if (modelData.model.includes('rm')) {
			selectedModelName = 'off-road-motocross/'
		} else if (modelData.model.includes('dr650sem3')) {
			selectedModelName = 'product/2023-dr650se/'
		} else if (modelData.model.includes('dr-z400sm')) {
			selectedModelName = 'product/2023-dr-z400s/'
		} else if (modelData.model.includes('LT-A')) {
			selectedModelName = 'catalogue/atv/utility-sport/'
		} else if (modelData.model.includes('LT-Z')) {
			selectedModelName = 'catalogue/atv/kids/'
		} else if (modelData.model.includes('LT-F')) {
			selectedModelName = 'product/2023-kingquad-400/'
		} else {
			selectedModelName = ''
		}
		var baseUrl = 'https://www.suzuki.ca/'
		var modelUrl = baseUrl + selectedModelName
		window.open(modelUrl, '_blank')
	}
	return (
		<Button secondary onClick={Click}>
			Model Page
		</Button>
	)
}
