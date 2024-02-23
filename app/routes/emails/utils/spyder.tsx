export function PrintSpecSpyder(financeData) {
	//console.log(financeData.model)
	let url = ''
	if (financeData.model.includes('spark')) {
		url =
			'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-REC-SPA-TRIXX-SPEC-DPS-ENNA_LR.pdf'
	} else if (financeData.model.includes('gti white')) {
		url =
			'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-REC-GTI-SPEC-DPS-ENNA_LR.pdf'
	} else if (financeData.model.includes('gti se')) {
		url =
			'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-REC-GTI-SE-SPEC-DPS-ENNA_LR.pdf'
	} else if (financeData.model.includes('gtx limited')) {
		url =
			'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-TOUR-GTX-LTD-SPEC-DPS-ENNA_LR.pdf'
	} else if (financeData.model.includes('gtr')) {
		url =
			'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-PERF-GTR-SPEC-DPS-ENNA_LR.pdf'
	} else if (financeData.model.includes('gtx')) {
		url =
			'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-TOUR-GTX-SPEC-DPS-ENNA_LR.pdf'
	} else if (financeData.model.includes('rtx')) {
		url =
			'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-PERF-RXT-X-SPEC-DPS-ENNA_LR.pdf'
	} else if (financeData.model.includes('rxp')) {
		url =
			'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-PERF-RXP-X-SPEC-DPS-ENNA_LR.pdf'
	} else if (financeData.model.includes('wake')) {
		url =
			'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-TOW-WAKE-SPEC-DPS-ENNA_LR.pdf'
	} else if (financeData.model.includes('wake pro')) {
		url =
			'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-TOW-WAKE-PRO-SPEC-DPS-ENNA_LR.pdf'
	} else if (financeData.model.includes('fishpro scout')) {
		url =
			'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-FISH-FP-SCOUT-SPEC-DPS-ENNA_LR.pdf'
	} else if (financeData.model.includes('fishpro sport')) {
		url =
			'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-FISH-FP-SPORT-SPEC-DPS-ENNA_LR.pdf'
	} else if (financeData.model.includes('fishpro trophy')) {
		url =
			'https://www.sea-doo.com/content/dam/global/en/sea-doo/my23/documents/specs-sheets/en/SEA-MY23-FISH-FP-TROPHY-SPEC-DPS-ENNA_LR.pdf'
	}

	return (url)

}
