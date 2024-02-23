function DealerfeesFunction({ deFees, request }) {
  const { dashBoardCustURL } = useLoaderData();
  let Dealerfees;
  const urlSegmentsDashboard = new URL(request.url).pathname.split("/");
  const url = urlSegmentsDashboard.slice(0, 3).join("/");
  console.log(url);
  if (url === "/welcome/dealerFees") {
    Dealerfees = [
      { name: "userAdmin", value: "0", placeholder: "Admin" },
      { name: "userFreight", value: "0", placeholder: "Freight" },
      { name: "userCommodity", value: "0", placeholder: "Commodity" },
      { name: "userPDI", value: "0", placeholder: "PDI" },
      { name: "userAirTax", value: "0", placeholder: "Air Tax" },
      { name: "userTireTax", value: "0", placeholder: "Tire Tax" },
      { name: "userGovern", value: "0", placeholder: "Government Fees" },
      { name: "userFinance", value: "0", placeholder: "Finance Fees" },
      {
        name: "destinationCharge",
        value: "0",
        placeholder: "Destination Charge",
      },
      { name: "userGasOnDel", value: "0", placeholder: "Gas On Delivery" },
      { name: "userMarketAdj", value: "0", placeholder: "Market Adjustment" },
      { name: "userDemo", value: "0", placeholder: "Demonstratration Fee" },
      { name: "userOMVIC", value: "60", placeholder: "OMVIC or Other" },
    ];
  }
  return Dealerfees;
}
