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
export const loader = async ({ request }) => {
	const session = await getSession(request.headers.get("Cookie"));
	const email = session.get("email")
	const user = await model.user.query.getForSession({ email: email });
	const notifications = await prisma.notificationsUser.findMany({
		where: { userId: user.id, }
	})
	const notificationsNewLead = await prisma.notificationsUser.findMany({
		where: { type: 'New Lead', }
	})
	if (!user) { redirect('/login') }
	return json({ user, notifications, notificationsNewLead, });
}

export default function Quote() {
	const { notifications, user } = useLoaderData()

	return (
		<>
			<div className="w-full h-auto  px-2 sm:px-1 lg:px-3 bg-black border-gray-300 font-bold uppercase  ">
				<Sidebar user={user} />
				<NotificationSystem />
				<Roadmap />
			</div>
		</>
	);
}
