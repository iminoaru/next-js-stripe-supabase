'use client'

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import Checkout from './Checkout';
import useUser from '@/app/hook/useUser';

const PricingCard = ({ price, isYearly, isPopular }) => (
  <div
    className={cn(
      "flex flex-col h-full  border rounded-lg p-6 transition-all duration-200 hover:shadow-lg",
      {
        "ring-2 ring-blue-500": isPopular,
      }
    )}
  >
    {isPopular && (
      <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold rounded-full px-3 py-1">
        Popular
      </span>
    )}
    <h2 className="text-2xl font-bold mb-2">{price.title}</h2>
    <p className="text-gray-600 mb-4">{price.description}</p>
    <div className="text-4xl font-bold mb-4">
      ${isYearly ? price.yearlyAmount : price.monthlyAmount}
      <span className="text-base font-normal text-gray-600">
        /{isYearly ? 'year' : 'month'}
      </span>
    </div>
    <ul className="space-y-3 mb-6 flex-grow">
      {price.benefits.map((benefit, index) => (
        <li key={index} className="flex items-center gap-2">
          <CheckCircle2 className="text-green-500" size={20} />
          <span className="text-sm text-gray-600">{benefit}</span>
        </li>
      ))}
    </ul>
    <Checkout
      priceId={isYearly ? price.yearlyPriceId : price.monthlyPriceId}
    />
  </div>
);

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const { data: user, isLoading } = useUser();

  const prices = [
    {
      title: "Free",
      description: "Perfect for side projects",
      benefits: [
        "Up to 3 projects",
        "Basic analytics",
        "24/7 support",
      ],
      monthlyAmount: 0,
      yearlyAmount: 0,
      monthlyPriceId: "price_free_monthly",
      yearlyPriceId: "price_free_yearly",
    },
    {
      title: "Dev",
      description: "For growing developers",
      benefits: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "Custom domain",
      ],
      monthlyAmount: 20,
      yearlyAmount: 200,
      monthlyPriceId: "price_1PwfXsP8f8vbBmtJ2pJSYcZV",
      yearlyPriceId: "price_1PwfYTP8f8vbBmtJLmd4rn5I",
    },
    {
      title: "Pro",
      description: "For professional developers",
      benefits: [
        "Everything in Dev",
        "White-label solution",
        "API access",
        "Dedicated account manager",
      ],
      monthlyAmount: 50,
      yearlyAmount: 500,
      monthlyPriceId: "price_1PwocDP8f8vbBmtJWCNrj2vA",
      yearlyPriceId: "price_1PwfYxP8f8vbBmtJvVf2ZHju",
    },
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (user?.subscription?.customer_id) {
    return <div className="text-center p-8">You are already subscribed!</div>;
  }

  return (
    <div className="container mx-auto px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h1>
      <p className="text-xl text-gray-600 text-center mb-8">
        Select the perfect plan for your needs
      </p>
      <div className="flex justify-center items-center space-x-4 mb-12">
        <span className={cn("text-lg", { "text-gray-900": !isYearly, "text-gray-500": isYearly })}>Monthly</span>
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />
        <span className={cn("text-lg", { "text-gray-900": isYearly, "text-gray-500": !isYearly })}>Yearly</span>
        {isYearly && <span className="text-sm text-green-500 font-medium">Save up to 20%</span>}
      </div>
	  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
		{prices.map((price, index) => (
			<PricingCard
			key={index}
			price={price}
			isYearly={isYearly}
			isPopular={index === 1}
			/>
		))}
		</div>

    </div>
  );
}