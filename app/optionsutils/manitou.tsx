/* eslint-disable @typescript-eslint/no-unused-vars */
import { OverviewLoader, overviewAction, } from './actions'
import {
	Tabs, TabsContent, TabsList, TabsTrigger, Popover, PopoverContent, PopoverTrigger, Accordion, AccordionContent, AccordionItem, AccordionTrigger, Input, Label, Separator, Button, Card, CardContent,
} from "~/components/ui/index"
import { Form, Link, useFetcher, useLoaderData, } from '@remix-run/react'
import React, { useState } from 'react'

export default function EquipManitou() {
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

	// is missing
	// powderCoatLX

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
		{ name: 'saltwaterPkg', value: '596', placeholder: 'Saltwater Package' },
		{ name: 'propeller', value: '995', placeholder: 'Prop Outboard' },
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

	const cruise = [
		{ name: 'biminiCr', value: '4015', placeholder: 'Bimini' },
		{ name: 'signature', value: '4480', placeholder: 'Signature Package' },
	]
	const explore = [
		{ name: 'signature', value: '5047', placeholder: 'Signature Package' },
		{ name: 'select', value: '6735', placeholder: 'Select Package' },
		{ name: 'tubeColor', value: '7680', placeholder: 'Painted tubes' },
	]
	const lx = [
		{ name: 'signature', value: '3178', placeholder: 'Signature Package' },
		{ name: 'selRFXPkgLX', value: '26684', placeholder: 'Select Package RFX / SRS' },
		{ name: 'selRFXWPkgLX', value: '28160', placeholder: 'Select Package RFXW / SRW' },
		{ name: 'tubeColor', value: '7680', placeholder: 'Painted tubes' },
		{ name: 'blkPkg', value: '3666', placeholder: 'Blackout Package' },
		{ name: 'colMatchedFiberLX', value: '12530', placeholder: 'Color Matched Fiberglass' },
	]
	const lxBimini = [
		{ name: 'powderCoatingLX', value: '2305', placeholder: 'Bimini Top, Double w/ Powder Coating' },
		{ name: 'blackAnoLX', value: '2342', placeholder: '	Bimini Top, Power Arm w/ Black Ano' },
	]
	const lxSpeaker = [
		{ name: 'JLTowerLX', value: '3338', placeholder: 'JL Tower Speakers (Select package required)' },
		{ name: 'premiumJLLX', value: '3585', placeholder: 'Premium JL MM105 Stereo' },
	]
	const xt = [
		{ name: 'signature', value: '17658', placeholder: 'Signature Package' },
		{ name: 'blkPkg', value: '516', placeholder: 'Blackout Package' },
		{ name: 'premAudioPkg', value: '1505', placeholder: 'Premium Audio Package' },
		{ name: 'XTPremiumcolor', value: '1920', placeholder: 'XT Premium color' },
	]
	const xtSpeaker = [
		{ name: 'JLPremiumxt', value: '1505', placeholder: 'JL Premium Audio pkg(base)' },
		{ name: 'JlPremiumAudio', value: '3380', placeholder: 'Jl premium audio pkg (signature pkg)' },
	]
	return (
		<>


			<div className="sm container mx-auto mt-5 lg:w-[95%] w-[95%]">

				{finance.model.includes('Cruise') ? (
					<>
						<div className="mt-3">
							<h3 className="text-2xl font-extralight">
								Model Specific Options
							</h3>
						</div>
						<Separator />

						<div className="grid  grid-cols-1">
							{cruise.map((result, index) => (
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

						<div className="mt-3">
							<h3 className="text-2xl font-extralight">Color</h3>
						</div>
						<Separator />

						<div className="grid grid-cols-1 gap-y-4">
							<label
								htmlFor="bimini"
								className="mt-3  text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Interior Color
							</label>
							<select
								id="intColor"
								name="intColor"
								onChange={handleInputChange}
								data-te-select-init
								className=" mt-2 border-border  text-foreground rounded-lg h-9 w-full items-center justify-between
                                        border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
								<option ></option>
								<option value="stone red - interior">
									stone red - interior
								</option>
								<option value="carbon - interior">
									carbon - interior
								</option>
								<option value="pearl ice - interior">
									pearl ice - interior
								</option>
								<option value="carbon blue - interior">
									carbon blue - interior
								</option>
								<option value="carbon red - interior">
									carbon red - interior
								</option>
							</select>

							<label
								htmlFor="bimini"
								className="mt-3  text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Wall Color
							</label>
							<select
								id="wallCol"
								name="wallCol"
								onChange={handleInputChange}
								data-te-select-init
								className="mt-2 border-border  text-foreground rounded-lg h-9 w-full items-center justify-between border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50">
								<option >
									Select Wall Color
								</option>
								<option value="great white">great white</option>
								<option value="shark grey">shark grey</option>
							</select>
						</div>
					</>
				) : null}

				{finance.model.includes('Explore') ? (
					<>
						<div className="mt-3">
							<h3 className="text-2xl font-extralight">
								Model Specific Options
							</h3>
						</div>
						<Separator />

						<div className="grid  grid-cols-1">
							{explore.map((result, index) => (
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

						<div className="mt-3">
							<h3 className="text-2xl font-extralight">Color</h3>
						</div>
						<Separator />

						<div className="grid grid-cols-1 gap-y-4">
							<label
								htmlFor="bimini"
								className="mt-3  text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Interior Color
							</label>
							<select
								id="intColor"
								name="intColor"
								onChange={handleInputChange}
								data-te-select-init
								className="mt-2 border-border  text-foreground rounded-lg h-9 w-full items-center justify-between border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50">
								<option></option>
								<option value="stone red - interior">
									stone red - interior
								</option>
								<option value="carbon - interior">
									carbon - interior
								</option>
								<option value="pearl ice - interior">
									pearl ice - interior
								</option>
								<option value="carbon blue - interior">
									carbon blue - interior
								</option>
								<option value="carbon red - interior">
									carbon red - interior
								</option>
							</select>

							<label
								htmlFor="bimini"
								className="mt-3  text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Wall Color
							</label>
							<select
								id="wallCol"
								name="wallCol"
								onChange={handleInputChange}
								data-te-select-init
								className="mt-2 border-border  text-foreground rounded-lg h-9 w-full items-center justify-between border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50">
								<option ></option>
								<option value="great white - Wall Color">
									great white
								</option>
								<option value="shark grey - Wall Color">
									shark grey
								</option>
							</select>
						</div>
					</>
				) : null}

				{finance.model.includes('LX') ? (
					<>
						<div className="mt-3">
							<h3 className="text-2xl font-extralight">
								Model Specific Options
							</h3>
						</div>
						<Separator />
						<div className="grid  grid-cols-1">
							{lx.map((result, index) => (
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

						<div className="mt-3">
							<h3 className="text-2xl font-extralight">Bimini</h3>
						</div>
						<Separator />

						<div className="grid  grid-cols-1">
							{lxBimini.map((result, index) => (
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

						<div className="mt-3">
							<h3 className="text-2xl font-extralight">
								Speaker Upgrade
							</h3>
						</div>
						<Separator />

						<div className="grid  grid-cols-1">
							{lxSpeaker.map((result, index) => (
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

						<div className="mt-3">
							<h3 className="text-2xl font-extralight">Color</h3>
						</div>
						<Separator />

						<div className="grid grid-cols-1 ">
							<label
								htmlFor="bimini"
								className="mt-3  text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Wall Color
							</label>
							<select
								id="wallCol"
								name="wallCol"
								onChange={handleInputChange}
								data-te-select-init
								className="mt-2 border-border  text-foreground rounded-lg h-9 w-full items-center justify-between border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50">
								<option></option>
								<option value="charcoal - wall">charcoal - wall</option>
								<option value="white pearl - wall">
									white pearl - wall
								</option>
								<option value="black - wall">black - wall</option>
								<option value="blue - wall">blue - wall</option>
								<option value="silver - wall">silver - wall</option>
								<option value="dream white - wall">
									dream white - wall
								</option>
							</select>

							<label
								htmlFor="bimini"
								className="mt-3  text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Wall Graphic
							</label>
							<select
								id="wallGraphic"
								name="wallGraphic"
								onChange={handleInputChange}
								data-te-select-init
								className="mt-2 border-border  text-foreground rounded-lg h-9 w-full items-center justify-between border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50">
								<option></option>

								<option value="carbon - wall graphic">
									carbon - wall graphic
								</option>
								<option value="silver - wall graphic">
									silver - wall graphic
								</option>
								<option value="scandi blue - wall graphic">
									scandi blue - wall graphic
								</option>
								<option value="neo mint - wall graphic">
									neo mint - wall graphic
								</option>
							</select>

							<label
								htmlFor="bimini"
								className="mt-3  text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Wall Graphic Accent
							</label>
							<select
								id="wallGraphicAccentLX"
								name="wallGraphicAccentLX"
								onChange={handleInputChange}
								data-te-select-init
								className="mt-2 border-border  text-foreground rounded-lg h-9 w-full items-center justify-between border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50">
								<option></option>
								<option value="carmal - wall graphic accent">
									carmal - wall graphic accent
								</option>
								<option value="black - wall graphic accent">
									black - wall graphic accent
								</option>
								<option value="blue - wall graphic accent">
									blue - wall graphic accent
								</option>
								<option value="tan - wall graphic accent">
									tan - wall graphic accent
								</option>
								<option value="silver - wall graphic accent">
									silver - wall graphic accent
								</option>
							</select>

							<label
								htmlFor="bimini"
								className="mt-3  text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Fibre Glass Pods
							</label>
							<select
								id="fibreGlassPodsLX"
								name="fibreGlassPodsLX"
								onChange={handleInputChange}
								data-te-select-init
								className="mt-2 border-border  text-foreground rounded-lg h-9 w-full items-center justify-between border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50">
								<option></option>
								<option value="gray - fibre glass pods">
									gray - fibre glass pods
								</option>
								<option value="white pearl - fibre glass pods">
									white pearl - fibre glass pods
								</option>
								<option value="black - fibre glass pods">
									black - fibre glass pods
								</option>
								<option value="dream white - fibre glass pods">
									dream white - fibre glass pods
								</option>
							</select>

							<label
								htmlFor="bimini"
								className="mt-3  text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Tube Color
							</label>
							<select
								id="tubeColor"
								name="tubeColor"
								onChange={handleInputChange}
								data-te-select-init
								className="mt-2 border-border  text-foreground rounded-lg h-9 w-full items-center justify-between border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50">
								<option></option>

								<option value="antique silver - powder coat">
									antique silver - powder coat
								</option>
								<option value="black - powder coat">
									black - powder coat
								</option>
							</select>

							<label
								htmlFor="bimini"
								className="mt-3  text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Furniture Color
							</label>
							<select
								id="furnitureColor"
								name="furnitureColor"
								onChange={handleInputChange}
								data-te-select-init
								className="mt-2 border-border  text-foreground rounded-lg h-9 w-full items-center justify-between border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50">
								<option></option>

								<option value="tan/black - furniture">
									tan/black - furniture
								</option>
								<option value="gray/black - furniture">
									gray/black - furniture
								</option>
								<option value="beige/black - furniture">
									beige/black - furniture
								</option>
								<option value="white/carbon - furniture">
									white/carbon - furniture
								</option>
								<option value="white/black - furniture">
									white/black - furniture
								</option>
							</select>

							<label
								htmlFor="bimini"
								className="mt-3  text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Flooring Color
							</label>
							<select
								id="flooringLX"
								name="flooringLX"
								onChange={handleInputChange}
								data-te-select-init
								className="mt-2 border-border  text-foreground rounded-lg h-9 w-full items-center justify-between border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50">
								<option></option>

								<option value="Standard Flooring">
									Standard Flooring
								</option>
								<option value="Spradling Teak - Grey">
									Spradling Teak - Grey
								</option>
								<option value="Spradling Teak - Brown">
									Spradling Teak - Brown
								</option>
								<option value="Luna - Silver">Luna - Silver</option>
							</select>
						</div>
					</>
				) : null}

				{finance.model.includes('XT') ? (
					<>
						<div className="mt-3">
							<h3 className="text-2xl font-extralight">
								Model Specific Options
							</h3>
						</div>
						<Separator />

						<div className="grid  grid-cols-1">
							{xt.map((result, index) => (
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

						<div className="mt-3">
							<h3 className="text-2xl font-extralight">
								Speaker Upgrade
							</h3>
						</div>
						<Separator />
						<div className="grid  grid-cols-1">
							{xtSpeaker.map((result, index) => (
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


						<div className="mt-3">
							<h3 className="text-2xl font-extralight">Color</h3>
						</div>
						<Separator />

						<div className="grid grid-cols-1 ">
							<label
								htmlFor="bimini"
								className="mt-3  text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Fibreglass Front & Pods
							</label>
							<select
								id="fibreglassFrontXT"
								name="fibreglassFrontXT"
								onChange={handleInputChange}
								data-te-select-init
								className="mt-2 border-border  text-foreground rounded-lg h-9 w-full items-center justify-between border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50">
								<option>
									fibreglass front & pods
								</option>
								<option value="black - fibreglass front & pods ">
									black - fibreglass front & pods "
								</option>
								<option value="blue - fibreglass front & pods ">
									blue - fibreglass front & pods "
								</option>
								<option value="destroyer gray - fibreglass front & pods">
									destroyer gray - fibreglass front & pods
								</option>
								<option value="red silver - fibreglass front & pods">
									red silver - fibreglass front & pods
								</option>
								<option value="white - fibreglass front & pods">
									white - fibreglass front & pods"
								</option>
								<option value="highland green - fibreglass front & pods">
									highland green - fibreglass front & pods
								</option>
								<option value="lemon zest - fibreglass front & pods">
									lemon zest - fibreglass front & pods
								</option>
								<option value="chromaflair pearlescent - fibreglass front & pods">
									chromaflair pearlescent - fibreglass front & pods
								</option>
								<option value="purple potion - fibreglass front & pods">
									purple potion - fibreglass front & pods
								</option>
							</select>

							<label
								htmlFor="bimini"
								className="mt-3  text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Wall Graphic
							</label>
							<select
								id="wallGraphic"
								name="wallGraphic"
								onChange={handleInputChange}
								data-te-select-init
								className="mt-2 border-border  text-foreground rounded-lg h-9 w-full items-center justify-between border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50">
								<option>wall graphic</option>
								<option value="none - wall graphic">
									none - wall graphic
								</option>
								<option value="slate - wall graphic">
									slate - wall graphic
								</option>
								<option value="black carbon - wall graphic">
									black carbon - wall graphic
								</option>
								<option value="bright blue - wall graphic">
									bright blue - wall graphic
								</option>
								<option value="red - wall graphic">
									red - wall graphic
								</option>
							</select>

							<label
								htmlFor="bimini"
								className="mt-3  text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Tube Color
							</label>
							<select
								id="tubeColor"
								name="tubeColor"
								onChange={handleInputChange}
								data-te-select-init
								className="mt-2 border-border  text-foreground rounded-lg h-9 w-full items-center justify-between border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50">
								<option>		Tube Color</option>
								<option value="antique silver - powder coat">
									antique silver - powder coat
								</option>
								<option value="black - powder coat">
									black - powder coat
								</option>
							</select>

							<label
								htmlFor="bimini"
								className="mt-3  text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Furniture Color
							</label>
							<select
								id="furnitureColor"
								name="furnitureColor"
								onChange={handleInputChange}
								data-te-select-init
								className="mt-2 border-border  text-foreground rounded-lg h-9 w-full items-center justify-between border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50">
								<option>		Furniture Color</option>

								<option value="beige/black">
									beige/black - Furniture Color
								</option>
								<option value="biege/carmel">
									biege/carmel - Furniture Color
								</option>
								<option value="black/black">
									black/black - Furniture Color
								</option>
								<option value="black/blue">
									black/blue - Furniture Color
								</option>
								<option value="black/carmel">
									black/carmel - Furniture Color
								</option>
								<option value="black/red">
									black/red - Furniture Color
								</option>
								<option value="gray/black">
									gray/black - Furniture Color
								</option>
								<option value="gray/blue">
									gray/blue - Furniture Color
								</option>
								<option value="gray/red">
									gray/red - Furniture Color
								</option>
								<option value="tan/black">
									tan/black - Furniture Color
								</option>
								<option value="white/black">
									white/black - Furniture Color
								</option>
								<option value="white/blue">
									white/blue - Furniture Color
								</option>
								<option value="white/carbon">
									white/carbon - Furniture Color
								</option>
								<option value="white/gray">
									white/gray - Furniture Color
								</option>
								<option value="white/red">
									white/red - Furniture Color
								</option>
							</select>
						</div>
					</>
				) : null}



				<Accordion type="single" collapsible className=" w-full">
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
				{!finance.model.includes('Cruise') && (
					<>
						<div>
							<h3 className="mt-3 text-2xl font-extralight">Motor Options</h3>

						</div>
						<Separator />


						<div className="grid grid-cols-1 ">
							<label
								htmlFor="bimini"
								className="mt-3  text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								DTS Motor
							</label>
							<select
								id="dts"
								name="dts"
								onChange={handleInputChange}
								data-te-select-init
								className="mt-2 border-border  text-foreground rounded-lg h-9 w-full items-center justify-between border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50">
								<option >DTS</option>
								<option value="33105">250xl</option>
								<option value="33789">250cxl</option>
								<option value="35011">250xl white</option>
								<option value="35680">250cxl white</option>
								<option value="33585">250xl pro xs black</option>
								<option value="36058">300xl</option>
								<option value="36727">300cxl</option>
								<option value="37949">300xl white</option>
								<option value="38633">300cxl white</option>
								<option value="38109">300xl pro xs black</option>
								<option value="38313">300cxl pro xs black</option>
							</select>

							<label
								htmlFor="bimini"
								className="mt-3  text-sm font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Verado Motor
							</label>
							<select
								id="verado"
								name="verado"
								onChange={handleInputChange}
								data-te-select-init
								className="mt-2 border-border  text-foreground rounded-lg h-9 w-full items-center justify-between border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50">
								<option>Verado</option>
								<option value="35476">250xl</option>
								<option value="36145">250cxl</option>
								<option value="37367">250xl white</option>
								<option value="38036">250cxl white</option>
								<option value="38313">300xl</option>
								<option value="38996">300cxl</option>
								<option value="40204">300xl white</option>
								<option value="40887">300cxl white</option>
								<option value="41891">350xl</option>
								<option value="42560">350cxl</option>
								<option value="43782">350xl white</option>
								<option value="44465">350cxl white</option>
								<option value="47185">400xl</option>
								<option value="47869">400cxl</option>
								<option value="49076">400xl white</option>
								<option value="49760">400cxl white</option>
							</select>
						</div>
					</>
				)}
			</div>


		</>
	)
}
