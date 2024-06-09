import { LinksFunction, ActionFunction } from "@remix-run/node";
import { Input } from "~/components";
import { json } from "@remix-run/node";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { prisma } from "~/libs";

export default function DealerCompleted() {
  return (
    <div className="bg-white my-auto mx-auto font-sans px-2 text-black h-[100vh] max-h-screen ">
      <div className="border mt-[25px] border-solid border-[#eaeaea] rounded-md my-[40px] mx-auto p-[20px] max-w-[465px]">
        <h1 className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
          Dealer Questionnaire
        </h1>
        <p className="text-black text-[14px] leading-[24px]">
          Everything is completed for now, thank-you and we will reach out to you soon once everything is set up.
        </p>


      </div>
      <hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full mt-auto" />
      <p className="text-[#666666] text-[12px] leading-[24px]">
        © Dealer Sales Assistant <br />
        613-898-0992 <br />
        skylerzanth@gmail.com <br />
        15490 Ashburn Rd, Berwick, ON, K0C 1G0, Canada
      </p>
    </div>
  );
}
export async function loader() {
  return null
}

export async function action({ request, }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  let formData = financeFormSchema.parse(formPayload)
  const intent = formPayload.intent
  if (intent === 'createDealer') {
    const dealer = await prisma.dealer.create({
      data: {
        dealerName: formData.dealerName,
        dealerAddress: formData.dealerAddress,
        dealerCity: formData.dealerCity,
        dealerProv: formData.dealerProv,
        dealerPostal: formData.dealerPostal,
        dealerPhone: formData.dealerPhone,
        dealerEmail: formData.dealerEmail,
        dealerContact: formData.dealerContact,
        dealerAdminContact: formData.dealerAdminContact,
        dealerEmailAdmin: formData.dealerEmailAdmin,
        dealerEtransferEmail: formData.dealerEtransferEmail,
      }
    })
    return json({ dealer })
  }

  return null
}

