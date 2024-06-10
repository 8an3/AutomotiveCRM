import { useState, useEffect } from 'react';
import { PrismaClient } from "@prisma/client";
import { PhoneOutcome, MenuScale, MailOut, MessageText, User, ArrowDown } from "iconoir-react";
import { Badge } from '~/components/ui/badge';


const ContactTimesByType = ({ data }) => {

  return (
    <>
      <div className='flex'>
        <div className='grid grid-cols-2'>
          <Badge className="bg-primary space-between mt-1 mr-1 w-[60px]">
            <User />
            <p className='ml-auto hover:text-[#000]'>
              {data.InPerson}
            </p>
          </Badge>
          <Badge className="bg-primary space-between mt-1 mr-1 w-[60px]">
            <PhoneOutcome />
            <p className='ml-auto hover:text-[#000]'>
              {data.Phone}
            </p>
          </Badge>
          <Badge className="bg-primary space-between mt-1 mr-1 w-[60px]">
            <MessageText />
            <p className='ml-auto hover:text-[#000]'>
              {data.SMS}
            </p>
          </Badge>
          <Badge className="bg-primary space-between mt-1 mr-1 w-[60px]">
            <MailOut />
            <p className='ml-auto text-[#000]'>
              {data.Email}
            </p>
          </Badge>
        </div>

        <p className='ml-1 mx-auto my-auto hover:text-[#000]'>
          {data.Other}
        </p>
      </div>
    </>
  );
}
export default ContactTimesByType;
