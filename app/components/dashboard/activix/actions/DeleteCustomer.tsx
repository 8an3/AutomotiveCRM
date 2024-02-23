import { json, redirect } from "@remix-run/node";
import { deleteBMW, deleteFinance, deleteManitou } from "~/utils/finance/delete.server";

export default async function DeleteCustomer({ formData, formPayload }) {
  const id = formData.id
  const brand = formPayload.brand
  console.log('deleting customer', id)
  if (brand === 'Switch') {
    const deleteCustomer = await deleteFinance({ id })
    const deleteOptions = await deleteManitou({ id })
    return json({ deleteCustomer, deleteOptions }), redirect('/dashboard/calls');
  }
  if (brand === 'Manitou') {
    const deleteCustomer = await deleteFinance({ id })
    const deleteOptions = await deleteManitou({ id })
    return json({ deleteCustomer, deleteOptions }), redirect('/dashboard/calls');
  }
  if (brand === 'BMW-Motorrad') {
    const deleteCustomer = await deleteFinance({ id })
    const deleteOptions = await deleteBMW({ id })
    return json({ deleteCustomer, deleteOptions }), redirect('/dashboard/calls');
  }
  else {
    const deleteCustomer = await deleteFinance({ id })
    return json({ deleteCustomer }), redirect('/dashboard/calls');
  }
}
