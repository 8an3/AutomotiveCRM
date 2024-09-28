
import { LucideIcon } from "lucide-react"

import { cn } from "~/components/ui/utils"
import { Button, buttonVariants } from "~/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { Link } from "@remix-run/react"

interface NavProps {
  isCollapsed: boolean
  GetEmailByFolder: any
  label: any
  links: {
    title: string
    label?: string
    icon: LucideIcon
    variant: "default" | "ghost"
  }[]
}

export function Nav({ links, isCollapsed, label, GetEmailByFolder }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="  group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2  flex space-x-2 flex-col max-w-[95%] lg:space-x-0 lg:space-y-1 mt-3">
        {links.map((link) =>
          isCollapsed ? (
            <Tooltip
              key={link.title}
              delayDuration={0}
            >
              <TooltipTrigger asChild >
                <Button variant='ghost'
                  size='icon'
                  onClick={() => {
                    GetEmailByFolder(link.title)
                  }}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    label === link.title
                      ? "bg-[#232324] hover:bg-muted/50 w-[95%]  mx-auto   "
                      : "hover:bg-muted/50 text-[#a1a1aa]  w-[95%] mx-auto ",
                    "w-[95%] "
                  )} >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <link.icon className="mr-2 h-4 w-4" />
                      <p>{link.title}</p>
                    </div>
                    {link.label && (
                      <span
                        className={cn(
                          "ml-auto",
                          label === link.title && "text-background dark:text-white"
                        )}
                      >
                        {link.label}
                      </span>
                    )}
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button variant='ghost'
              key={link.title}
              size='sm'
              onClick={() => {
                GetEmailByFolder(link.title)
              }}
              className={cn(
                buttonVariants({ variant: "ghost" }),

                label === link.title
                  ? "bg-[#232324] hover:bg-muted/50 w-[95%]     "
                  : "hover:bg-muted/50 text-[#a1a1aa]  w-[95%]  ",
                "w-[95%] "
              )} >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <link.icon className="mr-2 h-4 w-4" />
                  <p>{link.title}</p>
                </div>
                {link.label && (
                  <span
                    className={cn(
                      "ml-auto",
                      label === link.title && "text-background dark:text-white"
                    )}
                  >
                    {link.label}
                  </span>
                )}
              </div>
            </Button>

          )
        )}
      </nav>
    </div>
  )
}
