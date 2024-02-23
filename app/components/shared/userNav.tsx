// https://remix.run/docs/en/main/file-conventions/route-files-v2#md-root-route
import { DashboardSpeed, LogOut, Dashboard, Settings, User, AddDatabaseScript, MailIn, InputField, MoneySquare, Map } from "iconoir-react";
import { Button, DropdownMenu, DropdownMenuSeparator, DropdownMenuTrigger, Layout, PageHeader, TailwindIndicator, Toaster, TooltipProvider, DropdownMenuContent, DropdownMenuLabel, DropdownMenuGroup, Input, DropdownMenuItem, RemixNavLink, AvatarAuto, ThemeToggleButton, } from "~/components";
import { configDev, } from "~/configs";
import { useRootLoaderData, type RootLoaderData } from "~/hooks";
import { getUserIsAllowed } from "~/helpers";
import { Components, Keyboard, Users } from "~/icons";

export function HeaderUserMenu({

  align = "end",
}: {
  align?: "center" | "start" | "end" | undefined;
}) {
  const { user } = useRootLoaderData();

  if (!user) {
    return null;
  }

  const userIsAllowed = getUserIsAllowed(user, ["ADMIN", "MANAGER", "EDITOR"]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="myUserNav top-2 right-5 fixed"
          >
            <Button variant="ghost" className="relative ">
              <Settings className="size-sm me-2" />
              <h5>{user.name}</h5>
            </Button>
          </Button>
        </DropdownMenuTrigger>


        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuGroup>
            <RemixNavLink prefetch="intent" to={`/user/dashboard/settings`}>
              <DropdownMenuItem>
                <User className="size-sm me-2" />
                <span>Profile</span>
              </DropdownMenuItem>
            </RemixNavLink>
            <RemixNavLink to={`/dashboard/calls`}>
                  <DropdownMenuItem>
                    <Dashboard className="size-sm me-2" />
                    Dashboard
                  </DropdownMenuItem>
                </RemixNavLink>
            <RemixNavLink to={`/user/dashboard/contact`}>
              <DropdownMenuItem>
                <MailIn className="size-sm me-2" />
                Contact
              </DropdownMenuItem>
            </RemixNavLink>

            <RemixNavLink to={`/user/dashboard/scripts`}>
              <DropdownMenuItem>
                <AddDatabaseScript className="size-sm me-2" />
                Scripts
              </DropdownMenuItem>
            </RemixNavLink>
            <RemixNavLink to={`/user/dashboard/salestracker`}>
              <DropdownMenuItem>
                <InputField className="size-sm me-2" />
                <span>Sales Tracker</span>
              </DropdownMenuItem>
            </RemixNavLink>
          </DropdownMenuGroup>
          <hr className="solid" />
          
          <DropdownMenuGroup>
            <RemixNavLink to={`/user/dashboard/dealerfees`}>
              <DropdownMenuItem>
                <MoneySquare className="size-sm me-2" />
                <span>Dealer Fees</span>
              </DropdownMenuItem>
            </RemixNavLink>
            <RemixNavLink to={`/user/dashboard/dealeroptions`}>
              <DropdownMenuItem>
                <MoneySquare className="size-sm me-2" />
                <span>Dealer Options</span>
              </DropdownMenuItem>
            </RemixNavLink>
            <RemixNavLink to={`/user/dashboard/settings`}>
              <DropdownMenuItem>
                <Settings className="size-sm me-2" />
                <span>Settings</span>
              </DropdownMenuItem>
            </RemixNavLink>
            <RemixNavLink to={`/user/dashboard/roadmap`}>
              <DropdownMenuItem>
                <Map className="size-sm me-2" />
                <span>Roadmap</span>
              </DropdownMenuItem>
            </RemixNavLink>
            <RemixNavLink to={`/welcome/dealerfees`}>
              <DropdownMenuItem>
                <Keyboard className="size-sm me-2" />
                <span>Walkthrough</span>
              </DropdownMenuItem>
            </RemixNavLink>
          </DropdownMenuGroup>
          {userIsAllowed && (
            <>
              <hr className="solid" />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <RemixNavLink prefetch="intent" to={`/admin`}>
                    <DashboardSpeed className="size-sm me-2" />
                    <span>Admin</span>
                  </RemixNavLink>
                </DropdownMenuItem>

              </DropdownMenuGroup>
            </>
          )}
          {configDev.isDevelopment && (
            <>
              <hr className="solid" />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <RemixNavLink prefetch="intent" to={`/components`}>
                    <Components className="size-sm me-2" />
                    <span>Components</span>
                  </RemixNavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <RemixNavLink prefetch="intent" to={`/demo`}>
                    <Components className="size-sm me-2" />
                    <span>Demo</span>
                  </RemixNavLink>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
          <hr className="solid" />
          <RemixNavLink to="/logout">
            <DropdownMenuItem>
              <LogOut className="size-sm me-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </RemixNavLink>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

