import { saveMyDocument } from '~/utils/docTemplates/create.server'

export async function action({ params, request, }) {
  const data = await request.json();
  const savingDoc = await saveMyDocument({ ...data });
  // console.log('savingDoc', savingDoc, 'data', data)
  return savingDoc
}
