"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Briefcase, TrendingUp } from "lucide-react";

export default function ApplicantPortalAuth() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false); // Default to Sign In for better UX

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Lead Fix: Set the "Contract" for the portal layout to read
    const sessionData = {
      role: "applicant",
      name: isSignUp ? "New Applicant" : "Alex Thompson", // Mocking data for the demo
    };
    
    localStorage.setItem("user_session", JSON.stringify(sessionData));
    
    // Route to the Applicant Dashboard
    router.push("/applicant/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-muted/10">
      {/* Left Marketing Sidebar */}
      <div className="hidden lg:flex flex-col w-1/2 bg-primary/5 p-12 border-r">
        <div className="mb-auto">
           <h1 className="text-4xl font-bold mb-4 tracking-tight">Join our<br/>growing team.</h1>
           <p className="text-muted-foreground mb-12 max-w-md">
             Discover opportunities that match your skills and take the next step in your career journey.
           </p>

           <div className="space-y-8">
             <FeatureItem icon={Search} title="Explore Roles" desc="Find the perfect fit for your expertise" />
             <FeatureItem icon={Briefcase} title="Track Application" desc="Real-time updates on your status" />
             <FeatureItem icon={TrendingUp} title="Grow With Us" desc="Develop your career in a dynamic environment" />
           </div>
        </div>
        
        <p className="text-xs text-muted-foreground/60 italic">
          © 2026 HR Information Systems Portal
        </p>
      </div>

      {/* Right Auth Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Applicant Portal</h2>
            <p className="text-muted-foreground mt-2">
               {isSignUp ? "Create your candidate profile" : "Welcome back, please sign in"}
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex p-1 bg-muted/40 rounded-lg">
            <button 
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isSignUp ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </button>
            <button 
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isSignUp ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
          </div>

          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <form onSubmit={handleAuth} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input type="text" placeholder="John Doe" required />
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input type="email" placeholder="name@example.com" required />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <Input type="password" placeholder="••••••••" required />
                </div>

                {!isSignUp && (
                  <div className="flex items-center justify-between text-sm py-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-primary" />
                      <span>Remember me</span>
                    </label>
                    <a href="#" className="text-primary hover:underline font-medium">Forgot?</a>
                  </div>
                )}

                <Button type="submit" className="w-full h-11">
                  {isSignUp ? "Create Account →" : "Sign In →"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="text-center">
             <Link href="/login">
               <Button variant="ghost" className="text-xs text-muted-foreground hover:text-primary">
                 ← Internal Staff Login
               </Button>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Marketing Sidebar
function FeatureItem({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex gap-4">
      <div className="bg-primary/10 p-3 rounded-lg h-fit"><Icon className="h-6 w-6 text-primary" /></div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}