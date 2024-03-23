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
      <div  >
        <select name='customerState'
          onChange={handleSelectChange}
          defaultValue={data.customerState}
          className="mx-auto  cursor-pointer px-2 py-1 rounded-md border border-white text-white h-8  bg-[#363a3f]  text-xs  placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
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
    </Form>
  );
};

export default AttemptedOrReached;
