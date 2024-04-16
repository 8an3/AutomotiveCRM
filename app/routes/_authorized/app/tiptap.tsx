import { EditorTiptapContextViewHTML, EditorTiptapHook } from "~/components/libs/editor-tiptap"
import { useEffect, useRef, useState } from "react"
import { type ActionFunction } from "@remix-run/node"
import { Form } from "@remix-run/react"

import { conform, useForm, useInputEvent } from "@conform-to/react"

export const action: ActionFunction = async ({ request, }) => {
  const formPayload = Object.fromEntries(await request.formData())
  return formPayload
}
export default function ExampleTiptap(text) {
  const [contentValue, setContentValue] = useState('')
  const contentRef = useRef<HTMLInputElement>(null)
  const contentControl = useInputEvent({ ref: contentRef })
  console.log(text.content, 'text')
  useEffect(() => {
    handleUpdateContent(text)
  }, [text]);

  function handleUpdateContent(text: string) {
    const newText = text.content.toString()
    setContentValue(newText)
  }
  console.log(contentValue, 'contentValue')
  return (
    <div className="">
      <input type='hidden' name='body' defaultValue={contentValue} />
      <div>
        <EditorTiptapHook content={contentValue} handleUpdate={handleUpdateContent} />
      </div>
    </div>
  )
}
