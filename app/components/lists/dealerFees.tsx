import { useLoaderData } from "@remix-run/react";
import { dashboardLoader } from "../actions/dashboardCalls";

export let loader = dashboardLoader;

export function DealerfeesFunction({ deFees, request, url }) {
  // const { dashBoardCustURL } = useLoaderData();
  let Dealerfees;
  // const urlSegmentsDashboard = new URL(request.url).pathname.split('/');
  //const url = urlSegmentsDashboard.slice(0, 3).join('/');
  console.log(url)
  if (url === "/welcome/dealerFees") {
    Dealerfees = [
      { name: "userAdmin", value: '0', placeholder: "Admin" },
      { name: "userFreight", value: '0', placeholder: "Freight" },
      { name: "userCommodity", value: '0', placeholder: "Commodity" },
      { name: "userPDI", value: '0', placeholder: "PDI" },
      { name: "userAirTax", value: '0', placeholder: "Air Tax" },
      { name: "userTireTax", value: '0', placeholder: "Tire Tax" },
      { name: "userGovern", value: '0', placeholder: "Government Fees" },
      { name: "userFinance", value: '0', placeholder: "Finance Fees" },
      { name: "destinationCharge", value: '0', placeholder: "Destination Charge" },
      { name: "userGasOnDel", value: '0', placeholder: "Gas On Delivery" },
      { name: "userMarketAdj", value: '0', placeholder: "Market Adjustment" },
      { name: "userDemo", value: '0', placeholder: "Demonstratration Fee" },
      { name: "userOMVIC", value: '60', placeholder: "OMVIC or Other" },
    ];
    return Dealerfees;
  } else if (url === "/dashboard/activix") {
    Dealerfees = [
      { name: "userAdmin", value: '', placeholder: "Admin" },
      { name: "userFreight", value: '', placeholder: "Freight" },
      { name: "userCommodity", value: '', placeholder: "Commodity" },
      { name: "userPDI", value: '', placeholder: "PDI" },
      { name: "userAirTax", value: '', placeholder: "Air Tax" },
      { name: "userTireTax", value: '', placeholder: "Tire Tax" },
      { name: "userGovern", value: '', placeholder: "Government Fees" },
      { name: "userFinance", value: '', placeholder: "Finance Fees" },
      { name: "destinationCharge", value: '', placeholder: "Destination Charge" },
      { name: "userGasOnDel", value: '', placeholder: "Gas On Delivery" },
      { name: "userMarketAdj", value: '', placeholder: "Market Adjustment" },
      { name: "userDemo", value: '', placeholder: "Demonstratration Fee" },
      { name: "userOMVIC", value: '', placeholder: "OMVIC or Other" },
    ];
    return Dealerfees;
  } else {
    Dealerfees = [
      { name: "userAdmin", value: deFees.userAdmin, placeholder: "Admin" },
      { name: "userFreight", value: deFees.userFreight, placeholder: "Freight" },
      { name: "userCommodity", value: deFees.userCommodity, placeholder: "Commodity" },
      { name: "userPDI", value: deFees.userPDI, placeholder: "PDI" },
      { name: "userAirTax", value: deFees.userAirTax, placeholder: "Air Tax" },
      { name: "userTireTax", value: deFees.userTireTax, placeholder: "Tire Tax" },
      { name: "userGovern", value: deFees.userGovern, placeholder: "Government Fees" },
      { name: "userFinance", value: deFees.userFinance, placeholder: "Finance Fees" },
      { name: "destinationCharge", value: deFees.destinationCharge, placeholder: "Destination Charge" },
      { name: "userGasOnDel", value: deFees.userGasOnDel, placeholder: "Gas On Delivery" },
      { name: "userMarketAdj", value: deFees.userMarketAdj, placeholder: "Market Adjustment" },
      { name: "userDemo", value: deFees.userDemo, placeholder: "Demonstratration Fee" },
      { name: "userOMVIC", value: deFees.userOMVIC, placeholder: "OMVIC or Other" },
    ];
    return Dealerfees;
  }
}
