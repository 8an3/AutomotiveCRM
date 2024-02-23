import { useLoaderData } from "@remix-run/react";
import { dashboardLoader } from "../actions/dashboardAL.tsx.bx";

export let loader = dashboardLoader;

let desiredPaymentsMap;

export function ClientDetailsFunction({ data, finance }) {
  const { dashBoardCustURL } = useLoaderData();

  //  console.log(dashBoardCustURL, "checking to see if Ids are the same");

  if (dashBoardCustURL === "/dashboard/calls") {
    desiredPaymentsMap = {
      "Standard Payment": [
        { label: "Total", value: data.total },
        { label: "After Tax", value: data.onTax },
      ],
      "Payments with Options": [
        { label: "Total", value: data.totalWithOptions },
        { label: "After Tax", value: data.qcTax },
      ],
      "No Tax Payment": [{ label: "After Tax", value: data.native }],
      "No Tax Payment with Options": [
        { label: "Total", value: data.totalWithOptions },
        { label: "After Tax", value: data.totalWithOptions },
      ],
      "Custom Tax Payment": [
        { label: "Total", value: data.total },
        { label: "After Tax", value: data.otherTax },
      ],
      "Custom Tax Payment with Options": [
        { label: "Total", value: data.totalWithOptions },
        { label: "After Tax", value: data.otherTaxWithOptions },
      ],
    };

    const paymentDetails = desiredPaymentsMap[data.desiredPayments];

    const PaymentDetailsComponents = paymentDetails.map((detail, index) => {
      return (
        <div key={index} className="mt-2 flex flex-wrap justify-between">
          <p className="mt-2 basis-2/4 text-sm font-thin">{detail.label}</p>
          <p className="flex basis-2/4 items-end justify-end text-right text-sm font-thin">
            {detail.value}
          </p>
        </div>
      );
    });

    return PaymentDetailsComponents;
  } else {
    desiredPaymentsMap = {
      "Standard Payment": [
        { label: "Total", value: finance.total },
        { label: "After Tax", value: finance.onTax },
      ],
      "Payments with Options": [
        { label: "Total", value: finance.totalWithOptions },
        { label: "After Tax", value: finance.qcTax },
      ],
      "No Tax Payment": [{ label: "After Tax", value: finance.native }],
      "No Tax Payment with Options": [
        { label: "Total", value: finance.totalWithOptions },
        { label: "After Tax", value: finance.totalWithOptions },
      ],
      "Custom Tax Payment": [
        { label: "Total", value: finance.total },
        { label: "After Tax", value: finance.otherTax },
      ],
      "Custom Tax Payment with Options": [
        { label: "Total", value: finance.totalWithOptions },
        { label: "After Tax", value: finance.otherTaxWithOptions },
      ],
    };

    const paymentDetails = desiredPaymentsMap[finance.desiredPayments];

    const PaymentDetailsComponents = paymentDetails.map((detail, index) => {
      return (
        <div key={index} className="mt-2 flex flex-wrap justify-between">
          <p className="mt-2 basis-2/4 text-sm font-thin">{detail.label}</p>
          <p className="flex basis-2/4 items-end justify-end text-right text-sm font-thin">
            {detail.value}
          </p>
        </div>
      );
    });

    return PaymentDetailsComponents;
  }
}

export default ClientDetailsFunction;
