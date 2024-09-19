import React, { ComponentProps } from "react"
import formatDistanceToNow from "date-fns/formatDistanceToNow"

import { cn } from "~/components/ui/utils"
import { Badge } from "~/components/ui/badge"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Separator } from "~/components/ui/separator"
//import { useMail } from "@/app/(app)/examples/mail/use-mail"
//import { Mail } from "@/app/(app)/examples/mail/data"

interface MailListProps {
  items: Mail[]
}

export function MailList({ items = [], setMail, mail }) {
  // ----- sales card model and brand ---- //


  // --------- the sacred timeline -------//
  const options2 = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => {
          console.log('Item:', item); // Log each item to inspect the data

          return (
            <button
              key={item.id}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border border-border p-3 text-left text-sm transition-all hover:bg-accent",
                mail.selected === item.id && "bg-muted"
              )}
              onClick={() =>
                setMail(item)
              }
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{item.ownerName}</div>
                    {!item.read && (
                      <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "ml-auto text-xs",
                      mail.selected === item.id
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {new Date(mail.createdAt).toLocaleDateString("en-US", options2)}
                    {/* Ensure no date or time formatting here */}
                  </div>
                </div>
                <div className="text-xs font-medium">{item.generatedFrom}</div>
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground">
                {item.message.substring(0, 300)}
              </div>
              <div className="flex items-center gap-2">
                <Badge>
                  {item.dealerName ? item.dealerName : 'Non-Dealer'}
                </Badge>
                <Badge className='ml-3'>
                  {item.timeToPurchase}
                </Badge>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  )
}
//  {new Date(item.createdAt).toLocaleDateString("en-US", options2)}
function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default"
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline"
  }

  return "secondary"
}
