
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"


export default function Why() {
  return (
    <Card className='w-[600px] mt-5 mx-auto mb-5'>
      <CardHeader>
        <CardTitle>Why...</CardTitle>
        <CardDescription>Outside of sales training, what can you do that would have an impact on your team and sales?</CardDescription>
      </CardHeader>
      <CardContent className='h-[650px] max-h-[650px] overflow-y-auto' >
        <div className='grid gap-4'>
          <p>I'm going to ask you to do some math with me, whether it's on your phone, paper, computer doesn't matter. I'll explain why your doing this later.</p>
          <p>Let's start with one sales person, and one process. The one we have to do more than any other.</p>
          <p>Calls - complete the call in the system, leave a note for yourself for the next time you call them and rebook the appointment so the client doesn't fall through the cracks.</p>
          <p>Now you can time yourself, but quick sales people its going to take 1 min 30 secs to 2 minutes.</p>
          <p>I'm aware you can cheat the system and do it quicker, but your just going to hurt yourself as a sales person in the long run if you take this route. Its not sustainable to be consistently quicker by doing this. When the next time the call comes around, instead of reading a simple note your now opening up previous emails and text messages. So whatever time you think you saved when you rescheduled the call, you now just added 5-10 minutes.</p>
          <p>Lets go with 2 minutes because its easier math. Now I can easily do 100 calls in a day, on average. If no one picks up, or walks in I can be done by lunch</p>
          <p>Do you see the scaling problem?</p>
          <p>100 calls x 2 minutes each = 200 minutes a day wasted doing the most menial task a sales person can do.</p>
          <p>You work 5 days a week.</p>
          <p>Punch into your calculator 200 minutes x 5 days</p>
          <p>Now this is where I explain you need to do the math, because if I just gave you the numbers... you wouldn't beleive it.</p>
          <p>1000 minutes / 60 for minutes an hour, and what is the amount of hours wasted that week by clicking a bunch of buttons you do not need to click?</p>
          <p>I'm not going to answer that, you have your calculator. Now looking at the number your probably going to google next to see if you did the math right.</p>
          <p>.... because that number cannot be right. But it is... and this whole scenario is if your at it the entire shift and lets be real 9 out of 10 sales people aren't going from wire to wire AND your average being 2 minutes. What about the people who aren't good with computers? 5-10 minutes a call.</p>
          <p>Now multiply that number by 4, for the amount of weeks in a month.</p>
          <p>Then times 12 to find out how much each sales person wastes in given year.</p>
          <p>If your a owner, multiply that number by the amount of sales people.</p>
          <p>On a four man team your wasting $108,096 on an average pay of $65,000.</p>
          <p>And if your a dealer group owner, that number can get out of hand quickly.</p>
          <p>Did you catch the biggest issue at hand? This is just one process for one sales person.</p>
          <p>Here again comes the scaling problem, our job as sales people... its nothing but processes.</p>
          <p>But you run into an issue, forcing your team to be the most effecient workers on the planet, will only get you a net workforce of 0. Because no one will want to work for you.</p>
          <p>Make it easier to be more effecient. Instead, crms today just add time to your employees days and waste your hard earned profits.</p>
          <p>Now what kind of times can we get these down to, for the average person.</p>
          <p>Less than 10 secs? If no one picks up the phone, or if its an email/text.</p>
          <p>For more complicated calls/messages, yes it will take longer, but I garantee you it's not 2 minutes. Less than 30 secs on average.</p>
          <p>Let's apply this to every single process we have though.... for every employee in the dealership.</p>
          <p>Yes we only measure the sales people... what about the rest of your staff?</p>
        </div>
      </CardContent>
      <CardFooter>

      </CardFooter>
    </Card>

  )
}
