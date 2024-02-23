import { Form, useLoaderData, useParams, useResolvedPath, } from '@remix-run/react'
import EquipManitou from './optionsutils/manitou'
import { ImageSelect } from './overviewUtils/imageselect'
import {
    Tabs, TabsContent, TabsList, TabsTrigger, Popover, PopoverContent, PopoverTrigger, Accordion, AccordionContent, AccordionItem, AccordionTrigger, Input, Label, Separator, Button, Card, CardContent,
} from "~/components/ui/index"
import EquipSwitch from './optionsutils/switch'
import { redirect, json, type ActionFunction, type DataFunctionArgs, } from '@remix-run/node'
import { getDataByModelManitou, getDataBmwMoto, getLatestBMWOptions, getLatestFinance, getDataSwitch, getDataSeadoo, getDataSuzuki, getDataSpyder, getDataCanam, getDataHarley, getLatestFinanceManitou, getDataIndian, getLatestFinance2, getDataKtm, getDataYamaha, getDataByModel } from '~/utils/finance/get.server'
import {
    createFinanceManitou
} from '~/utils/finance/create.server'
import {
    updateBMWOptions,
    updateBMWOptions2, updateFinance,
} from '~/utils/finance/update.server'
import financeFormSchema from '~/routes/overviewUtils/financeFormSchema';

import { model } from '~/models'
import { EquipBMW } from './optionsutils/bmwmoto'
import { getLatestFinanceAndDashDataForClientfile } from '~/utils/client/getLatestFinance.server'
import { prisma } from "~/libs";
import { getSession } from '~/sessions/auth-session.server';
import { requireAuthCookie } from '~/utils/misc.user.server';




export async function loader({ request, params }: LoaderFunctionArgs) {
    let account = await requireAuthCookie(request);
    const user = await model.user.query.getForSession({ email: account.email });

    const userId = user?.id
    const finance = await getLatestFinanceAndDashDataForClientfile(email)
    const brand = finance?.brand
    if (brand === 'Manitou') {
        const modelData = await getDataByModelManitou(finance);
        return json({ ok: true, modelData, finance, user, })
    }
    if (brand === 'BMW-Motorrad') {
        const financeId = finance?.id
        const bmwMoto = await getLatestBMWOptions(financeId)
        const modelData = await getDataBmwMoto(finance);
        return json({ ok: true, modelData, finance, user, bmwMoto, })
    }
    else {
        const modelData = await getDataByModel(finance)
        return json({ ok: true, modelData, finance, user, })
    }
}

export const action: ActionFunction = async ({ request }) => {
    const formData = Object.fromEntries(await request.formData())
    try {
        if (formData.brand === 'BMW-Motorrad') {
            const creatingBMWOptions = financeFormSchema.parse(formData)
            await updateBMWOptions(creatingBMWOptions)
            await updateBMWOptions2(creatingBMWOptions)
            return redirect(`/overview/${formData.brand}`)
        }
        else {
            const creatingManitouOptions = financeFormSchema.parse(formData)
            await createFinanceManitou(creatingManitouOptions)
            return redirect(`/overview/${formData.brand}`)
        }
    } catch (error) {
        console.error(`quote not submitted ${error}`)
        return redirect(`/users/dashboard/settings`)
    }
}




export default function Options() {
    let { brandId } = useParams()
    const { finance, user } = useLoaderData()

    const id = finance.id

    return (
        <>
            <div className='mt-3'>
                <ImageSelect />
            </div>
            <Card className="mx-auto mt-3 mb-5">
                <CardContent>
                    <Form method='post' >
                        {brandId === 'Manitou' && (
                            <>
                                <EquipManitou />
                            </>
                        )}
                        {brandId === 'BMW-Motorrad' && (
                            <>
                                <EquipBMW />
                            </>
                        )}
                        {brandId === 'Switch' && (
                            <>
                                <EquipSwitch />
                            </>
                        )}
                        <Input type="hidden" name="email" defaultValue={user.email} />

                        <Input type="hidden" name="id" defaultValue={id} />
                        <Input type="hidden" name="brand" defaultValue={finance.brand} />
                        <Input type='hidden' name='financeId' value={finance.id} />
                        <div className="grid grid-cols-2 mb-1 ">
                            <div className="mt-3">
                                <Button className='h-5' type="submit" name='intent' value='goBack' content="update"  >
                                    Back
                                </Button>
                            </div>
                            <div className="float-right mt-3 mb-1 grid items-end justify-end">
                                <Button type="submit" name='intent' value='updateFinance' content="update"  >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </Form>
                </CardContent>
            </Card>


        </>
    )

}
