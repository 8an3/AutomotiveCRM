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
	return (
		<>


			<div className="sm container mx-auto mt-3">
				<div>
					<h1 className="text-2xl font-extralight">Optional Equipment</h1>
				</div>
				<Separator />

				{finance.model.includes('Cruise') ? (
					<>
						<div className="mt-3">
							<h3 className="text-2xl font-extralight">
								Model Specific Options
							</h3>
						</div>
						<Separator />

						<div className="grid  grid-cols-2">



							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									name="biminiCr"
									value="4015"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Bimini
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight  ">
								${formData.biminiCr}
							</p>

							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="signature"
									name="signature"
									value="4480"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Signature Package
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
								${formData.signature}
							</p>
						</div>

						<div className="mt-3">
							<h3 className="text-2xl font-extralight">Color</h3>
						</div>
						<Separator />

						<div className="grid grid-cols-1 ">
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
								className=" mt-2 border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring h-9 w-full items-center justify-between
                                        border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
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
								className="mt-2 border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring h-9 w-full items-center justify-between
                                        border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
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

						<div className="grid  grid-cols-2">
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="signature"
									name="signature"
									value="5047"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Signature Package
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight  ">
								${formData.signature}
							</p>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="select"
									name="select"
									value="6735"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Select Package
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
								${formData.select}
							</p>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="tubeColor"
									name="tubeColor"
									value="7680"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Painted tubes
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
								${formData.tubeColor}
							</p>
						</div>

						<div className="mt-3">
							<h3 className="text-2xl font-extralight">Color</h3>
						</div>
						<Separator />

						<div className="grid grid-cols-1 ">
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
								className="mt-2 border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring h-9 w-full items-center justify-between
                                        border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
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
								className="mt-2 border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring h-9 w-full items-center justify-between
                                        border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
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
						<div className="grid  grid-cols-2 mt-2">
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="signature"
									name="signature"
									value="3178"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Signature Package
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight  ">
								${formData.signature}
							</p>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="selRFXPkgLX"
									name="selRFXPkgLX"
									value="26684"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Select Package RFX / SRS
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
								${formData.selRFXPkgLX}
							</p>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="selRFXWPkgLX"
									name="selRFXWPkgLX"
									value="28160"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Select Package RFXW / SRW
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
								${formData.selRFXWPkgLX}
							</p>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="tubeColor"
									name="tubeColor"
									value="7680"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Painted tubes
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
								${formData.tubeColor}
							</p>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="blkPkg"
									name="blkPkg"
									value="3666"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Blackout Package
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
								${formData.blkPkg}
							</p>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="colMatchedFiberLX"
									name="colMatchedFiberLX"
									value="12530"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Color Matched Fiberglass
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
								${formData.colMatchedFiberLX}
							</p>
						</div>

						<div className="mt-3">
							<h3 className="text-2xl font-extralight">Bimini</h3>
						</div>
						<Separator />

						<div className="grid  grid-cols-2 mtg-2">
							<div className="flex items-center space-x-2 mt-2">
								<input
									type="checkbox"
									id="powderCoatingLX"
									name="powderCoatingLX"
									value="2305"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Bimini Top, Double w/ Powder Coating
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight  ">
								${formData.powderCoatingLX}
							</p>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="blackAnoLX"
									name="blackAnoLX"
									value="2342"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Bimini Top, Power Arm w/ Black Ano
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
								${formData.blackAnoLX}
							</p>
						</div>

						<div className="mt-3">
							<h3 className="text-2xl font-extralight">
								Speaker Upgrade
							</h3>
						</div>
						<Separator />

						<div className="grid  grid-cols-2 mt-2">
							<div className="flex items-center space-x-2 mt-2">
								<input
									type="checkbox"
									id="JLTowerLX"
									name="JLTowerLX"
									value="3338"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									JL Tower Speakers (Select package required)
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
								${formData.JLTowerLX}
							</p>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="premiumJLLX"
									name="premiumJLLX"
									value="3585"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Premium JL MM105 Stereo
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
								${formData.premiumJLLX}
							</p>
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
								className="mt-2 border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring h-9 w-full items-center justify-between
                                        border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
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
								className="mt-2 border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring h-9 w-full items-center justify-between
                                        border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
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
								className="mt-2 border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring h-9 w-full items-center justify-between
                                        border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
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
								className="mt-2 border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring h-9 w-full items-center justify-between
                                        border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
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
								className="mt-2 border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring h-9 w-full items-center justify-between
                                        border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
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
								className="mt-2 border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring h-9 w-full items-center justify-between
                                        border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
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
								className="mt-2 border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring h-9 w-full items-center justify-between
                                        border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
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

						<div className="grid  grid-cols-2 mt-2">
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="signature"
									name="signature"
									value="17658"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Signature Package
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight  ">
								${formData.signature}
							</p>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="blkPkg"
									name="blkPkg"
									value="516"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Blackout Package
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
								${formData.blkPkg}
							</p>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="premAudioPkg"
									name="premAudioPkg"
									value="1505"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Premium Audio Package
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
								${formData.premAudioPkg}
							</p>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="XTPremiumcolor"
									name="XTPremiumcolor"
									value="1920"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									XT Premium color
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
								${formData.XTPremiumcolor}
							</p>
						</div>

						<div className="mt-3">
							<h3 className="text-2xl font-extralight">
								Speaker Upgrade
							</h3>
						</div>
						<Separator />

						<div className="grid  grid-cols-2 mt-2">
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="JLPremiumxt"
									name="JLPremiumxt"
									value="1505"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									JL Premium Audio pkg(base)
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight  ">
								${formData.JLPremiumxt}
							</p>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="JlPremiumAudio"
									name="JlPremiumAudio"
									value="3380"
									className="form-checkbox"
									onChange={handleInputChange}
								/>
								<label
									htmlFor="bimini"
									className="text-sm  font-extralight leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Jl premium audio pkg (signature pkg)
								</label>
							</div>
							<p className="mb-0 flex basis-2/4 items-end justify-end pb-0 font-extralight">
								${formData.JlPremiumAudio}
							</p>
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
								className="mt-2 border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring h-9 w-full items-center justify-between
                                        border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
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
								className="mt-2 border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring h-9 w-full items-center justify-between
                                        border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
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
								className="mt-2 border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring h-9 w-full items-center justify-between
                                        border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
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
								className="mt-2 border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring h-9 w-full items-center justify-between
                                        border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
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

				<div>
					<h3 className="mt-3 text-2xl font-extralight">
						Optional Equipment
					</h3>
				</div>
				<Separator />

				<Accordion type="single" collapsible className=" w-full">
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
				<Separator />

				<Accordion type="single" collapsible className=" w-full">
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
								className="mt-2 border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring h-9 w-full items-center justify-between
                                        border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
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
								className="mt-2 border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring h-9 w-full items-center justify-between
                                        border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50">
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
