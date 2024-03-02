import { Form } from '@remix-run/react';
import React, { useRef } from 'react';
import { Input } from '~/components/ui';

const AttemptedOrReached = ({ data }) => {
  const formRef = useRef(null);

  const handleSelectChange = (event) => {
    // Do something with event.target.value if needed
    formRef.current && formRef.current.submit();
  };
  const id = data.id ? data.id.toString() : '';

  return (
    <Form method="post" ref={formRef}>
      <div className='grid grid-cols-1'>
        <select name='customerState'
          onChange={handleSelectChange}
          className="mx-auto  cursor-pointer rounded border-1 border-[#60b9fd]  h-8 mt-2 bg-white  text-xs text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
        >
          <option value="">Set Status</option>
          <option value="Attempted">Attempted</option>
          <option value="Reached">Reached</option>
        </select >
        <Input type="hidden" defaultValue={data.userEmail} name="userEmail" />
        <Input type="hidden" defaultValue={data.id} name="financeId" />
        <Input type="hidden" defaultValue={id} name="id" />
        <Input type="hidden" defaultValue={data.brand} name="brand" />
        <Input type="hidden" defaultValue='updateStatus' name="intent" />
      </div>
    </Form >
  );
};

export default AttemptedOrReached;
