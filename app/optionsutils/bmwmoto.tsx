/* eslint-disable tailwindcss/classnames-order */
import {
    Tabs, TabsContent, TabsList, TabsTrigger, Popover, PopoverContent, PopoverTrigger, Accordion, AccordionContent, AccordionItem, AccordionTrigger, Input, Label, Separator, Button, Card, CardContent,
} from "~/components/ui/index"
import { Form, Link, useFetcher, useLoaderData, } from '@remix-run/react'
import { useState } from 'react'

export function EquipBMW() {
    const { bmwMoto, finance } = useLoaderData();

    const [bmwData, setBmwData] = useState({
        comfortSeat: parseInt(bmwMoto.comfortSeat) || 0,
        designW: parseInt(bmwMoto.designW) || 0,
        loweringKit: parseInt(bmwMoto.loweringKit) || 0,
        forgedWheels: parseInt(bmwMoto.forgedWheels) || 0,
        carbonWheels: parseInt(bmwMoto.carbonWheels) || 0,
        centerStand: parseInt(bmwMoto.centerStand) || 0,
        billetPack1: parseInt(bmwMoto.billetPack1) || 0,
        billetPack2: parseInt(bmwMoto.billetPack2) || 0,
        heatedSeat: parseInt(bmwMoto.heatedSeat) || 0,
        lugRack: parseInt(bmwMoto.lugRack) || 0,
        lugRackBrackets: parseInt(bmwMoto.lugRackBrackets) || 0,
        chargeSocket: parseInt(bmwMoto.chargeSocket) || 0,
        auxLights: parseInt(bmwMoto.auxLights) || 0,
        mLightBat: parseInt(bmwMoto.mLightBat) || 0,
        carbonPkg: parseInt(bmwMoto.carbonPkg) || 0,
        enduroPkg: parseInt(bmwMoto.enduroPkg) || 0,
        sportShield: parseInt(bmwMoto.sportShield) || 0,
        sportWheels: parseInt(bmwMoto.sportWheels) || 0,
        sportSeat: parseInt(bmwMoto.sportSeat) || 0,
        brownBench: parseInt(bmwMoto.brownBench) || 0,
        brownSeat: parseInt(bmwMoto.brownSeat) || 0,
        handleRisers: parseInt(bmwMoto.handleRisers) || 0,
        lgihtsPkg: parseInt(bmwMoto.lgihtsPkg) || 0,
        fogLights: parseInt(bmwMoto.fogLights) || 0,
        pilSeatCover: parseInt(bmwMoto.pilSeatCover) || 0,
        lapTimer: parseInt(bmwMoto.lapTimer) || 0,
        floorLight: parseInt(bmwMoto.floorLight) || 0,
        blackBench: parseInt(bmwMoto.blackBench) || 0,
        hillStart: parseInt(bmwMoto.hillStart) || 0,
        floorboards: parseInt(bmwMoto.floorboards) || 0,
        reverse: parseInt(bmwMoto.reverse) || 0,
        forkTubeTrim: parseInt(bmwMoto.forkTubeTrim) || 0,
        spokedW: parseInt(bmwMoto.spokedW) || 0,
        lockGasCap: parseInt(bmwMoto.lockGasCap) || 0,
        aeroWheel: parseInt(bmwMoto.aeroWheel) || 0,
        psgrBench719: parseInt(bmwMoto.psgrBench719) || 0,
        blackS719: parseInt(bmwMoto.blackS719) || 0,
        aero719: parseInt(bmwMoto.aero719) || 0,
        pinstripe: parseInt(bmwMoto.pinstripe) || 0,
        designPkgBL: parseInt(bmwMoto.designPkgBL) || 0,
        benchseatlow: parseInt(bmwMoto.benchseatlow) || 0,
        iconWheel: parseInt(bmwMoto.iconWheel) || 0,
        centreStand: parseInt(bmwMoto.centreStand) || 0,
        tubeHandle: parseInt(bmwMoto.tubeHandle) || 0,
        classicWheels: parseInt(bmwMoto.classicWheels) || 0,
        blackContrastwheel: parseInt(bmwMoto.blackContrastwheel) || 0,
        silverContastWheel: parseInt(bmwMoto.silverContastWheel) || 0,
        silverWheel: parseInt(bmwMoto.silverWheel) || 0,
        activeCruise: parseInt(bmwMoto.activeCruise) || 0,
        blackPowertrain: parseInt(bmwMoto.blackPowertrain) || 0,
        blackWheel: parseInt(bmwMoto.blackWheel) || 0,
        m1000rMPkg: parseInt(bmwMoto.m1000rMPkg) || 0,

        m1000rTitEx: parseInt(bmwMoto.m1000rTitEx) || 0,
        desOption: parseInt(bmwMoto.desOption) || 0,
        m1000rrMPkg: parseInt(bmwMoto.m1000rrMPkg) || 0,
        s1000rrRacePkg: parseInt(bmwMoto.s1000rrRacePkg) || 0,
        s1000rrRacePkg2: parseInt(bmwMoto.s1000rrRacePkg2) || 0,
        f7gsConn: parseInt(bmwMoto.f7gsConn) || 0,
        f8gsDblSeat: parseInt(bmwMoto.f8gsDblSeat) || 0,
        r12rtAudioSystem: parseInt(bmwMoto.r12rtAudioSystem) || 0,
        f9xrHandProtectors: parseInt(bmwMoto.f9xrHandProtectors) || 0,
        r12gsCrossGld: parseInt(bmwMoto.r12gsCrossGld) || 0,
        r12gsSpSusp: parseInt(bmwMoto.r12gsSpSusp) || 0,
        r12gsProtBar: parseInt(bmwMoto.r12gsProtBar) || 0,
        r12gsCrossBlk: parseInt(bmwMoto.r12gsCrossBlk) || 0,
        audioSystem: parseInt(bmwMoto.audioSystem) || 0,
        highShield: parseInt(bmwMoto.highShield) || 0,
        psgrKit: parseInt(bmwMoto.psgrKit) || 0,
        alarm: parseInt(bmwMoto.alarm) || 0,
        color: parseInt(bmwMoto.color) || 0,
        chain: parseInt(bmwMoto.chain) || 0,
        comfortPkg: parseInt(bmwMoto.comfortPkg) || 0,
        touringPkg: parseInt(bmwMoto.touringPkg) || 0,
        activePkg: parseInt(bmwMoto.activePkg) || 0,
        dynamicPkg: parseInt(bmwMoto.dynamicPkg) || 0,
        offTire: parseInt(bmwMoto.offTire) || 0,
        keyless: parseInt(bmwMoto.keyless) || 0,
        headlightPro: parseInt(bmwMoto.headlightPro) || 0,
        shiftAssPro: parseInt(bmwMoto.shiftAssPro) || 0,
        tpc: parseInt(bmwMoto.tpc) || 0,
        cruise: parseInt(bmwMoto.cruise) || 0,
        windshield: parseInt(bmwMoto.windshield) || 0,
        handleBar: parseInt(bmwMoto.handleBar) || 0,
        extraHighSeat: parseInt(bmwMoto.extraHighSeat) || 0,
        alumTank1: parseInt(bmwMoto.alumTank1) || 0,
        alumTank2: parseInt(bmwMoto.alumTank2) || 0,
        classicW: parseInt(bmwMoto.classicW) || 0,
        silencer: parseInt(bmwMoto.silencer) || 0,
        chromedExhaust: parseInt(bmwMoto.chromedExhaust) || 0,
        crossW: parseInt(bmwMoto.crossW) || 0,
        highSeat: parseInt(bmwMoto.highSeat) || 0,
        lowKitLowSeat: parseInt(bmwMoto.lowKitLowSeat) || 0,
        lowSeat: parseInt(bmwMoto.lowSeat) || 0,

        passengerKitLowSeat: parseInt(bmwMoto.passengerKitLowSeat) || 0,
        comfortPsgrSeat: parseInt(bmwMoto.passengerKitLowSeat) || 0,
        aeroPkg719: parseInt(bmwMoto.passengerKitLowSeat) || 0,

    })

    /*
    floorLight
    headlightPro
    hillStart
    floorboards
    reverse
    cruise
    tpc
    spokedW
    forkTubeTrim
    lockGasCap
    silencer
    alarm
    activeCruise

    riderSeatHi
    blackS719
    psgrBench719
    comfortSeat
    blackbench
    benchseatlow
    blackPowertrain

    iconWheel
    blackContrastwheel
    silverContastWheel
    silverWheel
    blackWheel

    designPkgBL
    desOption
    pinstripe
    aero719

    */

    const handleInputChange = (e) => {
        const { name, value, checked, type } = e.target
        let newValue = value
        if (type === 'checkbox') {
            newValue = checked ? value : 0
        }
        setBmwData((prevData) => ({ ...prevData, [name]: newValue }))
    }
    return (
        <>

            <div>
                <h2 className="font-extralight text-center mt-2">{finance.model}</h2>
            </div>
            <div className="sm container mx-auto mt-3">
                {finance.model === 'F 750 GS' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div><Separator />
                        <select name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                            <option >Select Color</option>
                            <option value="1">Light White</option>
                            <option value="285">White / Blue / red</option>
                            <option value="390">Black Storm Metallic</option>
                        </select>

                        <div><h1 className="text-2xl font-extralight mt-3">Standard Equipment</h1></div>
                        <Separator />
                        <div className="flex justify-between flex-wrap  ">
                            <p className="basis-2/4 font-thin">Ride Modes</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">Heated Grips</p>
                            <p className="basis-2/4 font-thin">USB Charging Socket</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">LED lighting</p>
                        </div>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="chain" value='180' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                                    M Endurance Chain
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.chain}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="keyless" value='315' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >Keyless Ride</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.keyless}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="tpc" value='260' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >TPC</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.tpc}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="alarm" value='270' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >Alarm</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.alarm}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="f7gsConn" value='705' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >Connectivity</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.f7gsConn}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="lowKitLowSeat" value='240' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >

                                    Lowering Kit Low Seat
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.lowKitLowSeat}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="lowSeat" value='170' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                                    Extra Low Seat
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">N/C</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="comfortSeat" value='60' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                                    Comfort Seat
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.comfortSeat}</p>


                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">  N/C</p>
                        </div>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="comfortPkg" value='1065' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Comfort Package</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.comfortPkg}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="touringPkg" value='565' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Touring Package</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.touringPkg}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="dynamicPkg" value='565' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Dynamic Package</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.dynamicPkg}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="activePkg" value='375' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Actrive Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">
                                ${bmwData.activePkg}
                            </p>

                        </div>
                    </>
                ) : (null)}
                {finance.model === 'F 850 GS' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div><Separator />
                        <select name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                            <option>Select Color</option>
                            <option value="1">Racing Red</option>
                            <option value="810">Gravity Blue</option>
                            <option value="390">Black Storm Metallic</option>
                        </select>

                        <div><h1 className="text-2xl font-extralight mt-3">Standard Equipment</h1></div><Separator />
                        <div className="flex justify-between flex-wrap  ">
                            <p className="basis-2/4 font-thin">Ride Modes</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end">Heated Grips</p>
                            <p className="basis-2/4 font-thin">USB Charging Socket</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end">LED lighting</p>
                            <p className="basis-2/4 font-thin">Connectivity</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end">Hand Protectors</p>
                            <p className="basis-2/4 font-thin">Power Socket</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end">Gear Shift Assist Pro</p>
                        </div>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <div className="grid grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="chain" value='180' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">M Endurance Chain</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.chain}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="keyless" value='315' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Keyless Ride</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.keyless}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="tpc" value='260' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >TPC</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.tpc}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="alarm" value='270' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Alarm</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alarm}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="cruise" value='400' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Cruise Control</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.cruise}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="silencer" value='750' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Sports Silencer</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.silencer}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="offTire" value='70' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Off-Road Tires</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.offTire}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="loweringKit" value='240' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Lowering Kit 805 mm</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.loweringKit}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="lowSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Extra Low Seat 825 mm</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="comfortSeat" value='60' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Comfort Seat 875 mm</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortSeat}</p>
                        </div>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="comfortPkg" value='1065' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Comfort Package</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.comfortPkg}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="touringPkg" value='565' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Touring Package</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.touringPkg}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="activePkg" value='375' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Active Package</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.activePkg}</p>
                        </div>
                    </>
                ) : (null)}
                {finance.model === 'M 1000 R' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div><Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className=" mt-3 h-9 w-full items-center justify-between  border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="0">Select Color</option>
                            <option value="1">Light White / M Motorsport</option>
                            <option value="1">Black Storm Metallic / M Motorsport</option>
                        </select>

                        <div><h1 className="text-2xl font-extralight mt-3">Standard Equipment</h1></div><Separator />
                        <div className="flex justify-between flex-wrap  ">
                            <p className="basis-2/4 font-thin">Ride Modes Pro</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">High Windshield</p>
                            <p className="basis-2/4 font-thin">Connectivity</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">LED lighting</p>
                            <p className="basis-2/4 font-thin">Titanium Exhaust</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">USB Charging Socket</p>
                            <p className="basis-2/4 font-thin">M Lightweight Battery</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">M Chassis Kit</p>
                            <p className="basis-2/4 font-thin">M Winglets</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">Forged Wheels</p>
                            <p className="basis-2/4 font-thin">M Brakes</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">Heated Grips</p>
                            <p className="basis-2/4 font-thin">Cruise Control</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">Launch Control</p>
                            <p className="basis-2/4 font-thin">TPC</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">Gear Shift Assist Pro</p>
                            <p className="basis-2/4 font-thin">Keyless Ride</p>
                        </div>

                        <div><h1 className="text-2xl font-extralight mt-5">Available Factory Options</h1></div><Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="psgrKit" name="psgrKit" value='140' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >Passenger Kit</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.psgrKit}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportShield" name="sportShield" value='200' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Sport Windshield</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.sportShield}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="psgrKit" name="pilSeatCover" value='140' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Pillion Seat Cover</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.pilSeatCover}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="m1000rTitEx" name="m1000rTitEx" value='2870' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">M Titanium Exhaust</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.m1000rTitEx}</p>
                        </div>

                        <div><h1 className="text-2xl font-extralight mt-5">Available Factory Packages</h1></div><Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="m1000rMPkg" name="m1000rMPkg" value='7520' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >M Competition Package</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.m1000rMPkg}</p>
                        </div>

                    </>
                ) : (null)}
                {finance.model === 'M 1000 RR' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div><Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className=" mt-3 h-9 w-full items-center justify-between  border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="0">Select Color</option>
                            <option value="1">Light White / M Motorsport</option>
                            <option value="1">Black Storm Metallic / M Motorsport</option>
                        </select>

                        <div><h1 className="text-2xl font-extralight mt-5">Standard Equipment</h1></div><Separator />
                        <div className="flex justify-between flex-wrap  ">
                            <p className="basis-2/4 font-thin">Ride Modes Pro</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">High Windshield</p>
                            <p className="basis-2/4 font-thin">Connectivity</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">LED lighting</p>
                            <p className="basis-2/4 font-thin">Titanium Exhaust</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">USB Charging Socket</p>
                            <p className="basis-2/4 font-thin">M Lightweight Battery</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">M Chassis Kit</p>
                            <p className="basis-2/4 font-thin">M Winglets</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">M Carbon Wheels</p>
                            <p className="basis-2/4 font-thin">M Brakes</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">Heated Grips</p>
                            <p className="basis-2/4 font-thin">Cruise Control</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">Launch Control</p>
                        </div>

                        <div><h1 className="text-2xl font-extralight mt-5">Available Factory Options</h1></div><Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="alarm" name="alarm" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                                    Alarm System
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.alarm}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportShield" name="psgrKit" value='205' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Passenger Kit</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.psgrKit}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="psgrKit" name="lapTimer" value='145' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">M GPS Laptimer</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.lapTimer}</p>
                        </div>

                        <div><h1 className="text-2xl font-extralight mt-5">Available Factory Packages</h1></div><Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="m1000rrMPkg" name="m1000rrMPkg" value='6770' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >M Competition Package</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.m1000rrMPkg}</p>
                        </div>

                    </>
                ) : (null)}
                {finance.model === 'S 1000 RR' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div><Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                            <option >Select Color</option>
                            <option value="1">Black Storm Metallic</option>
                            <option value="485">Racing Red</option>
                            <option value="6125">Light White / M Motorsport</option>
                        </select>

                        <div><h1 className="text-2xl font-extralight mt-3">Standard Equipment</h1></div><Separator />
                        <div className="flex justify-between flex-wrap  ">
                            <p className="basis-2/4 font-thin">Ride Modes</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">High Windshield</p>
                            <p className="basis-2/4 font-thin">Connectivity</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">LED lighting</p>
                            <p className="basis-2/4 font-thin">Gear Shift Assist Pro</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">USB Charging Socket</p>
                            <p className="basis-2/4 font-thin">M Battery</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">M Chassis Kit</p>
                            <p className="basis-2/4 font-thin">M Winglets</p>
                        </div>

                        <div><h1 className="text-2xl font-extralight mt-5">Available Factory Options</h1></div><Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="desOption" name="desOption" value='150' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                                    Designer Options Wheels
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.desOption}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="psgrKit" name="psgrKit" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Passenger Kit
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="pilSeatCover" name="pilSeatCover" value='145' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Passenger Seat Cover
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.pilSeatCover}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="tpc" name="tpc" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    TPC
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.tpc}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="alarm" name="alarm" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Alarm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alarm}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="chain" name="chain" value='205' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    M Endurance Chain
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.chain}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="carbonWheels" name="carbonWheels" value='4910' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    M Carbon Wheels
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.carbonWheels}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="forgedWheels" name="forgedWheels" value='1875' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    M Forged Wheels
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.forgedWheels}</p>
                        </div>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="s1000rrRacePkg" name="s1000rrRacePkg" value='1280' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                                    Race Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.s1000rrRacePkg}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="s1000rrRacePkg2" name="s1000rrRacePkg2" value='3375' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                                    Race Package 2
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.s1000rrRacePkg2}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="dynamicPkg" name="dynamicPkg" value='1915' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                                    Dynammic Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.dynamicPkg}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="carbonPkg" name="carbonPkg" value='2705' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                                    M Carbon Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.carbonPkg}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="billetPack1" name="billetPack1" value='560' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm  font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                                    M Billet Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.billetPack1}</p>
                        </div>
                    </>
                ) : (null)}
                {finance.model === 'F 850 GSA' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div><Separator />
                        <select name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                            <option >Select Color</option>
                            <option value="1">Light White</option>
                            <option value="810">Kalamata</option>
                            <option value="390">Black Storm Metallic</option>
                        </select>

                        <div><h1 className="text-2xl font-extralight mt-5">Standard Equipment</h1></div><Separator />
                        <div className="flex justify-between flex-wrap  ">
                            <p className="basis-2/4 font-thin">Ride Modes</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end">Heated Grips</p>
                            <p className="basis-2/4 font-thin">USB Charging Socket</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end">LED lighting</p>
                            <p className="basis-2/4 font-thin">Connectivity</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end">Hand Protectors</p>
                            <p className="basis-2/4 font-thin">Adjustable Windshield</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end">Enduro Footrests</p>
                            <p className="basis-2/4 font-thin">Stainless Steel Luggage Racks</p>
                        </div>

                        <div><h1 className="text-2xl font-extralight mt-5">Available Factory Options</h1></div><Separator />
                        <div className="grid grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="chain" value='180' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">M Endurance Chain</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.chain}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="keyless" value='315' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Keyless Ride</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.keyless}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="tpc" value='260' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >TPC</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.tpc}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="alarm" value='270' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Alarm</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alarm}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="silencer" value='750' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Sports Silencer</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.silencer}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="offTire" value='70' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Off-Road Tires</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.offTire}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="loweringKit" value='240' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Lowering Kit 805 mm</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.loweringKit}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="f7gsXTlow" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Extra Low Seat 825 mm</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">$0</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="f8gsDblSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Black Double Seat 860 mm</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.f8gsDblSeat}</p>
                        </div>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="comfortPkg" value='1065' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Comfort Package</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.comfortPkg}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="touringPkg" value='945' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Touring Package</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.touringPkg}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="activePkg" value='535' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Active Package</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.activePkg}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="dynamicPkg" value='565' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Dynamic Package</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0  ">${bmwData.dynamicPkg}</p>
                        </div>
                    </>
                ) : (null)}
                {finance.model === 'R 1250 GS' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div><Separator />
                        <select name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option >Select Color</option>
                            <option value="1">Light White</option>
                            <option value="1420">White / Blue / Red</option>
                            <option value="1140">Black / Grey</option>
                            <option value="1670">Gravity Blue Metallic</option>
                        </select>

                        <div><h1 className="text-2xl font-extralight mt-3">Standard Equipment</h1></div><Separator />
                        <div className="flex justify-between flex-wrap  ">
                            <p className="basis-2/4 font-thin">Hand Protectors</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end">Engine Protection Bar</p>
                            <p className="basis-2/4 font-thin">Ride Modes Pro</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end">USB Charging Socket</p>
                            <p className="basis-2/4 font-thin">Connectivity</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end">LED lighting</p>
                        </div>

                        <div><h1 className="text-2xl font-extralight mt-5">Available Factory Options</h1></div><Separator />

                        <div className="grid grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="tpc" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" >
                                    TPC
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">
                                ${bmwData.tpc}
                            </p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="mLightBat" value='435' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    M Lightweight Battery
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">
                                ${bmwData.mLightBat}
                            </p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="r12gsSpSusp" value='465' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Sport Suspension 20mm higher
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">
                                ${bmwData.r12gsSpSusp}
                            </p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="fogLights" value='530' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    LED Additional Fog Lights
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">
                                ${bmwData.fogLights}
                            </p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="offTire" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Off-Road Tires
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">
                                N/C
                            </p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="r12gsProtBar" value='490' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Engine Protection Bar
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">
                                ${bmwData.r12gsProtBar}
                            </p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="r12gsCrossBlk" value='620' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Cross Spoked Wheels - Black
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">
                                ${bmwData.r12gsCrossBlk}
                            </p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="r12gsCrossGld" value='620' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Cross Spoked Wheels - Gold
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">
                                ${bmwData.r12gsCrossGld}
                            </p>


                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="psgrKit" value='395' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Passenger Kit - Standard Seat 850/870 mm Windshield Centre Stand
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">
                                ${bmwData.psgrKit}
                            </p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="passengerKitLowSeat" value='395' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Passenger Kit Low - Low Seat 800/820 mm Windshield Centre Stand
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">
                                ${bmwData.passengerKitLowSeat}
                            </p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="lowKitLowSeat" value='295' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Lowering Kit with Low Seat - 800/820 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">
                                ${bmwData.lowKitLowSeat}
                            </p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="lowSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Low Rider's Seat - 820/840 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">
                                N/C
                            </p>



                        </div>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="comfortPkg" value='985' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Comfort Package</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="touringPkg" value='1010' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Touring Package</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.touringPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="dynamicPkg" value='2015' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Dynamic Package</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.dynamicPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="enduroPkg" value='875' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Enduro Package</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.enduroPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="lgihtsPkg" value='770' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Lights Package</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.lgihtsPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="billetPack1" value='1350' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Option 719 Billet Pack 1</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack1}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="billetPack2" value='1210' className="form-checkbox" onChange={handleInputChange} />
                                <label className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Option 719 Billet Pack 2</label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack2}</p>

                        </div>
                    </>
                ) : (null)}
                {finance.model === 'R 1250 GSA' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option >Select Color</option>
                            <option value="1100">White / Blue / Red</option>
                            <option value="1">Black Storm Metallic</option>
                            <option value="810">Black / Black / Grey</option>
                            <option value="1250">Ice Grey</option>
                        </select>

                        <div><h1 className="text-2xl font-extralight mt-3">Standard Equipment</h1></div>
                        <Separator />
                        <div className="flex justify-between flex-wrap  ">
                            <p className="basis-2/4 font-thin">Ride Modes</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">USB Charging Socket</p>
                            <p className="basis-2/4 font-thin">Connectivity</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">LED lighting</p>
                        </div>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="r12gsaaluminumFuelTank" name="alumTank1" value='435' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Aluminum Fuel Tank
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alumTank1}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="mLightBat" name="mLightBat" value='435' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    M Lightweight Battery
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.mLightBat}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="tpc" name="tpc" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Tire Pressure Control
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.tpc}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="fogLights" name="fogLights" value='535' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    LED Additional Fog Light
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.fogLights}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="alarm" name="alarm" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Anti-Theft Alarm System
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alarm}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="handleRisers" name="handleRisers" value='145' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Handlebar Risers
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.handleRisers}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="offTire" name="offTire" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Off Road Tires
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">
                                N/C
                            </p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="r12gsacrossSpokedWheelsBlack" name="r12gsacrossSpokedWheelsBlack" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Cross Spoked Wheels - Black
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">
                                N/C
                            </p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="r12gsacrossSpokedWheelsGold" name="r12gsacrossSpokedWheelsGold" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Cross Spoked Wheels - Gold
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">
                                N/C
                            </p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="psgrKit" name="psgrKit" value='170' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none :cursor-not-allowed peer-disabled:opacity-70">
                                    Passenger Kit - Standard Seat 890/910 mm (35/35.8 in), Standard Windshield
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.psgrKit}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="passengerKitLowSeat" name="passengerKitLowSeat" value='170' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Passenger Kit Low - Low Seat 820/840 mm Standard Windshield
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.passengerKitLowSeat}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="r12gsaloweringKitLowSeat" name="lowKitLowSeat" value='295' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Lowering Kit with Low Seat - 820/840 mm
                                </label>
                                <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.lowKitLowSeat}</p>
                            </div>
                        </div>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />

                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="comfortPkg" name="comfortPkg" value='725' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Comfort Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="touringPkg" name="touringPkg" value='1025' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Touring Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.touringPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="dynamicPkg" name="dynamicPkg" value='1955' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Dynamic Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.dynamicPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="lgihtsPkg" name="lgihtsPkg" value='1190' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Lights Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.lgihtsPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="12gsaoption719BilletPackI" name="billetPack1" value='1350' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719-Billet Pack I
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack1}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="12gsaoption719BilletPackII" name="12gsaoption719BilletPackII" value='1210' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719-Billet Pack II
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack2}</p>

                        </div>
                    </>
                ) : (null)}
                {finance.model === 'F 900 XR' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option >Select Color</option>
                            <option value="1">Alpine White</option>
                            <option value="620">Black Storm Metallic</option>
                            <option value="860">Racing Blue Metallic</option>
                            <option value="2570">Meteoric Dust</option>
                        </select>





                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="keyless" name="keyless" value='315' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Keyless Ride
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.keyless}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="tpc" name="tpc" value='260' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Tire Pressure Monitor
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.tpc}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="f9xrHandProtectors" name="f9xrHandProtectors" value='100' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Hand Protectors
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.f9xrHandProtectors}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="alarm" name="alarm" value='270' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Anti-Theft Alarm System
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alarm}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="lowKitLowSeat" name="lowKitLowSeat" value='240' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Lowering Kit with Low Seat - 775 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.lowKitLowSeat}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="lowSeat" name="lowSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Low Seat - 795 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">
                                N/C
                            </p>
                        </div>




                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="comfortPkg" name="comfortPkg" value='1065' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Comfort Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="touringPkg" name="touringPkg" value='565' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Touring Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.touringPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="dynamicPkg" name="dynamicPkg" value='850' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Dynamic Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.dynamicPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="activePkg" name="activePkg" value='560' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Active Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.activePkg}</p>
                        </div>
                    </>
                ) : (null)}
                {finance.model === 'S 1000 XR' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option >Select Color</option>
                            <option value="1">Alpine White</option>
                            <option value="620">Black Storm Metallic</option>
                            <option value="860">Racing Blue Metallic</option>
                            <option value="2570">Meteoric Dust</option>
                        </select>




                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="headlightPro" name="headlightPro" value='695' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Adaptive Headlight Pro
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.headlightPro}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="designW" name="designW" value='150' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Design Option Wheels
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.designW}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="chargeSocket" name="chargeSocket" value='50' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    USB Charging Socket
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.chargeSocket}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="highShield" name="highShield" value='200' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    High Windshield
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.highShield}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="auxLights" name="auxLights" value='505' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    LED Auxiliary Lights
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.auxLights}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="alarm" name="alarm" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Anti-Theft Alarm System
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alarm}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="chain" name="chain" value='205' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    M Endurance Chain
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.chain}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="forgedWheels" name="forgedWheels" value='1875' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    M Forged Wheels
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.forgedWheels}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="lowKitLowSeat" name="lowKitLowSeat" value='295' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Lowering Kit with Low Seat - 790 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.lowKitLowSeat}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="lowSeat" name="lowSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Low Seat - 820 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.lowSeat}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="highSeat" name="highSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    High Seat - 860 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.highSeat}</p>



                        </div>


                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="touringPkg" name="touringPkg" value='1190' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Touring Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.touringPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="carbonPkg" name="carbonPkg" value='2425' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Carbon Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.carbonPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="billetPack2" name="billetPack1" value='1340' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    M Billet Pack
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack1}</p>
                        </div>
                    </>
                ) : (null)}
                {finance.model === 'G 310 GS' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option >Select Color</option>
                            <option value="1">Cosmic Black</option>
                            <option value="110">Kalamata</option>
                            <option value="145">White / Red</option>
                        </select>



                    </>
                ) : (null)}
                {finance.model === 'R 1250 RS' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                            <option >Select Color</option>
                            <option value="1">Light White</option>
                            <option value="685">White / Blue / Red</option>
                            <option value="890">Black Storm Metallic</option>
                        </select>


                        <div><h1 className="text-2xl font-extralight mt-5">Standard Equipment</h1></div>
                        <Separator />
                        <div className="flex justify-between flex-wrap  ">
                            <p className="basis-2/4 font-thin">Ride Modes</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">Connectivity</p>
                            <p className="basis-2/4 font-thin">LED lighting</p>
                            <p className="flex basis-2/4 font-thin justify-end items-end ">Heated Grips</p>
                            <p className="basis-2/4 font-thin">USB Charging Socket</p>
                        </div>



                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">






                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="auxLights" name="sportSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Sport Seat
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="alarm" name="alarm" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Anti-Theft Alarm System
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alarm}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="chain" name="psgrKit" value='165' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Passenger Kit
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.psgrKit}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="forgedWheels" name="heatedSeat" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Heated Seat
                                </label>

                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.heatedSeat}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="cruise" value='495' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Cruise Control

                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.cruise}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="lowSeat" name="centreStand" value='215' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Center Stand
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.centreStand}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="classicWheels" name="tubeHandle" value='150' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Tubular Handlebar
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.tubeHandle}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="sportWheels" value='1340' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719: Sport Wheels
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.sportWheels}</p>
                        </div>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="comfortPkg" name="comfortPkg" value='1080' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Comfort Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="touringPkg" name="touringPkg" value='1055' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Touring Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.touringPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="dynamicPkg" name="dynamicPkg" value='1915' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Dynamic Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.dynamicPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="billetPack1" name="billetPack1" value='1355' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719-Billet Pack I
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack1}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="billetPack2" name="billetPack2" value='930' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719-Billet Pack Classic II
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack2}</p>
                        </div>
                    </>
                ) : (null)}
                {finance.model === 'R 1250 RT' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option >Select Color</option>
                            <option value="1">Alpine White</option>
                            <option value="620">Black Storm Metallic</option>
                            <option value="860">Racing Blue Metallic</option>
                            <option value="2570">Meteoric Dust - 719</option>
                        </select>




                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="keyless" name="keyless" value='450' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Keyless Ride
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.keyless}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="audioSystem" name="audioSystem" value='1580' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Audio System with Bluetooth Interface
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.audioSystem}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="tpc" name="tpc" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Tire Pressure Control
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.tpc}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="auxLights" name="auxLights" value='535' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    LED Auxiliary Light
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.auxLights}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="alarm" name="alarm" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Anti-Theft Alarm System
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alarm}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="handleBar" name="handleBar" value='295' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Tubular Handlebars
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.handleBar}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="highSeat" name="highSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    High Seat - 830/850 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="lowSeat" name="lowSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Low Seat - 760/780 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="brownSeat" name="brownSeat" value='310' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719: Brown Seat - 805/825 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.brownSeat}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="classicWheels" name="classicWheels" value='1140' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719: Classic Wheels
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.classicWheels}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="sportWheels" value='1140' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719: Sport Wheels
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.sportWheels}</p>

                        </div>


                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="comfortPkg" name="comfortPkg" value='2120' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Comfort Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="dynamicPkg" name="dynamicPkg" value='3220' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Dynamic Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.dynamicPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="billetPack1" name="billetPack1" value='1355' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719-Billet Pack I
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack1}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="billetPack2" name="billetPack2" value='435' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719-Billet Pack II
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack2}</p>

                        </div>
                    </>
                ) : (null)}
                {finance.model === 'K 1600 B' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option value="">Select Color</option>
                            <option value="620">Black Storm</option>
                            <option value="860">Manhattan </option>
                            <option value="2570">Midnight</option>
                        </select>




                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="floorLight" name="floorLight" value='110' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Floor Lighting
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.floorLight}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="centerStand" name="centerStand" value='205' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Centre Stand
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.centerStand}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="forgedWheels" name="handleBar" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Forged Handlebar
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="highSeat" name="highSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    High Seat - 800 mm (31.5 in)
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="blackBench" name="blackBench" value='295' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719: Black Bench Seat - 750 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.blackBench}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="forgedWheels" name="forgedWheels" value='2185' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719: Classic Forged Wheels
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.forgedWheels}</p>
                        </div>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="comfortPkg" name="comfortPkg" value='1175' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Comfort Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="touringPkg" name="touringPkg" value='2315' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Touring Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.touringPkg}</p>
                        </div>
                    </>
                ) : (null)}
                {finance.model === 'K 1600 Grand America' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option value="">Select Color</option>
                            <option value="620">Black Storm</option>
                            <option value="435">Manhattan </option>
                            <option value="3235">Midnight</option>
                        </select>




                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="floorLight" name="floorLight" value='110' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Floor Lighting
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.floorLight}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="forgedWheels" name="forgedWheels" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Forged Handlebar
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.forgedWheels}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="centerStand" name="centerStand" value='205' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Centre Stand
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.centerStand}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="highSeat" name="highSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    High Seat - 800 mm (31.5 in)
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="blackBench" name="blackBench" value='295' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719: Black Bench Seat - 750 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.blackBench}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="forgedWheels" name="forgedWheels" value='2185' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719: Classic Forged Wheels
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.forgedWheels}</p>
                        </div>


                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="comfortPkg" name="comfortPkg" value='1175' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Comfort Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortPkg}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="comfortPkg" name="comfortPkg" value='0' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719 - Midight
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">Inc with color</p>
                        </div>
                    </>
                ) : (null)}
                {finance.model === 'K 1600 GT' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option value="">Select Color</option>
                            <option value="1">Black Storm</option>
                            <option value="710">Manhattan </option>
                            <option value="2610">Midnight</option>
                        </select>



                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="floorLight" name="floorLight" value='110' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Floor Lighting
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.floorLight}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="lowSeat780800mm" name="lowSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Low Seat - 780/800 mm (30.7/31.4 in.)
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="brownBench810830mm" name="brownBench" value='295' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719: Brown Bench Seat - 810/830 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.brownBench}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="forgedWheels" name="forgedWheels" value='2185' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719: Forged Classic Wheels
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.forgedWheels}</p>


                        </div>


                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="comfortPkg" name="comfortPkg" value='1175' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Comfort Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="touringPkg" name="touringPkg" value='2090' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Touring Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.touringPkg}</p>
                        </div>
                    </>
                ) : (null)}
                {finance.model === 'K 1600 GTL' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option value="">Select Color</option>
                            <option value="1">Black Storm</option>
                            <option value="985">Manhattan </option>
                            <option value="2610">Midnight</option>
                        </select>



                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="floorLight" name="floorLight" value='110' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Floor Lighting
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.floorLight}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="handleBar" name="handleBar" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Tubular Handlebars
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="highSeat800mm" name="highSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    High Seat-800 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="brownBench750mm" name="brownBench" value='295' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719: Brown Bench Seat - 750
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.brownBench}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="forgedWheels" name="forgedWheels" value='2185' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719: Classic Forged Wheels
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.forgedWheels}</p>

                        </div>



                    </>
                ) : (null)}
                {finance.model === 'R 1250 R' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option >Select Color</option>
                            <option value="1">Ice Grey</option>
                            <option value="620">Racing Blue</option>
                            <option value="1">Black Storm</option>

                        </select>



                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="headlightPro" name="headlightPro" value='840' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Adaptive Headlight
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.headlightPro}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="psgrKit" name="psgrKit" value='165' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Passenger Kit
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.psgrKit}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="heatedSeat" name="heatedSeat" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Heated Seat
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.heatedSeat}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="cruise" name="cruise" value='495' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Cruise Control
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.cruise}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportShield" name="sportShield" value='295' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Sport Windshield
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.sportShield}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="alarm" name="alarm" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Anti-Theft Alarm System
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alarm}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="handleBar" name="handleBar" value='150' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Sports Handlebar
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.handleBar}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="centerStand" name="centerStand" value='215' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Centre Stand
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.centerStand}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="lugRack" name="lugRack" value='225' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Luggage Rack
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.lugRack}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="lugRackBrackets" name="lugRackBrackets" value='170' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Luggage Case Brackets
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.lugRackBrackets}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="lowSeat790mm" name="lowSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Low Seat-790 mm - r12r
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportSeat" name="sportSeat" value='70' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Sport Seat - 840 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.sportSeat}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="comfortPkg" name="comfortPkg" value='70' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Comfort Passenger Seat
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="classicWheels" name="classicW" value='1340' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719: Classic Wheels
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.classicW}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="sportWheels" value='1340' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719: Sport Wheels
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.sportWheels}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="comfortPsgrSeat" value='70' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Comfort Passenger Seat
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortPsgrSeat}</p>
                        </div>


                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="comfortPkg" name="comfortPkg" value='1080' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Comfort Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="touringPkg" name="touringPkg" value='1055' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Touring Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.touringPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="dynamicPkg" name="dynamicPkg" value='1915' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Dynamic Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.dynamicPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="billetPack2" name="billetPack1" value='1355' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719-Billet Pack I
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack1}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="billetPack2" name="billetPack2" value='1210' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719-Billet Pack II - r12r
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack2}</p>

                        </div>
                    </>
                ) : (null)}
                {finance.model === 'S 1000 R' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option >Select Color</option>
                            <option value="3955">M Motorsport</option>
                            <option value="460">Blue Storm</option>
                            <option value="1">Black Storm</option>
                        </select>




                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="headlightPro" name="headlightPro" value='555' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Adaptive Headlight Pro
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.headlightPro}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="chain" name="chain" value='205' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    M Endurance Chain
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.chain}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="keyless" name="keyless" value='265' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Keyless Ride
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.keyless}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="designW" name="designW" value='150' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Design Option Wheels
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.designW}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="psgrKit" name="psgrKit" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Passenger Kit
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="tpc" name="tpc" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Tire Pressure Control
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.tpc}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="windshield" name="windshield" value='200' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Sport Windshield
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.windshield}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="alarm" name="alarm" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Anti-Theft Alarm System
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alarm}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="psgrKit" name="mPsgrSeat" value='70' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    M Passenger Seat
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.mPsgrSeat}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="forgedWheels" name="forgedWheels" value='1875' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    M Forged Wheels
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.forgedWheels}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="highSeat" name="highSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    High Seat - 850 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="lowSeat" name="lowSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Low Seat - 810 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>
                        </div>


                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="comfortPkg" name="comfortPkg" value='985' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Comfort Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="dynamicPkg" name="dynamicPkg" value='1635' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Dynamic Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.dynamicPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="carbonPkg" name="carbonPkg" value='2045' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    M Carbon Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.carbonPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="billetPack1" name="billetPack1" value='1340' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    M Billet Pack
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack1}</p>

                        </div>
                    </>
                ) : (null)}
                {finance.model === 'F 900 R' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option >Select Color</option>
                            <option value="1">Black Storm Metallic</option>
                            <option value="390">Racing Blue / Light White / Racing Red</option>
                            <option value="140">Blue Sone</option>
                        </select>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="chain" name="chain" value='180' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    M Endurance Chain
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.chain}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="keyless" name="keyless" value='315' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Keyless Ride
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.keyless}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="headlightPro" name="headlightPro" value='450' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Adaptive Headlight Pro
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.headlightPro}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="shiftAssPro" name="shiftAssPro" value='490' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Gear Shift Assistant Pro
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.shiftAssPro}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="tpc" name="tpc" value='260' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Tire Pressure Control
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.tpc}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="cruise" name="cruise" value='400' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Cruise Control
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.cruise}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="windshield" name="windshield" value='115' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Pure Windshield
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.windshield}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="alarm" name="alarm" value='270' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Anti-Theft Alarm System
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alarm}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="handleBar" name="handleBar" value='145' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    High Handlebar
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.handleBar}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="highSeat" name="highSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Extra High Seat - 865 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="lowKitLowSeat" name="lowKitLowSeat" value='240' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Lowering Kit with Low Seat - 770 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.lowKitLowSeat}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="lowSeat" name="lowSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Low Seat - 790 mm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                        </div>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="comfortPkg" name="comfortPkg" value='670' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Comfort Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="touringPkg" name="touringPkg" value='850' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Touring Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.touringPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="dynamicPkg" name="dynamicPkg" value='890' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Dynamic Package
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.dynamicPkg}</p>



                        </div>
                    </>
                ) : (null)}
                {finance.model === 'G 310 R' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option >Select Color</option>
                            <option value="1">Cosmic Black</option>
                            <option value="145">Racing Red</option>
                            <option value="145">White / Blue</option>
                        </select>

                    </>
                ) : (null)}
                {finance.model === 'R 18' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option >Select Color</option>
                            <option value="285">Mars Red</option>
                            <option value="1">Black Storm Metallic</option>
                            <option value="285">Manhatten Matte</option>
                            <option value="1080">719 - Mineral White</option>
                            <option value="1280">719 - Titan Silver / Galaxy Dust</option>
                        </select>



                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="keyless" name="headlightPro" value='340' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Adaptive Headlight Pro
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.headlightPro}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="hillStart" name="hillStart" value='90' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Hill Start Control
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.hillStart}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="cruise" name="cruise" value='305' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Cruise Control
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.cruise}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="floorboards" name="floorboards" value='130' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Floorboards
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.floorboards}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="auxLights" name="reverse" value='850' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Reverse Gear
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.reverse}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="psgrkit" name="psgrKit" value='225' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Passenger Kit
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.psgrKit}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="forkTubeTrim" name="forkTubeTrim" value='260' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Fork Tube Trim
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.forkTubeTrim}</p>



                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="spokedW" name="spokedW" value='605' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Spoked Wheels
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.spokedW}</p>



                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="silencer" name="silencer" value='780' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Design Option Silencer
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.silencer}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="lockGasCap" name="lockGasCap" value='45' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Lockable Gas Tank Cap
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.lockGasCap}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="tpc" name="tpc" value='200' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Tire Pressure Control
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.tpc}</p>


                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="alarm" value='210' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Alarm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alarm}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="highSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    High Seat
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="blackS719" value='140' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Black Seat - 719
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.blackS719}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="psgrBench719" value='270' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Passenger Bench Seat - 719
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.psgrBench719}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="aeroWheel" value='660' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Icon Wheel
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.aeroWheel}</p>


                        </div>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="desOption" value='1125' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Design Option Chrome
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.desOption}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="pinstripe" value='260' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Pinstriping
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.pinstripe}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="aero719" value='830' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719 Aero Design pkg
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.aero719}</p>

                        </div>

                    </>
                ) : (null)}
                {finance.model === 'R 18 Classic' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option >Select Color</option>
                            <option value="325">Mars Red</option>
                            <option value="1">Black Storm Metallic</option>
                            <option value="325">Manhatten Matte</option>
                            <option value="1235">719 - Mineral White</option>
                            <option value="1465">719 - Titan Silver / Galaxy Dust</option>
                        </select>





                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="headlightPro" name="headlightPro" value='485' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Adaptive Headlight Pro
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.headlightPro}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="hillStart" name="hillStart" value='100' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Hill Start Control
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.hillStart}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="floorboards" name="floorboards" value='150' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Floorboards
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.floorboards}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="auxLights" name="reverse" value='970' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Reverse Gear
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.reverse}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="brownSeat" name="lockGasCap" value='50' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Lockable Gas Tank Cap
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.lockGasCap}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="tpc" value='240' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Tire Pressure Control
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.tpc}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="alarm" value='240' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Alarm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alarm}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="benchseatlow" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Bench Seat Low
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="blackBench" value='405' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Bench Seat Black
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.blackBench}</p>


                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="iconWheel" value='750' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Icon Wheel
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.iconWheel}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="aero719" value='750' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Aero Wheel
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.aero719}</p>




                        </div>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="desOption" name="desOption" value='1285' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Design Option Chrome
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.desOption}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="pinstripe" name="pinstripe" value='295' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Pinstriping
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.pinstripe}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="aero719" name="aeroPkg719" value='950' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719 Aero Design pkg
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.aeroPkg719}</p>

                        </div>

                    </>
                ) : (null)}
                {finance.model === 'R 18 B' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option >Select Color</option>
                            <option value="455">Mars Red</option>
                            <option value="1">Black Storm Metallic</option>
                            <option value="455">Manhatten Matte</option>
                            <option value="2250">719 - Mineral White</option>
                            <option value="1830">719 - Titan Silver / Galaxy Dust</option>
                        </select>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="headlightPro" name="headlightPro" value='485' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Adaptive Headlight Pro
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.headlightPro}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="hillStart" name="hillStart" value='100' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Hill Start Control
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.hillStart}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="floorboards" name="floorboards" value='150' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Floorboards
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.floorboards}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="reverse" name="reverse" value='970' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Reverse Gear
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.reverse}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="tpc" name="tpc" value='230' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Tire Pressure Control
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.tpc}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="comfortSeat" name="comfortSeat" value='375' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Comfort Seat                                             </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortSeat}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="blackContrastwheel" value='250' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Black Contrast Cut Wheel
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.blackContrastwheel}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="silverContastWheel" value='250' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Silver Contrast Wheel
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.silverContastWheel}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="silverWheel" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Silver Wheel                                             </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                        </div>


                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="desOption" name="desOption" value='1430' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Design Option Chrome
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.desOption}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="pinstripe" name="pinstripe" value='375' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Pinstriping
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.pinstripe}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="aero719" name="aero719" value='950' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719 Aero Design pkg
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.aero719}</p>

                        </div>

                    </>

                ) : (null)}
                {finance.model === 'R 18 Transcontinental' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option value="455">Mars Red</option>
                            <option value="1">Black Storm Metallic</option>
                            <option value="455">Manhatten Matte</option>
                            <option value="1925">719 - Mineral White</option>
                            <option value="2350">719 - Titan Silver / Galaxy Dust</option>
                        </select>



                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="headlightPro" name="headlightPro" value='485' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Adaptive Headlight Pro
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.headlightPro}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="hillStart" name="hillStart" value='100' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Hill Start Control
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.hillStart}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="comfortSeat" name="activeCruise" value='495' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Active Cruise
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.activeCruise}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="comfortSeat" name="comfortSeat" value='375' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Comfort Seat
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortSeat}</p>

                            <div className="flex items-center
                                        space-x-2">
                                <input type="checkbox" id="tpc" name="tpc" value='230' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Tire Pressure Control
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.tpc}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="tpc" name="blackPowertrain" value='90' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Black Powertrain
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.blackPowertrain}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="benchseatlow" name="benchseatlow" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Bench Seat Low
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="blackContrastwheel" name="blackContrastwheel" value='250' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Black Contrast Cut Wheel
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.blackContrastwheel}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="silverContastWheel" name="silverContastWheel" value='250' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Silver Contrast Wheel
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.silverContastWheel}</p>



                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="blackWheel" name="blackWheel" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Black  Wheel
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                        </div>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="desOption" name="desOption" value='1430' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Design Option Chrome
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.desOption}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="pinstripe" name="pinstripe" value='375' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Pinstriping
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.pinstripe}</p>

                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.aero719}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="pinstripe" name="designPkgBL" value='150' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Design Pkg Black
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.designPkgBL}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="aero719" name="aero719" value='950' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Option 719 Aero Design pkg
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.aero719}</p>
                        </div>


                    </>
                ) : (null)}
                {finance.model === 'R nine T' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option >Select Color</option>
                            <option value="1">Black Storm</option>
                            <option value="1280">Aluminum - 719</option>
                            <option value="1450">Night Black / Aluminum</option>
                        </select>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="headlightPro" name="headlightPro" value='265' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Adaptive Headlight
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.headlightPro}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="alarm" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Alarm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alarm}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="alumTank1" value='720' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Aluminum Tank 1
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alumTank1}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="alumTank2" value='370' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Aluminum Tank 2
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alumTank2}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="classicW" value='575' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Classic Wheel - 719
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.classicW}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="sportWheels" value='575' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Sport Wheel - 719
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.sportWheels}</p>

                        </div>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="comfortPkg" value='930' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Comfort Pkg
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="billetPack1" value='1635' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Options 719 Billet Pack 1
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack1}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="billetPack2" value='1355' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Options 719 Billet Pack 2
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack2}</p>

                        </div>

                    </>
                ) : (null)}
                {finance.model === 'R nineT Pure' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option >Select Color</option>
                            <option value="1">Mineral Grey </option>
                            <option value="2070">Aluminum - 719</option>
                            <option value="765">Underground</option>
                            <option value="765">Pollux</option>

                        </select>


                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="keyless" name="headlightPro" value='265' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Adaptive Headlight
                                </label>
                            </div>

                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.headlightPro}</p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="alarm" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Alarm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alarm}</p>


                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="alumTank1" value='1700' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Aluminum Tank 1
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alumTank1}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="alumTank2" value='1355' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Aluminum Tank 2
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alumTank2}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="classicW" value='1280' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Classic Wheel - 719
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.classicW}</p>


                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="sportWheels" value='630' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Sport Wheel - 719
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.sportWheels}</p>


                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="silencer" value='720' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Design Option Silencer
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.silencer}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="chromedExhaust" value='145' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Chromed Exhuast
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.silencer}</p>

                        </div>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="comfortPkg" value='930' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Comfort Pkg
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="billetPack1" value='1635' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Options 719 Billet Pack 1
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack1}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="billetPack2" value='1355' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Options 719 Billet Pack 2
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack2}</p>

                        </div>

                    </>
                ) : (null)}
                {finance.model === 'R nineT Scrambler' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option >Select Color</option>
                            <option value="1">Granite Grey </option>
                            <option value="210">Manhatten Matte</option>
                            <option value="765">Underground - 719</option>
                            <option value="765">Pollux - 719</option>
                        </select>



                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="keyless" name="headlightPro" value='265' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Adaptive Headlight
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.headlightPro}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="alarm" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Alarm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alarm}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="alumTank1" value='1700' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Aluminum Tank 1
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alumTank1}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="alumTank2" value='1355' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Aluminum Tank 2
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alumTank2}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="designW" value='665' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Design Option Wheel
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.designW}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="offTire" value='70' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Off-Road Tires
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.offTire}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="loweringKit" value='295' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Lowering Kit
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.loweringKit}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="highSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    High Seat
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                        </div>


                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="comfortPkg" value='930' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Comfort Pkg
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="billetPack1" value='1635' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Options 719 Billet Pack 1
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack1}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="billetPack2" value='1355' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Options 719 Billet Pack 2
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack2}</p>

                        </div>

                    </>
                ) : (null)}
                {finance.model === 'R nineT Urban' ? (
                    <>
                        <div><h1 className="text-2xl font-extralight">Color</h1></div>
                        <Separator />
                        <select id="color" name="color" onChange={handleInputChange} data-te-select-init className="mt-3 h-9 w-full items-center justify-between  border bg-transparent px-3
     py-2 text-sm shadow-sm  focus:outline-none focus:ring-1  disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black dark:text-foreground">
                            <option >Select Color</option>
                            <option value="1">Light White</option>
                            <option value="210">Imperial Blue</option>
                            <option value="1040">Underground</option>
                        </select>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Options</h1></div><Separator />
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="headlightPro" name="headlightPro" value='265' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Adaptive Headlight
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.headlightPro}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="alarm" value='335' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Alarm
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alarm}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="alumTank1" value='1700' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Aluminum Tank 1
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alumTank1}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="alumTank2" value='1355' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Aluminum Tank 2
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.alumTank2}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="designW" value='665' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Design Option Wheel
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.designW}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="offTire" value='70' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Off-Road Tires
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.offTire}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="lowSeat" value='1' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Low Seat
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">N/C</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="crossW" value='620' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Cross Spoked Wheels
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.crossW}</p>


                        </div>

                        <div><h1 className="text-2xl font-extralight mt-3">Available Factory Packages</h1></div>
                        <Separator />
                        <div className="grid  grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="comfortPkg" value='930' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Comfort Pkg
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.comfortPkg}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="billetPack1" value='1635' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Options 719 Billet Pack 1
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.sportWheels}</p>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="sportWheels" name="billetPack2" value='1355' className="form-checkbox" onChange={handleInputChange} />
                                <label htmlFor="bimini" className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Options 719 Billet Pack 2
                                </label>
                            </div>
                            <p className="flex basis-2/4 font-thin justify-end items-end mb-0 pb-0">${bmwData.billetPack2}</p>

                        </div>
                    </>
                ) : (null)}

            </div>

        </>
    )
}
