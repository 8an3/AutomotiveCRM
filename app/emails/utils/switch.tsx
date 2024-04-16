
export function PrintSpecSwitch(financeData) {
	//console.log(financeData.model)
	let url = ''
	if (financeData.model.includes('switch cruise')) {
		url =
			'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-SWIC-SPEC-DPS-ENNA_LR.pdf'
	} else if (financeData.model.includes('switch sport')) {
		url =
			'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-SWIS-SPEC-DPS-ENNA_LR.pdf'
	} else
		url =
			'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-SWI-SPEC-DPS-ENNA_LR.pdf'

	return (url)
}






