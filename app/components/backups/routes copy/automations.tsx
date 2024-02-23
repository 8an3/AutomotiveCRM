/*import { Form } from '@remix-run/react';
import { useState } from 'react';
import { Button, Input } from '~/components/ui';
import { Cross2Icon } from '@radix-ui/react-icons';
import { button } from '~/ui/button';
import { type LoaderArgs, type ActionFunction } from '@remix-run/node';
import Calendar from 'react-calendar';
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "~/components/ui/dialog"



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
export async function loader({ request, params }: LoaderFunctionArgs) {
  const userCriteria = [
    { column: 'status', condition: 'Is', value: 'Active', logicalOperator: 'AND' },
    { column: 'result', condition: 'Is', value: 'Reached', logicalOperator: 'AND' },
    { column: 'userEmail', condition: 'Is', value: 'skylerzanth@gmail.com', logicalOperator: 'AND' },
    { column: 'pickUpDate', condition: 'Is in the future', value: undefined, logicalOperator: 'AND' },
    { column: 'deliveredDate', condition: 'Is not defined', value: undefined, logicalOperator: undefined },
    // Add more criteria as needed
  ];

  const lead = {
    Status: 'Active',
    AppointmentDate: '2024-01-20',
    Result: 'Reached',
    userEmail: 'skylerzanth@gmail.com',
    pickUpDate: '2024-01-23',
    deliveredDate: undefined,
    // ... other lead properties
  };
  console.log(lead, userCriteria, 'loader')

  function evaluateLeadAgainstCriteria(lead, userCriteria) {
    console.log(lead, userCriteria, 'evaluateLeadAgainstCriteria')

    // Initialize with the first criterion's result
    let meetsAllCriteria = evaluateCriterion(lead[userCriteria[0].column], userCriteria[0].condition, userCriteria[0].value);

    for (let i = 1; i < userCriteria.length; i++) {
      const criterion = userCriteria[i];
      const { column, condition, value } = criterion;
      console.log(column, condition, value, 'evaluateLeadAgainstCriteria')

      const result = evaluateCriterion(lead[column], condition, value);
      // Combine results based on logical operator
      if (criterion.logicalOperator === 'AND') {
        meetsAllCriteria = meetsAllCriteria && result;
      } else if (criterion.logicalOperator === 'OR') {
        meetsAllCriteria = meetsAllCriteria || result;
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
        console.log(new Date(leadValue), '>', new Date());
        return new Date(leadValue) > new Date();

      // Add more conditions as needed
      default:
        return false;
    }
  }
  const result = evaluateLeadAgainstCriteria(lead, userCriteria);
  console.log(result);
  return (result);
}
/**
export const action: ActionFunction = async ({ req, request, params, }) => {
  const formPayload = Object.fromEntries(await request.formData());
  let data = Schema.parse(formPayload);
  console.log(data)
  return null
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function AddAction(props) {
  const [action, setAction] = useState('');

  const { actionLines, setActionLines, setTemplate, setSendTo, setDelayBetween, setTask, setDelay, setBeforeAfter, setEventTrigger, setOccurrence } = props;

  const addLine = () => {
    setActionLines([...actionLines, {}]);
  };

  const deleteLine = (index) => {
    setActionLines(actionLines.filter((_, actionLinesIndex) => actionLinesIndex !== index));
  };

  const handleInputChange = (e, index) => {
    const newLines = [...actionLines];
    newLines[index][e.target.name] = e.target.value;
    setActionLines(newLines);
  };
  function Execution(index) {
    const [dialog, setDialog] = useState('dialogClosed');
    const [reopen, setReopen] = useState(false); useEffect(() => {
      if (reopen) {
        setTimeout(() => setDialog('dialogOpen'), 100);
        setReopen(false);
      }
    }, [reopen]);

    return (
      <>
        <button onClick={(e) => {
          if (dialog === 'dialogOpen') {
            setDialog('dialogClosed');
            setReopen(true);
          } else {
            setDialog('dialogOpen');
          }
        }}
          className="text-slate1  border border-white border-1 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium ">
          Execution
        </button>

        {dialog === 'dialogOpen' && (
          <>
            <div className='grid grid-cols-1' >
              <select name='occurrence'
                onChange={(e) => {

                  setOccurrence(e, index)
                }}
                className="mx-auto mt-2 border-black w-1/2 h-10 rounded border-1 border-black ml-2 mr-2 bg-white  text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
                <option value="">Occurrence</option>
                <option value="None">No Recurrence</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
              <div className='flex justify-center'>
                <select name='delay'
                  onChange={(e) => {

                    setDelay(e, index)
                  }}
                  className="mx-auto mt-2 border-black w-1/2 h-10 rounded border-1 border-black ml-2 mr-2 bg-white  text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
                  <option value="">Delay</option>
                  <option value="None">None</option>
                  <option value="Minutes">Minutes</option>
                  <option value="Hours">Hours</option>
                  <option value="Days">Days</option>
                  <option value="Months">Months</option>
                  <option value="Years">Years</option>
                </select>
                <Input name='delayValue' placeholder='Delay' className='border border-white w-[300px] text-black h-[40px] mt-2 ml-2' />
              </div>

              <select name='beforeAfter'
                onChange={(e) => {

                  setBeforeAfter(e, index)
                }}
                className="mx-auto mt-2 border-black w-1/2 h-10 rounded border-1 border-black ml-2 mr-2 bg-white  text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
                <option value="">Before/After Event</option>
                <option value="before">Before</option>
                <option value="after">After</option>
              </select>

              <select name='eventTrigger'
                onChange={(e) => {

                  setEventTrigger(e, index)
                }}
                className="mx-auto mt-2 border-black w-1/2 h-10 rounded border-1 border-black ml-2 mr-2 bg-white  text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
                <option value="">Event to trigger when...</option>
                <option value="after">When All Criteria is met</option>
                <option value="after">Lead - Creation date</option>
                <option value="after">Lead - Appointment confirmation date</option>
                <option value="after">Customer - Consent limit date</option>
              </select>


            </div>
            <div className="mt-[25px] flex justify-end">
              <button onClick={(e) => {
                setDialog('dialogClosed');
              }} className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                Apply
              </button>
            </div>
            <button onClick={(e) => {
              setDialog('dialogClosed');
            }}
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </>

        )}

      </>

    )
  }
  return (
    <form>
      {actionLines.map((line, index) => (
        <div key={index}>
          <div className='md:flex grid grid-cols-1   mt-3'>
            <select name='task'
              onChange={(e) => {
                handleInputChange(e, index)
                setAction(e.target.value)
                setTask(e.target.value)
              }}
              className="mx-auto    w-[150px] h-10 rounded border border-1 border-white ml-2 mr-2 bg-[#1c2024] text-slate1 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
              <option value="Addatask">Add a task</option>
              <option value="Sendadelayed notification">Send a delayed notification </option>
              <option value="Sendadouble opt -in email">Send a double opt-in email</option>
              <option value="Sendanotification">Send a notification  </option>
              <option value="Sendanemail">Is Before The</option>
              <option value="Isafterthe">Send an email </option>
              <option value="SendanSMS">Send an SMS</option>
              <option value="Sendupdatetoprovider">Send update to provider </option>
            </select>
            <Execution index={index} />
            <button type="button" className='border border-1 border-white w-[300px] text-slate1 h-[40px] ml-2' onClick={() => deleteLine(index)}>Delete Line</button>
          </div>
          {action === 'Sendanotification' && (
            <div className='   mt-3'>
              <select name='template'
                onChange={(e) => {
                  handleInputChange(e, index)
                  setTemplate(e.target.value)
                }}
                className="mx-auto    w-[150px] h-10 rounded border border-1 border-white ml-2 mr-2 bg-[#1c2024] text-slate1 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
                <option value="">Template</option>
              </select>

              <select name='sendTo'
                onChange={(e) => {
                  handleInputChange(e, index)
                  setSendTo(e.target.value)
                }}
                className="mx-auto    w-[150px] h-10 rounded border border-1 border-white ml-2 mr-2 bg-[#1c2024] text-slate1 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
                <option value="">Send To</option>
              </select>

              <select name='delayBetween'
                onChange={(e) => {
                  handleInputChange(e, index)
                  setDelayBetween(e.target.value)
                }}
                className="mx-auto    w-[150px] h-10 rounded border border-1 border-white ml-2 mr-2 bg-[#1c2024] text-slate1 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
                <option value="">Delay between notifications</option>
                <option value="15m">15m</option>
                <option value="30m">30m</option>
                <option value="60m">60m</option>
                <option value="2h">2h</option>
                <option value="4h">4h</option>
                <option value="8h">8h</option>
                <option value="12h">12h</option>
                <option value="24h">24h</option>
              </select>
            </div>
          )}

        </div>
      ))}
      <button type="button" className='m-2 text-slate1 border-white border-1' onClick={addLine}>Add Action</button>
    </form>
  );
}

function AddCriteria(props) {
  const { value, onChange, setCriteriaColumn, setIsWhen, setCriteriaFilter, setCondition, setLines, lines } = props

  const criteriaFields = [
    "LEAD",
    "Appointment confirmation date",
    "Appointment date",
    "Approbation process",
    "Approved",
    "Associate",
    "B - Back date",
    "BDC Agent",
    "Birthdate",
    "Calls unsubscribe",
    "City",
    "Civility",
    "Code",
    "Communication preference",
    "Created method",
    "Creation date",
    "Dealer tour",
    "Delivered date",
    "Delivery date",
    "Delivery man",
    "Deposit",
    "Division",
    "DND.",
    "Emails unsubscribe",
    "End of service date",
    "Event",
    "F & I",
    "First update time(seconds)",
    "Form",
    "Funded date",
    "Gender",
    "Import file name",
    "Incoming call longer than 30 seconds",
    "Incoming email",
    "Incoming SMS",
    "Inspection",
    "Institution",
    "Invalid email address",
    "Invalid phone",
    "Invoiced",
    "Language",
    "Last visit date",
    "Last visit KM",
    "Lead name",
    "Lead type",
    "Loyalty",
    "Next revival date",
    "No incoming call longer than 30 seconds",
    "No incoming email",
    "No incoming SMS",
    "No outgoing call longer than 30 seconds",
    "No outgoing email",
    "No outgoing SMS",
    "Outgoing call longer than 30 seconds",
    "Outgoing email",
    "Outgoing SMS",
    "Paperwork date",
    "Person that created the lead",
    "Person that updated the lead",
    "Person that updated the status",
    "Phone appointment date",
    "Planned pick up date",
    "Prepared",
    "Promised time",
    "Province",
    "Reached client",
    "Repair date",
    "Repair order #",
    "Result",
    "Sale by phone",
    "Sale date",
    "Service advisor",
    "Service agent",
    "SMS unsubscribe",
    "Source",
    "Status",
    "Status updated date",
    "Test drive date",
    "Turn over date",
    "Turn over manager",
    "Valid email address",
    "Valid phone",
    "Vehicle here on",
    "Visit date",
    "W.O. #",
    "W.O.Closure date",
    "W.O.opening date",
    "W.O.Partial closure date",
    "Walk around",
    "CUSTOMER",
    "Consent limit date for communication",
    "Double opt -in date",
    "DEALER",
    "Dealer new closed",
    "Dealer new open",
    "Dealer service closed",
    "Dealer service open",
    "Dealer used closed",
    "Dealer used open",
    "WANTED VEHICLE",
    "Accessories - W",
    "Cashdown - W",
    "Category - W",
    "Creation date - W",
    "Make - W",
    "Manager that verified the sale - W",
    "Max.year - W",
    "Min.year - W",
    "Model - W",
    "Offer # - W",
    "Payment - W",
    "Price - W",
    "Rate - W",
    "Recorded date - W",
    "Security deposit - W",
    "Stock - W",
    "Stock state - W",
    "Term - W",
    "Version - W",
    "VIN - W",
    "Year - W",
    "EXCHANGE VEHICLE",
    "Balance - C",
    "Category - C",
    "Condition - C",
    "Creation date - C",
    "End contract date - C",
    "Est.odometer excess - C",
    "Estimated - C",
    "Has not positive equity - C",
    "Has positive equity - C",
    "Make - C",
    "Max.year - C",
    "Min.year - C",
    "Model - C",
    "Odometer - C",
    "Price - C",
    "Profit - C",
    "Requested - C",
    "Security deposit - C",
    "Sold by - C",
    "Version - C",
    "VIN - C",
    "Year - C",
    "SOURCE",
    "Provider",
    "NEXT VIRTUAL EVENT",
    "Customer virtual event link",
    "User virtual event link",
    "OTHER",
    "Days of the week",
    "Triggered by an assigned user",
    "Triggered by a unassigned user",
    "Next appointment date",
    "CUSTOM FIELD",
    "Did Not Pickup",
    "Pièce ou Service",
    "Registered on",
    "Send Email",
    "Transferred On",]

  const criteriaFields2 = {
    "LEAD": [],
    "Appointment confirmation date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Appointment date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Approbation process": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Approved": ['Is checked', 'Is not checked'],
    "Associate": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "BDC Agent": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Birthdate": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Calls unsubscribe": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "City": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Civility": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Code": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Communication preference": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Created method": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Creation date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Dealer tour": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Delivered date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Delivery date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Delivery man": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Deposit": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Division": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "DND.": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Emails unsubscribe": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "End of service date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Event": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "F & I": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "First update time(seconds)": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Form": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Funded date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Gender": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Import file name": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Incoming call longer than 30 seconds": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Incoming email": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Incoming SMS": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Inspection": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Institution": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Invalid email address": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Invalid phone": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Invoiced": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Language": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Last visit date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Last visit KM": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Lead name": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Lead type": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Loyalty": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Next revival date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "No incoming call longer than 30 seconds": [],
    "No incoming email": [],
    "No incoming SMS": [],
    "No outgoing call longer than 30 seconds": [],
    "No outgoing email": [],
    "No outgoing SMS": [],
    "Outgoing call longer than 30 seconds": [],
    "Outgoing email": [],
    "Outgoing SMS": [],
    "Paperwork date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Person that created the lead": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Person that updated the lead": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Person that updated the status": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Phone appointment date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Planned pick up date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Prepared": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Promised time": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Province": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Reached client": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Repair date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Repair order #": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Result": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Sale by phone": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Sale date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Service advisor": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Service agent": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "SMS unsubscribe": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Source": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Status": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Status updated date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Test drive date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Turn over date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Turn over manager": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Valid email address": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Valid phone": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Vehicle here on": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Visit date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "W.O. #": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "W.O.Closure date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "W.O.opening date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "W.O.Partial closure date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Walk around": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "CUSTOMER": [],
    "Consent limit date for communication": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Double opt -in date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "DEALER": [],
    "Dealer new closed": [],
    "Dealer new open": [],
    "Dealer service closed": [],
    "Dealer service open": [],
    "Dealer used closed": [],
    "Dealer used open": [],
    "WANTED VEHICLE": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Accessories - W": ['Is defined', 'Is not defined'],
    "Cashdown - W": ['Is defined', 'Is not defined'],
    "Category - W": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Creation date - W": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Make - W": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Manager that verified the sale - W": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Max.year - W": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Min.year - W": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Model - W": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Offer # - W": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Payment - W": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Price - W": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Rate - W": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Recorded date - W": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Security deposit - W": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Stock - W": ['Is defined', 'Is not defined'],
    "Stock state - W": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Term - W": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Version - W": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "VIN - W": ['Is defined', 'Is not defined'],
    "Year - W": ['Is defined', 'Is not defined', 'Is After The', 'Is in the Past', 'Is in the future'],
    "EXCHANGE VEHICLE": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Balance - C": ['Is defined', 'Is not defined'],
    "Category - C": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Condition - C": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Creation date - C": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "End contract date - C": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Est.odometer excess - C": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Estimated - C": ['Is defined', 'Is not defined', 'Is',],
    "Has not positive equity - C": ['Is defined', 'Is not defined'],
    "Has positive equity - C": ['Is defined', 'Is not defined'],
    "Make - C": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Max.year - C": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Min.year - C": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Model - C": ['Is defined', 'Is not defined', 'Is', 'Is not',],
    "Odometer - C": ['Is defined', 'Is not defined', 'Is', 'Is not',],
    "Price - C": ['Is defined', 'Is not defined', 'Is', 'Is not',],
    "Profit - C": ['Is defined', 'Is not defined', 'Is', 'Is not',],
    "Requested - C": ['Is defined', 'Is not defined', 'Is', 'Is not',],
    "Security deposit - C": ['Is defined', 'Is not defined'],
    "Sold by - C": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "VIN - C": ['Is defined', 'Is not defined'],
    "Year - C": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "SOURCE": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Provider": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "NEXT VIRTUAL EVENT": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Customer virtual event link": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "User virtual event link": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "OTHER": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Days of the week": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Triggered by an assigned user": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Triggered by a unassigned user": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Next appointment date": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Did Not Pickup": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Registered on": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
    "Send Email": ['Is defined', 'Is not defined', 'Is', 'Is not'],
    "Transferred On": ['Is defined', 'Is not defined', 'Is', 'Is not', 'Is Before The', 'Is After The', 'Is in the Past', 'Is in the future'],
  }
  const criteriaFields3 = {
    'Is defined': [], //stays empty
    'Is not defined': [], //stays empty
    'Is': ['skyler', 'justin'], // hit db
    'Is not': ['skyler', 'justin'],// hit db
    'Is Before The': [], //date
    'Is After The': [], //date
    'Is in the Past': [], //stays empty
    'Is in the future': [], //stays empty

  }

  function CalendarPicker(index) {

    return (
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="text-slate1  border border-white border-1 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium ">
            Date
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <div className='grid grid-cols-1' >
              <Calendar
                onChange={(e) => {
                  setCriteriaFilter(e, index);
                  onChange(e);
                }}
                value={value}
                calendarType="gregory"
              />
              <Input
                type='hidden'
                value={value}
                name='criteriaFilter'
              />
            </div>
            <div className="mt-[25px] flex justify-end">
              <Dialog.Close asChild>
                <button className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                  Apply
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button
                className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }

  const [secondSelects, setSecondSelects] = useState([]);
  const [firstSelects, setFirstSelects] = useState([]);
  const [thirdSelects, setThirdSelects] = useState([]);
  const addLine = () => {
    setLines([...lines, {}]);
  };

  const deleteLine = (index) => {
    setLines(lines.filter((_, lineIndex) => lineIndex !== index));
  };

  const handleInputChange = (e, index) => {
    const newLines = [...lines];
    newLines[index][e.target.name] = e.target.value;
    setLines(newLines);
  };

  return (
    <form>
      {lines.map((line, index) => (
        <div key={index}>
          {index > 0 && (
            <select name='condition'
              onChange={(e) => {
                handleInputChange(e, index)
                setCondition(e.target.value)
              }}
              className="mx-auto    w-[150px] h-10 mt-3 ro}unded border border-1 border-white ml-2 mr-2 bg-[#1c2024] text-slate1 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
              <option value="">Condition</option>
              <option value="andAnd">AND</option>
              <option value="orOr">OR</option>
            </select>
          )}
          <div className='md:flex grid grid-cols-1   mt-3'>

            <select name='criteriaColumn'
              className="mx-auto w-[150px] h-10 rounded border border-1 border-white ml-2 mr-2 bg-[#1c2024] text-slate1 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
              value={firstSelects[index]}
              onChange={e => {
                const newFirstSelects = [...firstSelects];
                newFirstSelects[index] = e.target.value;
                setFirstSelects(newFirstSelects);
                handleInputChange(e, index);
              }}>
              {criteriaFields.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            {firstSelects[index] && (
              <select name='isWhen'
                className="mx-auto w-[150px] h-10 rounded border border-1 border-white ml-2 mr-2 bg-[#1c2024] text-slate1 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                value={secondSelects[index]}
                onChange={e => {
                  const newSecondSelects = [...secondSelects];
                  newSecondSelects[index] = e.target.value;
                  setSecondSelects(newSecondSelects);
                  handleInputChange(e, index);
                }}>
                {criteriaFields2[firstSelects] && criteriaFields2[firstSelects].map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}

            {(secondSelects[index] === 'Is' || secondSelects[index] === 'Is not') && (
              <select name='criteriaFilter'
                value={thirdSelects[index]}
                onChange={e => {
                  const newThirdSelects = [...thirdSelects];
                  newThirdSelects[index] = e.target.value;
                  setThirdSelects(newThirdSelects);
                  handleInputChange(e, index);
                }}
                className="mx-auto w-[150px] h-10 rounded border border-1 border-white ml-2 mr-2 bg-[#1c2024] text-slate1 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
              >
                {criteriaFields3[secondSelects[index]] && criteriaFields3[secondSelects[index]].map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}

            {(secondSelects[index] === 'Is Before The' || secondSelects[index] === 'Is After The') && (
              <>
                <CalendarPicker index={index} />
              </>
            )}
            <button type="button" className='m-2 text-slate1 border-1 border-white justify-end' onClick={() => deleteLine(index)}>Delete Line</button>
          </div>
        </div>
      ))}
      <p className='text-slate1'>second: {secondSelects} value: {value} </p>
      <button type="button" className='m-2 text-slate1 border-white border-1' onClick={addLine}>Add Criteria</button>
    </form>
  );
}



export default function AutomationForm() {
  const triggerFieldList = [
    "All",
    "LEAD",
    "Sale by phone",
    "Appointment date",
    "Visit date",
    "Sale date",
    "Test drive date",
    "Dealer tour",
    "Turn over date",
    "B - Back date",
    "Walk around",
    "Approved",
    "Approbation process",
    "Vehicle here on",
    "Paperwork date",
    "Deliverable date",
    "Delivered date",
    "Funded date",
    "Source",
    "Phone appointment date",
    "Appointment confirmation date",
    "Birthdate",
    "Call date",
    "Delivery date",
    "End of contract date",
    "End of service date",
    "Buy Out date",
    "Repair date",
    "Status updated date",
    "Associate",
    "BDC Agent",
    "Result",
    "Status",
    "Lead merged",
    "Reception of merged lead",
    "Prepared",
    "Division",
    "WANTED VEHICLE",
    "Stock state",
    "Recorded date",
    "Stock",
    "NIV",
    "Category",
    "Make",
    "Model",
    "Frequency",
    "Term",
    "Modality",
    "Contract end date",
    "Year",
    "Version",
    "Price",
    "CURRENT VEHICLE",
    "Stock State",
    "Stock",
    "NIV",
    "Category",
    "Make",
    "Model",
    "Tires sold",
    "Frequency",
    "Term",
    "Modality",
    "Contract end date",
    "Institution",
    "Sold Date",
    "Sold By",
    "Year",
    "Version",
    "Price",
    "NEXT VIRTUAL EVENT",
    "Customer virtual event link",
    "User virtual event link",
  ]
  const [when, setWhen] = useState()
  const [apply, setApply] = useState(false)
  const [lines, setLines] = useState([{}]);
  const [actionLines, setActionLines] = useState([{}]);
  const [value, onChange] = useState<Value>(new Date());

  const [template, setTemplate] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [delayBetween, setDelayBetween] = useState('');
  const [task, setTask] = useState('');
  const [criteriaColumn, setCriteriaColumn] = useState('');
  const [isWhen, setIsWhen] = useState('');
  const [criteriaFilter, setCriteriaFilter] = useState('');
  const [condition, setCondition] = useState('');
  const [title, setTitle] = useState('');
  const [whenValue, setWhenValue] = useState('');
  const [triggerField, setTriggerField] = useState('');
  const [eventTrigger, setEventTrigger] = useState('');
  const [beforeAfter, setBeforeAfter] = useState('');
  const [delay, setDelay] = useState('');
  const [occurrence, setOccurrence] = useState('');

  return (
    <Form method="post" className='w-[80%] mx-auto'>
      <div className='md:flex grid grid-cols-1  items-center'>
        <Input
          onChange={(e) => {
            setTitle(e.target.value)
          }}
          name='title' placeholder='Title' className=' border-black w-[300px] border-white text-slate1 h-[40px]' />
        <select name='when'
          onChange={(e) => {
            setWhen(e)
            setWhenValue(e.target.value)
          }}
          className="mx-auto    w-[150px] h-10 rounded border border-1 border-white ml-2 mr-2 bg-[#1c2024] text-slate1 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
          <option value="">When</option>
          <option value="LeadUpdated">Lead is Updated</option>
          <option value="LeadCreated">Lead is Created</option>
          <option value="TaskUpdated">Task is Updated</option>
          <option value="TaskCreated">Task is Created</option>
        </select>

        <select name='triggerField'
          onChange={(e) => setTriggerField(e.target.value)
          }
          className="mx-auto w-[150px] h-10 rounded border border-1 border-white ml-2 mr-2 bg-[#1c2024] text-slate1 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]">
          {triggerFieldList.map((option, optionIndex) => (
            <option key={optionIndex} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <AddCriteria lines={lines} setLines={setLines} setCriteriaColumn={setCriteriaColumn} setIsWhen={setIsWhen} setCondition={setCondition} setCriteriaFilter={setCriteriaFilter} />

      <AddAction value={value} onChange={onChange} setTemplate={setTemplate} setSendTo={setSendTo} setDelayBetween={setDelayBetween} setTask={setTask} actionLines={actionLines} setActionLines={setActionLines} setOccurrence={setOccurrence} setEventTrigger={setEventTrigger} setBeforeAfter={setBeforeAfter} setDelay={setDelay} />

      <button
        className='m-2 text-slate1 border-white border-1'
        onClick={() => setApply(true)}>
        Review
      </button>

      <input type='hidden' value={criteriaColumn} name='criteriaColumn' />
      <input type='hidden' value={condition} name='condition' />
      <input type='hidden' value={isWhen} name='isWhen' />
      <input type='hidden' value={task} name='task' />
      <input type='hidden' value={delayBetween} name='delayBetween' />
      <input type='hidden' value={sendTo} name='sendTo' />
      <input type='hidden' value={template} name='template' />
      <input type='hidden' value={criteriaFilter} name='criteriaFilter' />

      {apply === true && (
        <div className='border border-white border-1 mx-auto rounded-md text-slate1 p-2'>
          <h4 className='text-center'>{title}</h4>
          <br />
          <p>
            This automation will try to go off when
            <span className='text-[#60b9fd]'>
              {whenValue}
            </span>
            after the field:
            <span className='text-[#60b9fd]'>
              {triggerField}
            </span>
            is updated.
          </p>
          <br />
          <p>The criteria are:</p>

          {lines.map((line, index) => (
            <p key={index}>
              Criteria {index + 1}:
              <span className='text-[#60b9fd]'>
                {line.criteriaColumn} {line.isWhen} {line.criteriaFilter} {line.condition}
              </span>
            </p>
          ))}
          <br />
          <p>Once met the following actions will be triggered:</p>
          {actionLines.map((line, index) => (
            <p key={index}>
              Action {index + 1}: {line.task} {line.template} {line.sendTo} {line.delayBetween}
            </p>
          ))}

        </div>

      )}
    </Form >
  );
}

 */
