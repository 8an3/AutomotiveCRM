import { useLoaderData } from "@remix-run/react";
import { dashboardLoader } from "../actions/dashboardCalls"

export let loader = dashboardLoader;

export function FinanceOptionsFunction({ deFees, url, data, finance }) {
  let value;
  if (url === "/dashboard/activix") {
    finance
  } else if (url === "/dashboard/calls") {
    value = data
  } else {
    value = deFees
  }
  console.log(value, "finance")

  const FinanceOptions = [
    { name: "userExtWarr", value: deFees.userExtWarr, placeholder: 'Extended Warranty' },
    { name: "userLoanProt", value: deFees.userLoanProt, placeholder: 'Loan Protection' },
    { name: "userGap", value: deFees.userGap, placeholder: 'Gap Protection' },
    { name: "userTireandRim", value: deFees.userTireandRim, placeholder: 'Tire and Rim' },
    { name: "vinE", value: deFees.vinE, placeholder: 'Vin Etching' },
    { name: "rustProofing", value: deFees.rustProofing, placeholder: 'Under Coating' },
    { name: "userServicespkg", value: deFees.userServicespkg, placeholder: 'Service Package' },
    { name: "lifeDisability", value: deFees.lifeDisability, placeholder: 'Life and Disability' },
    { name: "userOther", value: deFees, placeholder: 'Other data Package' },
  ];
  return FinanceOptions;
}
