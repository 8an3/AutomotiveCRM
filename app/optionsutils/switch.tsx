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
	return (
		<>


						<div className="sm container mx-auto mt-3">


							<div>
								<h3 className="mt-3 text-2xl font-extralight">
									Optional Equipment
								</h3>
							</div>
							<hr className="solid" />

							<Accordion type="single" collapsible className="mt-3 w-full">
								<AccordionItem value="item-1">
									<AccordionTrigger>Show Optional Equipment</AccordionTrigger>
									<AccordionContent>
										<div className="grid  grid-cols-2">
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="battery"
													name="battery"
													value="700"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="battery"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													Marine Battery
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight  ">
												${formData.battery}
											</p>
											<div className="flex space-x-2 mt-2 items-center ">
												<input
													type="checkbox"
													id="gps"
													name="gps"
													value="262"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="gps"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													Garmin LakeVu Canada Mapping Card
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
												${formData.gps}
											</p>

											<div className="flex items-center space-x-2 mt-2">
												<input
													type="checkbox"
													id="saltwaterPkg"
													name="saltwaterPkg"
													value="596"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="gps"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													Saltwater Package
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
												${formData.saltwaterPkg}
											</p>
											<div className="flex items-center space-x-2 mt-2">
												<input
													type="checkbox"
													id="propeller"
													name="propeller"
													value="995"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="propeller"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													Prop Outboard
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
												${formData.propeller}
											</p>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>

							<div>
								<h3 className="mt-3 text-2xl font-extralight">Accessories</h3>
							</div>
							<hr className="solid" />

							<Accordion type="single" collapsible className="mt-3 w-full">
								<AccordionItem value="item-1">
									<AccordionTrigger>Show Accessories</AccordionTrigger>
									<AccordionContent>
										<div className="grid  grid-cols-2">
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="baseInst"
													name="baseInst"
													value="45"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="battery"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													LinQ Base Installation Kit
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight  ">
												${formData.baseInst}
											</p>
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="cupHolder"
													name="cupHolder"
													value="44"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="gps"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													LinQ Lite Cup Holder
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
												${formData.cupHolder}
											</p>
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="multiHolder"
													name="multiHolder"
													value="41"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="gps"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													LinQ Lite Multi Holder
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
												${formData.multiHolder}
											</p>
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="cooler13"
													name="cooler13"
													value="940"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="propeller"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													LinQ 13.5 Gal Cooler
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
												${formData.cooler13}
											</p>
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="coolerExtension"
													name="coolerExtension"
													value="370"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="battery"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													LinQ 13.5 Gal Cooler Extension
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight  ">
												${formData.coolerExtension}
											</p>
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="coolerBag14"
													name="coolerBag14"
													value="215"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="gps"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													LinQ 14 L Cooler Bag
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
												${formData.coolerBag14}
											</p>
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="singleHolder"
													name="singleHolder"
													value="260"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="gps"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													LinQ Lite Single Holder
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
												${formData.singleHolder}
											</p>
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="stemwareHolder"
													name="stemwareHolder"
													value="56"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="propeller"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													LinQ Lite Stemware Holder
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
												${formData.stemwareHolder}
											</p>
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="cargoBox10"
													name="cargoBox10"
													value="188"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="battery"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													LinQ Modular Cargo Box 10 L
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight  ">
												${formData.cargoBox10}
											</p>
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="cargoBox20"
													name="cargoBox20"
													value="210"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="gps"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													LinQ Modular Cargo Box 20 L
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
												${formData.cargoBox20}
											</p>
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="cargoBox30"
													name="cargoBox30"
													value="230"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="gps"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													LinQ Modular Cargo Box 30 L
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
												${formData.cargoBox30}
											</p>
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="rodHolder"
													name="rodHolder"
													value="39"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="propeller"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													LinQ Rod Holder
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
												${formData.rodHolder}
											</p>
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="batteryCharger"
													name="batteryCharger"
													value="545"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="battery"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													Battery Charger
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight  ">
												${formData.batteryCharger}
											</p>
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="bowFillerBench"
													name="bowFillerBench"
													value="1011"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="gps"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													Bow Filler Bench
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
												${formData.bowFillerBench}
											</p>
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="portAquaLounger"
													name="portAquaLounger"
													value="342"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="gps"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													Port Aqua Lounger
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
												${formData.portAquaLounger}
											</p>
											<div className="flex items-center space-x-2">
												<input
													type="checkbox"
													id="skiTowMirror"
													name="skiTowMirror"
													value="516"
													className="form-checkbox"
													onChange={handleInputChange}
												/>
												<label
													htmlFor="propeller"
													className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													Ski Tow Mirror
												</label>
											</div>
											<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
												${formData.skiTowMirror}
											</p>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>


						</div>
			

		</>
	)
}
