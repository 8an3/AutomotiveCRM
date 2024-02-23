import { useLoaderData } from "@remix-run/react";
import { dashboardLoader } from "../actions/dashboardAL.tsx.bx";

export let loader = dashboardLoader;

export function TradeDetailsFunction({ data, finance }) {
  const { dashBoardCustURL } = useLoaderData();
  let TradeDetails;

  // console.log(dashBoardCustURL, "checking to see if Ids are the same");

  if (dashBoardCustURL === "/dashboard/calls") {
    TradeDetails = [
      { name: "tradeMake", value: data.tradeMake, placeHolder: "Brand" },
      { name: "tradeDesc", value: data.tradeDesc, placeHolder: "Model" },
      { name: "tradeYear", value: data.tradeYear, placeHolder: "Year" },
      { name: "tradeTrim", value: data.tradeTrim, placeHolder: "Trim" },
      { name: "tradeColor", value: data.tradeColor, placeHolder: "Color" },
      { name: "tradeVin", value: data.tradeVin, placeHolder: "VIN" },
      {
        name: "tradeValue",
        value: data.tradeValue,
        placeHolder: "Trade Value",
      },
      {
        name: "tradeRepairs",
        value: data.tradeRepairs,
        placeHolder: "Trade Repairs",
      },
      { name: "seenTrade", value: data.seenTrade, placeHolder: "Seen Trade?" },
    ];
    return TradeDetails;
  } else {
    TradeDetails = [
      { name: "tradeMake", value: finance.tradeMake, placeHolder: "Brand" },
      { name: "tradeDesc", value: finance.tradeDesc, placeHolder: "Model" },
      { name: "tradeYear", value: finance.tradeYear, placeHolder: "Year" },
      { name: "tradeTrim", value: finance.tradeTrim, placeHolder: "Trim" },
      { name: "tradeColor", value: finance.tradeColor, placeHolder: "Color" },
      { name: "tradeVin", value: finance.tradeVin, placeHolder: "VIN" },
      {
        name: "tradeValue",
        value: finance.tradeValue,
        placeHolder: "Trade Value",
      },
      {
        name: "tradeRepairs",
        value: finance.tradeRepairs,
        placeHolder: "Trade Repairs",
      },
      {
        name: "seenTrade",
        value: finance.seenTrade,
        placeHolder: "Seen Trade?",
      },
    ];
    return TradeDetails;
  }
}
