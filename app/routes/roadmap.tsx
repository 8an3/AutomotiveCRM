import { Container } from "@radix-ui/themes";
import { Outlet, useLoaderData } from "@remix-run/react";
import React from "react";
import { getSession } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";
import { model } from "~/models";
import Sidebar from "~/components/shared/sidebar";
import { json } from "@remix-run/node";
import NotificationSystem from "./notifications";
import Roadmap from "./roadmap.list";

export default function Quote() {
	return (
		<>
			<div className="w-full h-auto  px-2 sm:px-1 lg:px-3 bg-black border-gray-300 font-bold uppercase  ">
				<Roadmap />
			</div>
		</>
	);
}
