import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet"
import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { type LinksFunction } from "@remix-run/node";
import { ClientOnly } from "remix-utils";
import 'react-clock/dist/Clock.css';

export const links: LinksFunction = () => [
];


export function DateTimeComponent() {
  const [value, setDateTime] = useState(new Date());

  const onChange = (value) => setDateTime(value);


  return (
    <div>
      <div>
        <ClientOnly fallback={null}>
          {() =>
            <DateTimePicker
              onChange={onChange}
              value={value}
              name="followUpDay1"


            />
          }
        </ClientOnly>
      </div>
    </div>
  );
}
export default DateTimeComponent;

