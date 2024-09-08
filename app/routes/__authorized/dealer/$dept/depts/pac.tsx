import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

export default function Accessories() {
  return (
    <div>
      <Tabs defaultValue="Dashboard" className="w-full mx-3">
        <TabsList>
          <TabsTrigger value="Dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="To Order">To Order</TabsTrigger>
        </TabsList>
        <TabsContent value="Dashboard">
          <Card className='mx-3 w-full'>
            <CardHeader>
              <CardTitle>Set Minimum Inventory Levels For Auto Ordering</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="To Order">
          <Card className='mx-3'>
            <CardHeader>
              <CardTitle>Need To Order</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: '/favicons/calendar.svg' },
];

export const meta = () => {
  return [
    { title: "PAC Dept || ADMIN || Dealer Sales Assistant" },
    {
      property: "og:title",
      content: "Your very own assistant!",
    },
    {
      name: "description",
      content:
        "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
      keywords: "Automotive Sales, dealership sales, automotive CRM",
    },
  ];
};
