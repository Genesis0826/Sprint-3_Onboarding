"use client";

import { Users, Clock, CheckCircle } from "lucide-react";

const teamMembers = [
  { name: "Alex Johnson", role: "Senior Developer", status: "Online" },
  { name: "Maria Garcia", role: "Product Designer", status: "Online" },
  { name: "James Wilson", role: "QA Engineer", status: "Online" },
  { name: "Sarah Lee", role: "Frontend Developer", status: "Online" },
  { name: "Michael Brown", role: "Backend Engineer", status: "Away" },
 
];

export default function ManagerDashboardPage() {
  return (
    <div className="space-y-16">

      {/* ================= KPI SECTION ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <div className="bg-white rounded-3xl shadow-md p-8">
          <div className="flex items-center gap-4 mb-6">
            <Users className="h-6 w-6 text-indigo-600" />
            <span className="text-green-600 text-sm font-medium">
              Stable
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-2">MY TEAM SIZE</p>
          <h2 className="text-4xl font-bold">12</h2>
          <p className="text-sm text-gray-500 mt-2">Direct Reports</p>
        </div>

        <div className="bg-white rounded-3xl shadow-md p-8">
          <div className="flex items-center gap-4 mb-6">
            <Clock className="h-6 w-6 text-orange-600" />
            <span className="text-orange-600 text-sm font-medium">
              3 Urgent
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-2">
            PENDING TIME-OFF REQUESTS
          </p>
          <h2 className="text-4xl font-bold">5</h2>
          <p className="text-sm text-gray-500 mt-2">
            Requires your attention
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-md p-8">
          <div className="flex items-center gap-4 mb-6">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <span className="text-green-600 text-sm font-medium">
              Up to date
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-2">
            APPROVALS NEEDED
          </p>
          <h2 className="text-4xl font-bold">2</h2>
          <p className="text-sm text-gray-500 mt-2">
            Performance reviews
          </p>
        </div>

      </div>

  
{/* ================= DIRECT REPORTS ================= */}
<div className="bg-white rounded-2xl shadow-sm p-8">

  <div className="flex justify-between items-center mb-8">
    <div className="flex items-center gap-3">
      <div className="bg-blue-100 p-2 rounded-lg">
        <Users className="h-5 w-5 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold">
        Direct Reports
      </h3>
    </div>

    <button className="text-blue-600 text-sm font-medium hover:underline">
      View All Team
    </button>
  </div>

  <div className="grid grid-cols-4 gap-6 auto-rows-fr"
style={{ gridAutoFlow: "column" }}
>
    {teamMembers.map((member, index) => (
      <div
        key={index}
        className="bg-gray-100 rounded-xl p-6"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
            {member.name.charAt(0)}
          </div>
          <span className="text-gray-400 text-lg">•••</span>
        </div>

        <p className="font-semibold text-base">
          {member.name}
        </p>

        <p className="text-sm text-gray-500">
          {member.role}
        </p>

        <div className="flex items-center gap-2 text-sm mt-3">
          <span
            className={`h-2 w-2 rounded-full ${
              member.status === "Online"
                ? "bg-green-500"
                : member.status === "In Meeting"
                ? "bg-orange-500"
                : member.status === "Away"
                ? "bg-yellow-500"
                : "bg-gray-400"
            }`}
          ></span>
          {member.status}
        </div>
      </div>
    ))}

  </div>
    </div>
      </div>
  );
}