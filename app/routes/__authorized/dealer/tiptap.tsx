import { EditorTiptapContextViewHTML, EditorTiptapHook } from "~/components/libs/editor-tiptap"
import { useEffect, useRef, useState } from "react"
import { LinksFunction, type ActionFunction } from "@remix-run/node"
import { Form } from "@remix-run/react"
import base from "~/styles/base.css";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", sizes: "32x32", href: "/money24.svg", },
  { rel: "icon", type: "image/svg", sizes: "16x16", href: "/money16.svg", },
  { rel: "stylesheet", href: base },
]


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
