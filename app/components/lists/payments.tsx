import { useLoaderData } from "@remix-run/react";
import { dashboardLoader } from "../actions/dashboardAL.tsx.bx";

export let loader = dashboardLoader;

export function PaymentDetailsFunction({ data, finance }) {
  const { dashBoardCustURL } = useLoaderData();

  let PaymentDetails;
  let PaymentsMap;
  // console.log(dashBoardCustURL, "checking to see if Ids are the same");

  if (dashBoardCustURL === "/dashboard/calls") {
    PaymentDetails = [
      { label: "Deposit", value: data.deposit },
      { label: "Term", value: data.months },
      { label: "Rate", value: `${data.iRate}%` },
    ];
    PaymentsMap = {
      "Standard Payment": [
        { label: "Monthly", value: data.on60 },
        { label: "Bi-Weekly", value: data.biweekly },
        { label: "Weekly", value: data.weekly },
      ],
      "Payments with Options": [
        { label: "Monthly", value: data.qc60 },
        { label: "Bi-Weekly", value: data.biweeklyqc },
        { label: "Weekly", value: data.weeklyqc },
      ],
      "No Tax Payment": [
        { label: "Monthly", value: data.nat60 },
        { label: "Bi-Weekly", value: data.biweeklNat },
        { label: "Weekly", value: data.weeklylNat },
      ],
      "No Tax Payment with Options": [
        { label: "Monthly", value: data.oth60 },
        { label: "Bi-Weekly", value: data.biweekOth },
        { label: "Weekly", value: data.weeklyOth },
      ],
      "Custom Tax Payment": [
        { label: "Monthly", value: data.nat60WOptions },
        { label: "Bi-Weekly", value: data.biweeklNatWOptions },
        { label: "Weekly", value: data.weeklylNatWOptions },
      ],
      "Custom Tax Payment with Options": [
        { label: "Monthly", value: data.oth60WOptions },
        { label: "Bi-Weekly", value: data.biweekOthWOptions },
        { label: "Weekly", value: data.weeklyOthWOptions },
      ],
    };

    const PaymentDetailsComponents = PaymentDetails.map((detail, index) => (
      <div key={index} className="mt-2 flex flex-wrap justify-between">
        <p className="mt-2 basis-2/4 text-sm font-thin">{detail.label}</p>
        <p className="flex basis-2/4 items-end justify-end text-right text-sm font-thin">
          {detail.value}
        </p>
      </div>
    ));

    // Iterate over PaymentsMap and render them
    const PaymentsMapComponents = Object.entries(PaymentsMap).map(
      ([paymentType, paymentValues]) => (
        <div key={paymentType} className="mt-2">
          <p className="text-sm font-semibold">{paymentType}</p>
          {paymentValues.map((paymentDetail, index) => (
            <div key={index} className="flex flex-wrap justify-between">
              <p className="mt-2 basis-2/4 text-sm font-thin">
                {paymentDetail.label}
              </p>
              <p className="flex basis-2/4 items-end justify-end text-right text-sm font-thin">
                {paymentDetail.value}
              </p>
            </div>
          ))}
        </div>
      )
    );

    return (
      <>
        {/* Display PaymentDetails */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Payment Details</h3>
          {PaymentDetailsComponents}
        </div>

        {/* Display PaymentsMap */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Payments Map</h3>
          {PaymentsMapComponents}
        </div>
      </>
    );
  } else {
    PaymentDetails = [
      { label: "Deposit", value: finance.deposit },
      { label: "Term", value: finance.months },
      { label: "Rate", value: `${finance.iRate}%` },
    ];
    PaymentsMap = {
      "Standard Payment": [
        { label: "Monthly", value: finance.on60 },
        { label: "Bi-Weekly", value: finance.biweekly },
        { label: "Weekly", value: finance.weekly },
      ],
      "Payments with Options": [
        { label: "Monthly", value: finance.qc60 },
        { label: "Bi-Weekly", value: finance.biweeklyqc },
        { label: "Weekly", value: finance.weeklyqc },
      ],
      "No Tax Payment": [
        { label: "Monthly", value: finance.nat60 },
        { label: "Bi-Weekly", value: finance.biweeklNat },
        { label: "Weekly", value: finance.weeklylNat },
      ],
      "No Tax Payment with Options": [
        { label: "Monthly", value: finance.oth60 },
        { label: "Bi-Weekly", value: finance.biweekOth },
        { label: "Weekly", value: finance.weeklyOth },
      ],
      "Custom Tax Payment": [
        { label: "Monthly", value: finance.nat60WOptions },
        { label: "Bi-Weekly", value: finance.biweeklNatWOptions },
        { label: "Weekly", value: finance.weeklylNatWOptions },
      ],
      "Custom Tax Payment with Options": [
        { label: "Monthly", value: finance.oth60WOptions },
        { label: "Bi-Weekly", value: finance.biweekOthWOptions },
        { label: "Weekly", value: finance.weeklyOthWOptions },
      ],
    };

    const PaymentDetailsComponents = PaymentDetails.map((detail, index) => (
      <div key={index} className="mt-2 flex flex-wrap justify-between">
        <p className="mt-2 basis-2/4 text-sm font-thin">{detail.label}</p>
        <p className="flex basis-2/4 items-end justify-end text-right text-sm font-thin">
          {detail.value}
        </p>
      </div>
    ));

    // Iterate over PaymentsMap and render them
    const PaymentsMapComponents = Object.entries(PaymentsMap).map(
      ([paymentType, paymentValues]) => (
        <div key={paymentType} className="mt-2">
          <p className="text-sm font-semibold">{paymentType}</p>
          {paymentValues.map((paymentDetail, index) => (
            <div key={index} className="flex flex-wrap justify-between">
              <p className="mt-2 basis-2/4 text-sm font-thin">
                {paymentDetail.label}
              </p>
              <p className="flex basis-2/4 items-end justify-end text-right text-sm font-thin">
                {paymentDetail.value}
              </p>
            </div>
          ))}
        </div>
      )
    );

    return (
      <>
        {/* Display PaymentDetails */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Payment Details</h3>
          {PaymentDetailsComponents}
        </div>

        {/* Display PaymentsMap */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Payments Map</h3>
          {PaymentsMapComponents}
        </div>
      </>
    );
  }
}
