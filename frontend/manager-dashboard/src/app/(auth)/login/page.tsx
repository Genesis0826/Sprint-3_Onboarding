"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { User, Lock, AlertCircle } from "lucide-react";

import { loginApi } from "@/lib/authApi";
import { setTokens, parseJwt, getAccessToken } from "@/lib/authStorage";
import { roleToPath } from "@/lib/roleMap";

export default function EmployeeLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState(""); // this is identifier (email or username)
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect already-authenticated users away from login
  useEffect(() => {
    const access = getAccessToken();
    if (access) {
      const decoded = parseJwt(access);
      if (decoded?.role_name) {
        router.replace(roleToPath(decoded.role_name));
      }
    }
  }, [router]);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  const identifier = email.trim();
  const pwd = password;

  if (!identifier) {
    setError("Please enter email or username.");
    return;
  }

  try {
    setLoading(true);

    const { access_token, refresh_token } = await loginApi({
      identifier,
      password: pwd,
      rememberMe,
    });

    // save tokens
    setTokens({ access_token, refresh_token, rememberMe });

    // decode role_name
    const decoded = parseJwt(access_token);
    const roleName = decoded?.role_name;

    console.log("LOGIN OK", {
      roleName,
      access_preview: access_token?.slice(0, 25) + "...",
    });

    let redirectPath = "/employee";
    switch (roleName) {
      case "System Admin":
        redirectPath = "/system-admin";
        break;
      case "Admin":
        redirectPath = "/admin";
        break;
      case "HR Manager":
        redirectPath = "/hr-manager";
        break;
      case "HR Recruiter":
        redirectPath = "/hr-recruiter";
        break;
      case "HR Interviewer":
        redirectPath = "/hr-interviewer";
        break;
      case "Active Employee":
        redirectPath = "/employee";
        break;
      case "Applicant":
        redirectPath = "/applicant";
        break;
      default:
        redirectPath = "/employee";
    }

    console.log("REDIRECTING TO:", redirectPath);

    router.push(redirectPath);
  } catch (err: any) {
    console.log("LOGIN FAILED:", err);
    setError(err?.message || "Invalid credentials");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md shadow-lg border-gray-100">
        <CardHeader className="text-center pb-6">
          <CardDescription className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-2">
            HR Information System
          </CardDescription>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-gray-500">
            Please sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Email or Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Email or username"
                  className="pl-9 border-gray-200 focus-visible:ring-blue-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 border-gray-200 focus-visible:ring-blue-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm py-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                <span className="text-gray-600 font-medium">Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-blue-600 hover:underline font-semibold"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm mt-2"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-3 pt-6 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
          <Link
            href="/applicant/login"
            className="text-blue-600 font-medium hover:underline text-sm"
          >
            Applicant Portal →
          </Link>

          <Link
            href="/subscribe"
            className="text-gray-600 hover:text-blue-600 hover:underline text-sm"
          >
            New Company? Subscribe Now
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}