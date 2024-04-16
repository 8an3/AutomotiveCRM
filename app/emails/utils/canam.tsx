

export function PrintSpecCanAm(financeData) {
	//console.log(financeData.model)
	let url = ''
	if (financeData.model.toLowerCase().includes('renegade x')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/renegade/high-rez/ORV-ATV-MY23-SPEC-Can-Am-REN-X-XC-EN-HR.pdf'
	} else if (financeData.model.toLowerCase().includes('renegade x xc')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/renegade/high-rez/ORV-ATV-MY23-SPEC-Can-Am-REN-X-XC-EN-HR.pdf'
	} else if (financeData.model.toLowerCase().includes('renegade x mr')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/renegade/high-rez/ORV-ATV-MY23-SPEC-Can-Am-REN-X-MR-650-EN-HR.pdf'
	} else if (financeData.model.toLowerCase().includes('renegade')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/renegade/high-rez/ORV-ATV-MY23-SPEC-Can-Am-REN-EN-HR.pdf'
	} else if (financeData.model.toLowerCase().includes('outlander max xt')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/outlander/high-rez/ORV-ATV-MY23-SPEC-Can-Am-OUT-MAX-XT-EN-HR.pdf'
	} else if (financeData.model.toLowerCase().includes('outlander xt p')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/outlander/high-rez/ORV-ATV-MY23-SPEC-Can-Am-OUT-XTP-EN-HR.pdf'
	} else if (financeData.model.toLowerCase().includes('outlander xt')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/outlander/high-rez/ORV-ATV-MY23-SPEC-Can-Am-OUT-XT-EN-HR.pdf'
	} else if (financeData.model.toLowerCase().includes('outlander xmr')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/outlander/high-rez/ORV-ATV-MY23-SPEC-Can-Am-OUT-X-MR-1000R-EN-HR.pdf'
	} else if (financeData.model.toLowerCase().includes('outlander max dps')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/outlander/high-rez/ORV-ATV-MY23-SPEC-Can-Am-OUT-MAX-DPS-EN-HR.pdf'
	} else if (financeData.model.toLowerCase().includes('outlander max limited')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/outlander/high-rez/ORV-ATV-MY23-SPEC-Can-Am-OUT-MAX-LTD-EN-HR.pdf'
	} else if (financeData.model.toLowerCase().includes('outlander hunting edition')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/outlander/high-rez/ORV-ATV-MY23-SPEC-Can-Am-OUT-Hunting-Edition-850-EN-HR.pdf'
	} else if (financeData.model.toLowerCase().includes('outlander dps')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/outlander/high-rez/ORV-ATV-MY23-SPEC-Can-Am-OUT-DPS-EN-HR.pdf'
	} else if (financeData.model.toUpperCase().includes('OUTLANDER X MR 850')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/outlander/high-rez/ORV-ATV-MY23-SPEC-Can-Am-OUT-X-MR-850-EN-HR.pdf'
	} else if (financeData.model.toUpperCase().includes('OUTLANDER X MR 1000R')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/outlander/high-rez/ORV-ATV-MY23-SPEC-Can-Am-OUT-X-MR-1000R-EN-HR.pdf'
	} else if (financeData.model.toUpperCase().includes('OUTLANDER MAX XT 700')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/outlander-500-700/high-rez/ORV-ATV-MY23-5-SPEC-Can-Am-OUT-MAX-XT-700-EN-HR.pdf'
	} else if (financeData.model.toUpperCase().includes('OUTLANDER MAX DPS 500/700')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/outlander-500-700/high-rez/ORV-ATV-MY23-5-SPEC-Can-Am-OUT-MAX-DPS-500-700-EN-HR.pdf'
	} else if (financeData.model.toUpperCase().includes('OUTLANDER XT 700')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/outlander-500-700/high-rez/ORV-ATV-MY23-5-SPEC-Can-Am-OUT-XT-700-EN-HR.pdf'
	} else if (financeData.model.toUpperCase().includes('OUTLANDER 500/700')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/outlander-500-700/high-rez/ORV-ATV-MY23-5-SPEC-Can-Am-OUT-500-700-EN-HR.pdf'
	} else if (financeData.model.toUpperCase().includes('OUTLANDER DPS 500/700')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/outlander-500-700/high-rez/ORV-ATV-MY23-5-SPEC-Can-Am-OUT-DPS-500-700-EN-HR.pdf'
	} else if (financeData.model.toUpperCase().includes('OUTLANDER 500 2WD')) {
		url =
			'https://can-am.brp.com/content/dam/global/en/can-am-off-road/my23/assets/spec-sheets/atv/outlander-500-700/high-rez/ORV-ATV-MY23-5-SPEC-Can-Am-OUT-500-2WD-EN-HR.pdf'
	}
	return (url)
}

