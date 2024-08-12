import { Outlet } from "@remix-run/react";

import { createSitemap } from "~/utils";

export const handle = createSitemap();

export default function Route() {
  return (
    <div className="contain-sm space-y-4">
      <Outlet />
    </div>
  );
}

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/svg", href: "/favicons/settings.svg", },
]
