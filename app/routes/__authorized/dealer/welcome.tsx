import { Outlet } from '@remix-run/react'
import { type MetaFunction, type LinksFunction } from '@remix-run/node'
import Sidebar from "~/components/shared/sidebar";
import slider from '~/styles/slider.css'
import secondary from "~/styles/secondary.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: slider },
	{ rel: "icon", type: "image/svg", sizes: "32x32", href: "/money24.svg", },
	{ rel: "icon", type: "image/svg", sizes: "16x16", href: "/money16.svg", },
	{ rel: "stylesheet", href: secondary },

]


export const meta = () => {
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
			<div className="flex h-screen w-screen  bg-[#09090b] text-slate3">
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

