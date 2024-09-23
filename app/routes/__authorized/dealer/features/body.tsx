import { useState, useEffect, } from "react";

export default function EmailBody() {
  const [htmlBody, setHtmlBody] = useState('')

  useEffect(() => {
    const isOpen = window.localStorage.getItem("selectedEmail");
    console.log(isOpen, 'isopen')
    if (isOpen) {
      const parsedEmail = JSON.parse(isOpen);
      //  console.log(parsedEmail)
      setHtmlBody(parsedEmail.body.content);
    }

  }, []);

  return (
    <>
      <div className='p-3 m-3 h-[100%] w-[100%] flex-grow mx-auto ' dangerouslySetInnerHTML={{ __html: htmlBody }} />
    </>
  )
}
