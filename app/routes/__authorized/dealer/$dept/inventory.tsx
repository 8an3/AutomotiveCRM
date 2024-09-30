import { Outlet, useLoaderData } from "@remix-run/react";

export default function Quote() {
  return (
    <>
      <div className="w-[100%] h-[100%] overflow-clip   ">
        <Outlet />
      </div>
    </>
  );
}

