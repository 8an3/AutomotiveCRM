
export function PrintSpecManitou(financeData) {
	//console.log(financeData.model)
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
	return (url)

}
