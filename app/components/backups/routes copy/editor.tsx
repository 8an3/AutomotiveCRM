import { Outlet } from "@remix-run/react";
import React, { useState, useEffect } from 'react';
import Sidebar from "~/components/shared/sidebar";
// <Sidebar />

export default function editor() {
  return (
    <>
      <Sidebar />
      <div className='w-[100%]  mx-auto  h-[100%] justify-center mx-auto items-center bg-slate12 border-gray-300'>
        <Outlet />
      </div>
    </>
  )
}
// maybe host this in  an irame so its accesible accross all pages in the sidebar maybe?

