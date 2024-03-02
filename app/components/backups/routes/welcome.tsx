import { Outlet } from '@remix-run/react'
import { type MetaFunction } from '@remix-run/node'
import stylesheet from '~/styles/tailwind.css'
import Sidebar from "~/components/shared/sidebar";
import slider from '~/styles/slider.css'

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: slider },
	{ rel: "stylesheet", href: stylesheet }
];

export const meta: MetaFunction = () => {
	return [
		{ title: "Welcome - Dealer Sales Assistant" },
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
			<Sidebar />
			<div className="flex min-h-screen px-4 sm:px-6 lg:px-8 bg-slate12 text-slate3">
				<div className="w-full overflow-hidden rounded-lg ">
					<div className="md:flex my-auto mx-auto">
						<div className="sm:w-2/3 w-full my-auto mx-auto ">
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

