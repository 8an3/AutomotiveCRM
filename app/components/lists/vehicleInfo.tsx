import { useLoaderData } from "@remix-run/react";
import { dashboardLoader } from "../actions/dashboardCalls";

export let loader = dashboardLoader;

export function VehichleDetailsFunction({ data, finance }) {
  const { dashBoardCustURL } = useLoaderData();

  let VehichleDetails;

  // console.log(dashBoardCustURL, "checking to see if Ids are the same");

  if (dashBoardCustURL === "/dashboard/calls") {
    VehichleDetails = [
      { name: "brand", value: data.brand, placeHolder: "Brand", readOnly: true },
      { name: "model", value: data.model, placeHolder: "Model", readOnly: true },
      { name: "year", value: data.year, placeHolder: "Year", readOnly: false },
      { name: "trim", value: data.trim, placeHolder: "Trim", readOnly: false },
      { name: "color", value: data.color, placeHolder: "Color", readOnly: false },
      { name: "vin", value: data.vin, placeHolder: "Vin", readOnly: false },
      { name: "stockNum", value: data.stockNum, placeHolder: "Stock Number", readOnly: false },
      { name: "modelCode", value: data.modelCode, placeHolder: "Model Code", readOnly: false },
    ];
    return VehichleDetails;
  }
  else if (dashBoardCustURL === "/dashboard/activix") {
    VehichleDetails = [
      { name: "brand", value: data.brand, placeHolder: "Brand", readOnly: true },
      { name: "model", value: data.model, placeHolder: "Model", readOnly: true },
      { name: "year", value: data.year, placeHolder: "Year", readOnly: false },
      { name: "trim", value: data.trim, placeHolder: "Trim", readOnly: false },
      { name: "color", value: data.color, placeHolder: "Color", readOnly: false },
      { name: "vin", value: data.vin, placeHolder: "Vin", readOnly: false },
      { name: "stockNum", value: data.stockNum, placeHolder: "Stock Number", readOnly: false },
      { name: "modelCode", value: data.modelCode, placeHolder: "Model Code", readOnly: false },
    ];
    return VehichleDetails;
  } else {
    VehichleDetails = [
      { name: "brand", value: finance.brand, placeHolder: "Brand", readOnly: true },
      { name: "model", value: finance.model, placeHolder: "Model", readOnly: true },
      { name: "year", value: finance.year, placeHolder: "Year", readOnly: false },
      { name: "trim", value: finance.trim, placeHolder: "Trim", readOnly: false },
      { name: "color", value: finance.color, placeHolder: "Color", readOnly: false },
      { name: "vin", value: finance.vin, placeHolder: "Vin", readOnly: false },
      {
        name: "stockNum",
        value: finance.stockNum,
        placeHolder: "Stock Number", readOnly: false
      },
      {
        name: "modelCode",
        value: finance.modelCode,
        placeHolder: "Model Code", readOnly: false
      },
    ];
    return VehichleDetails;
  }
}
