import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
  CardTitle,
  Button,
  Separator,
  Label,
} from "~/components"
import { prisma } from "~/libs";
import * as Slider from '@radix-ui/react-slider';
import { type LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import charts from "~/styles/charts.css";
import { Badge } from "~/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Hr } from "@react-email/components";
import { Copy } from "lucide-react";
import { RocketIcon } from "@radix-ui/react-icons"

function calculateTimeWasted(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffInMs = endDate - startDate;
  const diffInSeconds = diffInMs / 1000 / 60;
  return diffInSeconds;
}

export default function Component() {
  const { getLastDemo, getDifference } = useLoaderData();
  const [start] = useState(getLastDemo.start);
  const [end] = useState(getLastDemo.end);
  const [calls, setCalls] = useState(10);
  const [wasteMultiplier, setWasteMultiplier] = useState(1);

  const initial = {
    maxCalls: 200,
    callIntervals: 25,
    timeWastedInSeconds: calculateTimeWasted(start, end),

  }
  const [formData, setFormData] = useState(initial)


  const data = Array.from({ length: formData.maxCalls / formData.callIntervals }, (_, i) => {
    const currentCalls = (i + 1) * formData.callIntervals;
    return {
      calls: currentCalls,
      timeWasted: currentCalls * formData.timeWastedInSeconds * wasteMultiplier
    };
  });

  const handleSliderChange = (event) => {
    setWasteMultiplier(event.target.value);
  };

  return (
    < div className='bg-[#09090b] text-[#fafafa] grid grid-cols-2'>
      <Card className='w-[30%] h-autp max-h-[500px] mx-auto mr-5'>
        <CardHeader className="px-7">
          <CardTitle>Time Wasted from this singular process.</CardTitle>
          <CardDescription>{getDifference}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Calls</TableHead>
                <TableHead>Wasted Minutes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(({ calls, timeWasted }, index) => (
                <TableRow key={index}>
                  <TableCell>{calls}</TableCell>
                  <TableCell>{timeWasted}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <input
              type="range"
              value={wasteMultiplier}
              onChange={handleSliderChange}
              min={1}
              max={10}
              step={0.1}
              className="bg-gray-300 h-3 w-1/2 appearance-none rounded-full shadow-sm outline-none"
            />
            <div className="mt-2 text-center">
              <span>Waste Multiplier: {wasteMultiplier}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card
        className="overflow-hidden text-[#f0f0f0]" x-chunk="dashboard-05-chunk-4"
      >
        <CardHeader className="flex flex-row items-start bg-[#18181a]">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Adjust Variables
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy className="h-3 w-3" />

              </Button>
            </CardTitle>
          </div>
          <div className="ml-auto flex items-center gap-1">

          </div>
        </CardHeader>
        <CardContent className="flex-grow !grow overflow-y-scroll overflow-x-clip p-6 text-sm bg-[#09090b]">
          <div className="grid gap-3 max-h-[20vh] h-auto">
            <hr className="my-3 text-[#27272a] w-[98%] mx-auto" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Minutes per call</span>
                <span>{formData.timeWastedInSeconds}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>$5.00</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>$25.00</span>
              </li>
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Total</span>
                <span>$329.00</span>
              </li>
            </ul>

            <hr className="my-3 text-[#27272a] w-[98%] mx-auto" />
            <div className="grid gap-3 mx-3 mb-3">
              <div className="grid gap-3">

                <Label htmlFor="name">Wasted Minutes</Label>
                <Input
                  name="timeWastedInSeconds"
                  type="text"
                  defaultValue={formData.timeWastedInSeconds}
                  className="w-sm bg-[#09090b] border-[#27272a] "
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="name">Mac Calls</Label>
                <Input
                  name="maxCalls"
                  type="text"
                  defaultValue={formData.maxCalls}
                  className="w-sm bg-[#09090b] border-[#27272a] "
                />

              </div>
              <div className="grid gap-3">
                <Label htmlFor="name">Call Interval</Label>
                <Input
                  name="callIntervals"
                  type="text"
                  defaultValue={formData.callIntervals}
                  className="w-sm bg-[#09090b] border-[#27272a] "
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="name">Multitplier</Label>
                <Input
                  name="Multitplier"
                  defaultValue={wasteMultiplier}
                  type="number"
                  className="w-full bg-[#09090b] border-[#27272a] "
                />
              </div>
            </div>
            < fieldset className="mt-10 mb-10 grid gap-6 rounded-lg border p-4 mx-auto w-auto text-[#f9f9f9]   border-[#27272a] " >
              <legend className="-ml-1 px-1 text-sm font-medium flex">
                <RocketIcon className="h-4 w-4 mr-2" />
                Demo
              </legend>
              <div className="grid gap-3">
                <Label htmlFor="role" className='text-2xl'>
                </Label>
                <p></p>
                <p className='text-[#949494] text-xl'>
                </p>
              </div>
              <div className="grid gap-3">
                <Button
                  className='bg-[#c72323] '
                  onClick={() => navigate('/demo/improvedDash')}
                >
                  Next
                </Button>
              </div>
            </fieldset >
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t border-[#27272a] bg-[#18181a] px-6 py-3">
          <div className="text-xs text-[#18181a]">
            Updated <time dateTime="2023-11-23">November 23, 2023</time>
          </div>
        </CardFooter>
      </Card>
    </ div >

  )
}



export const links = () => [
  { rel: "stylesheet", href: charts },
];

export const loader: LoaderFunction = async () => {
  function getSecondsBetweenDates(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffInMilliseconds = Math.abs(d1 - d2);
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    return diffInSeconds
  }

  const getLastDemo = await prisma.demoTime.findFirst({
    orderBy: {
      createdAt: 'desc'
    }
  });
  const getDifference = getSecondsBetweenDates(getLastDemo.start, getLastDemo.end)
  return json({ getDifference, getLastDemo });
};


