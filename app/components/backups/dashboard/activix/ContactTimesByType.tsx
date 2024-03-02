import { useState, useEffect } from 'react';
import { PrismaClient } from "@prisma/client";
import { PhoneOutcome, MenuScale, MailOut, MessageText, User, ArrowDown } from "iconoir-react";
import { Badge } from '~/other/badge';


const ContactTimesByType = ({ data }) => {

  return (
    <>
      <div className='flex'>
        <div className='grid grid-cols-2'>
          <Badge className="bg-[#02a9ff] space-between mt-1 mr-1 w-[60px]">
            <User />
            <p className='ml-auto'>
              {data.countsInPerson}
            </p>
          </Badge>
          <Badge className="bg-[#02a9ff] space-between mt-1 mr-1 w-[60px]">
            <PhoneOutcome />
            <p className='ml-auto'>
              {data.countsPhone}
            </p>
          </Badge>
          <Badge className="bg-[#02a9ff] space-between mt-1 mr-1 w-[60px]">
            <MessageText />
            <p className='ml-auto'>
              {data.countsSMS}
            </p>
          </Badge>
          <Badge className="bg-[#02a9ff] space-between mt-1 mr-1 w-[60px]">
            <MailOut />
            <p className='ml-auto'>
              {data.countsEmail}
            </p>
          </Badge>
        </div>

        <p className='ml-1 mx-auto my-auto'>
          {data.countsOther}
        </p>
      </div>
    </>
  );
}
export default ContactTimesByType;
