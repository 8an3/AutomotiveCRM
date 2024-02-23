import React from 'react';
import { Form } from '@remix-run/react';
import { Button, Input, TextArea } from '~/components';

function ScriptForm({ userFname, useremail }) {
  return (
    <Form method="post" action="/emails/send/custom">
      <TextArea
        placeholder="Type your script here."
        name="customContent"
        className="h-[200px]"
      />
      <Input type="hidden" name="userFname" value={userFname} />
      <Input type="hidden" name="useremail" value={useremail} />


      <Button className="w-full mt-3" type="submit" name="intent" value="scriptForm">
        Email
      </Button>
    </Form>
  );
}

export default ScriptForm;
