import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Input } from "~/other/input";
import { Badge } from "~/ui/badge";
import { templateServer } from "~/utils/emailTemplates/template.server";



export async function Template(formData, intent, id) {
  const data = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    body: formData.body,
    userEmail: formData.userEmail,
    category: formData.category,
    type: formData.type,
    subject: formData.subject,
    cc: formData.cc,
    bcc: formData.bcc,
    attributes: formData.attributes,
    dept: formData.dept,
    label: formData.label,
  }

  if (intent === 'createTemplate') {
    delete data.id
  }
  console.log(data)
  const tempServer = await templateServer(data, intent, id)
  return json({ tempServer })
}


export default function Example() {
  const { user, getTemplates } = useLoaderData();



  const axios = require('axios');

  const getDataset = axios.get('http://localhost:3000/editor/email/templates')
    .then(response => {
      // Call your function and pass the data to it
      setData(response.data);
    })
    .catch(error => {
      console.error('There was a problem with the axios operation: ', error);
    });
  useEffect(() => {
    if (Array.isArray(getTemplates)) {
      setData(getTemplates);
    }
  }, [getTemplates]);

  const [data, setData] = useState(getDataset);

  const [isOpen, setIsOpen] = useState(false);
  const [lineIsOpen, setLineIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedLine, setSelectedLine] = useState(null);
  console.log(getTemplates, data)

  const handleLineClick = (index) => {
    setSelectedLine(selectedLine === index ? null : index);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
    setEmail(emailBody)
  };

  /**
    // rest of your component
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedEmail, setSelectedEmail] = useState('');

    let filteredData;// = []//data.filter();

    const filteredDropDown = data?.filter(item =>
      (selectedCategory === '' || item.category === selectedCategory) &&
      (selectedType === '' || item.type === selectedType) &&
      (selectedEmail === '' || item.userEmail === selectedEmail)
    );

    const categories = [...new Set(data.map(item => item.category))];
    const types = [...new Set(data.map(item => item.type))];
    const emails = [...new Set(data.map(item => item.userEmail))];


      value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}


   <select

                  className={`border-black text-black placeholder:text-blue-300 broder mx-auto h-8  cursor-pointer rounded border bg-[#09090b] px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}>
                  <option value="">All Categories</option>
                  {categories.map(category => <option key={category} value={category}>{category}</option>)}
                </select>

                <select
                  className={`border-black text-black placeholder:text-blue-300 broder mx-auto ml-2  h-8 cursor-pointer rounded border bg-[#09090b] px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                  value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                  <option value="">All Types</option>
                  {types.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                <select className={`border-black text-black placeholder:text-blue-300 broder mx-auto ml-2  h-8 cursor-pointer rounded border bg-[#09090b] px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}
                  value={selectedEmail} onChange={e => setSelectedEmail(e.target.value)}>
                  <option value="">All Emails</option>
                  {emails.map(email => <option key={email} value={email}>{email}</option>)}
                </select>

   */
  return (
    <>
      <div className='w-[95%]'>
        <div className="grid grid-cols-1 gap-4">

        </div>
        <div className="mx-auto w-full border-b-2">
          <div className='flex justify-between'>
            <input
              type="text"
              placeholder="Search"

            />
            <div className='flex'>

            </div>
          </div>
          {/*!filteredData.length &&*/}
          {data.length > 1 ? (

            data?.map((item, index) => (
              <div key={index} className="mx-auto w-full border-b-2 mt-2">
                <div className='flex justify-between'>
                  <p className='cursor-pointer text-left hover:underline'>
                    <button onClick={() => handleLineClick(index)}>
                      {item.label}
                    </button>
                  </p>
                  <div className='flex'>
                    <p className='ml-auto'>
                      {item.type}
                    </p>
                    <p className='ml-3'>
                      {item.category}
                    </p>
                    <p className='ml-3'>
                      {item.userEmail}
                    </p>
                    <div>
                      <button onClick={() => handleLineClick(index)} className='cursor-pointer ml-2 hover:text-[#02a9ff]'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-arrow-down-circle"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="m8 12 4 4 4-4" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className={`${selectedLine === true && isOpen === true ? 'h-[50%] overflow-y-auto' : ''}`}>

                  <div className={`bg-white fixed top-0 w-[100vw] items-center overflow-x-hidden rounded-lg border border-b-0 border-slate12  transition-all duration-1000 md:w-[50%] ${selectedLine === index ? 'transform translate-y-0' : 'transform -translate-y-full'}`}>

                    <div className={`${selectedLine === index ? 'block' : 'hidden'}`}>
                      <div className="">
                        <button onClick={handleLineClick} className=" bg-white  hover:text-[#02a9ff] text-black border-black flex border p-2 text-left cursor-pointer ">

                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-x-circle"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                        </button>
                      </div>
                      {item.userEmail}
                      <div className="bg-white mx-auto grid w-[95%] grid-cols-1 justify-center gap-4 md:w-2/3">
                        <Form method='post' >
                          {/* Row 1 */}
                          <div className="py-1">
                            <Input name='label' defaultValue={item.label} placeholder='Email Template Title ' className='border-black border-b-black border' />
                          </div>
                          {/* Row 2 */}
                          <div className="py-1">
                            <div className='flex flex-row justify-between'>
                              <select name='Select a Dept' defaultValue={item.dept}
                                className={`border-black text-black placeholder:text-blue-300 broder  h-8 cursor-pointer  justifty-start rounded border bg-[#09090b]  px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}>
                                <option value="">Select a Dept</option>
                                <option value="Active">Sales</option>
                                <option value="Duplicate">Service</option>
                                <option value="Invalid">Accessories</option>
                                <option value="Lost">Management</option>
                                <option value="Lost">After Sales</option>
                                <option value="Lost">Other</option>
                              </select>
                              <Input name='type' type="text" defaultValue={item.type} placeholder="Template Type, ie Follow-up, Service Reminder" className=' border-black border-b-black w-1/2 border' />
                            </div>
                          </div>
                          {/* Row 3 */}
                          <div className="py-1">
                            <Input name='subject' placeholder='Subject' defaultValue={item.subject} className='border-black border-b-black border' />
                          </div>
                          <div className="py-1">
                            <Input name='cc ' placeholder='cc' defaultValue={item.cc} className='border-black w-1/2 mr-2 border-b-black border' />
                            <Input name='bcc ' placeholder='bcc' defaultValue={item.bcc} className='border-black w-1/2 ml-2 border-b-black border' />

                          </div>
                          {/* Row 4 */}
                          <div className=" p-4">
                            <div className='mr-auto px-2'>
                              {/* Your content here */}
                              <Badge className="mb-2 mr-2 cursor-pointer">Regular Editor</Badge>
                              <Badge className="mb-2 cursor-pointer">Markdown Editor</Badge>
                              <Markdown />
                              <Input name='intent' type='hidden' defaultValue='updateTemplate' />
                              <Input name='userEmail' type='hidden' defaultValue={user.email} />
                              <Input name='firstName' type='hidden' defaultValue={item.firstName} />
                              <Input name='lastName' type='hidden' defaultValue={item.lastName} />

                            </div>
                          </div>
                          <div className=" p-2">
                            <Button type='submit' className="border-black cursor-pointer border uppercase hover:text-[#02a9ff]" variant='ghost'>
                              Update
                            </Button>
                          </div>
                        </Form>
                        <Form method='post' className="justify-end">
                          <Input name='intent' type='hidden' defaultValue='deleteTemplate' />
                          <Input name='id' type='hidden' defaultValue={item.id} />
                          <Button type='submit' className="border-black cursor-pointer border uppercase hover:text-[#02a9ff] " variant='ghost'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                          </Button>
                        </Form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : null}
        </div>
      </div>
      {/* Rest of your component */}
      <div className={`${selectedLine === true && isOpen === true ? 'h-[50%] overflow-y-auto' : ''}`}>

        <div className={`bg-white fixed bottom-0 overflow-y-auto w-[100vw] items-center overflow-x-hidden rounded-lg border border-b-0 border-slate12 shadow-md transition-all duration-1000 md:w-[50%]  ${isOpen ? 'h-[37%] ' || `${selectedLine === true && isOpen === true ? 'h-[50%] overflow-y-auto' : ''}` : 'h-14 '}`}>
          <div className="">
            <button onClick={handleClick} className=" bg-white text-black border-black flex border p-2 text-left cursor-pointer hover:text-[#02a9ff]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-folder-plus"><path d="M12 10v6" /><path d="M9 13h6" /><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></svg>
              Create Template
            </button>
          </div>
          {/* bottom model*/}
          <div className={`${isOpen ? 'block' : 'hidden'}`}>
            <Form method='post' >
              <div className="bg-white mx-auto grid w-[95%] grid-cols-1 justify-center gap-4 md:w-2/3">
                {/* Row 1 */}
                <div className="py-1">
                  <Input name='label' placeholder='Email Template Title ' className='border-black border-b-black border' />
                </div>
                {/* Row 2 */}
                <div className="py-1">
                  <div className='flex flex-row justify-between'>
                    <select placeholder='Select a Dept'
                      name='dept'
                      className={`border-black text-black placeholder:text-blue-300 broder  h-8 cursor-pointer w-1/2 mr-2 justifty-start rounded border bg-[#09090b]  px-2 text-xs uppercase shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]`}>
                      <option value="">Select a Dept</option>
                      <option value="Active">Sales</option>
                      <option value="Duplicate">Service</option>
                      <option value="Invalid">Accessories</option>
                      <option value="Lost">Management</option>
                      <option value="Lost">After Sales</option>
                      <option value="Lost">Other</option>
                    </select>
                    <Input name='category' type="text" placeholder="Template Type, ie Follow-up, Service Reminder" className=' border-black border-b-black w-1/2 border ml-2' />
                  </div>
                </div>
                {/* Row 3 */}
                <div className="py-1">
                  <Input name='subject' placeholder='subject' className='border-black border-b-black border' />
                  <Input name='intent' type='hidden' defaultValue='createTemplate' />
                  <Input name='userEmail' type='hidden' defaultValue={user.email} />
                </div>
                <div className="py-1">
                  <Input name='cc ' placeholder='cc' className='border-black w-1/2 mr-2 border-b-black border' />
                  <Input name='bcc ' placeholder='bcc' className='border-black w-1/2 ml-2 border-b-black border' />

                </div>
                {/* Row 4 */}
                <div className=" p-4">
                  <div className='mr-auto px-2'>
                    {/* Your content here */}
                    <Badge className="mb-2 mr-2 cursor-pointer">Regular Editor</Badge>
                    <Badge className="mb-2 cursor-pointer">Markdown Editor</Badge>
                    <App />
                  </div>
                </div>
                <div className=" p-2">
                  <Button type='submit' className="border-black cursor-pointer border uppercase hover:text-[#02a9ff]" variant='ghost'>Save</Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div >
    </>
  )
}
