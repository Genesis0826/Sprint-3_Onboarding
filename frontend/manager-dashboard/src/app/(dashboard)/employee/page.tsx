"use client";

import { useEffect, useState } from "react";
import { parseJwt, getAccessToken } from "@/lib/authStorage";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Briefcase,
  Calendar,
  CheckCircle2,
  Upload,
  FileText,
  Shield,
  Clock,
} from "lucide-react";



// export default function EmployeeDashboardPage() {
//   return (
//     <AuthGuard allowedRoles={["Active Employee"]}>
//       <EmployeeDashboardInner />
//     </AuthGuard>
//   );
// }
export default function EmployeeDashboardPage() {
  return <EmployeeDashboardInner />;
}
function EmployeeDashboardInner() {
  const [employeeName, setEmployeeName] = useState("Employee");

  useEffect(() => {
  const token = getAccessToken();
  if (!token) return;
  const decoded = parseJwt(token);
  const first = decoded?.first_name || "";
  const last = decoded?.last_name || "";
  const full = (first + " " + last).trim();
  setEmployeeName(full || decoded?.username || decoded?.email || "Employee");
}, []);



  const checklist = [
    { title: "Upload Identification Documents", status: "Pending", icon: Upload, locked: false },
    { title: "Review Employee Handbook", status: "Pending", icon: FileText, locked: false },
    { title: "Complete Tax Forms", status: "Pending", icon: FileText, locked: false },
    { title: "Set Up Direct Deposit", status: "Pending", icon: Briefcase, locked: false },
    { title: "IT Security Training", status: "Locked", icon: Shield, locked: true },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Blue Welcome Banner */}
      <div className="relative bg-[#1e40af] overflow-hidden rounded-xl p-8 text-white shadow-sm h-48 flex flex-col justify-center">
        {/* Decorative background circles */}
        <div className="absolute top-0 right-10 w-48 h-48 bg-white/10 rounded-full -translate-y-1/4 translate-x-1/4 border-white/5"></div>
        <div className="absolute bottom-0 right-32 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 translate-x-1/4 border-white/5"></div>

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-3">Welcome, {employeeName}!</h1>
          <p className="text-white/80 text-sm leading-relaxed">
            We're excited to have you on board. Here's a quick overview of your
            profile and onboarding progress.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_1.5fr] gap-6 items-start">
        {/* Basic Profile Details Card */}
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <User className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-bold text-gray-900">
                Basic Profile Details
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProfileField icon={User} label="FULL NAME" value={employeeName} />
            <ProfileField icon={Briefcase} label="ROLE" value="Active Employee" />
            <ProfileField icon={Calendar} label="START DATE" value="February 24, 2026" />
          </CardContent>
        </Card>

        {/* Onboarding Checklist Card */}
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Onboarding Checklist
                </CardTitle>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-500">Progress</span>
              <span className="font-bold text-blue-600 text-base">
                0% Complete
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div className="w-[0%] h-full bg-blue-600 rounded-full"></div>
            </div>
          </CardHeader>

          <CardContent className="mt-4 space-y-3">
            {checklist.map((item, idx) => (
              <ChecklistItem key={idx} item={item} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper component for cleaner code
function ProfileField({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4 bg-gray-50/80 p-4 rounded-xl border border-gray-100/50">
      <Icon className="h-5 w-5 text-gray-400 shrink-0" />
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// Helper component for checklist
function ChecklistItem({ item }: any) {
  const Icon = item.icon;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border ${
        item.locked
          ? "bg-gray-50/50 border-gray-100 opacity-60"
          : "bg-white border-orange-100/50 hover:border-orange-200 transition-colors shadow-sm"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-2 rounded-full ${
            item.locked ? "bg-gray-100 text-gray-400" : "bg-orange-50 text-orange-500"
          }`}
        >
          {Icon ? <Icon className="h-4 w-4" /> : null}
        </div>

        <span className={`font-semibold ${item.locked ? "text-gray-500" : "text-gray-900"}`}>
          {item.title}
        </span>
      </div>

      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
          item.locked
            ? "text-gray-400 bg-gray-100"
            : "text-orange-600 bg-orange-50 border border-orange-100/50"
        }`}
      >
        {!item.locked && <Clock className="h-3 w-3" />}
        {item.status}
      </div>
    </div>
  );
}