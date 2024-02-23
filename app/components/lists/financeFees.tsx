import { useLoaderData } from "@remix-run/react";
import { dashboardLoader } from "../actions/dashboardCalls";

export let loader = dashboardLoader;

export function DataFeesFunction({ data, finance }) {
  const { dashBoardCustURL } = useLoaderData();

  let dataFees;
  // console.log(dashBoardCustURL, "checking to see if Ids are the same");
  if (dashBoardCustURL === "/dashboard/calls") {
    const totalLabour = data.labour * data.userLabour;

    dataFees = [
      { name: "MSRP", value: data.msrp },
      { name: "Freight", value: data.freight },
      { name: "Admin", value: data.admin },
      { name: "PDI", value: data.pdi },
      { name: "Commodity", value: data.commodity },
      { name: "Delivery", value: data.deliveryCharge },
      { name: "Government Fees", value: data.userGovern },
      { name: "Air Tax", value: data.userAirTax },
      { name: "Tire Tax", value: data.userTireTax },
      { name: "Finance Fee", value: data.userdata },
      { name: "Destination Charge", value: data.destinationCharge },
      { name: "Market Adjustment", value: data.userMarketAdj },
      { name: "OMVIC / Gov Fee", value: data.userOMVIC },
      { name: "Demonstration Fee", value: data.userDemo },
      { name: "Other Accessories", value: data.accessories },
      { name: "Labour", value: totalLabour },
      { name: "Discount %", value: data.discountPer },
      { name: "Discount", value: data.discount },
      { name: "Trade Value", value: data.tradeValue },
    ];

    return dataFees;
  } else if (dashBoardCustURL === "/dashboard/activix") {
    const totalLabour = data.labour * data.userLabour;

    dataFees = [
      { name: "MSRP", value: data.msrp },
      { name: "Freight", value: data.freight },
      { name: "Admin", value: data.admin },
      { name: "PDI", value: data.pdi },
      { name: "Commodity", value: data.commodity },
      { name: "Delivery", value: data.deliveryCharge },
      { name: "Government Fees", value: data.userGovern },
      { name: "Air Tax", value: data.userAirTax },
      { name: "Tire Tax", value: data.userTireTax },
      { name: "Finance Fee", value: data.userdata },
      { name: "Destination Charge", value: data.destinationCharge },
      { name: "Market Adjustment", value: data.userMarketAdj },
      { name: "OMVIC / Gov Fee", value: data.userOMVIC },
      { name: "Demonstration Fee", value: data.userDemo },
      { name: "Other Accessories", value: data.accessories },
      { name: "Labour", value: totalLabour },
      { name: "Discount %", value: data.discountPer },
      { name: "Discount", value: data.discount },
      { name: "Trade Value", value: data.tradeValue },
    ];

    return dataFees;
  } else {
    const totalLabour = finance.labour * finance.userLabour;

    dataFees = [
      { name: "MSRP", value: finance.msrp },
      { name: "Freight", value: finance.freight },
      { name: "Admin", value: finance.admin },
      { name: "PDI", value: finance.pdi },
      { name: "Commodity", value: finance.commodity },
      { name: "Delivery", value: finance.deliveryCharge },
      { name: "Government Fees", value: finance.userGovern },
      { name: "Air Tax", value: finance.userAirTax },
      { name: "Tire Tax", value: finance.userTireTax },
      { name: "Finance Fee", value: finance.userdata },
      { name: "Destination Charge", value: finance.destinationCharge },
      { name: "Market Adjustment", value: finance.userMarketAdj },
      { name: "OMVIC / Gov Fee", value: finance.userOMVIC },
      { name: "Demonstration Fee", value: finance.userDemo },
      { name: "Other Accessories", value: finance.accessories },
      { name: "Labour", value: totalLabour },
      { name: "Discount %", value: finance.discountPer },
      { name: "Discount", value: finance.discount },
      { name: "Trade Value", value: finance.tradeValue },
    ];
    return dataFees;
  }
}
