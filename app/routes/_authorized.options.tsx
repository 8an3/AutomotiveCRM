import { Links, Meta, Outlet } from '@remix-run/react'
import { type MetaFunction, redirect, type LoaderFunction } from '@remix-run/node'
import { prisma } from "~/libs";
import { getSession } from '~/sessions/auth-session.server';
import Sidebar from "~/components/shared/sidebar";
// <Sidebar />
import { requireAuthCookie } from '~/utils/misc.user.server';
import slider from '~/styles/slider.css'

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: slider },
];



export async function loader({ request, params }: LoaderFunctionArgs) {
	let account = await requireAuthCookie(request);
	const user = await model.user.query.getForSession({ email: account.email });

	if (!user?.customerId) { return redirect('/subscribe') }

	return null
}
export const meta: MetaFunction = () => {
	return [
		{ title: "Options - Dealer Sales Assistant" },
		{
			property: "og:title",
			content: "Your very own assistant!",
		},
		{
			name: "description",
			content: "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.", keywords: 'Automotive Sales, dealership sales, automotive CRM',
		},
	];
};

export default function Quote() {
	return (
		<>
			<div className="flex min-h-screen px-4 sm:px-6 lg:px-8">
				<div className="w-full overflow-hidden rounded-lg ">
					<div className="md:flex my-auto mx-auto">
						<div className="md:w-[70%] my-auto mx-auto ">
							<div className="my-auto mx-auto">
								<Outlet />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

