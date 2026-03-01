"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock reset logic
    if (email.trim() !== "") {
      setSubmitted(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md shadow-lg border-gray-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Reset your password
          </CardTitle>
          <CardDescription className="text-gray-500">
            Enter your email and we’ll send reset instructions
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    className="pl-9 border-gray-200 focus-visible:ring-blue-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Send Reset Link →
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
              <p className="text-gray-700 font-medium">
                If an account exists for <span className="font-semibold">{email}</span>,
                a reset link has been sent.
              </p>
              <Link href="/login" className="text-blue-600 hover:underline font-semibold text-sm">
                Back to Login
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}