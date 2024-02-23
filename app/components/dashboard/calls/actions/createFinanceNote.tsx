import { json, redirect } from "@remix-run/node";
import { updateDashData } from "~/utils/dashboard/update.server";
import { createFinanceNote, createFinanceNoteForClientfile } from "~/utils/financeNote/create.server";
//import { emitter } from "~/utils/emitter.server";

export default async function createFinanceNotes({ formData, }) {

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
  const createNoteFunction = await createFinanceNote(data)

  //emitter.emit("note", createNoteFunction.id);

  console.log(createNoteFunction, 'createNote')
  return json({ createNoteFunction });

}
