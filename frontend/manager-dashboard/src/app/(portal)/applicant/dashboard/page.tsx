import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Briefcase, MapPin, Clock, Search } from "lucide-react";

export default function ApplicantDashboardPage() {
  const jobRoles = [
    { title: "Product Manager", dept: "Product", location: "San Francisco, CA", time: "2 days ago", type: "Full-time" },
    { title: "UX/UI Designer", dept: "Design", location: "Remote", time: "5 hours ago", type: "Contract" },
    { title: "DevOps Engineer", dept: "Engineering", location: "New York, NY", time: "1 week ago", type: "Full-time" },
    { title: "Data Scientist", dept: "Data", location: "Boston, MA", time: "3 days ago", type: "Full-time" },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Application Status Tracker */}
      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <CardContent className="p-8">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Application Status: In Review</h2>
              <p className="text-sm text-gray-500 mt-1">Senior Software Engineer at Tech Corp</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full border border-blue-100">
              Active
            </span>
          </div>

          {/* Visual Step Tracker */}
          <div className="relative flex items-center justify-between w-full">
            {/* Background Lines */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[50%] h-1 bg-blue-600 rounded-full z-0"></div>

            {/* Step 1: Applied */}
            <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
              <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center border-4 border-white shadow-sm">
                <Check className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-blue-600">Applied</span>
            </div>

            {/* Step 2: Screening */}
            <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
              <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center border-4 border-white shadow-sm">
                <Check className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-blue-600">Screening</span>
            </div>

            {/* Step 3: Interview */}
            <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
              <div className="h-10 w-10 rounded-full bg-white border-2 border-blue-600 text-blue-600 flex items-center justify-center shadow-sm">
                <span className="font-bold text-sm">3</span>
              </div>
              <span className="text-xs font-semibold text-blue-600">Interview</span>
            </div>

            {/* Step 4: Offer */}
            <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
              <div className="h-10 w-10 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center shadow-sm">
                <span className="font-bold text-sm">4</span>
              </div>
              <span className="text-xs font-semibold text-gray-400">Offer</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Job Roles */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Available Job Roles</h2>
            <p className="text-sm text-gray-500 mt-1">Based on your profile and preferences</p>
          </div>
          <div className="relative w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
             <Input type="text" placeholder="Search jobs..." className="pl-9 bg-white border-gray-200" />
          </div>
        </div>

        <div className="grid gap-4">
          {jobRoles.map((job, i) => (
            <Card key={i} className="border-gray-200 shadow-sm hover:border-blue-200 transition-colors group">
              <CardContent className="p-6 flex flex-row items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0">
                    <Briefcase className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5"/> {job.dept}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5"/> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5"/> {job.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-sm font-semibold text-gray-600 border border-gray-200 px-3 py-1 rounded-md">{job.type}</span>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                    Apply Now →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center pt-4">
           <Button variant="link" className="text-blue-600 font-semibold hover:text-blue-800">
             View all 24 open positions
           </Button>
        </div>
      </div>
    </div>
  );
}