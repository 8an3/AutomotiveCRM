import { json, redirect } from "@remix-run/node";
import { updateFinanceNote } from "~/utils/client/updateFinanceNote.server";
import { updateDashData } from "~/utils/dashboard/update.server";
import { createFinanceNote, createFinanceNoteForClientfile } from "~/utils/financeNote/create.server";

export default async function updateFinanceNotes({ formData, }) {
  const id = formData.id
  const slug = formData.slug
  const customContent = formData.customContent
  const urgentFinanceNote = formData.urgentFinanceNote
  const author = formData.author
  const isPublished = formData.isPublished
  const customerId = formData.customerId
  const dept = formData.dept
  const data = {
    slug,
    customContent,
    urgentFinanceNote,
    author,
    isPublished,
    customerId,
    dept,
  }
  const updateNoteFunction = await updateFinanceNote(financeId, financeNote)


  console.log(updateNoteFunction, 'createNote')
  return json({ updateNoteFunction });
}
