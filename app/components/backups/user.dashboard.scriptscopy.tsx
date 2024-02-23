import React, { useEffect, useState } from 'react';
import { Form, useLoaderData, useFetcher } from '@remix-run/react'
import { Input, Separator, Button, CardContent, Card, CardHeader, CardTitle, RemixNavLink, } from "~/components/ui/index"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "../../other/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "../../other/accordion"
import { Textarea } from "../../other/textarea"
import * as Toast from '@radix-ui/react-toast';
import { scriptsLoader, scriptsAction } from '~/components/actions/scriptsAL';

export const meta = () => {
  return [
    { title: "Toolbox - Dealer Sales Assistant" },
    {
      property: "og:title",
      content: "Your very own assistant!",
    },
    {
      name: "description",
      content: "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
      keywords: 'Automotive Sales, dealership sales, automotive CRM',

    },
  ];
};

export let loader = scriptsLoader
export let action = scriptsAction
export default function Shight() {
  const { user, scripts } = useLoaderData();
  const email = user.email
  const name = user.name
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef(0);
  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, [])

  return (
    <>
      <div className="mt-[15px] mx-auto text-slate3">
        <div className="flex flex-col  justify-center mx-auto">
          <div>
            <h3 className="text-2xl font-thin text-slate3">
              TOOLBOX</h3>
            <p className="text-slate3 text-sm">
              Your ability to close increase with the amount of tools at your
              disposal. A mechanic without a tire iron wouldnt be able to change
              a tire. So why dont more sales people take better care of their
              scripts, closes, and such?
            </p>
            <p className="text-slate3 text-sm">
              This will be a shared repository, so your more than welcome to
              send yours in and use this resource so you don't have to
              upkeep your own. It can be accessed any time, anywhere. No
              need to carry around a notebook.
            </p>
          </div>
          <hr className="solid bg-slate3" />
          <div className="mx-auto mt-6">
            <Tabs defaultValue="Closes" className='w-full'>
              <TabsList className="flex flex-row w-full bg-slate12">
                <TabsTrigger className="cursor-pointer bg-slate11 border border:bg-slate10 text-slate3 mx-1 active:text-[#02a9ff] " value="Closes">Closes</TabsTrigger>
                <TabsTrigger className="cursor-pointer bg-slate11 border border:bg-slate10 text-slate3 mx-1 " value="Overcomes">Overcomes</TabsTrigger>
                <TabsTrigger className="cursor-pointer bg-slate11 border border:bg-slate10 text-slate3 mx-1 " value="FollowUp">FollowUp</TabsTrigger>
                <TabsTrigger className="cursor-pointer bg-slate11 border border:bg-slate10 text-slate3 mx-1 " value="Qualifying">Qualifying</TabsTrigger>
              </TabsList>
              <TabsList className="flex flex-row w-full mt-1 bg-slate12">
                <TabsTrigger className="cursor-pointer bg-slate11 border border:bg-slate10 text-slate3 mx-1 " value="Upsell">Upsell</TabsTrigger>
                <TabsTrigger className="cursor-pointer bg-slate11 border border:bg-slate10 text-slate3 mx-1 " value="Texting">Texting</TabsTrigger>
                <TabsTrigger className="cursor-pointer bg-slate11 border border:bg-slate10 text-slate3 mx-1 " value="Automation">Automation</TabsTrigger>
                <TabsTrigger className="cursor-pointer bg-slate11 border border:bg-slate10 text-slate3 mx-1 " value="TipsandTricks">Tips and Tricks</TabsTrigger>
              </TabsList>
              <hr className="solid  mt-7 bg-slate3" />
              <TabsContent value="Closes">
                <Closes />
              </TabsContent>
              <TabsContent value="Overcomes">
                <Overcomes />
              </TabsContent>
              <TabsContent value="FollowUp">
                <FollowUp />
              </TabsContent>
              <TabsContent value="Qualifying">
                <Qualifying />
              </TabsContent>
              <TabsContent value="Upsell">
                <Upsell />
              </TabsContent>
              <TabsContent value="Texting">
                <Texting />
              </TabsContent>
              <TabsContent value="Automation">
                <Automation />
              </TabsContent>
              <TabsContent value="TipsandTricks">
                <TipsandTricks />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}


/**
 *
 *

export function FollowUp() {
  const { followups } = useLoaderData()
  return (
    <>
      <ul>
        {followups.map((followup) => {
          return (
            <ul key={followup.id}>
              <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

                <CardContent>
                  <p className="">
                    Submitted by: {followup.name}
                  </p>
                  <Separator />
                  <p className=" text-sm mt-3">
                    {followup.content}
                  </p>
                </CardContent>
              </Card>
            </ul>
          );
        })}
      </ul >
    </>
  )
}
 */


/*
function TestDrive() {
  const { TestDrive } = useLoaderData()
  return (
    <ul>
      {TestDrive.upsell.map((TestDrives) => (
        <li key={TestDrives.id}>
          <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

            <CardContent>
              <p className="">
                Submitted by: {TestDrives.name}
              </p>
              <Separator />
              <p className=" text-sm mt-3">
                {TestDrives.script}
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}



function Texting() {
  const { Texting } = useLoaderData()
  return (
    <ul>
      {Texting.upsell.map((Textings) => (
        <li key={Textings.id}>
          <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

            <CardContent>
              <p className="">
                Submitted by: {Textings.name}
              </p>
              <Separator />
              <p className=" text-sm mt-3">
                {Textings.script}
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}







*/

function TipsandTricks() {
  return (
    <>
      <Accordion type="single" collapsible>
        <AccordionItem value="1" className='mt-3 bg-slate12 text-slate3 '>
          <AccordionTrigger className='cursor-trigger'>
            Parts and Accessories
          </AccordionTrigger>
          <AccordionContent >
            <Card className=" mt-3">
              <CardHeader className='bg-slate11 text-slate3 first:rounded-t-md '>
                <CardTitle className='bg-slate11 text-slate3 '>

                </CardTitle>
              </CardHeader>
              <CardContent className='bg-slate11 text-slate3 rounded-b-md '>
                <div className='grid w-full items-center bg-slate11  text-slate3 ' >
                  <p>
                    Do not order/promise parts to a customer who has not signed a bill of sale.
                  </p>
                  <p className='mt-3'>
                    We have seen entire dealers fall prey to this. A customer comes in, orders a part on a unit at the time of purchase, and then the week of pick up or even the day before customer tries to cancel or change the part. If the bill of sale is not signed you legally cannot force them to take it even if its installed.
                  </p>
                  <p className='mt-3'>
                    Your service dept, if its run well. Would have had this completed the week before. It is already installed. The customer signed for it, the customer is taking it. Your dealer put up the funds to order this part. The service dept put in the labour hours to install the part. It's only fair that the customer took the unit with it installed if they did not give you proper time to adjust the order.
                  </p>
                  <p className='mt-3'>
                    At the time of purchase when signing: "I have listed the parts and accessories you wanted on the bill of sale so that we can order them ahead of time and have them installed before you pick up your unit. This way you can enjoy your unit right away. This also ensures that incase the part is on back order, we can try to find a replacement part before you pick up. If you need to cancel the part you need to give me at least 2-3 weeks notice because my service dept will prob work on your unit the week or two before. This doesn't mean your unit will be ready at that time, its just that incase the service dept is on schdule we like to prep units early. That way if anything is wrong at the time of the PDI, we can notify you that we need to change the pick up date. Customers do not appreciate being called the day of or the day before informing them that it's not ready because the manufacturer forgot a bolt, or the shipping company dented a panel. I want your pick up to be as smooth as possible, so sign here."
                  </p>
                  <p className='mt-3'>
                    I dont care if my finance dept cries about not being able to sell their products, after its signed. Too bad. This is for the dealer as a whole, not just the finance managers pocket. They should be there to help the customer when the customer AND dealer needs it. Bills of sales need to be signed asap. We will touch more on this later with ordering units as well.
                  </p>
                  <p className='mt-3'>
                    Are you here to make money? Yes. BUT your also there to protect the dealer and its finances. Have we sold we sold units to nigerian princes? Yes, we will take cash all day long, those 15 units were paid for in cash. Have we sold parts lists that are so long the sales manager freaks out? Yes, but before getting a signed bill of sale we asked the sales manager how much down. The list value was more than $ figure of the unit itself. The list was so big, the manager didn't have faith, gave a huge deposit thinking it wouldnt go through. Still sold it, manager still freaked out. Did the customer have the chance to back out on single part? No. Bill of sale was signed along with a description on the bill it self.
                  </p>
                  <p className='mt-3'>
                    You need to protect the dealer in a lot of ways. On every part you order is on credit, most likely. You need your customers commitment to pay for it. If there is an objection, just explain. "We as a dealer are ordering this part for you, some parts are very sellable yes, others no. Lets be honest here, I want to give you exactly what you want but we also need your commitment. I cant take customer promises on every unit I sell, I would go broke just from inventory credits."
                  </p>
                  <p className='mt-3'>
                    Whenever you talk real to the customer, whether about parts and accessories, or any other issue or subject. The customer will not only appreciate, but understand you. If after all the explantion, the customer "changes their mind", this means that the customer didn't really want it to begin with. Be happy about this, because you just saved yourself from getting yelled at the time of pick up by management.
                  </p>
                </div>
              </CardContent>
            </Card>
            <ul>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="2" className='mt-3 bg-slate10'>
          <AccordionTrigger className='cursor-pointer'>
            Ordering Units / Contracts
          </AccordionTrigger>
          <AccordionContent>
            <Card className=" mt-3">
              <CardHeader>
                <CardTitle>
                  Again entire dealers fall prey to this.
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid w-full items-center mt-3' >
                  <p>
                    Do not order/promise a unit to a customer who has not signed a bill of sale.
                  </p>
                  <p className='mt-3'>
                    Were not going to repeat everything from the last one. But continue on, almost.
                  </p>
                  <p className='mt-3'>
                    A deposit means nothing. I dont care if its your first day, or your tenth year. A deposit still allows the customer to back out. Why are you commiting time, resources and probably headaches of not only your self but to others in your dealer.
                  </p>
                  <p className='mt-3'>
                    Got a yes? Sign, right away. Why wait.
                  </p>
                  <p className='mt-3'>
                    A lot of sales people are so eager, or hungry to get the sale. They just get a deposit. It means nothing because there is no commitment. Maybe they are afraid of contracts. Don't be, if your dealer allows sales people to sign contracts. Practice, alot. This is a great skill to have for the sales process. I will, at nauseam, go over every line with every customer for every deal. Even if they bought a unit off of me yesterday. That way, there is no confusion after the sale. Nothing for the customer to come back saying they are confused about this or that. Whenever you hear customers say this, that person didn't do their job. Finance manager's are notorius for this. They don't have to be, they're afraid if they explain it the way they should, they won't sell their products. Their wrong, you can explain it in a way the customer isn't confused after the sale, and still sell their product. I dont get calls, a week, month or year later asking about some random fee that was never explained.
                  </p>
                  <p className='mt-3'>
                    If your in a dealer where only the finance manager signs the customer:
                    This is where finance managers might get mad. BUT they need to be available, on the customers terms, not theirs. Customers walks in, says yes, but your finance manager says hes going on lunch and would rather call them after or schedule a meeting a week from now. Fuck no. Your the finance manager, getting paid more than the sales guys. Shut the fuck up, do your job and sign the customer. THE SALES PERSON GOT THE YES, WHICH MAKES THE FINANCE MANGERS JOB EASIER TO SELL. The sales person has the hardest job in the dealer. The amount of rejection and stuff we have to go through. I wish I could have someone presell my customers and only deal with yes'. At the same time I don't get the same rush from that. The finance managers need to stop crying. The dealer is not bowing to the finance dept are they? No. The dealer is not bowing to the sales person are they? No. Do your job when it needs to be done. I do not care how much your getting paid, to be honest, I expect more from the ones I'm paying more. So if that bill needs to be signed and your dealer/finance mangers are the ones doing the signing. They need to be there when the customers says yes. Not a week from now.
                  </p>
                  <p className='mt-3'>
                    I have been a GM, sales manager, and a sales person. I have done it all. As a sales person I have even managed sales managers.
                  </p>
                  <p className='mt-3'>
                    I understand the sales process of the box, I've done it. I understand that every finance manager wants a piece of the action. I will help them make as much money for them as they will. With saying that, do not put my customer on hold for any reason. Because its not just my customer their putting on hold, its the dealers customer.
                  </p>
                  <p className='mt-3'>
                    Show your finance, or sales manager this if your not comfortable having this conversation. If this is an issue in your dealer, this conversation needs to happen.
                  </p>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="4" className='mt-3'>
          <AccordionTrigger className="cursor-pointer">

            Taking the lose professionally
          </AccordionTrigger>
          <AccordionContent>
            <Card className=" mt-3">
              <CardHeader>
                <CardTitle>
                  Your not going to make every sale.
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid w-full items-center mt-3' >
                  <p>
                    In the world of sales, no one can close every deal in a dealership. While I've seen it happen in other industries, the automotive sector presents a different reality.
                  </p>
                  <p className='mt-3'>
                    It's not just about you; it's about the general perception customers have about salespeople and dealerships.
                  </p>
                  <p className='mt-3'>
                    Instead of accepting defeat like every other dealer, why not respond differently? In doing so, you might end up gaining more customers than you initially expected, including those who bought elsewhere.
                  </p>
                  <p className='mt-3'>
                    "Congratulations! I hope the unit meets your expectations. If you have any questions, whether about insurance or the best roads to ride on, feel free to ask. I'm more than happy to assist you."
                  </p>
                  <p className='mt-3'>
                    When someone you've just informed about not moving forward with a sale approaches you with such inquiries, they'll remember it. Particularly, if they're the type to be open and direct with their salespeople. Often, they face hostility because the salesperson feels their time was wasted.
                  </p>
                  <p className='mt-3'>
                    Although we didn't close the deal today, consider this: What if the unit they purchased doesn't meet their expectations, or their spouse's? Those are easy sales if you've made a positive impression on the husband. Trust us on that one. What if their circumstances change in a month and they need something different? What if they were eyeing a specific unit, bought elsewhere due to price, but your professional handling of the situation led them to buy their entire corporate fleet from you instead? What if they have a friend looking to buy a unit and they refer them to you because of how you handled the situation?
                  </p>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="5" className='mt-3'>
          <AccordionTrigger className="cursor-pointer">

            Asking the questions other sales people won't
          </AccordionTrigger>
          <AccordionContent>
            <Card className=" mt-3">
              <CardHeader>
                <CardTitle>
                  Does this take skill, no. Does it take confidence, yes.
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid w-full items-center mt-3' >
                  <p>
                    Nothing that we provide here takes skill. It takes confidence. Confidence in your self, your product, your dealer and your industry.
                  </p>
                  <p className='mt-3'>
                    If you don't have confidence in yourself, work on it. If you don't have confidence in your dealer or management, either fill in for the role that they provide or move on.
                  </p>
                  <p className='mt-3'>
                    But an easy way to get a customer talking after a period of no response. Or if they seemed ready to buy yesterday and just went cold. Ask the question. It will seem too forward most, and I've discussed this with many sales coaches who agree with me, almost all sales people don't ask the right questions at the right time.
                  </p>
                  <p className='mt-3'>
                    "Were there any other questions or concerns that was keeping you back from moving forward? I want to make sure you have all the information you need before buying so you make an informed buying decision, I'm hear to help make the process easy for you."
                  </p>
                  <p className='mt-3'>
                    The usaully reaction is, "Do you really say that?" Yes, because I need to know why they arent moving forward when they contacted me. That way I can address the concerns they have, when they are having them. Most of the time, they are trivial and so easy to overcome that its just low lieing fruit. Should I sit at my desk and hope they call back again, no. "The Secret", belongs more in other sections of the book store than where it currently resides. Wishful thinking is not a sales tactic.
                  </p>
                  <p className='mt-3'>
                    The force is not real, you can't move things with your mind. You can pick up the phone though.
                  </p>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="6" className='mt-3'>
          <AccordionTrigger className="cursor-pointer">

            Want to be better than the rest of the dealer?
          </AccordionTrigger>
          <AccordionContent>
            <Card className=" mt-3">
              <CardHeader>
                <CardTitle>

                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid w-full items-center mt-3' >
                  <p>
                    Glengarry Glen Ross, the amount of times I see this in real life. Blows my mind. Never really experinced it in my own dealer till recently. Everyone just wanted to be on coffee breaks. It was insane. 2-3 hour long coffee breaks.
                  </p>
                  <p className='mt-3'>
                    I was doing web leads, only. In the second month I was acheiving higher sales then the rest of the floor, with lower quality leads on a product lineup I've even looked at before. I was doing the exact opposite of what they were doing.
                  </p>
                  <p className='mt-3'>
                    Are coffee breaks and shooting the shit fun? Yes, dont get me wrong, but your there to work. Will they dislike you for it. 100% when they see you making sales when their not. I dont mean to disrespect my colleagues by ignoring them. I really dont, if you ever worked with me and you felt that way, i know most have, I'm sorry. I even take calls when Im on dates with my wife. I love it when the in-laws are in town. We go out to dinner, they talk amongst themselves and I hammer out emails/texts. She gets annoyed and taps my arm and asks what im doing. Just sold 4 units why whats up? How is she going to complain about that, when I'm not even included in the conversation.
                  </p>
                  <p className='mt-3'>
                    The sales people who are really making big numbers, are not doing it because of skill. It's hard work.
                  </p>
                  <p className='mt-3'>
                    When I was a sales manager at a door to door company, I noticed this with some phenomonal people. This is where hard work really shines. There was one employee that worked harder than anyone else. He was horrible at sales, not entirely his fault because he was on the spectrum. But he realised that, and if he wanted to compete with some of the other sales people he had to knock on more doors than anyone else. Did he have really bad days? He did, I felt bad every time these happened. Did he beat some of the best sales people in our location some days? Yes, just from pure brutal grueling hard work of banging on doors all day. When he won those days, he would chirp people so bad, I cracked ribs from laughing so hard hearing what was coming out his mouth.
                  </p>
                  <p className='mt-3'>
                    Take me for exmaple, at that same door to door company. I started with no sales experience. I was horrible. So horrible when I had good days no body would beleive it, sometimes we worked in pairs and they would assume that the person I was with was the one doing the selling. That hurt but I moved on. Worked hard, put my head down and kept at it. There were bad days, but the days kept getting better. The last day of sales, in the last year I was there, it was the end of the season. Literally the last day before we closed for the year. We were selling a product/service that we were not going to provide anymore. The top sales person in the company, was like fuck it im taking the rest of the day off. Because I was a manager, who wanted to work the rest of the season as a sales person I was given first shot at her location. We were so far behind in daily sales, she didnt think anything of it. Thankfully I've been a manger for the last 5 years and can coach people when they need it. Along with the sales skills I've accumulated we fucking crushed it. It was myself and one other sales person working together
                  </p>
                  <p className='mt-3'>
                    This kid was amazing at sales, but he was a mess. If he didnt get a yes every 15 minutes, he had a mental breakdown. If I wasn't closing, I was coaching. I've never told anyone this actual story. We went till 11pm if I remember correctly. We crushed it so hard, didn't eat, didnt break nothing. As good as a sales person as he was, I was keeping up with him. He was the best in their location. If i hadnt been a sales manager and was trained to coach, we would have never beated that record that day. The kid was falling apart too much. As soon as I see him slipping I would coach him for a minute and then get back to sales. He would then start closing again. It was the last day to make money, I wasnt even thinking about anything else. Handed in our money when we were dragged away from management. Back at the office, I didn't realize anything that was going on because I was eating on the other side of the office at midnight. She was so mad I heard her screaming.
                  </p>
                  <p className='mt-3'>
                    I had taken her sales record, on the last day in the last hour. Because I started at 8 that day, I was the one that took her record not my partnet and I. The first partner went home when I went to the other location. My second partner started at 3 in the afternoon. From last to first. She started making so many excuses, she was so furious because of how competitive she was. Sorry.
                  </p>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="7" className='mt-3'>
          <AccordionTrigger className="cursor-pointer">

            Stand your ground with pricing
          </AccordionTrigger>
          <AccordionContent>
            <Card className=" mt-3">
              <CardHeader>
                <CardTitle>

                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid w-full items-center mt-3' >
                  <p>
                    A lot of sales places you won't benefit from this as much as others. Start practicing this now, and you will see the benefits later.
                  </p>
                  <p className='mt-3'>
                    I was taught this in door to door, and forced to do it in automotive. Seriously, no discounts 98% of the time. It's not easy but I'll explain why you should anyways.
                  </p>
                  <p className='mt-3'>
                    That customer took time out of their day to bug you. Your busy dealing with customers, paperwork and whatever else. Are they being paid to come to the store? No. Are you being paid to sell? Yes, so whos time is more valuable in this situation. You came to me in some form or fashion, I didn't come to your workplace to try to sell you what I have. My time is important and I need to dedicate it to people who will buy. So I assume I'm closing you. Every single person. Because if your not here to buy, how dare you waste my time. The amount of stuff I have to do in a day and your trying to take some of that time and waste it? I will not let you.
                  </p>
                  <p className='mt-3'>
                    I was headhunted by a construction company, right in the middle of the pandemic. I'm 6'2 or 3, started growing my beard before the pandemic, but because of every shop being closed, it just grew huge. Tattoos, resting bitch face. As you can tell I'm not the most approachable person. Compared to the other staff in this construction company? The top sales people were a group of 4 women who dressed like they were hitting the bars every day. They looked at me like I wasn't going to make any sales or last long there. I gave that company the thing they needed most, when they needed it. Pandemic everyone was buying. This constrctino company had advertising dialed, to such a degree that your leads were so hot. I have never experienced this before. Especially in automotive. Remember my attitude though? Off the hop, started to kill it. I was told I was the fastest to 100k in commision than anyone before. Day after day, being new I got less calls to get accumulated to the new enviroment, I was still crushing it. Quite a few days I was top in commision. Not in sales, because I didnt have enough calls. But top in commision because this company really paid when you didn't discount. Those women got mad. I can see there point, I was doing half or a third of the amount of calls.
                  </p>
                  <p className='mt-3'>
                    How is this big intimidating guy doing so well? Why hasnt he discounted anything? They complained to the owner so much so that he called me to, "adjust" my sales tactics. My closing rate that week, 82%, I dont care who you are but that kind of sales figures is insane. Who the fuck closes at over 80%. No one. Was I the only one doing it at that company though? There was one other person that week with more follwing extremely close, thats how good and refined their advertising and sales funnel was. I got a call, demanding I start to discount because I was leaving 18% of sales on the table. I thought this was a joke, I laughed so hard. Got me in more trouble because he was serious. I straight up told him, Why do you want me to devalue your service for you? Your service is worth what it is priced at. If im closing at 82% the pricing is fine where it is, if anything you can charge more. This was like a month and a half in, so I was proving you did not need to discount. Everyone took notice, and what started to happen? Over time, everyones discounts started to get smaller. By the time I was done there, everyone had decreased their discounts.
                  </p>
                  <p className='mt-3'>
                    Why did it take me to come in and prove it can be done, for it to get done? Why am I on the phone with the owner of the company explaining to him why he shouldnt discount. He didnt really like me after that conversation. Unfortauntly I had proved him wrong in the end so much so that he started to demand his staff not to discount. If they did he would cancel the deal. Some people can't take being proven wrong. I was only there for 8 months.
                  </p>
                  <p className='mt-3'>
                    Why are you discounting? The only reason people discount is because they don't beleive in the service. Don't beleive it should be priced where it is. Don't beleive in the product. Don't beleive in the dealer. Don't beleive in themselves. If you had that beleif, you will not discount.
                  </p>
                  <p className='mt-3'>
                    I'll let you in on a secret.
                  </p>
                  <p className='mt-3'>
                    The units are priced at what the manufacturer beleives what they should be sold at.
                  </p>
                  <p className='mt-3'>
                    Don't beleive me? I'll prove it to you.
                  </p>
                  <p className='mt-3'>
                    Take the adult toy industry, I'm not talking about sex toys. Porches, BMW, Mercedes.... Look at the pricing. Actually take notice in whatever country your in.
                  </p>
                  <p className='mt-3'>
                    Then pull up other countries, take BMW for exmaple. Most recoginisable brand in the world. Noticed how their priced differently in each country?
                  </p>
                  <p className='mt-3'>
                    I wonder how much money BMW devotes to just invest in learning on what to sell their products at. I can garauntee you, if you knew the type of figures they spend on this type of research you would be floored. Mind blown. How dare you beleive that their product is worth less than the msrp. BMW wants to sell more units than anyone else.
                  </p>
                  <p className='mt-3'>
                    I have been in enough of their training to know this. I know their mind set. They didn't become the most recognizalbe brand for no reason. There product stack is smart, priced at what it needs to be priced in the markets they are in. BMW has incredile funding, mountainsly high. Way more than you can imagine. Cars aren't even the product that makes them the most money. Imagine what that type of funding can provide for each facet of their company.
                  </p>
                  <p className='mt-3'>
                    If you think for a second, that they dont research pricing sensitivety in each market they are in, you are wrong.
                  </p>
                  <p className='mt-3'>
                    So why the fuck are you discounting?
                  </p>
                  <p className='mt-3'>
                    Are you worth $61 billion? BMW is, and they are more right about pricing than you because their doing it in every market they are in. Prices are strategically set to help dealers sell more. Not hoping you discount in order to sell more. With saying that, very few there are, there are brands that torpedo their dealer network. I only know of 1. They also treat their customers the same, the exact opposite of how bmw treats their customers and dealer network. This company is not even worth half a billion. I'm only telling you this last part because that type of company, is extremely rare. All the brands want you to sell more to gain more penetration in whatever market they are in. BMW is not the only company spending resources on this type of research. Instead of going against the millions / billions of dollars spent and not beleiving in the price, beleive in it. There are hundreds of germans in a room, with a lot of money, that are smarter than you. They know what they are doing. Take that team and use it, instead of discarding it.
                  </p>
                  <p className='mt-3'>
                    If your worried about that torpedoing brand, don't because you will recognize it immediatly. 99% of people reading this will not be selling their products. So start beleiving in what you sell.
                  </p>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="8" className='mt-3'>
          <AccordionTrigger className="cursor-pointer">

            Deliver every unit 7 days or later
          </AccordionTrigger>
          <AccordionContent>
            <Card className=" mt-3">
              <CardHeader>
                <CardTitle>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid w-full items-center mt-3' >
                  <p className='mt-3'>
                    I'v found that sticking to a 7-day delivery rule for all our sales can really change the game in tire sales. You know, opting for next-day deliveries or anything less than 7 days can cause more headaches than you'd think.
                  </p>
                  <p className='mt-3'>
                    Imagine this: when we deliver within a day or two, it doesn't give us any wiggle room to tackle issues that might pop up. And here's the thing, stressing the importance of that bill of sale signature can be a game-changer. Tell the customer that without it, their vehicle can't even hit the service department's queue.
                  </p>
                  <p className='mt-3'>
                    Moreover, it's not just about the signature—it's about efficiency. Ordering parts, scheduling services, and dealing with licensing and registration all become way smoother with a 7-day window. Plus, we can handle unforeseen circumstances much better.
                  </p>
                  <p className='mt-3'>
                    Ever noticed how having that extra time results in fewer complaints? And it's not just about us; it's a win-win. We get happier customers and more deals closed efficiently. It also gives us the flexibility to adjust things as needed within that 7-day timeframe.
                  </p>
                  <p className='mt-3'>
                    Bottom line, having this approach in place can make our busiest sales year also the easiest and most successful. It's all about managing expectations and operations in a way that works for everyone.
                  </p>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="9" className='mt-3'>
          <AccordionTrigger className="cursor-pointer">

            Get good with contracts
          </AccordionTrigger>
          <AccordionContent>
            <Card className=" mt-3">
              <CardHeader>
                <CardTitle>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid w-full items-center mt-3' >
                  <p className='mt-3'>
                    dealing with contracts can seem daunting, but let me break it down. Getting that bill of sale signed right after the customer says "yes" is key. It outlines exactly what they're expecting and what we promise to deliver. Plus, it secures their commitment and prevents tying up our funds unnecessarily.
                  </p>
                  <p className='mt-3'>
                    Now, if you're not contract-savvy, that's okay. Practice makes perfect. I go through every line of every contract for every deal. Whether it's a seasoned customer buying multiple bikes or a new customer, I'll make sure they understand every detail. Yes, it's meticulous, but it ensures no confusion.
                  </p>
                  <p className='mt-3'>
                    Explaining contracts in a simple, understandable way is vital. I've seen finance teams struggle with this. We shouldn't fear losing a sale over clarity. Contracts can make everything smooth, especially for units going out in a few weeks. It's about setting expectations and making sure we have everything ordered and scheduled for service in a timely manner.
                  </p>
                  <p className='mt-3'>
                    We let the customer know that changes need to be communicated within a set timeframe. It's all about efficient coordination. For instance, licensing won't be ready until a few days before pickup. We've got a lot on our plate, from registrations to warranties, but planning ahead helps us deliver seamlessly.
                  </p>

                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion >

    </>
  )
}

function Qualifying() {
  const { qualifying, finance } = useLoaderData()
  /**
   *     {
        email: "",
        name: "",
        content: "",
        category: "overcome",
        subCat: 'overcome',
      },
   */


  const [copiedText, setCopiedText] = useState('');

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(''), 3000); // Reset after 3 seconds
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };
  const myQualifing = [
    {
      email: "",
      name: "",
      content: "From the moment we select the right vehicle, and we have a mutal agreement, do you want your new vehicle by the end of the week or the begining of next month?",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "",
      content: "Concerning the purchase of the vehicle, are you making the final decision today? ",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "",
      content: "Did anyone explain to you the different programs that are avialabe on the market today? First we are going to choose the right vehicle for you and then we will select the right program to fit your budget.",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "",
      content: "To be in a comfortable situation, would you invest 25 or 50 more per week on your vehicle? Again to be in a comfrotable situation, would you like to invest 500 or 1000 cash down on your bank loan?",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "",
      content: "What vehicle do you drive now? How much cash did you want to invest?  What were the advatages for you to purchase on your last purchase? Has anything changed since you bought that vehicle last time? More family members, different riding/driving circumstances, etc",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "",
      content: "",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "",
      content: "I may have a buyer for your vehicle, are you loooking to sell it?",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "",
      content: "How many monthly payments do you have left?",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "",
      content: "At this time, how much are you paying every month? Did you finance or purchase out right?",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "",
      content: "Besides the equipemnt, what else is important to you in your next vehicle?  ",
      category: "overcome",
      subCat: 'overcome',
    },

    {
      email: "",
      name: "",
      content: "What made you choose this? What would be the advantages for you to drive this?",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "",
      content: "How many kms do you typically put on in a year?",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "",
      content: "Is this bike going to be used mostly in the city or on the highway?",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "",
      content: "Now who will be the primary driver?",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "",
      content: "What basic features/equipment are important to you? Would this unit meet those requirements?",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "",
      content: "What are we looking at today?",
      category: "overcome",
      subCat: 'overcome',
    },
  ]

  return (
    <>
      <p className=" text-sm">
        How you approch this is extremely market dependant, so we will try to keep this as autmotive as possible.
      </p>
      <ul>
        {myQualifing.map((quals) => {
          return (
            <ul key={quals.id}>
              <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

                <CardContent>

                  <p className=" text-sm mt-3">
                    {quals.content}
                  </p>
                  <button className='ml-auto mt-auto mb-2 mr-2 cursor-pointer' onClick={() => copyText(quals.content)}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  </button>
                  {copiedText === quals.content && <div>Copied!</div>}
                </CardContent>
              </Card>
            </ul>
          );
        })}
      </ul>
      <ul>
        {qualifying.map((qualy) => {
          return (
            <ul key={qualy.id}>
              <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

                <CardContent>
                  <p className="">
                    Submitted by: {qualy.name}
                  </p>
                  <Separator />
                  <p className=" text-sm mt-3">
                    {qualy.content}
                  </p>
                  <button className='ml-auto mt-auto mb-2 mr-2 cursor-pointer' onClick={() => copyText(qualy.content)}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  </button>
                  {copiedText === qualy.content && <div>Copied!</div>}
                </CardContent>
              </Card>
            </ul>
          );
        })}
      </ul>
    </>
  )
}

function FollowUp() {
  /**
   *     {
        email: "",
        name: "",
        content: "",
        category: "followups",
        subCat: 'followups',
      },
   */
  const myFollowUp = [

    {
      email: "",
      name: "",
      content: "Hey just wanted to follow up to our conversations, if your not ready to buy right now when do you want me to follow up with you? I want to respect your time, that way im not wasting your it and bugging you every couple of days.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "While I respect your decision to wait, if this is the unit you want. We can button up the deal now, and you can store it here for free till your ready to pick up. Because if we were to order one we wouldn't get till after June, maybe longer.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "If the season is winding down or coming to a close, it's essential to act swiftly. Our stock levels are depleting rapidly, and it's likely to worsen. Every day, we receive numerous requests online and via email, and it's only a matter of time before we're completely sold out.  We're committed to providing excellent service to the customers within our territory, and that's why we try not to sell outside of it. If we did, we'd already be sold out given the high demand. Considering the wide range of trim levels, colors, and more, our ability to order from BRP is limited. Therefore, it's crucial to act quickly if we have what you need right now. Whenever you have a moment, please give me a call to secure your purchase.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "You had put an inquiry online for one of our representatives to get in touch with you. Do you already have a specific idea of what you're looking for, or would you like some guidance in finding the right fit for you?  We currently have a model on our sales floor, which is a great opportunity to experience firsthand the exceptional quality H-D has to offer. You're more than welcome to visit us in person for a closer look. Alternatively, we can have a phone conversation to discuss your preferences and options. When would be a convenient time for you to visit or have a phone call? Would later today work for you, or would tomorrow better suit your schedule?",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "Just reaching out to ensure you know that I'm here whenever you're ready to move forward with the purchase. I completely understand that life can sometimes get in the way of making decisions like this, and I want to emphasize that I haven't abandoned you as your salesperson. Whether it's in a week, a month, or even six months, I'm here to assist you.  If I don't receive a response, I'll follow up with you at the beginning of the season to ensure you don't miss out on any opportunities. Your satisfaction is my priority, and I'm committed to providing the support you need when you're ready.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "Can-Am",
      content: "Just a quick follow-up to let you know that I'm here for you whenever you're ready to move forward with the purchase. Life can sometimes get in the way of these decisions, and I want you to know that I haven't forgotten about you as your salesperson. Whether it's in a week, a month, or even six months, I'm here to assist you.  It's worth noting that our Spring check promotion is coming to a close this week, which includes a fantastic warranty promo. If that's of interest to you, now would be an ideal time to take advantage of it. Additionally, if you're looking for an in-stock unit, we currently have promotions offering up to $750 off, along with any other promotions offered by BRP at the time of purchase.  Even if I don't hear back from you, I'll give you a call in October, right before the start of the next season, to see if you're ready to explore your options further. Your satisfaction is my priority, and I'm here to make the process as smooth as possible for you.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "Just a quick follow-up to let you know that I'm here for you whenever you're ready to move forward with the purchase. Life can sometimes get in the way of these decisions, and I want you to know that I haven't forgotten about you as your salesperson. Whether it's in a week, a month, or even six months, I'm here to assist you.  It's worth noting that we currently have promotional finance rates to help clients get on their dream bikes today. If that's of interest to you, now would be an ideal time to take advantage of it. Even if I don't hear back from you, I'll give you a call in March, right before the start of the next season, to see if you're ready to explore your options further. Your satisfaction is my priority, and I'm here to make the process as smooth as possible for you.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "Hello! I hope you're having a fantastic day. I wanted to check in and see if you have any additional questions or concerns about the Outlander. We've received significant interest in this model, and I want to ensure you don't miss the opportunity to own one at the price we discussed. If you're ready to proceed, please let me know, and I'll be delighted to assist you with the purchase process.  If there's something holding you back, such as the price or if this isn't the right unit, please don't hesitate to share your thoughts. I'm here to help. Whether it's working with my manager to find a better price or exploring other unit options, I'm committed to finding a solution that aligns with your needs.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "Instead of reaching out to you every few days and potentially taking up your valuable time, I'd like to work on your schedule. When do you think you'll be ready to move forward with the purchase? I'll make a note of it in my calendar and follow up with you at the time that's most convenient for you.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "Just came out of a meeting where we discussed inventory and unit ordering, and it's clear that the power sports industry is still going strong post-pandemic, with no signs of slowing down. Unfortunately, this also means that inventory continues to be a challenge for us and other dealers. Despite promises from manufacturers, availability hasn't improved as expected.  I completely respect your decision to wait, but I wanted to present an option that might work for you. If this is the unit you truly desire, you can secure it by placing a deposit along with a signed bill of sale and opting for storage. Ordering a new one might mean waiting until after June, or possibly even longer. The choice is entirely yours, and we're here to make it as convenient as possible for you.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "While I fully understand and respect your decision to wait, I'd like to offer an alternative solution. If this is the unit you truly desire, you can secure it by placing a deposit along with a signed bill of sale. We can also arrange for storage until you're ready to pick it up. This way, you won't have to worry about missing out on this season's enjoyment, as ordering a new one might not guarantee it arrives in time. The choice is entirely yours, and I'm here to make it as convenient as possible for you.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "If the season hasn't started yet, and no phone number was provided.  Our stock levels are being depleted before the season has even started, and it's only going to get worse. Every day I get requests online and emails, so it's only a matter of time before we're sold out. With that said, we're trying not to sell outside our territory because we want to take care of the people within our territory and give them the service they deserve. If we sold outside of our territory, we would already be sold out. Give me a call when you have some time to claim it.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "Which day would be most convenient for you? My priority is to simplify the buying process for our customers. If you prefer, we can handle everything over the phone, making it as hassle-free as possible. I understand the frustration when the buying process becomes cumbersome, and I aim to provide a smoother experience because, like you, I'm also a consumer.  I take pride in tailoring the buying process to individual preferences, whether it's someone's first purchase or their 100th. Your convenience matters most. If visiting the store is challenging due to a busy schedule, we can manage everything efficiently through email or phone until it's time for pickup. Your satisfaction is my commitment, and I'm here to ensure the process aligns with your needs.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "Were there any other questions or concerns that was keeping you back from moving forward? I want to make sure you have all the information  you need before buying because I'm hear to help make the process easy.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "Hello Frank, With the warm weather, many people are coming out of hibernation and making purchases. I want to ensure that my customers can enjoy the products they desire for this summer, especially since it's the first truly free COVID summer in years. While I can't make promises, I'd like to know what it would take to earn your business. Your satisfaction is my priority.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "Hello! I wanted to check in and see how you're feeling about the sales process. Is there anything specific you'd like assistance with or any questions I can address to help move things forward? While I can't promise to fulfill every request, I'm here to do my best and ensure your experience is as smooth as possible. Feel free to share any concerns or requests, and I'll be more than happy to assist you.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "Hello! I hope you're having a fantastic day. I wanted to follow up with you regarding the 850. Is there anything that's been holding you back from moving forward with your purchase? I'm here to assist you in making an informed buying decision and answer any questions you may have. Please feel free to let me know your thoughts or any concerns, and I'll be more than happy to address them. If there's anything specific you'd like to discuss or if you're ready to take the next steps, please don't hesitate to reach out.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "Hello! I hope you're having a fantastic day. I wanted to follow up with you regarding the 850. Is there anything specific that's been holding you back from moving forward? I'm here to assist you in making an informed buying decision and to promptly address any questions or concerns you may have. Please don't hesitate to let me know, and I'll be more than happy to help.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "I wanted to follow up on our last correspondence. Were there any other questions or concerns that were keeping you back from moving forward? I want to make sure you have all the information you need before making an informed buying decision. I'm here to make the process easy for you.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "I hope you're having a great day! I wanted to check in and see if you have any additional questions or concerns regarding the Street Glide. We've received significant interest in this model, and I want to ensure you don't miss the chance to own one at the price we discussed. If you're ready to proceed, please let me know, and I'll be delighted to assist you with the purchase process.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "Which day works best for you? My aim is to make the buying process as effortless as possible for my customers. If you prefer, we can handle everything over the phone to ensure convenience on your end. I understand the importance of a hassle-free experience because I'm also a consumer, and I know how frustrating it can be when the process isn't seamless.  I take pride in tailoring the buying process to meet your unique needs, whether it's your first purchase or if you're a seasoned buyer. Even if you're too busy to visit the store, we can manage everything efficiently through email or phone until it's time for pickup. Your satisfaction is my priority, and I'm here to make it as easy as possible for you.",
      category: "followups",
      subCat: 'followups',
    },
    {
      email: "",
      name: "",
      content: "Allow me to walk you through our sales process. Since you've already visited our dealership, we can efficiently handle most of the steps over the phone or through email. To get the ball rolling, I'll need a picture of the front of your driver's license. This will help us prepare your file and move things along smoothly.  Additionally, to secure the unit while we work on your approval, a $500 deposit is required, which you can conveniently put on your credit card. You have the option to either call me with your card number or send a picture of the front and back if you're busy at work and prefer not to make a phone call.  Once we have the necessary details, our sales manager will assemble your file and forward it to our business manager, who will reach out to you to facilitate the approval process. Once you're approved, the business manager will coordinate a pickup date with you. During the pickup, I'll be there to assist you with the vehicle explanation and help you load it if needed. We have ramps available for your convenience. Please note that while we strive to ensure a smooth loading and unloading process, we cannot be held liable for any incidents during these activities. Rest assured, I've never encountered any issues before, and I'm confident in my ability to assist you with loading and securing your purchase.",
      category: "followups",
      subCat: 'followups',
    },
  ]


  const [copiedText, setCopiedText] = useState('');

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(''), 3000); // Reset after 3 seconds
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };

  return (
    <>
      <ul>
        {myFollowUp.map((followup) => {
          return (
            <ul key={followup.id}>
              <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

                <CardContent>
                  <p className=" text-sm mt-3">
                    {followup.content}
                  </p>
                  <button className='ml-auto mt-auto mb-2 mr-2 cursor-pointer' onClick={() => copyText(followup.content)}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  </button>
                  {copiedText === followup.content && <div>Copied!</div>}
                </CardContent>
              </Card>
            </ul>
          );
        })}
      </ul >
    </>
  )
}

function Automation() {
  const myAutomated = [
    {
      email: "",
      name: "1 day after pick up",
      content: " I want to express my gratitude once more for choosing us, { Client - First name }. I hope you find great joy in your { Current Vehicle - Model } for the years ahead. If you ever have questions, encounter any issues, or anything else comes to mind, please don't hesitate to reach out. I'm here and more than willing to assist. Even if you believe it's something minor, I value your feedback to ensure your purchase was absolutely perfect.",
      category: "automation",
      subCat: '1 day after pick up',
    },
    {
      email: "",
      name: "After first visit no phone # provided",
      content: "Hey {Client - First Name} It was great talking to you about the {Wanted vehicle - Model} you are interested in.  If any questions or concerns come up let me know and I will be more than happy to address them. I'll follow up with you in a couple of days to give you time to consider any parts or accessories you would like to add. If you want to move forward before I follow up, text or call me and we can lock it in for you.",
      category: "automation",
      subCat: 'sms',
    },
    {
      email: "",
      name: "After first visit - set up time for a call",
      content: " Hey { Client - First name } It was great talking to you about the { Wanted Vehicle - Model }. If any questions come up let me know and I will be more than happy to address them.",
      category: "automation",
      subCat: 'sms',
    },
    {
      email: "",
      name: "After hours invalid email",
      content: " Hey { Client - First name } its { User - First name } from dealer, were currently closed so I may not be able to answers all your questions till we open, but I'll try my best to help you now.",
      category: "automation",
      subCat: 'sms',
    },
    {
      email: "",
      name: "First text message",
      content: " Hey { Client - First name } it's me from dealer, you requested that rep get in contact with you about the { Current Vehicle - Model } you were looking at online. When is a good time for me to call you back, would later on today work or tomorrow?",
      category: "automation",
      subCat: 'sms',
    },
    {
      email: "",
      name: "Call/text combo",
      content: "Hey { Client - First name } it's me from dealer, I just called but your probably tied up. When is a good time for us to talk about the { Current Vehicle - Model }, would later this afternoon work, or is tomorrow better?",
      category: "automation",
      subCat: 'sms',
    },
    {
      email: "",
      name: "Asking for objections",
      content: "Were there any other questions or concerns that was keeping you back from moving forward? I want to make sure you have all the information you need before buying so you make an informed buying decision, I'm hear to help make the process easy for you.",
      category: "automation",
      subCat: 'sms',
    },
  ]


  const [copiedText, setCopiedText] = useState('');

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(''), 3000); // Reset after 3 seconds
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };
  return (
    <>
      <p className=" text-sm">
        Automated responses
      </p>
      <ul>
        {myAutomated.map((quals) => {
          return (
            <ul key={quals.id}>
              <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

                <CardContent>
                  <p className=" text-sm mt-3">
                    {quals.name}
                  </p>
                  <p className=" text-sm mt-3">
                    {quals.content}
                  </p>
                  <button className='ml-auto mt-auto mb-2 mr-2' onClick={() => copyText(quals.content)}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  </button>
                  {copiedText === quals.content && <div>Copied!</div>}
                </CardContent>
              </Card>
            </ul>
          );
        })}
      </ul>
    </>
  )
}

function Overcomes() {
  /**
   *     {
      email: "",
      name: "",
      content: "",
      category: "overcome",
      subCat: 'overcome',
    },
   */

  const [copiedText, setCopiedText] = useState('');

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(''), 3000); // Reset after 3 seconds
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };
  const overcomes = [

    {
      email: "",
      name: "I can't find insurance",
      content: "For insurance, whether it's bikes or any motorcycle, call David bodnar. I've been with him now for 8 years and hes with the times. If anything changes I can just text him whatever the details are, like an ownership, and he will quote/write it up immediately. He handles all of his customers like this and his rates are the best too. I switched to him because my company dropped me due to my zx-10rr, ever since switching it hasn't cost me more than $950. I've switched everything to him because of his rates, every person that calls him.... switches seriously. Office 905-364-4007 cell 289-380-3824 david.bodnar@thebig.ca. For the person reading this dont take this as a plug. But whatever market your in, get a guy for these types of overcomes. If you live in ontario, you now have one. I've been working with david for years. He has helped me and I have helped him. It's been a great relationship. If you don't live in ontario try to find someone like him. He took the approach of selling motorcycle insurance for no profit... at the time of writing this. A lot of agents wish they had someone like me. I opened a city up to him that he didn't have access to. He was so succssful in my city that I would hear about him from other people that I had never met. I was his first client in the city, this is a common objection so i pushed him hard on my clients because he helped me so much with my insurance. ",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "I want to compare with other brands before making a decision.",
      content: "I completely understand, it's important to make an informed decision when purchasing a motorcycle. I would recommend taking a look at our Street Glide, it offers advanced features and performance that are unmatched by other brands in its class. But if you still want to compare, I would be happy to provide you with information on other brands and models so you can make a comparison. I'll also be happy to answer any questions you might have about the features and benefits of the Street Glide. Let me know what you need and I'll be happy to help you.",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "Price",
      content: "Unfortunately whatever you get at the motorcycle show will probably be more money than a 22, if we have it in stock. Due to the rising costs of the pandemic there will be a new fee on sea-doo as they have introduced to every other line up so far. I don't know what that cost will be for the new fee but it will be called a commodity fee set by brp so the dealers will have to pay for it which means so will the customer.  MSRP's will also be rising and our cost has gone up so the discounts will be smaller. I was talking to an old retired dealer owner who had brp, he was like I don't know how you guys do it, its smaller margins and costs just keep going up and the dealers cant seem to keep people. I'm not saying don't go because you never know when a dealer owner needs to pay his staff or his bills so he doesn't loose his location, but the days of cost units for sale are done. Here on out any consumer buying something at cost will be hurting that dealer horribly and it will be one step closer to shutting its doors. I wish this wasn't the case because I'm a consumer as well but ive been in 2 dealers my whole life and ive seen doors close over and over again, there's almost no more mom and pop shops in canada and they all closed in the last 5 years. It happened with cars, you have huge car groups behind the car dealers with almost no soul but own everything. Sales people come and go more than you clear the snow off youre driveway and you don't have that trusted sales person who you will beleive what they say because they have been doing it forever. I drive my brands and sell what I beleive in, you can't find that in a lot of dealers. When was the last time you bought a ford or ram truck and that sales person loved it so much he bought it with his own money. I knew more about the ram I never owned than the person that sold it to me, he had a ford.",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "Whats the rate? ",
      content: "The finance person didn't give me an exact rate, when you sit down with the finance manager we check your credit and match you with an institution that will give you the best rate. Every institution has different thresholds on how they evaluate credit, investments and so on but because of our working relationships with the bank managers we know each bank is looking for in a customer and they evaluate each customer and assign rates.",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "whats the rate right now?",
      content: "It's hard to answer that because everyones rate is going to be different. We deal with several institutions so when we get your information and run your credit we can match you with the best bank.  As you know not all banks treat investments and current customer loans the same. Were not here to just sell you one thing were here to sell you multiple of units down the road when you want to upgrade so we will do our best to get the rate you deserve. ",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "",
      content: "It seems like you might not be completely satisfied with the deal we're working on. No worries! I can't promise to get everything you want, but I'd be more than happy to take your conditions, present them to the sales manager, and negotiate on your behalf. I'll even throw in an arm-wrestling match with him to squeeze the best possible deal for you! In all seriousness, your satisfaction is my top priority, and I'm here to work together on finding a solution that aligns better with your expectations.",
      category: "overcome",
      subCat: 'overcome',
    },
    {
      email: "",
      name: "",
      content: "I've noticed that you may have some concerns about the current deal we're discussing. What would it take to make it more appealing to you? While I can't guarantee that we can fulfill every request, I'm more than willing to take your conditions and present them to my manager. I've been collaborating with him for several years now, so I have a good understanding of how and when to negotiate to get favorable terms into deals, always within reasonable boundaries, of course. Your satisfaction is our priority, and I'm here to work with you to find a solution that suits your needs.",
      category: "overcome",
      subCat: 'overcome',
    },
  ]
  return (
    <>
      <ul>
        {overcomes.map((overcome) => (
          <li key={overcome.id}>
            <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">
              <CardContent>
                <p className=" text-sm mt-3">
                  {overcome.name}
                </p>
                <p className=" text-sm mt-3">
                  {overcome.content}
                </p>
                <button className='ml-auto mt-auto mb-2 mr-2 cursor-pointer' onClick={() => copyText(overcome.content)}>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </button>
                {copiedText === overcome.content && <div>Copied!</div>}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}

function Upsell() {
  const { Upsell } = useLoaderData()

  const [copiedText, setCopiedText] = useState('');

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(''), 3000); // Reset after 3 seconds
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };
  return (
    <>
      <Accordion type="single" collapsible>

        <AccordionItem value="Upsell" className='mt-3'>
          <AccordionTrigger className="cursor-pointer">
            The Up-Sell
          </AccordionTrigger>
          <AccordionContent>
            <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">
              <CardHeader>
                <CardTitle>
                  Maybe your not closing it because, for the money on that paticular model/trim the customer doesn't see the value. Why not move up to a more expensive unit? It's just a payment. If they can afford $300 a month, they can afford $350 or $400. I've double and tripled customers bills, and they were happy! Because they bought something where they saw the value in it. Some of the lower trim levels are just too cheap as far as features go compared to the top trim levels.
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid w-full items-center mt-3' >
                  <p>
                    The font may seem extreme but a lot of sales people have a hard time getting over this one. Related to this is discounting, so many sales people just discount right away. FUCK THAT, why are you devaluing the product you are selling. The MSRP or product price is set by the manufacturer for reason, because that's what it is worth.
                  </p>
                  <p className='mt-3'>
                    When I got head hunted for a construction company, covid just started. No hair cut, and this was the first time I ever grew my beard, it was so long it was almost down to my stomach. With my tattoo's I look questionable. So much so I got targeted by cops at that time because, I looked like I should be in a biker gang snorting meth. So in the sales world, I couldn't be more unapproachable, haha. The sales manager training me was worried about how bad I would do, to give you context. The whole sales team was 25-30 year old blonde bartenders, showing up to work every day like they were going clubbing.
                  </p>
                  <p className='mt-3'>
                    2 weeks in, I did not discount a single deal. Because I was new, I was only getting a quater or a fifth of the calls the girls were getting so I can get accustomed to the new products.
                  </p>
                  <p className='mt-3'>
                    My commission? The same or more as theirs, and lets just say they werent happy about it. My manager told me what they were saying too, "How is that 6'3 mountain man not discounting, it makes no sense! Is he just threating them or something?"
                    No, it's called believing in the value of the product your selling.
                  </p>
                  <p className='mt-3'>
                    3rd week in, first sales meeting at the office since covid started. Keep in mind, I've never talked to the ceo before this time. He is in another meeting in the office with a different dept, with 7 employees. As soon as he sees me, he stops mid sentence and starts talking super loud, "damn Skyler! You fucking killed it this week, you made over 10 grand thats fucking insane", and he keeps going. Mean while I'm looking at the other employees in the meeting with him, and they were not impressed with this behaviour. It was also just super fucking weird to do. Not a single person in that meeting was on the sales team, their salaries were a lot less. I felt bad for the way he was acting.
                  </p>
                  <p className='mt-3'>
                    4th week in to this new job I got a call from the CEO, :"what the fuck you need to start discounting, your leaving sales on the table."
                  </p>
                  <p className='mt-3'>
                    I'm over 75% closer ratio with no discounts, I seriously thought he was joking. I started to laugh, and said fuck off what do you need, in a freindly way. I have only talked to him twice at this point, so I dont know how he acts..... He was being serious. The other employees were complaing so badly and so often that he had to call me, so he can tell them he did something about it. I told him, "Why would I devalue your service at the closing ratio im at? Your insane, were booking a year from now and people need to get in as soon as possible. Why would I discount? We have the best service/product and the cheapest rates in the industry, your seriously not making any sense. It would be stupid to discount. For the next two weeks, I never gave one discount. After the sale I had to put in a fake discount just so i wouldnt get fired. By the time I had left, everyone stopped discount because I showed them it can be done."
                  </p>
                </div>
              </CardContent>
            </Card>
            <ul>



            </ul>

          </AccordionContent>
        </AccordionItem>
      </Accordion >


    </>
  )
}

function Closes() {

  const {
    directs,
    assumptive,
    alternative,
    felt,
    problem,
    emotional,
    testDrives,
    summary,
    question,
    trial,
    upsell

  } = useLoaderData()
  const closes1 = [
    {
      email: "",
      name: "",
      content: "",
      category: "close",
      subCat: 'close',
    },
    {
      email: "",
      name: "dsa",
      content: "I hope you're having a great day! I wanted to check in and see if you had any further questions or concerns about the Street Glide. We've had a lot of interest in this model and I want to make sure you don't miss out on the opportunity to own one at the price we discussed. If you're ready to move forward, please let me know and I'll be happy to assist you with the purchase process.",
      category: "close",
      subCat: 'close',
    },
    {
      email: "",
      name: "dsa",
      content: " I noticed you haven't responded to my previous email, and I wanted to check in and see if you have any further questions about the Street Glide. When you're ready to move forward with your purchase, we're offering a limited-time promotional rate for people that qualify. Let me know if you're interested and we can discuss next steps.",
      category: "close",
      subCat: 'close',
    },
    {
      email: "",
      name: "dsa",
      content: "I understand that purchasing a motorcycle can be a big decision, but I want to remind you that the Street Glide is currently available at the price we discussed. I would be happy to go over all te features it has again with you. Would this afternoon work for you or would tomorrow fit your schedule better?",
      category: "close",
      subCat: 'close',
    },
    {
      email: "",
      name: "dsa",
      content: "To ensure that you have the opportunity to view and secure the unit, I recommend placing a deposit to reserve it until it arrives. This way, you'll prevent anyone else from purchasing it before you've had a chance to see it. The best part is, if you don't like it when you see it, you'll receive a full deposit refund. On the other hand, if you fall in love with it, you won't miss the opportunity to make it yours.",
      category: "close",
      subCat: 'close',
    },
    {
      email: "",
      name: "dsa",
      content: "I take pride in being the best salesperson I can be and assisting as many people in my community as possible. It's clear that you may have some reservations about the current deal. If you don't mind sharing, I'd love to know what we can adjust or improve to make it a more attractive offer for you. Your feedback is invaluable, and I'm here to work together on a solution that meets your needs and expectations.",
      category: "close",
      subCat: 'close',
    },
    {
      email: "",
      name: "dsa",
      content: "I understand that deciding on a motorcycle purchase is a significant decision. However, I'd like to emphasize that the Street Glide is currently available at the agreed-upon price we discussed. To help you make an informed decision, I'm thrilled to offer you the opportunity for a test drive. This will allow you to personally experience the motorcycle's exceptional features and performance. Could we arrange a test drive for you this afternoon? Alternatively, if your schedule is more accommodating, tomorrow would also work perfectly. Your comfort and satisfaction are our top priorities, and I'm here to assist you in making the right choice for your needs.",
      category: "closes",
      subCat: 'testDrives',
    },
    {
      email: "",
      name: "dsa",
      content: "I understand that choosing the perfect motorcycle is a significant decision, one that can truly enhance your life. Imagine the Street Glide as more than just a motorcycle; it's your ticket to unforgettable adventures and cherished moments with family and friends.  Picture yourself cruising the curvy roads. With the Street Glide, you're not just buying a motorcycle; you're investing in unforgettable memories and quality time with loved ones. The price we discussed today is an incredible opportunity to bring these dreams to life. I'd love to arrange a test drive, so you can personally experience the excitement and freedom this motorcycle offers. Would this afternoon or tomorrow be a better time for you? Your happiness and the enrichment of your life are our utmost priorities, and I'm here to make that happen.",
      category: "close",
      subCat: 'emotional',
    },
    {
      email: "",
      name: "dsa",
      content: "I completely understand that making a decision like this can be a significant step. Many of our customers have been in the same position, and they've shared some incredible stories with us.  Customers who purchased the Street Glide have told us how it transformed their weekends and vacations. They found that it added a new dimension to their family time, creating memories that they'll cherish forever.  One of our recent customers, John, initially had similar reservations. However, after taking the Street Glide for a test drive, he couldn't resist its appeal. He mentioned how it rekindled his love for the open road and brought his family closer together.  Another customer, Sarah, told us how she discovered hidden backcountry roads and beautiful spots she never knew existed before owning this motorcycle.  It's stories like these that remind us how life-changing the Street Glide can be. We'd love to help you create your own memorable experiences. If you're open to it, I can schedule a test drive for you. Would this afternoon or tomorrow work better for you?",
      category: "close",
      subCat: 'felt',
    },
    {
      email: "",
      name: "dsa",
      content: "I understand that you might have some concerns, and I appreciate your diligence in making the right decision. Let me address a few common questions and concerns that customers often have:  Price: Some customers worry about the cost. However, the Street Glide is not just an expense; it's an investment in your lifestyle and enjoyment. Plus, the price we've discussed today is a fantastic offer.  Maintenance: Maintenance can be a concern. Rest assured that H-D is known for its reliability, and we offer maintenance plans that will keep your motorcycle in top condition without any hassle.  Safety: Safety is paramount. The Street Glide is equipped with state-of-the-art safety features.  Resale Value: Some wonder about the resale value. H-D tend to hold their value well over time, and we can provide you with insights on how to maintain that value.  Time Commitment: You might be concerned about the time needed to enjoy your motorcycle. Remember, the Street Glide is designed to enhance your free time, allowing you to create wonderful memories without extensive commitments.  I'm here to address any specific concerns you may have. Your comfort and confidence in your decision are of utmost importance to us. Is there a particular concern you'd like to discuss or any additional information you need before moving forward?",
      category: "close",
      subCat: 'problem',
    },
    {
      email: "",
      name: "dsa",
      content: "Present the customer with two options and ask them to choose. It's as simple as that.",
      category: "close",
      subCat: 'alternative',
    },
    {
      email: "",
      name: "dsa",
      content: "To move forward with your purchase, we would need a $500 deposit and a picture of your driver's license. This will allow us to initiate the process for our finance manager to go over the application with you.  We understand that making a financial commitment is an important step, and we want you to feel comfortable. If you're hesitant about putting money down for financing, please know that it's perfectly okay. In fact, we have a flexible approach, and we'll refund the deposit when you come to pick up your new bike.  We genuinely want to make this process as smooth and convenient for you as possible. Could you please let us know which payment option you're most comfortable with?",
      category: "close",
      subCat: 'alternative',
    },
    {
      email: "",
      name: "dsa",
      content: "It seems like you might have some concerns about the deal we're working on, and I truly value your feedback. My goal is to ensure that you're completely satisfied with your purchase. I can't make guarantees, but I'm more than willing to take your conditions and present them to my manager. I've had a long-standing working relationship with him, and I know how and when to approach him to explore options that can meet your needs, within reasonable boundaries, of course.  Your satisfaction is of the utmost importance to us, and we're committed to finding a solution that works for you. What would it take to make this deal align better with your expectations? Please share your conditions, and I'll do my best to advocate for you",
      category: "close",
      subCat: 'directs',
    },
    {
      email: "",
      name: "dsa",
      content: "To ensure you have the opportunity to see and buy it, I recommend placing a deposit to reserve the unit until it arrives. This way, you'll have peace of mind knowing that no one else can purchase it before you have a chance to make a decision. The best part is, if you happen to dislike it when you see it, you'll receive a full refund of your deposit. On the other hand, if you fall in love with it, you won't miss out on the chance to make it yours. It's a win-win scenario that allows you the time and flexibility to make an informed choice. Would you like to go ahead and place a deposit to secure the unit?",
      category: "close",
      subCat: 'directs',
    },
    {
      email: "",
      name: "dsa",
      content: "Ask the customer questions to gauge their level of interest.",
      category: "close",
      subCat: 'trial',
    },
    {
      email: "",
      name: "dsa",
      content: "Summarize the key benefits of the product and ask for the sale.",
      category: "close",
      subCat: 'summary',
    },
    {
      email: "",
      name: "dsa",
      content: "If your worried about the finance numbers we can sit you down with our finance manager and he can go over the deal with you and see what rate we can go for before you fully commit. That way you have all the information to make an informed decision.",
      category: "close",
      subCat: 'close',
    },
  ]


  const [copiedText, setCopiedText] = useState('');

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(''), 3000); // Reset after 3 seconds
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };
  return (
    <>

      <Accordion type="single" collapsible>

        <AccordionItem value="item-0">
          <AccordionTrigger className="cursor-pointer">

            The Direct Close
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {closes1
                .filter((item) => item.subCat === 'directs') // Replace 'testDrives' with the desired subCat value
                .map((item, index) => (
                  <li key={index}>
                    <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

                      <CardContent>
                        <p className="">Submitted by: {item.name}</p>
                        <Separator />
                        <p className=" text-sm mt-3">{item.content}</p>
                        <button
                          className="ml-auto mt-auto mb-2 mr-2 cursor-pointer"
                          onClick={() => copyText(item.content)}
                        >
                          <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                          </svg>
                        </button>
                        {copiedText === item.content && <div>Copied!</div>}
                      </CardContent>
                    </Card>
                  </li>
                ))}
            </ul>
          </AccordionContent>
        </AccordionItem>



        <AccordionItem value="item-2" className='mt-3'>
          <AccordionTrigger className="cursor-pointer">

            The Assumptive Close
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {closes1
                .filter((item) => item.subCat === 'assumptive') // Replace 'testDrives' with the desired subCat value
                .map((item, index) => (
                  <li key={index}>
                    <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

                      <CardContent>
                        <p className="">Submitted by: {item.name}</p>
                        <Separator />
                        <p className=" text-sm mt-3">{item.content}</p>
                        <button
                          className="ml-auto mt-auto mb-2 mr-2 cursor-pointer"
                          onClick={() => copyText(item.content)}
                        >
                          <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                          </svg>
                        </button>
                        {copiedText === item.content && <div>Copied!</div>}
                      </CardContent>
                    </Card>
                  </li>
                ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className='mt-3'>
          <AccordionTrigger className="cursor-pointer">

            The Alternative Close
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {closes1
                .filter((item) => item.subCat === 'alternative') // Replace 'testDrives' with the desired subCat value
                .map((item, index) => (
                  <li key={index}>
                    <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

                      <CardContent>
                        <p className="">Submitted by: {item.name}</p>
                        <Separator />
                        <p className=" text-sm mt-3">{item.content}</p>
                        <button
                          className="ml-auto mt-auto mb-2 mr-2 cursor-pointer"
                          onClick={() => copyText(item.content)}
                        >
                          <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                          </svg>
                        </button>
                        {copiedText === item.content && <div>Copied!</div>}
                      </CardContent>
                    </Card>
                  </li>
                ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className='mt-3'>
          <AccordionTrigger className="cursor-pointer">

            The Problem Solving Close
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {closes1
                .filter((item) => item.subCat === 'problem') // Replace 'testDrives' with the desired subCat value
                .map((item, index) => (
                  <li key={index}>
                    <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

                      <CardContent>
                        <p className="">Submitted by: {item.name}</p>
                        <Separator />
                        <p className=" text-sm mt-3">{item.content}</p>
                        <button
                          className="ml-auto mt-auto mb-2 mr-2 cursor-pointer"
                          onClick={() => copyText(item.content)}
                        >
                          <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                          </svg>
                        </button>
                        {copiedText === item.content && <div>Copied!</div>}
                      </CardContent>
                    </Card>
                  </li>
                ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className='mt-3'>
          <AccordionTrigger className="cursor-pointer">

            The Feel, Felt, Found Close
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {closes1
                .filter((item) => item.subCat === 'felt') // Replace 'testDrives' with the desired subCat value
                .map((item, index) => (
                  <li key={index}>
                    <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

                      <CardContent>
                        <p className="">Submitted by: {item.name}</p>
                        <Separator />
                        <p className=" text-sm mt-3">{item.content}</p>
                        <button
                          className="ml-auto mt-auto mb-2 mr-2 cursor-pointer"
                          onClick={() => copyText(item.content)}
                        >
                          <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                          </svg>
                        </button>
                        {copiedText === item.content && <div>Copied!</div>}
                      </CardContent>
                    </Card>
                  </li>
                ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6" className='mt-3'>
          <AccordionTrigger className="cursor-pointer">

            The Emotional Close
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {closes1
                .filter((item) => item.subCat === 'emotional') // Replace 'testDrives' with the desired subCat value
                .map((item, index) => (
                  <li key={index}>
                    <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

                      <CardContent>
                        <p className="">Submitted by: {item.name}</p>
                        <Separator />
                        <p className=" text-sm mt-3">{item.content}</p>
                        <button
                          className="ml-auto mt-auto mb-2 mr-2 cursor-pointer"
                          onClick={() => copyText(item.content)}
                        >
                          <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                          </svg>
                        </button>
                        {copiedText === item.content && <div>Copied!</div>}
                      </CardContent>
                    </Card>
                  </li>
                ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-7" className='mt-3'>
          <AccordionTrigger className="cursor-pointer">

            Test Drive Close
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {closes1
                .filter((item) => item.subCat === 'testDrives') // Replace 'testDrives' with the desired subCat value
                .map((item, index) => (
                  <li key={index}>
                    <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

                      <CardContent>
                        <p className="">Submitted by: {item.name}</p>
                        <Separator />
                        <p className=" text-sm mt-3">{item.content}</p>
                        <button
                          className="ml-auto mt-auto mb-2 mr-2 cursor-pointer"
                          onClick={() => copyText(item.content)}
                        >
                          <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                          </svg>
                        </button>
                        {copiedText === item.content && <div>Copied!</div>}
                      </CardContent>
                    </Card>
                  </li>
                ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8" className='mt-3'>
          <AccordionTrigger className="cursor-pointer">

            The Question Close
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {closes1
                .filter((item) => item.subCat === 'question') // Replace 'testDrives' with the desired subCat value
                .map((item, index) => (
                  <li key={index}>
                    <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

                      <CardContent>
                        <p className="">Submitted by: {item.name}</p>
                        <Separator />
                        <p className=" text-sm mt-3">{item.content}</p>
                        <button
                          className="ml-auto mt-auto mb-2 mr-2 cursor-pointer"
                          onClick={() => copyText(item.content)}
                        >
                          <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                          </svg>
                        </button>
                        {copiedText === item.content && <div>Copied!</div>}
                      </CardContent>
                    </Card>
                  </li>
                ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-9" className='mt-3'>
          <AccordionTrigger className="cursor-pointer">

            The Summary Close
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {closes1
                .filter((item) => item.subCat === 'summary') // Replace 'testDrives' with the desired subCat value
                .map((item, index) => (
                  <li key={index}>
                    <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

                      <CardContent>
                        <p className="">Submitted by: {item.name}</p>
                        <Separator />
                        <p className=" text-sm mt-3">{item.content}</p>
                        <button
                          className="ml-auto mt-auto mb-2 mr-2 cursor-pointer"
                          onClick={() => copyText(item.content)}
                        >
                          <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                          </svg>
                        </button>
                        {copiedText === item.content && <div>Copied!</div>}
                      </CardContent>
                    </Card>
                  </li>
                ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-10" className='mt-3'>
          <AccordionTrigger className="cursor-pointer">

            The Trial Close
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {closes1
                .filter((item) => item.subCat === 'trial') // Replace 'testDrives' with the desired subCat value
                .map((item, index) => (
                  <li key={index}>
                    <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

                      <CardContent>
                        <p className="">Submitted by: {item.name}</p>
                        <Separator />
                        <p className=" text-sm mt-3">{item.content}</p>
                        <button
                          className="ml-auto mt-auto mb-2 mr-2 cursor-pointer"
                          onClick={() => copyText(item.content)}
                        >
                          <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                          </svg>
                        </button>
                        {copiedText === item.content && <div>Copied!</div>}
                      </CardContent>
                    </Card>
                  </li>
                ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-11" className='mt-3'>
          <AccordionTrigger className="cursor-pointer">

            Not yet Catergorized
          </AccordionTrigger>
          <AccordionContent>
            <Card className=" mt-3">
              <CardHeader>
                <CardTitle>
                  Needs Sorting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {closes1
                    .filter((item) => item.subCat === 'close') // Replace 'testDrives' with the desired subCat value
                    .map((item, index) => (
                      <li key={index}>
                        <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

                          <CardContent>
                            <p className="">Submitted by: {item.name}</p>
                            <Separator />
                            <p className=" text-sm mt-3">{item.content}</p>
                            <button
                              className="ml-auto mt-auto mb-2 mr-2 cursor-pointer"
                              onClick={() => copyText(item.content)}
                            >
                              <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                              </svg>
                            </button>
                            {copiedText === item.content && <div>Copied!</div>}
                          </CardContent>
                        </Card>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-13" className='mt-3'>
          <AccordionTrigger className="cursor-pointer">

            A bad, but profitable habit...
          </AccordionTrigger>
          <AccordionContent>
            <Card className=" mt-3">
              <CardHeader>
                <CardTitle>
                  Depending how the introduction goes, and how the customer is protraying themselves, the first thing I do is try to close them to gauge where they are in the buying process. I'm not going to waste 3-4 hours of my time with someone I probably won't like, lets be real.
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid w-full items-center mt-3' >
                  <p>
                    I am notorious for closing within the first minute or two. It is a
                    horrible habit i have made for myself. Every dealer owner
                    has hated me for it, but loved me at the same time. I dont create those mean while relationships with every single customer. You shouldn't either, if your selling the way the customers needs to be sold. Another way the customer looks at it though, because they have told me. The effeicency to get the client out the door when they already made up their mind about a purchase, shocks the customer and shows how you've mastered your craft because he doesn't have to sit in a dealership for the afternoon daydreaming about the golf course. A lot of customers have appreciated the time it took to get everything bundled up. For that persons next purchase, is he going to go to the dealer he knows will be a day event? or 15 mins with you?
                  </p>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion >
    </>
  )
}

function Texting() {
  const { Texting, user, dFees } = useLoaderData()
  /**
   * {
        email: "",
        name: "",
        content: "",
        category: "Texting",
        subCat: 'Texting',
      },
   */



  const MyTexting = [
    {
      email: "10",
      name: "Client - bdc - source FB - coms - text",
      content: `Hey it's ${user.username} from ${dFees.dealer}, you requested to have a rep contact you about the { Current Vehicle - Model } on facebook. When is a good time for me to call you back, would later on today work or tomorrow? If text is the only way of contact, that would be good as well.`,
      category: "Texting",
      subCat: 'First Contact',
    },
    {
      email: "9",
      name: "Client - 24 hour reminder for in store appt",
      content: "I wanted to remind you about our appointment tomorrow. If, for any reason, you can't make it, please let me know, and we can reschedule. Otherwise, I'm looking forward to seeing you tomorrow!",
      category: "Texting",
      subCat: 'Texting',
    },
    {
      email: "8",
      name: "Client - 24 hour reminder for bike pu",
      content: "I wanted to remind you about your motorcycle pick-up tomorrow. If, for any reason, you can't make it, please let me know, and we can reschedule. Otherwise, I'm looking handing off your new bike to you so you can hit the open road.",
      category: "Texting",
      subCat: 'Texting',
    },
    {
      email: "7",
      name: "After meeting",
      content: "Hey { Client - Civility } { Client - First name }, it's { User - First name } from { Dealer - Name }. It was nice meeting you today. Do not hesitate if you have any questions. Have a great day!",
      category: "Texting",
      subCat: 'Texting',
    },

    {
      email: "6",
      name: "Asking for objections",
      content: "Were there any questions or concerns you had that was stopping you from moving forward?",
      category: "Texting",
      subCat: 'Texting',
    },
    {
      email: "5",
      name: "",
      content: "Hey Mike just wanted to follow up to our conversations, if your not ready to buy right now when do you want me to follow up with you? that way I'm not wasting your time and bugging you every couple of days. ",
      category: "Texting",
      subCat: 'Texting',
    },
    {
      email: "4",
      name: "",
      content: `Hey its ${user.username} from ${dFees.dealer} you put in a request on line to take advantage of the current promotions, which unit were you looking for?`,
      subCat: 'Texting',
    },
    {
      email: "3",
      name: "",
      content: `Hey its ${user.username} from ${dFees.dealer} you requested that rep get in contact with you about the unit you were looking at online when is a good time for me to call you back, would later on today work or tomorrow?`,
      category: "Texting",
      subCat: 'Texting',
    },
    {
      email: "2",
      name: "Call/text combo - auto",
      content: `Hey its ${user.username} from ${dFees.dealer} I just called but your probably tied up give me a call or text when you can and we can go over that unit you were looking for`,
      category: "Texting",
      subCat: 'Texting',
    },
    {
      email: "1",
      name: "After hours invalid email",
      content: "Hey { Client - First name } its { User - First name } from Freedom, were currently closed so I may not be able to answers all your questions till we open, but I'll try my best to help you now.",
      category: "Texting",
      subCat: 'Texting',
    },

  ]


  const [copiedText, setCopiedText] = useState('');

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(''), 3000); // Reset after 3 seconds
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };
  return (
    <>
      <ul>
        {MyTexting.map((text) => (
          <li key={text.email}>
            <Card className="mt-3 bg-slate12 border border:bg-slate11 text-slate3">

              <CardContent>
                <p className=" text-sm mt-3">
                  {text.name}
                </p>
                <p className=" text-sm mt-3" id={text.email}>
                  {text.content}
                </p>
                <button className='ml-auto mt-auto mb-2 mr-2 cursor-pointer' onClick={() => copyText(text.content)}>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </button>
                {copiedText === text.content && <div>Copied!</div>}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}



/**
 *
 *  Hey { Client - First name } it's Skyler from Freedom HD, you requested to have a rep contact you about the { Current Vehicle - Model } on facebook. When is a good time for me to call you back, would later on today work or tomorrow? If text is the only way of contact, that would be good as well.
 *
 * Hey { Client - First name } it's Skyler from Freedom HD, you requested to have a rep contact you about the { Current Vehicle - Model } on facebook. When is a good time for me to call you back, would later on today work or tomorrow? If text is the only way of contact, that would be good as well.
 * I want to express my gratitude once more for choosing us, { Client - First name }. I hope you find great joy in your { Current Vehicle - Model } for the years ahead. If you ever have questions, encounter any issues, or anything else comes to mind, please don't hesitate to reach out. I'm here and more than willing to assist. Even if you believe it's something minor, I value your feedback to ensure your purchase was absolutely perfect.
 *  I wanted to remind you about our appointment tomorrow. If, for any reason, you can't make it, please let me know, and we can reschedule. Otherwise, I'm looking forward to seeing you tomorrow!
 *
 *
 *
 * <input type="text" placeholder="Search... (310)" class="w-36 border shadow rounded" list="firstNamelist" value="">
 */
