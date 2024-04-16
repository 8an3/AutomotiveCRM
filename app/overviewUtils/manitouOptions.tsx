import { useFetcher, useLoaderData, useParams, } from '@remix-run/react'
import { overviewLoader, overviewAction, } from '~/components/actions/overviewActions'
import { useState } from 'react';

export default function ManitouOptions({
  manOptions,
  modelData,

}) {
  const [maniData, setManiData] = useState({
    BEandTR: parseFloat(manOptions.BEandTR) || '',
    intColor1: parseFloat(manOptions.intColor1) || '',
    licensingMan: parseFloat(manOptions.licensingMan) || '',
    licensingManTr: parseFloat(manOptions.licensingManTr) || '',
    motor: parseFloat(manOptions.motor) || '',
    sigPkgCruise: parseFloat(manOptions.sigPkgCruise) || '',
    wallCol: parseFloat(manOptions.wallCol) || '',
    wallColCr: parseFloat(manOptions.wallColCr) || '',
    colorCruise: parseFloat(manOptions.colorCruise) || '',
    furnitureColor: parseFloat(manOptions.furnitureColor) || '',
    sigPkgExplore: parseFloat(manOptions.sigPkgExplore) || '',
    selPkgExplore: parseFloat(manOptions.selPkgExplore) || '',
    tubesExplore: parseFloat(manOptions.tubesExplore) || '',
    colorExplore: parseFloat(manOptions.colorExplore) || '',
    wallColorExplore: parseFloat(manOptions.wallColorExplore) || '',
    sigPkgLX: parseFloat(manOptions.sigPkgLX) || '',
    blkPkgLX: parseFloat(manOptions.blkPkgLX) || '',
    wallGraphic: parseFloat(manOptions.wallGraphic) || '',
    wallColorLX: parseFloat(manOptions.wallColorLX) || '',
    wallGraphicLX: parseFloat(manOptions.wallGraphicLX) || '',
    wallGraphicAccentLX: parseFloat(manOptions.wallGraphicAccentLX) || '',
    fibreGlassPodsLX: parseFloat(manOptions.fibreGlassPodsLX) || '',
    powderCoatLX: parseFloat(manOptions.powderCoatLX) || '',
    furnitureLX: parseFloat(manOptions.furnitureLX) || '',
    flooringLX: parseFloat(manOptions.flooringLX) || '',
    blackoutPkgXT: parseFloat(manOptions.blackoutPkgXT) || '',
    signaturePkgXT: parseFloat(manOptions.signaturePkgXT) || '',
    WallGraphicXT: parseFloat(manOptions.WallGraphicXT) || '',
    powderCoatXT: parseFloat(manOptions.powderCoatXT) || '',
    furnitureXT: parseFloat(manOptions.furnitureXT) || '',
    biminiCr: parseInt(manOptions.biminiCr) || 0,
    signature: parseInt(manOptions.signature) || 0,
    select: parseInt(manOptions.select) || 0,
    tubeColor: parseInt(manOptions.tubeColor) || 0,
    blkPkg: parseInt(manOptions.blkPkg) || 0,
    selRFXPkgLX: parseInt(manOptions.selRFXPkgLX) || 0,
    selRFXWPkgLX: parseInt(manOptions.selRFXWPkgLX) || 0,
    colMatchedFiberLX: parseInt(manOptions.colMatchedFiberLX) || 0,
    powderCoatingLX: parseInt(manOptions.powderCoatingLX) || 0,
    blackAnoLX: parseInt(manOptions.blackAnoLX) || 0,
    JLTowerLX: parseInt(manOptions.JLTowerLX) || 0,
    premiumJLLX: parseInt(manOptions.premiumJLLX) || 0,
    premAudioPkg: parseInt(manOptions.premAudioPkg) || 0,
    fibreglassFrontXT: manOptions.fibreglassFrontXT,
    JlPremiumAudio: parseInt(manOptions.JlPremiumAudio) || 0,
    JLPremiumxt: parseInt(manOptions.JLPremiumxt) || 0,
    XTPremiumcolor: parseInt(manOptions.XTPremiumcolor) || 0,
    dts: parseInt(manOptions.dts) || 0,
    verado: parseInt(manOptions.verado) || 0,
    battery: parseInt(manOptions.battery) || 0,
    gps: parseInt(manOptions.gps) || 0,
    saltwaterPkg: parseInt(manOptions.saltwaterPkg) || 0,
    propeller: parseInt(manOptions.propeller) || 0,

    baseInst: parseInt(manOptions.baseInst) || 0,
    cupHolder: parseInt(manOptions.cupHolder) || 0,
    multiHolder: parseInt(manOptions.multiHolder) || 0,
    cooler13: parseInt(manOptions.cooler13) || 0,
    coolerExtension: parseInt(manOptions.coolerExtension) || 0,
    coolerBag14: parseInt(manOptions.coolerBag14) || 0,
    singleHolder: parseInt(manOptions.singleHolder) || 0,
    stemwareHolder: parseInt(manOptions.stemwareHolder) || 0,
    cargoBox10: parseInt(manOptions.cargoBox10) || 0,
    cargoBox20: parseInt(manOptions.cargoBox20) || 0,
    cargoBox30: parseInt(manOptions.cargoBox30) || 0,
    rodHolder: parseInt(manOptions.rodHolder) || 0,
    batteryCharger: parseInt(manOptions.batteryCharger) || 0,
    bowFillerBench: parseInt(manOptions.bowFillerBench) || 0,
    portAquaLounger: parseInt(manOptions.portAquaLounger) || 0,
    skiTowMirror: parseInt(manOptions.skiTowMirror) || 0,
    boatEngineAndTrailerFees: parseFloat(modelData.boatEngineAndTrailerFees) || 0,
    engineFreight: parseFloat(modelData.engineFreight) || 0,
    enginePreRigPrice: parseFloat(modelData.enginePreRigPrice) || 0,
    engineRigging: parseFloat(modelData.engineRigging) || 0,
    nmma: parseFloat(modelData.nmma) || 0,
    trailer: parseFloat(modelData.trailer) || 0,
  })
  let modelSpecOpt =
    maniData.battery +
    maniData.propeller +
    maniData.gps +
    maniData.saltwaterPkg;

  let motorTotal =
    maniData.dts +
    maniData.verado;

  let accTotal =
    manOptions.baseInst +
    maniData.cupHolder +
    maniData.multiHolder +
    maniData.cooler13 +
    maniData.coolerExtension +
    maniData.coolerBag14 +
    maniData.singleHolder +
    maniData.stemwareHolder +
    maniData.cargoBox10 +
    maniData.cargoBox20 +
    maniData.cargoBox30 +
    maniData.rodHolder +
    maniData.batteryCharger +
    maniData.bowFillerBench +
    maniData.portAquaLounger +
    maniData.skiTowMirror;

  let optionsTotalMani =
    maniData.biminiCr +
    maniData.signature +
    maniData.select +
    maniData.tubeColor +
    maniData.selRFXPkgLX +
    maniData.selRFXWPkgLX +
    maniData.blkPkg +
    maniData.colMatchedFiberLX +
    maniData.powderCoatingLX +
    maniData.blackAnoLX +
    maniData.JLTowerLX +
    maniData.premiumJLLX +
    maniData.premAudioPkg +
    maniData.XTPremiumcolor +
    maniData.JlPremiumAudio +
    maniData.JLPremiumxt;

  let feesTotal =
    maniData.boatEngineAndTrailerFees +
    maniData.engineFreight +
    maniData.enginePreRigPrice +
    maniData.engineRigging +
    maniData.nmma +
    maniData.trailer;

  let maniTotal = modelSpecOpt + motorTotal + motorTotal + accTotal + optionsTotalMani + feesTotal;


  const manSwitchAccNames = {
    baseInst: 'Base Installer',
    cupHolder: 'Cup Holder',
    multiHolder: 'Multi Holder',
    cooler13: 'Cooler 13 L',
    stemwareHolder: 'Stemware Holder',
    coolerExtension: 'Cooler Extension',
    coolerBag14: 'Cooler Bag 14 L',
    singleHolder: 'Single Holder',
    cargoBox10: 'Cargo Box 10 L',
    cargoBox20: 'Cargo Box 20 L',
    cargoBox30: 'Cargo Box 30 L',
    rodHolder: 'Rod Holder',
    batteryCharger: 'Battery Charger',
    bowFillerBench: 'Bow Filler Bench',
    skiTowMirror: 'Ski Tow Mirror',
    portAquaLounger: 'Port Aqua Lounger',

  }


  const manSwitchAccArray = [
    'baseInst', 'cupHolder', 'multiHolder', 'cooler13', 'coolerExtension', 'coolerBag14', 'singleHolder', 'stemwareHolder', 'cargoBox10', 'cargoBox20', 'cargoBox30', 'rodHolder', 'batteryCharger', 'bowFillerBench', 'portAquaLounger', 'skiTowMirror',
  ]
  const manhMotorArray = [
    'dts', 'verado',
  ]
  const manEngineFeesArray = [
    'boatEngineAndTrailerFees', 'engineFreight', 'enginePreRigPrice', 'engineRigging', 'nmma',
  ]
  const maniOptionsNames = {
    biminiCr: 'Sport Bimini Cruise',
    intColor: 'Interior Color',
    signature: 'Signature Pkg',
    select: 'Select Pkg',
    blkPkg: 'Blackout Pkg',
    wallCol: 'Wall Color',
    wallGraphic: 'Wall Graphic',
    furnitureColor: 'Furniture Color',
    colorExplore: 'Interior Color',
    selRFXPkgLX: 'Select Pkg ',
    selRFXWPkgLX: 'Select Pkg',
    colMatchedFiberLX: 'Color Matched Fiberglass',
    powderCoatingLX: 'Powder Coating',
    blackAnoLX: 'Black Anodized',
    premiumJLLX: 'Premium JL Audio',
    JLTowerLX: 'JL Tower Speakers',
    wallGraphicAccentLX: 'Wall Graphic Accent',
    fibreGlassPodsLX: 'Fiberglass Pods',
    powderCoatLX: 'Powder Coating',
    flooringLX: 'Flooring',
    premAudioPkg: 'Premium Audio Pkg',
    XTPremiumcolor: 'Premium Color',
    JLPremiumxt: 'JL Premium Audio',
    JlPremiumAudio: 'JL Premium Audio',
    fibreglassFrontXT: 'Fiberglass Front',
    saltwaterPkg: 'Salt Water Pkg',
    tubeColor: 'Tube Color',
  }
  const maniOptionsArray = [
    'saltwaterPkg', 'biminiCr', 'signature', 'select', 'tubeColor', 'blkPkg', 'selRFXPkgLX', 'selRFXWPkgLX', 'colMatchedFiberLX', 'powderCoatingLX', 'blackAnoLX', 'JLTowerLX', 'premiumJLLX', 'premAudioPkg', 'fibreglassFrontXT', 'JlPremiumAudio', 'JLPremiumxt', 'XTPremiumcolor',
  ]
  return (
    <>

      <>
        {motorTotal > 0 && (
          <>
            <div className="mt-3">
              <h3 className="text-2xl font-thin">Motor</h3>
            </div>
            <hr className="solid" />
            <div className="flex flex-wrap justify-between mt-2 ">
              {manOptions.dts > 0 && (
                <>
                  <p className="basis-2/4 ">DTS</p>
                  <p className="flex basis-2/4 items-end justify-end  ">
                    ${manOptions.dts}
                  </p>
                </>
              )}
              {manOptions.verado > 0 && (
                <>
                  <p className="basis-2/4 ">Verado</p>
                  <p className="flex basis-2/4 items-end justify-end  ">
                    ${manOptions.verado}
                  </p>
                </>
              )}
              {modelData.nmma > 0 && (
                <>
                  <p className="basis-2/4 ">NMMA fee</p>
                  <p className="flex basis-2/4 items-end justify-end  ">
                    ${modelData.nmma}
                  </p>
                </>
              )}
              {manOptions.engineFreight > 0 && (
                <>
                  <p className="basis-2/4 ">
                    Engine Freight
                  </p>
                  <p className="flex basis-2/4 items-end justify-end  ">
                    ${manOptions.engineFreight}
                  </p>
                </>
              )}
              {manOptions.enginePreRigPrice > 0 && (
                <>
                  <p className="basis-2/4 ">
                    Engine Pre Rig Price
                  </p>
                  <p className="flex basis-2/4 items-end justify-end  ">
                    ${manOptions.enginePreRigPrice}
                  </p>
                </>
              )}
              {manOptions.engineRigging > 0 && (
                <>
                  <p className="basis-2/4 ">
                    Engine Rigging
                  </p>
                  <p className="flex basis-2/4 items-end justify-end  ">
                    ${manOptions.engineRigging}
                  </p>
                </>
              )}
              {modelData.boatEngineAndTrailerFees > 0 && (
                <>
                  <p className="basis-2/4 ">
                    Boat Engine and Trailer Fees
                  </p>
                  <p className="flex basis-2/4 items-end justify-end  ">
                    ${modelData.boatEngineAndTrailerFees}
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </>

      {maniOptionsArray.some((option) => manOptions[option] > 0) && (
        <>
          <div className="mt-3">
            <h3 className="text-2xl font-thin">
              Model Specfic Options
            </h3>
          </div>
          <hr className="solid" />
        </>
      )}
      {maniOptionsArray.map((option) => {
        if (manOptions[option] > 0) {
          const displayName = maniOptionsNames[option]
          return (
            <div key={option} className="flex justify-between mt-2" >
              <p className="">
                {displayName}
              </p>
              <p className="">
                ${manOptions[option]}
              </p>
            </div>
          );
        }
        return null;
      })}


      {modelSpecOpt !== null && (
        <>

          <div className="mt-3">
            <h3 className=" font-thin text-2xl ">
              Optional Equipment
            </h3>
          </div>
          <hr className="solid" />
          <div className="flex flex-wrap justify-between mt-2  ">
            {manOptions.battery !== null && (
              <>
                <p className="basis-2/4  ">Battery</p>
                <p className="flex basis-2/4 items-end justify-end  ">
                  ${manOptions.battery}
                </p>
              </>
            )}
            {manOptions.propeller !== null && (
              <>
                <p className="basis-2/4 ">Prop</p>
                <p className="flex basis-2/4 items-end justify-end  ">
                  ${manOptions.propeller}
                </p>
              </>
            )}
            {manOptions.gps !== null && (
              <>
                <p className="basis-2/4 ">GPS</p>
                <p className="flex basis-2/4 items-end justify-end  ">
                  ${manOptions.gps}
                </p>
              </>
            )}
            {manOptions.saltwaterPkg !== null && (
              <>
                <p className="basis-2/4 ">
                  Salt Water Package
                </p>
                <p className="flex basis-2/4 items-end justify-end  ">
                  ${manOptions.saltwaterPkg}
                </p>
              </>
            )}
          </div>
        </>
      )}

      {accTotal > 0 && (
        <>
          {manSwitchAccArray.some((option) => manOptions[option] > 0) && (
            <>
              <div className="mt-3">
                <h3 className="text-2xl font-thin">
                  Accessories
                </h3>
              </div>
              <hr className="solid" />
            </>
          )}
          {manSwitchAccArray.map((option) => {
            if (manOptions[option] > 0) {
              const displayName = manSwitchAccNames[option]
              return (
                <div key={option} className="flex justify-between mt-2" >
                  <p className="">
                    {displayName}
                  </p>
                  <p className="">
                    ${manOptions[option]}
                  </p>
                </div>
              );
            }
            return null; // To skip rendering if the option is not greater than zero
          })}
        </>
      )}
    </>

  )

}
