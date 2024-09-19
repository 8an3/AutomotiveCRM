
import { Fragment, useState, useCallback, useEffect, useRef, useMemo, useDeferredValue } from 'react'
import { Calendar, Views, dayjsLocalizer, Navigate } from 'react-big-calendar'
import { Text, } from '@radix-ui/themes';
import { UserPlus, Gauge, CalendarPlus, ChevronsLeft, ChevronsRightLeft, ChevronsRight, ArrowLeft, ArrowRight, Sheet, Truck, Wrench } from 'lucide-react';
import clsx from 'clsx'
import { Button, buttonVariants, Popover, PopoverTrigger, PopoverContent, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, Input, Card, } from "~/components";
import calendarIcon from '~/images/favicons/calendar.svg'

// <ViewToolbar setView={setView} />
export const ViewToolbar = ({

  setView
}) => {
  return (
    <div className='mt-3 mx-auto'>
      <Select
        //  value={view}
        onValueChange={(value) => setView(value)}>
        <SelectTrigger className="w-[180px] mx-auto">
          <SelectValue placeholder="Select A Calendar View" />
        </SelectTrigger>
        <SelectContent className='border-border'>
          <SelectGroup>
            <SelectLabel>Views</SelectLabel>
            <SelectItem value='day'>
              Day
            </SelectItem>
            <SelectItem value='week'>
              Week
            </SelectItem>
            <SelectItem value='month'>
              Month
            </SelectItem>
            <SelectItem value='agenda'>
              Agenda
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export const ViewNamesGroup = ({ views: viewNames, view, messages, onView }) => {
  return viewNames.map((name) => (
    <Button
      key={name}
      type="button"
      className={clsx({ 'rbc-active': view === name })}
      onClick={() => onView(name)}
    >
      <Text>{messages[name]}</Text>
    </Button>
  ))
}

export const CustomToolbar = ({
  label,
  localizer: { messages },
  onNavigate,
  onView,
  view,
  views,
}) => {
  return (
    <div className="rbc-toolbar items-center">

      <span className="rbc-toolbar-label text-foreground text-center text-2xl my-auto">{ }</span>
      <span className="ml-auto justify-end mr-5">

      </span>
      <div className="ml-auto justify-end my-auto items-center">
        <Button
          variant='outline'
          className=' text-center my-auto  p-2 cursor-pointer hover:text-primary justify-center items-center border-border mr-4'
          onClick={() => onNavigate(Navigate.TODAY)}
        >
          Today
        </Button>
        <Button
          variant='ghost'
          className=' p-2 cursor-pointer hover:text-primary justify-center items-center border-transparent hover:bg-transparent'
          onClick={() => onNavigate(Navigate.PREVIOUS)}
        >
          <ArrowLeft />
        </Button>

        <Button
          variant='ghost'
          className='p-2 cursor-pointer hover:text-primary justify-center items-center mr-3 border-transparent hover:bg-transparent'
          onClick={() => onNavigate(Navigate.NEXT)}
        >
          <ArrowRight />
        </Button>
      </div>
    </div>
  )
}
export const mobileToolbar = ({
  label,
  localizer: { messages },
  onNavigate,
  onView,
  view,
  views,
}) => {
  return (
    <div className="grid grid-cols-1">

      <span className="mx-auto">{label}</span>

      <span className="mx-auto">
        <button className='rounded-tl-md   rounded-bl-md   p-2 cursor-pointer hover:text-primary justify-center items-center ' onClick={() => onNavigate(Navigate.PREVIOUS)}
        >
          <ChevronsLeft size={20} strokeWidth={1.5} />
        </button>
        <button className='rounded-none  p-2 cursor-pointer hover:text-primary justify-center items-center '
          onClick={() => onNavigate(Navigate.TODAY)}
        >
          Today
        </button>
        <button className=' rounded-tr-md  rounded-br-md  p-2 cursor-pointer hover:text-primary justify-center items-center mr-3'
          onClick={() => onNavigate(Navigate.NEXT)}
        >
          <ChevronsRight size={20} strokeWidth={1.5} />
        </button>
      </span>
    </div>
  )
}
export const noToolbar = ({
  label,
  localizer: { messages },
  onNavigate,
  onView,
  view,
  views,
}) => {
  return (
    <div className="rbc-toolbar">


    </div>
  )
}


export const colors = [
  '#039be5',
  '#7986cb',
  '#f6bf26',
  '#9e69af',
  '#4285f4',
  '#33FFF3',
  '#ad1457',
  '#f09300',
  '#7cb342',
  '#1757aa',
  '#f4511e',
  '#0b8043',
  '#3f51b5',
  '#039be5',
  '#d81b60',
];

export interface IEventInfo extends Event {
  _id: string
  id: string
  todoId?: string
  description: string
  allDay: string
  start: string
  end: string
  resourceId: number
  userEmail: string
  followUpDay1: string
  financeId: string
  direction: string
  resultOfcall: string
  firstName: string
  lastName: string
  email: string
  brand: string
  intent: string
  contactMethod: string
  completed: string
  apptStatus: string
  apptType: string
  title: string
  note: string
  phone: string
  resourceId2: string
  address: string
  userId: string
  userName: string
  messageTitle: string
  attachments: string
  getClientFileById: string
  followUpDay: string
  clientFileId: string
  model: string
  unit: string

  writer: string
  tech: string
  vin: string
  tag: string
  motor: string
  location: string
  workOrderId: number
  mileage: string
  color: string
}

export interface EventFormData {
  todoId: string
  description: string
  allDay: string
  start: string
  end: string
  resourceId: string
  userEmail: string
  followUpDay1: string
  financeId: string
  direction: string
  resultOfcall: string
  firstName: string
  lastName: string
  email: string
  brand: string
  intent: string
  contactMethod: string
  completed: string
  apptStatus: string
  resourceId2: string
  stockNum: string
  apptType: string
  unit: string
  title: string
  note: string
  phone: string
  address: string
  userId: string
  userName: string
  messageTitle: string
  attachments: string
  getClientFileById: string
  model: string
  writer: string
  tech: string
  tag: string
  motor: string
  location: string
  workOrderId: number
  mileage: string
  color: string
}

export interface DatePickerEventFormData {
  allDay: boolean
  start?: Date
  end?: Date
  todoId: string
  description: string
  resourceId: string
  userEmail: string
  followUpDay1: string
  financeId: string
  direction: string
  resultOfcall: string
  firstName: string
  lastName: string
  email: string
  brand: string
  intent: string
  contactMethod: string
  completed: string
  apptStatus: string
  apptType: string
  title: string
  note: string
  phone: string
  address: string
  userId: string
  userName: string
  messageTitle: string
  attachments: string
  resourceId2: string
  getClientFileById: string
  model: string
  unit: string
  writer: string
  tech: string
  vin: string
  tag: string
  motor: string
  location: string
  workOrderId: number
  mileage: string
  color: string
}

export const initialEventFormState: EventFormData = {
  description: "",
  todoId: undefined,
  completed: 'no',
  apptType: '',
  getClientFileById: '',
  userEmail: '',
  followUpDay: '',
  clientFileId: '',
  brand: '',
  model: '',
  stockNum: '',
  writer: '',
  tech: '',
  vin: '',
  tag: '',
  motor: '',
  location: '',
  workOrderId: '',
  mileage: '',
  color: '',
}

export const initialDatePickerEventFormData: DatePickerEventFormData = {
  description: "",
  todoId: undefined,
  allDay: false,
  start: undefined,
  resourceId2: '',
  end: undefined,
  apptType: '',
  completed: '',
  resourceId: '',
  userEmail: '',
  followUpDay1: '',
  financeId: '',
  direction: '',
  resultOfcall: '',
  firstName: '',
  lastName: '',
  email: '',
  brand: '',
  intent: '',
  contactMethod: '',
  apptStatus: '',
  unit: '',
  title: '',
  note: '',
  phone: '',
  address: '',
  userId: '',
  userName: '',
  messageTitle: '',
  attachments: '',
  getClientFileById: '',
  followUpDay: '',
  clientFileId: '',
  model: '',
  writer: '',
  tech: '',
  vin: '',
  tag: '',
  motor: '',
  location: '',
  workOrderId: '',
  mileage: '',
  color: '',

}

export interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  onDeleteEvent: (e: MouseEvent<HTMLButtonElement>) => void
  onCompleteEvent: (e: MouseEvent<HTMLButtonElement>) => void
  currentEvent: IEventInfo
  user: IUser
  techs: any
}

export const useScreenSize = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isSmallScreen;
};

export const resourceTitle = (resource) => {

  return (
    <div className='h-[50px] flex justify-center items-center mt-[25px]'>
      {resource.resourceTitle === 'Service Desk' ? (
        <Sheet />
      ) : resource.resourceTitle === 'Deliveries' ? (
        <Truck />
      ) : <Wrench />}
      <p className='text-foreground text-center text-3xl my-auto ml-3'>{resource.resourceTitle}</p>
    </div>
  )
}
