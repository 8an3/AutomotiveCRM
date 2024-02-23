import { useLoaderData } from "@remix-run/react";
import { dashboardLoader } from "../actions/dashboardCalls";

export let loader = dashboardLoader;

export function ClientDetailsFunction({ data, finance }) {
  const { dashBoardCustURL } = useLoaderData();

  let ClientDetails;

  // console.log(dashBoardCustURL, "checking to see if Ids are the same");

  if (dashBoardCustURL === "/dashboard/calls") {
    ClientDetails = [
      { name: "name", value: data.name, placeHolder: "Name" },
      { name: "lastName", value: data.lastName, placeHolder: "Last Name" },
      { name: "phone", value: data.phone, placeHolder: "Phone" },
      { name: "email", value: data.email, placeHolder: "Email" },
      { name: "address", value: data.address, placeHolder: "Address" },
      { name: "postal", value: data.postal, placeHolder: "Postal Code" },
      { name: "city", value: data.city, placeHolder: "City" },
      { name: "province", value: data.province, placeHolder: "Province" },
      { name: "postal", value: data.postal, placeHolder: "Postal Code" },
      { name: "dl", value: data.dl, placeHolder: "Driver License" },
    ];
    return ClientDetails;
  } else if (dashBoardCustURL === "/leads/sales") {
    ClientDetails = [
      { name: "firstName", value: data.firstName, placeHolder: "First Name" },
      { name: "lastName", value: data.lastName, placeHolder: "Last Name" },
      { name: "phone", value: data.phone, placeHolder: "Phone" },
      { name: "email", value: data.email, placeHolder: "Email" },
      { name: "address", value: data.address, placeHolder: "Address" },
      { name: "postal", value: data.postal, placeHolder: "Postal Code" },
      { name: "city", value: data.city, placeHolder: "City" },
      { name: "province", value: data.province, placeHolder: "Province" },
      { name: "postal", value: data.postal, placeHolder: "Postal Code" },
      { name: "dl", value: data.dl, placeHolder: "Driver License" },
    ];
    return ClientDetails;
  }
  else if (dashBoardCustURL === "/leads/finance") {
    ClientDetails = [
      { name: "firstName", value: data.firstName, placeHolder: "First Name" },
      { name: "lastName", value: data.lastName, placeHolder: "Last Name" },
      { name: "phone", value: data.phone, placeHolder: "Phone" },
      { name: "email", value: data.email, placeHolder: "Email" },
      { name: "address", value: data.address, placeHolder: "Address" },
      { name: "postal", value: data.postal, placeHolder: "Postal Code" },
      { name: "city", value: data.city, placeHolder: "City" },
      { name: "province", value: data.province, placeHolder: "Province" },
      { name: "postal", value: data.postal, placeHolder: "Postal Code" },
      { name: "dl", value: data.dl, placeHolder: "Driver License" },
    ];
    return ClientDetails;
  } else {
    ClientDetails = [
      {
        name: "firstName",
        value: finance.firstName,
        placeHolder: "First Name",
      },
      { name: "lastName", value: finance.lastName, placeHolder: "Last Name" },
      { name: "phone", value: finance.phone, placeHolder: "Phone" },
      { name: "email", value: finance.email, placeHolder: "Email" },
      { name: "address", value: finance.address, placeHolder: "Address" },
      { name: "postal", value: finance.postal, placeHolder: "Postal Code" },
      { name: "city", value: finance.city, placeHolder: "City" },
      { name: "province", value: finance.province, placeHolder: "Province" },
      { name: "postal", value: finance.postal, placeHolder: "Postal Code" },
      { name: "dl", value: finance.dl, placeHolder: "Driver License" },
    ];
    return ClientDetails;
  }
}
