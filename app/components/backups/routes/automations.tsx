import { Form } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { Button, Input } from '~/components/ui';
import { Cross2Icon } from '@radix-ui/react-icons';
import { button } from '~/ui/button';
import { type LoaderArgs, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import Calendar from 'react-calendar';
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import * as Dialog from '@radix-ui/react-dialog';
import { prisma } from '~/libs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"



const Schema = z.object({
  value: zfd.text(z.string().optional()),
  date: zfd.text(z.string().optional()),
  title: zfd.text(z.string().optional()),
  when: zfd.text(z.string().optional()),
  triggerField: zfd.text(z.string().optional()),
  condition: zfd.text(z.string().optional()),
  criteriaColumn: zfd.text(z.string().optional()),
  isWhen: zfd.text(z.string().optional()),
  criteriaFilter: zfd.text(z.string().optional()),
  criteriaField: zfd.text(z.string().optional()),
  task: zfd.text(z.string().optional()),
  sendTo: zfd.text(z.string().optional()),
  template: zfd.text(z.string().optional()),
  delayBetween: zfd.text(z.string().optional()),
})
export async function loader({ request, params }: LoaderFunction) {
  const currentDate = new Date();
  const futureDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours

  console.log(futureDate.toISOString()); // Output: A date and time 24 hours in the future

  const userCriteria = [
    { column: 'status', condition: 'Is', value: 'Active', logicalOperator: 'AND' },
    { column: 'result', condition: 'Is', value: 'Reached', logicalOperator: 'AND' },
    { column: 'userEmail', condition: 'Is', value: 'skylerzanth@gmail.com', logicalOperator: 'AND' },
    { column: 'pickUpDate', condition: 'Is in the future', value: '2024-01-22T19:02:32.633Z', logicalOperator: 'AND' }, // This date is before '2024-01-23'
    { column: 'deliveredDate', condition: 'Is not defined', value: undefined, logicalOperator: undefined },
    // Add more criteria as needed
  ];

  const lead = {
    status: 'Active',
    appointmentDate: '2024-01-20',
    result: 'Reached',
    userEmail: 'skylerzanth@gmail.com',
    pickUpDate: '2024-02-06',
    deliveredDate: undefined,
    // ... other lead properties
  };
  console.log(lead, userCriteria, 'loader')

  function evaluateLeadAgainstCriteria(lead, userCriteria) {
    console.log(lead, userCriteria, 'evaluateLeadAgainstCriteria');
    // Initialize with the first criterion's result
    let meetsAllCriteria = evaluateCriterion(lead[userCriteria[0].column], userCriteria[0].condition, userCriteria[0].value);

    for (let i = 1; i < userCriteria.length; i++) {
      const criterion = userCriteria[i];
      const { column, condition, value, logicalOperator } = criterion;
      console.log(column, condition, value, 'evaluateLeadAgainstCriteria');

      // Base case: Check if lead[column] is undefined or null
      if (lead[column] === undefined || lead[column] === null) {
        meetsAllCriteria = false;
        break; // Exit the loop and stop evaluating criteria
      }

      const result = evaluateCriterion(lead[column], condition, value);
      console.log(`Criterion result: ${result}`);

      // Combine results based on logical operator
      if (logicalOperator === 'AND') {
        meetsAllCriteria = meetsAllCriteria && result;
        console.log('first result', result);
      } else if (logicalOperator === 'OR') {
        meetsAllCriteria = meetsAllCriteria || result;
        console.log('seconds result', result);
      }
      // Add more logical operators if needed
    }

    return meetsAllCriteria;
  }



  function evaluateCriterion(leadValue, condition, criterionValue) {
    console.log(`Lead value: ${leadValue}, Condition: ${condition}, Criterion value: ${criterionValue}`);
    switch (condition) {
      case 'Is defined':
        return leadValue !== undefined && leadValue !== null;
      case 'Is not defined':
        return leadValue === undefined || leadValue === null;
      case 'Is':
        return leadValue === criterionValue;
      case 'Is not':
        return leadValue !== criterionValue;
      case 'Is before':
        console.log(new Date(leadValue), '<', new Date(criterionValue));
        return new Date(leadValue) < new Date(criterionValue);
      case 'Is after':
        console.log(new Date(leadValue), '>', new Date(criterionValue));
        return new Date(leadValue) > new Date(criterionValue);
      case 'Is in the past':
        console.log(new Date(leadValue), '<', new Date());
        return new Date(leadValue) < new Date();
      case 'Is in the future':
        if (leadValue !== undefined) {
          const leadDate = new Date(leadValue);
          const criterionDate = new Date(criterionValue);
          return leadDate.getTime() > criterionDate.getTime();
        }
        return false;
      default:
        return false;
    }
  }
  const result = evaluateLeadAgainstCriteria(lead, userCriteria);
  console.log(result);
  return (result);
}

export const action: ActionFunction = async ({ req, request, params, }) => {
  const formPayload = Object.fromEntries(await request.formData());
  let data = Schema.parse(formPayload);
  console.log(data)
  return null
}
export default function Automations() {


  return (
    <div className='bg-black'>
      <div className='w-1/2 border border-white'>
        <Form method='post' >
          <Input name='title' placeholder='Title' className='w-auto mx-2 mt-10 items-center justify-center' />
          <Card className="w-auto mt-2 mx-2">
            <CardHeader>
              <CardTitle>Action</CardTitle>
              <CardDescription>What would you like to happen when the automation activates?</CardDescription>
            </CardHeader>
            <CardContent>
              <Select name='action'>
                <SelectTrigger className="w-auto focus:border-[#60b9fd]">
                  <SelectValue placeholder="What event to take place?" />
                </SelectTrigger>
                <SelectContent className='bg-slate1'>
                  <SelectItem value="New Task">New Task</SelectItem>
                  <SelectItem value="Send Email">Send Email</SelectItem>
                  <SelectItem value="Send SMS">Send SMS</SelectItem>
                </SelectContent>
              </Select>
              <div className='flex mt-2'>
                <Select name='timeType'>
                  <SelectTrigger className="w-auto focus:border-[#60b9fd] mr-2">
                    <SelectValue placeholder="No Delay" />
                  </SelectTrigger>
                  <SelectContent className='bg-slate1'>
                    <SelectItem value="No delay">No delay</SelectItem>
                    <SelectItem value="Exact Time">Exact Time</SelectItem>
                    <SelectItem value="Same Day">Same Day</SelectItem>
                    <SelectItem value="Minutes">Minutes</SelectItem>
                    <SelectItem value="Hours">Hours</SelectItem>
                    <SelectItem value="Days">Days</SelectItem>
                    <SelectItem value="Weeks">Weeks</SelectItem>
                    <SelectItem value="Months">Months</SelectItem>
                  </SelectContent>
                </Select>
                <Input type='number' name='executionTime' className='w-[100px]' />
              </div>
              <Select name='beforeAfter'>
                <SelectTrigger className="w-auto focus:border-[#60b9fd] mt-2">
                  <SelectValue placeholder="Type of Appointment" />
                </SelectTrigger>
                <SelectContent className='bg-slate1'>
                  <SelectItem value="After">After</SelectItem>
                  <SelectItem value="Before">Before</SelectItem>
                </SelectContent>
              </Select>
              <Select name='sendOnly'>
                <SelectTrigger className="w-auto focus:border-[#60b9fd]">
                  <SelectValue placeholder="Type of Appointment" />
                </SelectTrigger>
                <SelectContent className='bg-slate1'>
                  <SelectItem value="Always Send">Always Send</SelectItem>
                  <SelectItem value="Dont Send If Closed">Dont send if closed</SelectItem>
                  <SelectItem value="Execute at next business hour">Execute at next business hour</SelectItem>
                  <SelectItem value="Only on chosen days">Only on chosen days</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </Form>
      </div>
      <div className='w-1/2 border border-white'>

      </div>
    </div>
  )
}
