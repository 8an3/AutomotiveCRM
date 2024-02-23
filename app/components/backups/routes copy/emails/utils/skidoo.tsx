
export function PrintSpecSkiDoo(financeData) {
	//console.log(financeData.model)
	let url = ''
	if (financeData.model.includes('Summit X with Expert Package')) {
		url = 'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-SUM-X-EXP-SPEC-ENNA-Page-PDFx.pdf'
	}
	else if (financeData.model.includes('explore')) {
		url = 'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-SUM-X-SPEC-ENNA-Page-PDFx.pdff'
	}
	else if (financeData.model.includes('SUMMIT ADRENALINE WITH EDGE PACKAGE')) {
		url = 'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-SUM-ADRENALINE-EDGE-PACK-SPEC-ENNA-Page-PDFx.pdf'
	}
	else if (financeData.model.includes('SUMMIT ADRENALINE')) {
		url = 'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-SUM-ADRENALINE-SPEC-ENNA-Page-PDFx.pdf'
	}
	else if (financeData.model.includes('Freeride')) {
		url = 'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-FREE-SPEC-ENNA-Page-PDFx.pdf'
	}
	else if (financeData.model.includes('Renegade X-RS')) {
		url = 'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-REN-X-RS-SPEC-ENNA-Page-PDFx.pdf'
	}
	else if (financeData.model.includes('Renegade Adrenaline with Enduro Package')) {
		url = 'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-REN-ADRENALINE-ENDURO-PACK-SPEC-ENNA-Page-PDFx.pdf'
	}
	else if (financeData.model.includes('Renegade Adrenaline')) {
		url = 'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-REN-ADRENALINE-SPEC-ENNA-Page-PDFx.pdf'
	}
	else if (financeData.model.includes('Renegade Sport')) {
		url = 'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-REN-SPORT-SPEC-ENNA-Page-PDFx.pdf'
	}
	else if (financeData.model.includes('Renegade X')) {
		url = 'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-REN-X-SPEC-ENNA-Page-PDFx.pdf'
	}
	else if (financeData.model.includes('MXZ Adrenaline with Blizzard Package')) {
		url = 'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-MXZ-ADRENALINE-BLIZZARD-PACK-SPEC-ENNA-Page-PDFx.pdf'
	}
	else if (financeData.model.includes('mxz adrenaline')) {
		url = 'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-MXZ-ADRENALINE-SPEC-ENNA-Page-PDFx.pdf'
	}
	else if (financeData.model.includes('MXZ Sport')) {
		url = 'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-MXZ-SPORT-SPEC-ENNA-Page-PDFx.pdf'
	}
	else if (financeData.model.includes('Grand Touring LE with Luxury Package')) {
		url = 'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-GT-LE-SPEC-ENNA-Page-PDFx.pdf'
	} else if (financeData.model.includes('Grand Touring LE')) {
		url =
			'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-GT-LE-SPEC-ENNA-Page-PDFx.pdf'
	} else if (financeData.model.includes('Grand Touring Sport')) {
		url =
			'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-GT-SPORT-SPEC-ENNA-Page-PDFx.pdf'
	} else if (financeData.model.includes('Backcountry Adrenaline')) {
		url =
			'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-BCK-ADRENALINE-SPEC-ENNA-Page-PDFx.pdf'
	} else if (financeData.model.includes('Backcountry Sport')) {
		url =
			'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-EXP-LE-SPEC-ENNA-Page-PDFx.pdf'
	} else if (financeData.model.includes('Expedition LE')) {
		url =
			'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-EXP-LE-SPEC-ENNA-Page-PDFx.pdf'
	} else if (financeData.model.includes('Expedition Xtreme')) {
		url =
			'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-EXP-XTREME-SPEC-ENNA-Page-PDFx.pdf'
	} else if (financeData.model.includes('Expedition Sport')) {
		url =
			'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-EXP-SPORT-SPEC-ENNA-Page-PDFx.pdf'
	} else if (financeData.model.includes('Skandic LE')) {
		url =
			'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-SKA-SE-SPEC-ENNA-Page-PDFx.pdf'
	} else if (financeData.model.includes('Skandic Sport')) {
		url =
			'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-SKA-SPORT-SPEC-ENNA-Page-PDFx.pdf'
	} else if (financeData.model.includes('Tundra LE')) {
		url =
			'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-TUN-LE-SPEC-ENNA-Page-PDFx.pdf'
	} else if (financeData.model.includes('Tundra Sport')) {
		url =
			'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-TUN-SPORT-SPEC-ENNA-Page-PDFx.pdf'
	} else if (financeData.model.includes('Summit NEO')) {
		url =
			'https://www.ski-doo.com/content/dam/global/en/ski-doo/my24/spec-sheets/na/en/SKI-MY24-SUM-NEO-SPEC-ENNA-Page-PDFx.pdf'
	}
	return (url)

}
