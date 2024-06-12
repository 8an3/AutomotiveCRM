import { Typography } from "@mui/material"
import { type IEventInfo } from "~/futureRoutes/dashboard.calls"
import { useState } from "react"
import { Bookmark } from "lucide-react"
import { Flex, Text, Heading, Container, Box, Grid } from '@radix-ui/themes';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Input, Button, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "~/components/ui/index"

interface IProps {
  event: IEventInfo
}
const EventInfo = ({ event }: IProps) => {
  const data = event

  return (
    <>
      <TooltipProvider>
        <Tooltip >
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          <TooltipContent className='w-[300px]'>

            <div className='absolute bg-background p-4 border-border rounded-md shadow-md text-foreground z-[500]'>
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
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
