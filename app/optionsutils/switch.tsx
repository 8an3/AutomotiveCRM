/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Tabs, TabsContent, TabsList, TabsTrigger, Popover, PopoverContent, PopoverTrigger, Accordion, AccordionContent, AccordionItem, AccordionTrigger, Input, Label, Separator, Button, Card, CardContent,
} from "~/components/ui/index"
import { useState } from 'react'
import { Form, Link, useFetcher, useLoaderData, useParams, } from '@remix-run/react'


export default function EquipSwitch() {
	const { finance } = useLoaderData()
	const [formData, setformData] = useState({
		biminiCr: parseInt(finance.biminiCr) || '',
		signature: parseInt(finance.signature) || '',
		select: parseInt(finance.select) || '',
		tubeColor: parseInt(finance.tubeColor) || '',
		selRFXPkgLX: parseInt(finance.selRFXPkgLX) || '',
		selRFXWPkgLX: parseInt(finance.selRFXWPkgLX) || '',
		blkPkg: parseInt(finance.blkPkg) || '',
		colMatchedFiberLX: parseInt(finance.colMatchedFiberLX) || '',
		powderCoatingLX: parseInt(finance.powderCoatingLX) || '',
		blackAnoLX: parseInt(finance.blackAnoLX) || '',
		JLTowerLX: parseInt(finance.JLTowerLX) || '',
		premiumJLLX: parseInt(finance.premiumJLLX) || '',
		premAudioPkg: parseInt(finance.premAudioPkg) || '',
		fibreglassFrontXT: parseInt(finance.fibreglassFrontXT) || '',
		JlPremiumAudio: parseInt(finance.JlPremiumAudio) || '',
		JLPremiumxt: parseInt(finance.JLPremiumxt) || '',
		dts: parseInt(finance.dts) || '',
		verado: parseInt(finance.verado) || '',
		battery: parseInt(finance.battery) || '',
		gps: parseInt(finance.gps) || '',
		saltwaterPkg: parseInt(finance.saltwaterPkg) || '',
		propeller: parseInt(finance.propeller) || '',
		baseInst: parseInt(finance.baseInst) || '',
		cupHolder: parseInt(finance.cupHolder) || '',
		multiHolder: parseInt(finance.multiHolder) || '',
		cooler13: parseInt(finance.cooler13) || '',
		coolerExtension: parseInt(finance.coolerExtension) || '',
		coolerBag14: parseInt(finance.coolerBag14) || '',
		singleHolder: parseInt(finance.singleHolder) || '',
		stemwareHolder: parseInt(finance.stemwareHolder) || '',
		cargoBox10: parseInt(finance.cargoBox10) || '',
		cargoBox20: parseInt(finance.cargoBox20) || '',
		cargoBox30: parseInt(finance.cargoBox30) || '',
		rodHolder: parseInt(finance.rodHolder) || '',
		batteryCharger: parseInt(finance.batteryCharger) || '',
		bowFillerBench: parseInt(finance.bowFillerBench) || '',
		portAquaLounger: parseInt(finance.portAquaLounger) || '',
		skiTowMirror: parseInt(finance.skiTowMirror) || '',
		XTPremiumcolor: parseInt(finance.XTPremiumcolor) || '',
	})

	const handleInputChange = (e) => {
		const { name, value, checked, type } = e.target
		let newValue = value
		if (type === 'checkbox') {
			newValue = checked ? value : 0
		}
		setformData((prevData) => ({ ...prevData, [name]: newValue }))
	}
	const optionalEquip = [
		{ name: 'battery', value: '700', placeholder: 'Marine Battery' },
		{ name: 'gps', value: '262', placeholder: 'Garmin LakeVu Canada Mapping Card' },
		{ name: 'saltwaterPkg', value: '596', placeholder: '	Saltwater Package' },
		{ name: 'propeller', value: '995', placeholder: '		Prop Outboard' },
	]
	const accessories = [
		{ name: 'baseInst', value: '45', placeholder: 'LinQ Base Installation Kit' },
		{ name: 'cupHolder', value: '44', placeholder: 'LinQ Lite Cup Holder' },
		{ name: 'multiHolder', value: '41', placeholder: 'LinQ Lite Multi Holder' },
		{ name: 'cooler13', value: '940', placeholder: 'LinQ 13.5 Gal Cooler' },
		{ name: 'coolerExtension', value: '370', placeholder: 'LinQ 13.5 Gal Cooler Extension' },
		{ name: 'coolerBag14', value: '215', placeholder: 'LinQ 14 L Cooler Bag' },
		{ name: 'singleHolder', value: '260', placeholder: 'LinQ Lite Single Holder' },
		{ name: 'stemwareHolder', value: '56', placeholder: 'LinQ Lite Stemware Holder' },
		{ name: 'cargoBox10', value: '188', placeholder: 'LinQ Modular Cargo Box 10 L' },
		{ name: 'cargoBox20', value: '210', placeholder: 'LinQ Modular Cargo Box 20 L' },
		{ name: 'cargoBox30', value: '230', placeholder: 'LinQ Modular Cargo Box 30 L' },
		{ name: 'rodHolder', value: '39', placeholder: 'LinQ Rod Holder' },
		{ name: 'batteryCharger', value: '545', placeholder: 'Battery Charger' },
		{ name: 'bowFillerBench', value: '1011', placeholder: 'Bow Filler Bench' },
		{ name: 'portAquaLounger', value: '342', placeholder: 'Port Aqua Lounger' },
		{ name: 'skiTowMirror', value: '516', placeholder: 'Ski Tow Mirror' },
	]
	return (
		<>
			<div className="sm container mx-auto mt-3">
				<Accordion type="single" collapsible className="mt-3 w-full">
					<AccordionItem value="item-1">
						<AccordionTrigger className="text-2xl font-extralight">	Optional Equipment</AccordionTrigger>
						<AccordionContent>
							<div className="grid  grid-cols-1">
								{optionalEquip.map((result, index) => (
									<div key={index} className='flex justify-between items-center'>
										<div className="inline-flex items-center">
											<label className="relative flex items-center rounded-full cursor-pointer" htmlFor={result.name}>
												<input
													type="checkbox"
													name={result.name}
													value={result.value}
													className="form-checkbox peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-primary transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-secondary checked:bg-primary checked:before:bg-secondary hover:before:opacity-10"
													onChange={handleInputChange}
												/>
												<span
													className="absolute text-foreground transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
														stroke="currentColor" strokeWidth="1">
														<path fillRule="evenodd"
															d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
															clipRule="evenodd"></path>
													</svg>
												</span>
											</label>
											<label
												htmlFor={result.name}
												className=" ml-3 font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xl">
												{result.placeholder}
											</label>
										</div>
										<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight text-xl">
											${formData[result.name]}
										</p>
									</div>
								))}
							</div>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="item-2">
						<AccordionTrigger className="text-2xl font-extralight">Accessories</AccordionTrigger>
						<AccordionContent>
							<div className="grid  grid-cols-1">
								{accessories.map((result, index) => (
									<div key={index} className='flex justify-between items-center'>
										<div className="inline-flex items-center">
											<label className="relative flex items-center rounded-full cursor-pointer" htmlFor={result.name}>
												<input
													type="checkbox"
													name={result.name}
													value={result.value}
													className="form-checkbox peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-primary transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-secondary checked:bg-primary checked:before:bg-secondary hover:before:opacity-10"
													onChange={handleInputChange}
												/>
												<span
													className="absolute text-foreground transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
														stroke="currentColor" strokeWidth="1">
														<path fillRule="evenodd"
															d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
															clipRule="evenodd"></path>
													</svg>
												</span>
											</label>
											<label
												htmlFor={result.name}
												className="ml-3 font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xl">
												{result.placeholder}
											</label>
										</div>
										<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight text-xl">
											${formData[result.name]}
										</p>
									</div>
								))}
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</>
	)
}
