import { Typography } from "@mui/material"
import { type IEventInfo } from "~/futureRoutes/dashboard.calls"
import { useState } from "react"
import { Bookmark } from "lucide-react"
import { Flex, Text, Heading, Container, Box, Grid } from '@radix-ui/themes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Input, Button, TooltipProvider, TooltipTrigger, TooltipContent, TooltipAuto } from "~/components/ui/index"
import * as Tooltip from '@radix-ui/react-tooltip';

interface IProps {
  event: IEventInfo
}


const EventInfo = ({ event }: IProps) => {

  const data = event
  console.log(data, 'event data')
  return (
    <>
      <Tooltip.Provider>

        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger asChild>
            <div className='flex items-center cursor-pointer'>
              {event?.completed === 'yes' && (
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/a988022497f5e1f4da2fb8abae215748e34227097d0680432329fa00986efb7c?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
                  className="w-4"
                  alt="Logo"
                />
              )}
              <p className='ml-2'>{event.firstName} {event.lastName} {event.unit}</p>
              <Bookmark strokeWidth={1.5} />
            </div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              avoidCollisions={true}
              side="bottom"
              data-state="instant-open"
              className="w-[500px] ml-5  z-[99999] select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
              sideOffset={5}
            >
              <div className='absolute bg-white p-4 border rounded shadow-md text-black z-[500]'>
                {/* Additional content or functionality goes here */}
                <p>{event.brand}</p>
                <p>{event.unit}</p>
                <p>Contact method: {event.contactMethod}</p>
                <p>Event type/dept: {event.apptType}</p>
                <p>Completed: {event.completed}</p>


                <p>Sales Person: {event.userName}</p>
                {event && event.note && (
                  <p>{event.note}</p>
                )}
                {event && event.description && (
                  <p>{event.description}</p>
                )}
                {event && event.vin && (
                  <p>{event.vin}</p>
                )}
                {event && event.stockNum && (
                  <p>{event.stockNum}</p>
                )}
                {event && event.resultOfcall && (
                  <p>{event.resultOfcall}</p>
                )}
              </div>
              <Tooltip.Arrow className="fill-white" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </>
  );
};

export default EventInfo;

/**
const EventInfo = ({ event }: IProps) => {
  const [data, setData] = useState({
    completed: event?.completed,
  })
  return (
    <>
      <div>
        <div className='flex items-center cursor-pointer'>
          {event?.completed === 'yes' && (
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/a988022497f5e1f4da2fb8abae215748e34227097d0680432329fa00986efb7c?apiKey=fdb7b9e08a6a45868cbaa43480e243cd&"
              className="w-4"
              alt="Logo"
            />
          )}
          <p className='ml-2'>{event.firstName} {event.lastName}</p>
          <Bookmark strokeWidth={1.5} />

        </div>
        <Text>{event.title} </Text>
        <Text>{event.contactMethod}</Text>

      </div>
    </>

  )
}
 */
