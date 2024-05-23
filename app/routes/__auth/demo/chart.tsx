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
  Input,
  CardFooter,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components"
import { prisma } from "~/libs";
import * as Slider from '@radix-ui/react-slider';
import { type LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
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
  const navigate = useNavigate()
  const initial = {
    maxCalls: 200,
    callIntervals: 25,
    timeWastedInSeconds: calculateTimeWasted(start, end).toFixed(2),
    szpaperwork: 22,
    szlicensing: 30,
    szsales: 200,
    szwastedMin: 1.5,
    zscalls: 115,
    partsRelated: 18,
    serviceRelated: 18,
    employees: 4,

  }
  const [formData, setFormData] = useState(initial)
  const [first, setFirst] = useState(true)
  const [second, setSecond] = useState(false)


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


  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value, }))
  }

  return (
    <div className='grid grid-cols-1'>
      <Tabs defaultValue="account" className="w-[45%]  mt-[100px]  mx-auto ">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Time Wasted</TabsTrigger>
          <TabsTrigger value="password">Tally</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          < div className='bg-[#09090b] text-[#fafafa] grid grid-cols-2 '>
            <Card className='w-[98%] h-auto max-h-[500px] mx-auto mr-2'>
              <CardHeader className="px-7 bg-[#18181a]">
                <CardTitle>Time Wasted / Day</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Calls</TableHead>
                      <TableHead className='text-right'>Wasted Minutes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map(({ calls, timeWasted }, index) => (
                      <TableRow key={index}>
                        <TableCell >{calls}</TableCell>
                        <TableCell className='text-right'>{timeWasted.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

              </CardContent>

            </Card>
            <Card
              className="w-auto overflow-hidden text-[#f0f0f0] ml-2" x-chunk="dashboard-05-chunk-4"
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

              </CardHeader>
              <CardContent className="flex-grow  overflow-y-scroll overflow-x-clip p-6 text-sm bg-[#09090b]">
                <div className="grid gap-3 max-h-[30vh] h-auto">
                  <hr className="my-3 text-[#27272a] w-[98%] mx-auto" />
                  <div className="grid gap-3 mx-3 mb-3">
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground">Wasted Minutes</span>
                        <span>
                          <Input
                            name="timeWastedInSeconds"
                            type="text"
                            onChange={handleChange}

                            defaultValue={formData.timeWastedInSeconds}
                            className="w-[50px] bg-[#09090b] border-[#27272a] "
                          />
                        </span>
                      </li>
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground">Call Interval</span>
                        <span>
                          <Input
                            name="callIntervals"
                            type="text"
                            onChange={handleChange}

                            defaultValue={formData.callIntervals}
                            className="  w-[50px]  bg-[#09090b] border-[#27272a] "
                          />
                        </span>
                      </li>
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground">Max Calls</span>
                        <span><Input
                          name="maxCalls"
                          type="text"
                          onChange={handleChange}

                          defaultValue={formData.maxCalls}
                          className="w-[50px]  bg-[#09090b] border-[#27272a] "
                        />
                        </span>
                      </li>
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground">Multitplier</span>
                        <span>
                          <Input
                            name="Multitplier"
                            defaultValue={wasteMultiplier}
                            onChange={handleChange}

                            className="w-[50px]  bg-[#09090b] border-[#27272a] "
                          />
                        </span>
                      </li>
                    </ul>
                    <hr className="my-3 text-[#27272a] w-[98%] mx-auto" />
                    <p className='text-lg'>At 100 calls / day</p>
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Minutes per call</span>
                        <span>{formData.timeWastedInSeconds}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Wasted time / Week</span>
                        <span>{Number(formData.timeWastedInSeconds) * 100 * 5}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground"> / Month</span>
                        <span>{Number(formData.timeWastedInSeconds) * 100 * 20}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground"> / Year</span>
                        <span>{Number(formData.timeWastedInSeconds) * 100 * 20 * 12} / Mins</span>
                      </li>
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground"> / Year</span>
                        <span>{Number(formData.timeWastedInSeconds) * 100 * 20 * 12 / 352 * 24} / Hours</span>
                      </li>
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground"> / Year</span>
                        <span>{Number(formData.timeWastedInSeconds) * 100 * 20 * 12 / 352} / Days</span>
                      </li>
                    </ul>
                    <hr className="my-3 text-[#27272a] w-[98%] mx-auto" />
                    <p className='text-lg'>What if your an employer?</p>
                    <ul className="grid gap-3">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Employees</span>
                        <span>
                          <Input
                            name="employees"
                            defaultValue={formData.employees}
                            onChange={handleChange}

                            className="w-[50px]  bg-[#09090b] border-[#27272a] "
                          />
                        </span>
                      </li>
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-muted-foreground">Per Day</span>
                        <span>{Number(formData.timeWastedInSeconds) * 100 * formData.employees} / Mins</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ div >
        </TabsContent>
        <TabsContent value="password">
          <Card className='text-[#fafafa]'>
            <CardHeader className="flex flex-row items-start bg-[#18181a]">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Full Example
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
            <CardContent className="flex-grow  overflow-y-scroll overflow-x-clip p-6 text-sm bg-[#09090b]">
              <div className="grid gap-3 max-h-[30vh] h-auto">
                <hr className="my-3 text-[#27272a] w-[98%] mx-auto" />
                <div className="grid gap-3 mx-3 mb-3">
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Wasted Minutes</span>
                      <span>
                        <Input
                          name="szwastedMin"
                          onChange={handleChange}
                          defaultValue={formData.szwastedMin}
                          className="w-[75px] bg-[#09090b] border-[#27272a] "
                        />
                      </span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Calls / Day</span>
                      <span>
                        <Input
                          name="zscalls"
                          type="text"
                          onChange={handleChange}
                          defaultValue={formData.zscalls}
                          className="  w-[75px]  bg-[#09090b] border-[#27272a] "
                        />
                      </span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Completing Licensing / Sale</span>
                      <span><Input
                        name="szlicensing"
                        type="text"
                        onChange={handleChange}
                        defaultValue={formData.szlicensing}
                        className="w-[75px]  bg-[#09090b] border-[#27272a] "
                      />
                      </span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Completing Paperwork / Sale</span>
                      <span>
                        <Input
                          name="szpaperwork"
                          onChange={handleChange}
                          defaultValue={formData.szpaperwork}
                          className="w-[75px]  bg-[#09090b] border-[#27272a] "
                        />
                      </span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Parts Related Tasks / Sale</span>
                      <span>
                        <Input
                          name="partsRelated"
                          onChange={handleChange}
                          defaultValue={formData.partsRelated}
                          className="w-[75px]  bg-[#09090b] border-[#27272a] "
                        />
                      </span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Service Related Tasks / Sale</span>
                      <span>
                        <Input
                          name="serviceRelated"
                          onChange={handleChange}
                          defaultValue={formData.serviceRelated}
                          className="w-[75px]  bg-[#09090b] border-[#27272a] "
                        />
                      </span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Sales / Year</span>
                      <span>
                        <Input
                          name="szsales"
                          onChange={handleChange}
                          defaultValue={formData.szsales}
                          className="w-[75px]  bg-[#09090b] border-[#27272a] "
                        />
                      </span>
                    </li>
                  </ul>
                  <hr className="my-3 text-[#27272a] w-[98%] mx-auto" />
                  <p className='text-lg'>At 100 calls / day</p>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Minutes per call</span>
                      <span>{formData.szwastedMin}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Wasted time / Week</span>
                      <span>{Number(formData.szwastedMin) * 100 * 5}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground"> / Month</span>
                      <span>{Number(formData.szwastedMin) * 100 * 20}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground"> / Year</span>
                      <span>{Number(formData.szwastedMin) * 100 * 20 * 12} / Mins</span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground"> / Year</span>
                      <span>{Number(formData.szwastedMin) * 100 * 20 * 12 / 352 * 24} / Hours</span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground"> / Year</span>
                      <span>{Number(formData.szwastedMin) * 100 * 20 * 12 / 352} / Days</span>
                    </li>
                  </ul>
                  <p className='text-lg'>Time spent per sale</p>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total / Sale</span>
                      <span>
                        {(
                          formData.serviceRelated +
                          formData.partsRelated +
                          formData.szpaperwork +
                          formData.szlicensing
                        )} /Mins
                      </span>

                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">x amount of sales / year</span>
                      <span>
                        {(
                          formData.serviceRelated +
                          formData.partsRelated +
                          formData.szpaperwork +
                          formData.szlicensing
                        ) * formData.szsales} / Mins
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Wasted time per call + sales duties</span>
                      <span>
                        {
                          (Number(formData.szwastedMin) * 100 * 20 * 12) +
                          ((
                            formData.serviceRelated +
                            formData.partsRelated +
                            formData.szpaperwork +
                            formData.szlicensing
                          ) * formData.szsales)} / Mins
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>

          </Card>
        </TabsContent>
      </Tabs>
      {first === true ? (
        <>
          <fieldset className="mt-10 mb-10 grid gap-6 rounded-lg border p-4 mx-auto w-auto text-[#f9f9f9] border-[#27272a] max-w-[50%]">
            <legend className="-ml-1 px-1 text-sm font-medium flex">
              <RocketIcon className="h-4 w-4 mr-2" />
              I know...
            </legend>
            <div className="grid gap-3">
              <p className="text-[#949494]">
                These numbers are big, but ask yourself with how much we are always looking to strive to be the best.
              </p>
              <p className="text-[#949494]">
                When has a sales coach ever sat you down and looked at these numbers?
              </p>
              <p className="text-[#949494]">
                They don't. All they look at with you are how many sales you got.
              </p>
              <p className="text-[#949494]">
                The reason they don't, when you look at these types of numbers you have to be honest with yourself, and most aren't.
              </p>
            </div>
            <Button
              name='intent'
              value='demoTime'
              className='bg-[#c72323] '
              onClick={() => {
                setFirst(false)
                setSecond(true)
              }}
            >
              Next
            </Button>
          </fieldset>

        </>
      ) : second === true ? (
        <>
          <fieldset className="mt-10 mb-10 grid gap-6 rounded-lg border p-4 mx-auto w-auto text-[#f9f9f9] border-[#27272a]">
            <legend className="-ml-1 px-1 text-sm font-medium flex">
              <RocketIcon className="h-4 w-4 mr-2" />
              What if...
            </legend>
            <div className="grid gap-3">
              <p className="text-[#949494]">
                We can adjust some of these numbers.
              </p>
              <p className="text-[#949494]">
                You will have to go to the second tab named tally to input all the numbers.
              </p>
            </div>
            <div className="grid gap-3">
              <ul>
                <li>
                  <p>Wasted mins: 0.1</p>
                </li>
                <li>
                  <p>Completing Licensing: 20</p>
                </li>
                <li>
                  <p>Completing Paperwork: 5</p>
                </li>
                <li>
                  <p>Completing Parts Related: 0</p>
                </li>
                <li>
                  <p>Completing Service Related: 10</p>
                </li>
              </ul>
            </div>
            <Button
              name='intent'
              value='demoTime'
              className='bg-[#c72323] '
              onClick={() => {
                setSecond(false)
              }}
            >
              Next
            </Button>
          </fieldset>
        </>
      ) : (
        <>
          <fieldset className="mt-10 mb-10 grid gap-6 rounded-lg border p-4 mx-auto w-auto text-[#f9f9f9] border-[#27272a]">
            <legend className="-ml-1 px-1 text-sm font-medium flex">
              <RocketIcon className="h-4 w-4 mr-2" />
              How...
            </legend>
            <div className="grid gap-3">
              <p className="text-[#949494]">
                We can leverage tech to releive steps in the process, not add to them.
              </p>
            </div>
            <div className="grid gap-3">
              <ul>
                <li>
                  <p>Wasted mins: On a call that doesnt pick up, or an email, everything is done behind the scenes you just put a day in and it will set the next follow up for that day. There is also a second option to set follow ups for the ones that need more comprehensive notes. But tuned a little differently to ensure your completing appts quickly, a lot more quickly than what is used in conventional crms.</p>
                </li>
                <li>
                  <p>Completing Licensing && Completing Paperwork: Paper is already done, just hit print and everything gets done for you. Whether its licensing, contracts, or anything else you need to fill out.</p>
                </li>
                <li>
                  <p>Completing Parts Related & Completing Service Related: The parts order / service workorder should just be sent to the parts inbox or something similar.  Rather than going to each dept in person when you dont need to, waiting for them to be finished with their customer and then explaining what already written down for them.</p>
                </li>
                <li>
                  <p>There are other measures that are impletemented as well, but this is just some examples.</p>
                </li>
              </ul>
            </div>
            <Button
              name='intent'
              value='demoTime'
              className='bg-[#c72323] '
              onClick={() => {
                navigate('/subscribe')
              }}
            >
              Next
            </Button>
          </fieldset>
        </>
      )
      }
    </div >
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


