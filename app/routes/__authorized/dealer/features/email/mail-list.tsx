import React, { ComponentProps } from "react"
import formatDistanceToNow from "date-fns/formatDistanceToNow"

import { cn } from "~/components/ui/utils"
import { Badge } from "~/components/ui/badge"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Separator } from "~/components/ui/separator"
//import { useMail } from "@/app/(app)/examples/mail/use-mail"
//import { Mail } from "@/app/(app)/examples/mail/data"

interface MailListProps {
  emails: any
  setMail: any
  mail: any
}

export function MailList({ emails, setMail, mail }: MailListProps) {
  // ----- sales card model and brand ---- //

  console.log('mail list before return', emails)
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
  console.log(emails, 'in maillist')
  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {emails && Array.isArray(emails) && emails.map((email: any, index: any) => (
          email && email.id && (
            <button
              key={index}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border border-border p-3 text-left text-sm transition-all hover:bg-accent",
                mail?.id === email.id && "bg-muted"
              )}
              onClick={() => setMail(email)}
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{email.form?.emailAddress.name}</div>
                    {email.isRead === false && (
                      <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "ml-auto text-xs",
                      mail?.id === email.id ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {new Date(email.createdDateTime).toLocaleDateString("en-US", options2)}
                  </div>
                </div>
                <div className="text-xs font-medium">{email.subject || 'No Subject'}</div>
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground">
                {email.bodyPreview?.substring(0, 300) || 'No Preview Available'}
              </div>
              {email && email.labels && email.labels.length ? (
                <div className="flex items-center gap-2">
                  {email.labels.map((label) => (
                    <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                      {label}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </button>
          )
        ))}
      </div>
    </ScrollArea>
  )
}


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
