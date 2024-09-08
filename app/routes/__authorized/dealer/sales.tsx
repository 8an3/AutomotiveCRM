import slider from '~/styles/slider.css'
import { Container } from "@radix-ui/themes";
import { Outlet, useLoaderData } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { commitSession, getSession } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";
import { model } from "~/models";
import Sidebar from "~/components/zRoutes/oldComps/sidebar";
import { type LinksFunction, json, createCookie, redirect } from "@remix-run/node";
import NotificationSystem from "~/routes/__authorized/dealer/notifications";
import { GetUser } from "~/utils/loader.server";
import secondary from "~/styles/secondary.css";
import global from "~/globals.css";
import useSWR from 'swr';
import axios from 'axios'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import money from '~/images/favicons/money.svg'



export const links: LinksFunction = () => [
  { rel: "stylesheet", href: slider },
  { rel: "stylesheet", href: secondary },
  { rel: "stylesheet", href: global },


]
export default function Quote() {
  return (
    <>
      <div className="w-[100%] h-[100%] overflow-clip    bg-background  ">
        <Outlet />
      </div>
    </>
  );
}

