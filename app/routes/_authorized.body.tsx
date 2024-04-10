import { useState, useEffect, useLayoutEffect } from "react";

export default function EmailBody() {
  const [htmlBody, setHtmlBody] = useState('')

  useEffect(() => {
    const isOpen = window.localStorage.getItem("selectedEmail");
    console.log(isOpen, 'isopen')
    if (isOpen) {
      const parsedEmail = JSON.parse(isOpen);
      console.log(parsedEmail)
      setHtmlBody(parsedEmail.body);
    }

  }, []);

  return (
    <>
      <div className='p-2 h-[100%]' dangerouslySetInnerHTML={{ __html: htmlBody }} />
    </>
  )
}
