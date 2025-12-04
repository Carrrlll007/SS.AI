"use client";

import React from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Check, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { getProfile, updateProfile } from "./lib/dataStore";

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["1 Site", "5 Pages", "Builder branding", "Community support"],
    value: "Free",
  },
  {
    name: "Pro",
    price: "$29",
    features: [
      "Unlimited Sites",
      "Unlimited Pages",
      "Custom Domain",
      "Priority Support",
    ],
    highlight: true,
    value: "Pro",
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["White Label", "Team Members", "SSO", "Dedicated Support"],
    value: "Enterprise",
  },
];

export default function Settings() {
  const [profile, setProfile] = React.useState(null);
  const [formState, setFormState] = React.useState({ fullName: "", plan: "Free" });
  const [status, setStatus] = React.useState("idle");

  React.useEffect(() => {
    getProfile().then((data) => {
      setProfile(data);
      setFormState({
        fullName: data?.fullName || "",
        plan: data?.plan || "Free",
      });
    });
  }, []);

  const handleSave = async () => {
    setStatus("saving");
    try {
      const updated = await updateProfile({
        fullName: formState.fullName,
        plan: formState.plan,
      });
      setProfile(updated);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1500);
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and subscription</p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={profile?.email || "user@example.com"} disabled className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="John Doe"
                  value={formState.fullName}
                  onChange={(e) => setFormState((prev) => ({ ...prev, fullName: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 items-center">
              {status === "saved" && (
                <span className="text-sm text-green-600">Saved</span>
              )}
              {status === "error" && (
                <span className="text-sm text-red-600">Error saving changes</span>
              )}
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={handleSave}
                disabled={status === "saving"}
              >
                {status === "saving" ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                whileHover={{ y: -5 }}
                className={`relative rounded-2xl border ${
                  plan.highlight ? "border-indigo-600 shadow-xl" : "border-gray-200 shadow-sm"
                } bg-white p-6 flex flex-col`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-bold tracking-tight text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">
                      {plan.price === "Custom" ? "" : "/month"}
                    </span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mr-2" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={formState.plan === plan.value ? "outline" : "default"}
                  className={`w-full ${formState.plan !== plan.value ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
                  onClick={() => setFormState((prev) => ({ ...prev, plan: plan.value }))}
                >
                  {formState.plan === plan.value ? "Current Plan" : "Choose Plan"}
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Keep your account safe</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Two-factor authentication</p>
                <p className="text-xs text-gray-500">Add an extra layer of protection.</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-indigo-600">
              Manage
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
