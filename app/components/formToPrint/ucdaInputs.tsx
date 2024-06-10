import * as Dialog from "@radix-ui/react-dialog";
import { Input, Button, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, TextArea, } from "~/components/ui/index";
import { useLoaderData, Form, useFetcher, useLocation } from "@remix-run/react";
import { PhoneOutcome, MenuScale, Mail, MessageText, User, ArrowDown, Calendar as CalendarIcon, WebWindowClose, } from "iconoir-react";
import { dashboardLoader } from "~/components/actions/dashboardCalls";
import { response } from "express";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import React, { useEffect, useRef, useState } from 'react';
import * as Toast from "@radix-ui/react-toast";
import { Badge } from "~/components/ui/badge";

export default function UcdaInputs() {
  const fetcher = useFetcher();

  const [formData, setFormData] = useState({
    seenOwnership: 'X',
    originalOwner: 'X',
    vinChecked: 'X',
    orignialVinPlate: 'X',
    registeredLien: 'X',
    totalLoss: '',
    theftRecovery: '',
    manuWarrCancelled: '',
    outOfProv: '',
    usVehicle: '',
    dailyRental: '',
    fireDmg: '',
    waterDmg: '',
    policeCruiser: '',
    paintedBodyPanels: '',
    absInoperable: '',
    polutionInoperable: '',
    repairsTransmission: '',
    repairsSuspSubframe: '',
    repairsFuelSystem: '',
    repairsPowerTrain: '',
    repairsECU: '',
    repairsElectrical: '',
    repairsStructuralFrameDamage: '',
    alteredOrRepaired: '',
    decalsBadges: '',
    dmgExcess3000: '',
  });
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild >
        <p className="cursor-pointer" >
          <Badge className='button  shadow bg-primary transform -translate-y-[1px]'  >
            UCDA
          </Badge>
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[400px] w-[1200px]  translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            UCDA Form
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
          </Dialog.Description>
          <fetcher.Form method="post">
            <div className="flex  flex-row mt-3 space-between">
              {/* Content for the first column */}
              <div className="w-1/3 p-2 mx-auto grid grid-cols-1 ">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id="seenOwnership"
                    name="seenOwnership"
                    defaultChecked={formData.seenOwnership === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Seen Ownership</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="originalOwner"
                    defaultChecked={formData.originalOwner === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Original Owner</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="vinChecked"
                    defaultChecked={formData.vinChecked === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Vin Checked</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="orignialVinPlate"
                    defaultChecked={formData.orignialVinPlate === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Orignial Vin Plate</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="registeredLien"
                    defaultChecked={formData.registeredLien === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Registered Lien</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="totalLoss"
                    defaultChecked={formData.totalLoss === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Total Loss</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="theftRecovery"
                    defaultChecked={formData.theftRecovery === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Theft Recovery</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="manuWarrCancelled"
                    defaultChecked={formData.manuWarrCancelled === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">OEM Warranty Cancelled</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="outOfProv"
                    defaultChecked={formData.outOfProv === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Out Of Prov</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="usVehicle"
                    defaultChecked={formData.usVehicle === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">US Vehicle</span>
                </label>

              </div>
              {/* Content for the second column */}
              <div className="w-1/3 p-3 mx-auto grid grid-cols-1">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="dailyRental"
                    defaultChecked={formData.dailyRental === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Daily Rental</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="fireDmg"
                    defaultChecked={formData.fireDmg === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Fire Dmg</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="waterDmg"
                    defaultChecked={formData.waterDmg === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Water Dmg</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="policeCruiser"
                    defaultChecked={formData.policeCruiser === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Police Cruiser</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="paintedBodyPanels"
                    defaultChecked={formData.paintedBodyPanels === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Painted Body Panels or Replaced</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="absInoperable"
                    defaultChecked={formData.absInoperable === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">ABS Inoperable</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="polutionInoperable"
                    defaultChecked={formData.polutionInoperable === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Polution Control Inoperable</span>
                </label>
              </div>
              {/* Content for the first column */}
              <div className="w-1/3 p-3 mx-auto grid grid-cols-1">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="repairsEngine"
                    defaultChecked={formData.repairsEngine === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Engine</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="repairsSuspSubframe"
                    defaultChecked={formData.repairsSuspSubframe === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Suspension / Subframe</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="repairsTransmission"
                    defaultChecked={formData.repairsTransmission === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Transmission Dmg</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="repairsFuelSystem"
                    defaultChecked={formData.repairsFuelSystem === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Fuel System</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="repairsPowerTrain"
                    defaultChecked={formData.repairsPowerTrain === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Power Train Dmg</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="repairsECU"
                    defaultChecked={formData.repairsECU === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">ECU Dmg</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="repairsElectrical"
                    defaultChecked={formData.repairsElectrical === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Electrical Dmg</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="repairsStructuralFrameDamage"
                    defaultChecked={formData.repairsStructuralFrameDamage === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Structural or Frame Damage</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="alteredOrRepaired"
                    defaultChecked={formData.alteredOrRepaired === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Altered Or Repaired</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="dmgExcess3000"
                    defaultChecked={formData.dmgExcess3000 === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Dmg Excess of $3000</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="decalsBadges"
                    defaultChecked={formData.decalsBadges === 'X'}
                    className="form-checkbox mr-2 checked:bg-gray-500"
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      const newValue = checked ? 'X' : ''; // Set to 'X' if checked, empty string if unchecked
                      setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                    }}
                  />
                  <span className="ml-2 text-sm">Decals or Badges Changed</span>
                </label>
              </div>
            </div>

            <div className="mt-[25px] flex justify-end">
              <Dialog.Close>
                <button name='emailType' value='fullCustom' type='submit' className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                  Send
                </button>
              </Dialog.Close>

            </div>
          </fetcher.Form >
          <Dialog.Close asChild>
            <button
              name='intent'
              value='UCDA'
              className=" hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <WebWindowClose />
            </button>
          </Dialog.Close>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
