import {
  Anchor,
  AnchorText,
  AspectRatio,
  Balancer,
  Image,
  Layout,
  YouTubeVideo,
} from "~/components";
import { useRootLoaderData } from "~/hooks";
import { AppleMac } from "~/icons";
import { createMetaData, createSitemap } from "~/utils";

export const meta = createMetaData({
  title: "About",
  description:
    "Just some quick info about this project and showcase some of the features.",
});

export const handle = createSitemap("/about", 0.9);

// TODO: Load content from HTML/MDX data
export default function Route() {

  return (
    <div
      className="relative flex-col items-start gap-8 md:flex pl-3 pr-3 md:w-[30%] text-foreground mx-auto"
    >
      <fieldset className="grid gap-6 rounded-lg border p-4 border-border  bg-background">
        <legend className="-ml-1 px-1 text-sm font-medium">About</legend>
        <p>
          Having been in the industry since I was 17 years old, I have seen both great and horrible sales people. Starting I was horrible at sales, but over the years i learned from those better than me and continued to grow. At this point there's not a lot to learn anymore, I wont go into what the industry needs to do to improve but I'll go over the self reflection I've done and really tried to pin point what else can I improve in order to sell more.
        </p>
        <p>
          Ofcourse, you need sales training. What the fail to touch on though is everything else about the job. Paperwork, processes and procedures, are things that are not taught in almost any course I have taken. If it takes you 2 hours to write someone up it doesn't matter how good you are at sales, you're not going to sell much.
        </p>
        <p>
          Other than sales ability what can I improve? CRM, dealer processes and procedures are the next thing that comes to mind. I've been in dealerships that have no CRM, and I've been in dealerships that have a CRM but no one uses it. I've been in dealerships that have a CRM and everyone uses it but it's not being used properly. I've been in dealerships that have a CRM and everyone uses it properly but the processes and procedures are not being followed. I've been in dealerships that have a CRM, everyone uses it properly and the processes and procedures are being followed but the CRM is not being used to it's full potential. Most of the situations can be fixed with a better crm, so that's what I started to work on and grew into what it is now. It's not the prettiest but it's functional, it works and you will be able to get through your sale from start to finish faster than any other crm out there. As I'm still on the sales floor, this crm will always get adjusted, tested to see how we can save time, even seconds counts. Over the span of the year you would be shocked at how much time you waste.
        </p>
      </fieldset>
    </div>

  );
}
