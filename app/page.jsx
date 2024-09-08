import Price from "@/components/subscription/price";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

import { FaGithub, FaYoutube } from "react-icons/fa";

export default function page() {
	return (
		<div className="space-y-10">
			<div>
				<h1 className="text-xl font-bold">Test links</h1>
				<div className=" space-x-2">
					<Link href="/dashboard" className="underline ml-8">
						/dashboard
					</Link>
					<Link href="/profile" className=" underline ml-8">
						/profile
					</Link>
					<Link href="/subscription" className=" underline ml-8">
						/subscription
					</Link>
				</div>
			</div>
			<Price />

		</div>
	);
}
