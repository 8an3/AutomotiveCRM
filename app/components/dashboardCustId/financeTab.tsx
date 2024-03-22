import { Input, Separator, } from "~/components/ui/index";
import { useFetcher, useLoaderData } from "@remix-run/react";
import * as Tabs from '@radix-ui/react-tabs'
import * as Toast from '@radix-ui/react-toast';
import { getSession } from "~/sessions/auth-session.server";
import { json } from "@remix-run/node";
import { commitSession as commitPref, getSession as getPref } from '~/utils/pref.server';

import { authenticator } from "~/services/auth-service.server";
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { model } from "~/models";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  const userId = user?.id
  const deFees = await getDealerFeesbyEmail(email)
  return json({ deFees, user, })
}

export default function FinanceTab(merged) {
  const { deFees, finance } = useLoaderData();
  let fetcher = useFetcher();
  const data = finance
  const totalLabour = merged.merged.labour * merged.merged.userLabour;
  //console.log(merged, 'merged', deFees, 'deFees')
  console.log(merged.merged.msrp, 'merged',)
  const dataFees = [
    { name: "MSRP", value: merged.merged.msrp },
    { name: "Freight", value: merged.merged.freight },
    { name: "Admin", value: merged.merged.admin },
    { name: "PDI", value: merged.merged.pdi },
    // { name: "Commodity", value: merged.merged.userCommodity }, under finance figures now
    { name: "Delivery", value: merged.merged.deliveryCharge },
    { name: "Government Fees", value: deFees.userGovern },
    { name: "Air Tax", value: deFees.userAirTax },
    { name: "Tire Tax", value: deFees.userTireTax },
    { name: "Finance Fee", value: deFees.userdata },
    { name: "Destination Charge", value: deFees.destinationCharge },
    { name: "Market Adjustment", value: deFees.userMarketAdj },
    { name: "OMVIC / Gov Fee", value: deFees.userOMVIC },
    { name: "Demonstration Fee", value: deFees.userDemo },
    { name: "Other Accessories", value: merged.merged.accessories },
    { name: "Labour", value: totalLabour },
    { name: "Discount %", value: merged.merged.discountPer },
    { name: "Discount", value: merged.merged.discount },
    { name: "Trade Value", value: merged.merged.tradeValue },


  ];

  const financeOptions = [
    { name: "userExtWarr", value: deFees.userExtWarr, placeholder: 'Extended Warranty' },
    { name: "userLoanProt", value: deFees.userLoanProt, placeholder: 'Loan Protection' },
    { name: "userGap", value: deFees.userGap, placeholder: 'Gap Protection' },
    { name: "userTireandRim", value: deFees.userTireandRim, placeholder: 'Tire and Rim' },
    { name: "vinE", value: deFees.vinE, placeholder: 'Vin Etching' },
    { name: "rustProofing", value: deFees.rustProofing, placeholder: 'Under Coating' },
    { name: "userServicespkg", value: deFees.userServicespkg, placeholder: 'Service Package' },
    { name: "lifeDisability", value: deFees.lifeDisability, placeholder: 'Life and Disability' },
    { name: "userOther", value: deFees.userOther, placeholder: 'Other data Package' },
  ];
  return (
    <>
      <Tabs.Root className="flex flex-col shadow-[0_2px_10px] rounded  mt-5 mx-auto  border border-[#43484E]  bg-myColor-900" defaultValue="Price"  >
        <Tabs.List className="shrink-0 flex border-b border-slate2 " aria-label="Manage your account">
          <Tabs.Trigger className="bg-myColor-900 px-2 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate1 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all text-center duration-150 cursor-pointer
              focus:outline-none      mx-1"  value="Price"    >
            Price
          </Tabs.Trigger>
          <Tabs.Trigger className="bg-myColor-900 px-2 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate1 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all text-center duration-150 cursor-pointer
                 focus:outline-none  focus:text-[#02a9ff]   mx-1"   value="Finance"   >
            Finance
          </Tabs.Trigger>
          <Tabs.Trigger className="bg-myColor-900 px-2 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate1 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all text-center duration-150 cursor-pointer
                focus:outline-none  focus:text-[#02a9ff]   mx-1"    value="Options"  >
            Options
          </Tabs.Trigger>

          <Tabs.Trigger disabled className="bg-myColor-900 px-2 h-[45px] w-[95%] flex-1 flex items-center justify-center text-[15px] leading-none  first:rounded-tl-md last:rounded-tr-md target:text-[#02a9ff] hover:text-[#02a9ff] text-slate1 active:bg-[#02a9ff] font-bold uppercase  rounded shadow hover:shadow-md outline-none  ease-linear transition-all text-center duration-150 cursor-pointer
            focus:outline-none  focus:text-[#02a9ff]    mx-1"   value="Accessories"   >
            Accessories
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          className="grow p-5 bg-slate-900 text-slate1 rounded-b-md outline-none  focus:shadow-black"
          value="Price"  >
          {dataFees
            .filter(
              (fee) =>
                fee && fee.value > 0 &&
                fee.value !== "on" &&
                fee.value !== "0"
            )
            .map((fee, index) => (
              fee && <div
                key={index}
                className="mt-1 flex flex-wrap  text-slate1  justify-between "
              >
                <p className="mt-1 basis-2/4 text-slate1  text-sm font-thin">
                  {fee.name}
                </p>
                <p className="flex basis-2/4  items-end   text-slate1   justify-end text-sm font-thin ">
                  ${fee.value}
                </p>
              </div>
            ))}

          {merged.merged.desiredPayments === "Standard Payment" && (
            <>
              <div className="mt-2 flex flex-wrap justify-between text-slate1 ">
                <p className="mt-2 basis-2/4  text-slate1  text-sm  font-thin">
                  Total
                </p>
                <p className="flex basis-2/4 text-slate1  items-end  justify-end text-right text-sm font-thin ">
                  ${merged.merged.total}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-between text-slate1  ">
                <p className="mt-2 basis-2/4   text-sm text-slate1  font-thin">
                  After Tax
                </p>
                <p className="flex basis-2/4  items-end text-slate1   justify-end text-sm font-thin ">
                  ${merged.merged.onTax}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-between ">
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Deposit
                </p>
                <p className="flex basis-2/4  items-end   justify-end text-sm font-thin ">
                  ${merged.merged.deposit}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-between text-slate1  ">
                <p className="mt-2 basis-2/4   text-sm text-slate1  font-thin">
                  Balance
                </p>
                <p className="flex basis-2/4  items-end text-slate1   justify-end text-sm font-thin ">
                  ${merged.merged.onTax - merged.merged.deposit}
                </p>
              </div>
            </>
          )}
          {merged.merged.desiredPayments === "Payments with Options" && (
            <>
              <div className="mt-2 flex flex-wrap justify-between text-slate1 ">
                <p className="mt-2 basis-2/4  text-slate1  text-sm  font-thin">
                  Total
                </p>
                <p className="flex basis-2/4 text-slate1  items-end  justify-end text-right text-sm font-thin ">
                  ${merged.merged.totalWithOptions}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap text-slate1  justify-between ">
                <p className="mt-2 basis-2/4 text-slate1   text-sm  font-thin">
                  After Tax
                </p>
                <p className="flex basis-2/4  items-end text-slate1   justify-end text-sm font-thin ">
                  ${merged.merged.qcTax}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-between ">
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Deposit
                </p>
                <p className="flex basis-2/4  items-end   justify-end text-sm font-thin ">
                  ${merged.merged.deposit}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-between text-slate1  ">
                <p className="mt-2 basis-2/4   text-sm text-slate1  font-thin">
                  Balance
                </p>
                <p className="flex basis-2/4  items-end text-slate1   justify-end text-sm font-thin ">
                  ${merged.merged.qcTax - merged.merged.deposit}
                </p>
              </div>
            </>
          )}
          {merged.merged.desiredPayments === "No Tax Payment" && (
            <>
              <div className="mt-2 flex flex-wrap text-slate1  justify-between ">
                <p className="mt-2 basis-2/4  text-slate1  text-sm  font-thin">
                  After Tax
                </p>
                <p className="flex basis-2/4  text-slate1  items-end   justify-end  text-right text-sm font-thin ">
                  Total ${merged.merged.native}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-between ">
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Deposit
                </p>
                <p className="flex basis-2/4  items-end   justify-end text-sm font-thin ">
                  ${merged.merged.deposit}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-between text-slate1  ">
                <p className="mt-2 basis-2/4   text-sm text-slate1  font-thin">
                  Balance
                </p>
                <p className="flex basis-2/4  items-end text-slate1   justify-end text-sm font-thin ">
                  ${merged.merged.native - merged.merged.deposit}
                </p>
              </div>
            </>
          )}
          {merged.merged.desiredPayments === "No Tax Payment with Options" && (
            <>
              <div className="mt-2 flex flex-wrap text-slate1  justify-between ">
                <p className="mt-2 basis-2/4 text-slate1   text-sm  font-thin">
                  Total
                </p>
                <p className="flex basis-2/4  items-end text-slate1   justify-end  text-right text-sm font-thin ">
                  ${merged.merged.totalWithOptions}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-between ">
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Deposit
                </p>
                <p className="flex basis-2/4  items-end   justify-end text-sm font-thin ">
                  ${merged.merged.deposit}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-between text-slate1  ">
                <p className="mt-2 basis-2/4   text-sm text-slate1  font-thin">
                  Balance
                </p>
                <p className="flex basis-2/4  items-end text-slate1   justify-end text-sm font-thin ">
                  ${merged.merged.totalWithOptions - merged.merged.deposit}
                </p>
              </div>
            </>
          )}
          {merged.merged.desiredPayments === "Custom Tax Payment" && (
            <>
              <div className="mt-2 flex flex-wrap justify-between ">
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Total
                </p>
                <p className="flex basis-2/4  items-end   justify-end text-sm font-thin ">
                  ${merged.merged.total}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-between ">
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  After Tax
                </p>
                <p className="flex basis-2/4  items-end   justify-end  text-right text-sm font-thin ">
                  ${merged.merged.otherTax}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-between ">
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Deposit
                </p>
                <p className="flex basis-2/4  items-end   justify-end text-sm font-thin ">
                  ${merged.merged.deposit}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-between text-slate1  ">
                <p className="mt-2 basis-2/4   text-sm text-slate1  font-thin">
                  Balance
                </p>
                <p className="flex basis-2/4  items-end text-slate1   justify-end text-sm font-thin ">
                  ${merged.merged.otherTax - merged.merged.deposit}
                </p>
              </div>
            </>
          )}
          {merged.merged.desiredPayments ===
            "Custom Tax Payment with Options" && (
              <>
                <div className="mt-2 flex flex-wrap justify-between ">
                  <p className="mt-2 basis-2/4   text-sm  font-thin">
                    Total
                  </p>
                  <p className="flex basis-2/4  items-end   justify-end text-sm font-thin ">
                    ${merged.merged.totalWithOptions}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap justify-between ">
                  <p className="mt-2 basis-2/4   text-sm  font-thin">
                    After Tax
                  </p>
                  <p className="flex basis-2/4  items-end   justify-end  text-right text-sm font-thin ">
                    ${merged.merged.otherTaxWithOptions}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap justify-between ">
                  <p className="mt-2 basis-2/4   text-sm  font-thin">
                    Deposit
                  </p>
                  <p className="flex basis-2/4  items-end   justify-end text-sm font-thin ">
                    ${merged.merged.deposit}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap justify-between text-slate1  ">
                  <p className="mt-2 basis-2/4   text-sm text-slate1  font-thin">
                    Balance
                  </p>
                  <p className="flex basis-2/4  items-end text-slate1   justify-end text-sm font-thin ">
                    ${merged.merged.otherTaxWithOptions - merged.merged.deposit}
                  </p>
                </div>
              </>
            )}


        </Tabs.Content>
        <Tabs.Content
          className="grow p-5 bg-slate-900 text-slate1 rounded-b-md outline-none  focus:shadow-black"
          value="Finance"  >
          <div className="mt-2 flex flex-wrap justify-between ">
            <p className="mt-2 basis-2/4   text-sm  font-thin">
              Desposit
            </p>
            <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
              ${merged.merged.deposit}
            </p>
            <p className="mt-2 basis-2/4   text-sm  font-thin">
              Term
            </p>
            <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
              {merged.merged.months}
            </p>
            <p className="mt-2 basis-2/4   text-sm  font-thin">
              Rate
            </p>
            <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
              {merged.merged.iRate}%
            </p>
          </div>
          {merged.merged.desiredPayments === "Standard Payment" && (
            <>
              <p className="mt-2 basis-2/4   text-sm  font-thin">
                Standard
              </p>
              <hr className="solid" />
              <div className="mt-2 flex flex-wrap justify-between ">
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Monthly
                </p>
                <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                  ${merged.merged.on60}
                </p>
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Bi-weekly
                </p>
                <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                  ${merged.merged.biweekly}
                </p>
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Weekly
                </p>
                <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                  ${merged.merged.weekly}
                </p>
              </div>
            </>
          )}
          {deFees.desiredPayments === "Payments with Options" && (
            <>
              <p className="mt-2 basis-2/4   text-sm  font-thin">
                Standard W/ Options
              </p>
              <hr className="solid" />
              <div className="mt-2 flex flex-wrap justify-between ">
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Monthly
                </p>
                <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                  ${merged.merged.qc60}
                </p>
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Bi-weekly
                </p>
                <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                  ${merged.merged.biweeklyqc}
                </p>
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Weekly
                </p>
                <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                  ${merged.merged.weeklyqc}
                </p>
              </div>
            </>
          )}
          {merged.merged.desiredPayments === "No Tax Payment" && (
            <>
              <p className="mt-2 basis-2/4   text-sm  font-thin">
                Tax Exempt
              </p>
              <hr className="solid" />
              <div className="mt-2 flex flex-wrap justify-between ">
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Monthly
                </p>
                <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                  ${merged.merged.nat60}
                </p>
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Bi-weekly
                </p>
                <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                  ${merged.merged.biweeklNat}
                </p>
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Weekly
                </p>
                <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                  ${merged.merged.weeklylNat}
                </p>
              </div>
            </>
          )}
          {deFees.desiredPayments === "No Tax Payment with Options" && (
            <>
              <p className="mt-2 basis-2/4   text-sm  font-thin">
                Tax Exempt
              </p>
              <hr className="solid" />
              <div className="mt-2 flex flex-wrap justify-between ">
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Monthly
                </p>
                <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                  ${merged.merged.oth60}
                </p>
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Bi-weekly
                </p>
                <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                  ${merged.merged.biweekOth}
                </p>
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Weekly
                </p>
                <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                  ${merged.merged.weeklyOth}
                </p>
              </div>
            </>
          )}
          {deFees.desiredPayments === "Custom Tax Payment" && (
            <>
              <p className="mt-2 basis-2/4   text-sm  font-thin">
                Tax Exempt
              </p>
              <hr className="solid" />
              <div className="mt-2 flex flex-wrap justify-between ">
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Monthly
                </p>
                <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                  ${merged.merged.nat60WOptions}
                </p>
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Bi-weekly
                </p>
                <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                  ${merged.merged.biweeklNatWOptions}
                </p>
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Weekly
                </p>
                <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                  ${merged.merged.weeklylNatWOptions}
                </p>
              </div>
            </>
          )}
          {merged.merged.desiredPayments ===
            "Custom Tax Payment with Options" && (
              <>
                <p className="mt-2 basis-2/4   text-sm  font-thin">
                  Tax Exempt
                </p>
                <hr className="solid" />
                <div className="mt-2 flex flex-wrap justify-between ">
                  <p className="mt-2 basis-2/4   text-sm  font-thin">
                    Monthly
                  </p>
                  <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                    ${merged.merged.oth60WOptions}
                  </p>
                  <p className="mt-2 basis-2/4   text-sm  font-thin">
                    Bi-weekly
                  </p>
                  <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                    ${merged.merged.biweekOthWOptions}
                  </p>
                  <p className="mt-2 basis-2/4   text-sm  font-thin">
                    Weekly
                  </p>
                  <p className="mt-2 flex basis-2/4 items-end justify-end text-sm font-thin">
                    ${merged.merged.weeklyOthWOptions}
                  </p>
                </div>
              </>
            )}
        </Tabs.Content>
        <Tabs.Content
          className="grow p-5 bg-slate-900 text-slate1 rounded-b-md outline-none  focus:shadow-black"
          value="Options"  >
          {/* loading all and every option may be too consuming of internet resources, if they want to see the options and accessories they can go to the quote itself */}
          <p className="mt-2  basis-2/4   text-sm font-thin">
            Finance Products
          </p>
          <Separator />

          {financeOptions
            .filter(
              (fee) =>
                fee && fee.value > 0 &&
                fee.value !== "on" &&
                fee.value !== "0"
            )
            .map((fee, index) => (
              fee && <div
                key={index}
                className="mt-1 flex flex-wrap  text-slate1  justify-between "
              >
                <p className="mt-1 basis-2/4 text-slate1  text-sm font-thin">
                  {fee.name}
                </p>
                <p className="flex basis-2/4  items-end   text-slate1   justify-end text-sm font-thin ">
                  ${fee.value}
                </p>
              </div>
            ))}
          <p className="mt-2  basis-2/4   text-sm font-thin">
            Vehichle Options
          </p>
          <Separator />

          <p className="mt-2  basis-2/4   text-sm font-thin">
            Parts & Acc
          </p>
          <Separator />
        </Tabs.Content>

        <Tabs.Content
          className="grow p-5 bg-slate-900 text-slate1 rounded-b-md outline-none  focus:shadow-black"
          value="Accessories"  >
        </Tabs.Content>

      </Tabs.Root>
    </>
  )
}
