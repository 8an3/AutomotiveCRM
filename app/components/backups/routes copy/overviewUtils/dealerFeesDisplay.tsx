
export default function DealerFeesDisplay({ finance, deFees }) {
  const total =
    deFees.userAirTax +
    deFees.userTireTax +
    deFees.userGovern +
    deFees.userAirTax +
    deFees.userFinance +
    deFees.destinationCharge +
    deFees.userGasOnDel +
    deFees.userMarketAdj +
    deFees.userDemo +
    deFees.userOMVIC;
  return (
    <>
      {total > 0 && (
        <>
          <div className="mt-3">
            <h3 className="text-2xl ">Fees</h3>
          </div>
          <hr className="solid" />
          <div className="flex flex-wrap justify-between  ">
            {deFees.userAirTax > 0 && (
              <>
                <p className="basis-2/4  mt-2">Air Tax</p>
                <p className="flex basis-2/4 items-end justify-end  ">
                  ${deFees.userAirTax}
                </p>
              </>
            )}
            {deFees.userTireTax > 0 && (
              <>
                <p className="basis-2/4  mt-2">Tire Tax</p>
                <p className="flex basis-2/4 items-end justify-end  ">
                  ${deFees.userTireTax}
                </p>
              </>
            )}
            {deFees.userGovern > 0 && (
              <>
                <p className="basis-2/4  mt-2">Government Fees</p>
                <p className="flex basis-2/4 items-end justify-end  ">
                  ${deFees.userGovern}
                </p>
              </>
            )}
            {deFees.userFinance > 0 && (
              <>
                <p className="basis-2/4  mt-2">Finance Fees</p>
                <p className="flex basis-2/4 items-end justify-end  ">
                  ${deFees.userFinance}
                </p>
              </>
            )}
            {deFees.destinationCharge > 0 && (
              <>
                <p className="basis-2/4  mt-2">Destination Charge</p>
                <p className="flex basis-2/4 items-end justify-end  ">
                  ${deFees.destinationCharge}
                </p>
              </>
            )}
            {deFees.userGasOnDel > 0 && (
              <>
                <p className="basis-2/4  mt-2">Gas On Delivery</p>
                <p className="flex basis-2/4 items-end justify-end  ">
                  ${deFees.userGasOnDel}
                </p>
              </>
            )}
            {deFees.userMarketAdj > 0 && (
              <>
                <p className="basis-2/4  mt-2">Market Adjustment</p>
                <p className="flex basis-2/4 items-end justify-end  ">
                  ${deFees.userMarketAdj}
                </p>
              </>
            )}
            {deFees.userDemo > 0 && (
              <>
                <p className="basis-2/4  mt-2">
                  Demonstrate features or walkaround
                </p>
                <p className="flex basis-2/4 items-end justify-end  ">
                  ${deFees.userDemo}
                </p>
              </>
            )}
            {deFees.userOMVIC > 0 && (
              <>
                <p className="basis-2/4  mt-2">OMVIC / Other GV Fees</p>
                <p className="flex basis-2/4 items-end justify-end  ">
                  ${deFees.userOMVIC}
                </p>
              </>
            )}
          </div>
        </>
      )}
    </>
  )
}
