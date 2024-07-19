import { json, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { GetUser } from '~/utils/loader.server';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { Form, Link, useLoaderData, useLocation, Await, useFetcher, useSubmit, useNavigate } from '@remix-run/react';
import { ProgressCircle } from '@tremor/react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"



export async function action({ request, params }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session = await getSession(request.headers.get('Cookie'));
  const email = session.get('email')
  const user = await GetUser(email)
  return json({ user });
};

export async function loader({ request, params }: LoaderAction) {
  const session = await getSession(request.headers.get('Cookie'));
  const email = session.get('email')
  const user = await GetUser(email)
  return json({ user });
};


export default function NewFile() {
  const { user } = useLoaderData()

  const cards = [
    {
      dept: 'Sales', year: '2024',
      janGoal: 2, janAch: 10,
      febGoal: 3, febAch: 8,
      marGoal: 10, marAch: 10,
      aprGoal: 2, aprAch: 2,
      mayGoal: 4, mayAch: 6,
      junGoal: 10, junAch: 3,
      julGoal: 2, julAch: 2,
      augGoal: 2, augAch: 2,
      sepGoal: 2, sepAch: 2,
      octGoal: 2, octAch: 2,
      novGoal: 2, novAch: 2,
      decGoal: 2, decAch: 2,
    },
    {
      dept: 'Service', year: '2024',
      janGoal: 2, janAch: 2,
      febGoal: 2, febAch: 2,
      marGoal: 2, marAch: 2,
      aprGoal: 2, aprAch: 2,
      mayGoal: 2, mayAch: 2,
      junGoal: 2, junAch: 2,
      julGoal: 2, julAch: 2,
      augGoal: 2, augAch: 2,
      sepGoal: 2, sepAch: 2,
      octGoal: 2, octAch: 2,
      novGoal: 2, novAch: 2,
      decGoal: 2, decAch: 2,
    },
    {
      dept: 'Parts', year: '2024',
      janGoal: 2, janAch: 2,
      febGoal: 2, febAch: 2,
      marGoal: 2, marAch: 2,
      aprGoal: 2, aprAch: 2,
      mayGoal: 2, mayAch: 2,
      junGoal: 2, junAch: 2,
      julGoal: 2, julAch: 2,
      augGoal: 2, augAch: 2,
      sepGoal: 2, sepAch: 2,
      octGoal: 2, octAch: 2,
      novGoal: 2, novAch: 2,
      decGoal: 2, decAch: 2,
    },
    {
      dept: 'Accessories', year: '2024',
      janGoal: 2, janAch: 2,
      febGoal: 2, febAch: 2,
      marGoal: 2, marAch: 2,
      aprGoal: 2, aprAch: 2,
      mayGoal: 2, mayAch: 2,
      junGoal: 2, junAch: 2,
      julGoal: 2, julAch: 2,
      augGoal: 2, augAch: 2,
      sepGoal: 2, sepAch: 2,
      octGoal: 2, octAch: 2,
      novGoal: 2, novAch: 2,
      decGoal: 2, decAch: 2,
    },
  ];

  const calculatePercentage = (goal, achiev) => {
    if (goal === 0) return 0;
    return Math.round((achiev / goal) * 100);
  };


  return (
    <div>
      <Tabs defaultValue="dept" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="dept">Store</TabsTrigger>
          <TabsTrigger value="username">{user.name}</TabsTrigger>
        </TabsList>
        <TabsContent value="dept">
          <h2>Dept Leaderboard</h2>
          <div className="container mx-auto p-4 max-h-[700px] h-[700px] overflow-y-auto">
            <div className="grid grid-cols-1">
              {cards.map((card, index) => {
                const charts = [
                  { month: 'Jan', goal: card.janGoal, achiev: card.janAch, percentage: calculatePercentage(card.janGoal, card.janAch) },
                  { month: 'Feb', goal: card.febGoal, achiev: card.febAch, percentage: calculatePercentage(card.febGoal, card.febAch) },
                  { month: 'Mar', goal: card.marGoal, achiev: card.marAch, percentage: calculatePercentage(card.marGoal, card.marAch) },
                  { month: 'Apr', goal: card.aprGoal, achiev: card.aprAch, percentage: calculatePercentage(card.aprGoal, card.aprAch) },
                  { month: 'May', goal: card.mayGoal, achiev: card.mayAch, percentage: calculatePercentage(card.mayGoal, card.mayAch) },
                  { month: 'Jun', goal: card.junGoal, achiev: card.junAch, percentage: calculatePercentage(card.junGoal, card.junAch) },
                  { month: 'Jul', goal: card.julGoal, achiev: card.julAch, percentage: calculatePercentage(card.julGoal, card.julAch) },
                  { month: 'Aug', goal: card.augGoal, achiev: card.augAch, percentage: calculatePercentage(card.augGoal, card.augAch) },
                  { month: 'Sep', goal: card.sepGoal, achiev: card.sepAch, percentage: calculatePercentage(card.sepGoal, card.sepAch) },
                  { month: 'Oct', goal: card.octGoal, achiev: card.octAch, percentage: calculatePercentage(card.octGoal, card.octAch) },
                  { month: 'Nov', goal: card.novGoal, achiev: card.novAch, percentage: calculatePercentage(card.novGoal, card.novAch) },
                  { month: 'Dec', goal: card.decGoal, achiev: card.decAch, percentage: calculatePercentage(card.decGoal, card.decAch) },
                ];
                return (
                  <Card key={index} className="mx-auto max-w-[95%]">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <h2 className="text-center my-auto">{card.dept} - {card.year}</h2>
                      {charts.map((card, index) => (
                        <div className='grid grid-cols-1'>
                          <p className='uppercase text-thin text-center mb-3'>{card.month}</p>
                          <ProgressCircle value={card.percentage} size="lg" color={`${card.percentage === 100 ? '#53B365' : 'primary'}`}>
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-500">
                              {card.percentage}%
                            </span>
                          </ProgressCircle>
                          <p className='mt-3 text-muted-foreground text-center'>{card.goal} / {card.achiev}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>

        </TabsContent>
        <TabsContent value="username">Change your password here.</TabsContent>
      </Tabs>
    </div>
  )
}
