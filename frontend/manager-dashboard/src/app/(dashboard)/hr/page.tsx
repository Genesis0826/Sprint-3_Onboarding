"use client";
import { useState, useMemo } from "react"; // Added useMemo for performance
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, UserPlus, MoreHorizontal, Filter, Download, CheckCircle2, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HRDashboardPage() {
  const [isToastVisible, setIsToastVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const pipelineData = [
    { initials: "S", name: "Sarah Connor", email: "sarah.c@company.com", role: "Product Designer", dept: "Design", date: "Feb 20, 2026", status: "In Progress", statusColor: "text-blue-600 bg-blue-50", progress: 45, barColor: "bg-blue-600" },
    { initials: "M", name: "Michael Chen", email: "m.chen@company.com", role: "Software Engineer", dept: "Engineering", date: "Feb 18, 2026", status: "Reviewing", statusColor: "text-orange-600 bg-orange-50", progress: 80, barColor: "bg-orange-500" },
    { initials: "J", name: "Jessica Day", email: "j.day@company.com", role: "Marketing Specialist", dept: "Marketing", date: "Feb 22, 2026", status: "Pending", statusColor: "text-blue-400 bg-blue-50", progress: 10, barColor: "bg-blue-400" },
    { initials: "D", name: "David Miller", email: "d.miller@company.com", role: "Sales Associate", dept: "Sales", date: "Feb 15, 2026", status: "Completed", statusColor: "text-green-600 bg-green-50", progress: 100, barColor: "bg-green-500" },
    { initials: "E", name: "Emily Wilson", email: "e.wilson@company.com", role: "HR Coordinator", dept: "Human Resources", date: "Feb 25, 2026", status: "In Progress", statusColor: "text-blue-600 bg-blue-50", progress: 30, barColor: "bg-blue-600" },
    { initials: "A", name: "Alex Thompson", email: "a.thompson@company.com", role: "DevOps Engineer", dept: "Engineering", date: "Feb 26, 2026", status: "Reviewing", statusColor: "text-orange-600 bg-orange-50", progress: 70, barColor: "bg-orange-500" },
    { initials: "R", name: "Rachel Green", email: "r.green@company.com", role: "Product Manager", dept: "Product", date: "Feb 27, 2026", status: "Pending", statusColor: "text-blue-400 bg-blue-50", progress: 0, barColor: "bg-blue-400" },
    { initials: "B", name: "Bruce Wayne", email: "b.wayne@company.com", role: "Finance Director", dept: "Finance", date: "Mar 01, 2026", status: "Completed", statusColor: "text-green-600 bg-green-50", progress: 100, barColor: "bg-green-500" },
  ];

  // Optimization: useMemo filters the data only when searchTerm changes
  const filteredData = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return pipelineData.filter(emp => 
      emp.name.toLowerCase().includes(lowerSearch) || 
      emp.role.toLowerCase().includes(lowerSearch) || 
      emp.dept.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentTableData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 relative">
      {/* Refined Toast Positioning */}
      {isToastVisible && (
        <div className="fixed top-20 right-8 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full shadow-lg text-sm font-medium z-50 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          Login Successful: HR Portal
          <button onClick={() => setIsToastVisible(false)} className="ml-2 hover:bg-green-200 p-0.5 rounded-full transition-colors">
            <X className="h-4 w-4 text-green-600/60" />
          </button>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard icon={Users} color="blue" label="Total Company Headcount" value="1,248" sub="Active Employees" trend="+12%" />
        <MetricCard icon={FileText} color="orange" label="Pending Verifications" value="15" sub="Documents to review" trend="Action Required" />
        <MetricCard icon={UserPlus} color="purple" label="New Hires This Month" value="28" sub="Onboarding in progress" trend="+5" />
      </div>

      {/* Pipeline Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between p-6 border-b border-gray-100 gap-4">
          <h3 className="text-lg font-bold">Onboarding Pipeline</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:ring-1 focus:ring-blue-500 outline-none" 
              />
            </div>
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs font-bold text-gray-400 bg-gray-50/50 border-b border-gray-100 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentTableData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">{row.initials}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{row.name}</p>
                      <p className="text-xs text-gray-500">{row.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{row.role}</td>
                  <td className="px-6 py-4 text-gray-600">{row.dept}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 w-24">
                      <span className={`text-[10px] font-bold ${row.statusColor}`}>{row.status}</span>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${row.barColor}`} style={{ width: `${row.progress}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-gray-500 text-sm">
          <span>Page {currentPage} of {totalPages || 1}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Prev</Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages || totalPages === 0}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for clean code
function MetricCard({ icon: Icon, color, label, value, sub, trend }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600"
  };
  return (
    <Card className="shadow-sm border-gray-100">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-lg ${colors[color]}`}><Icon className="h-5 w-5" /></div>
          <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-gray-100">{trend}</span>
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
        <p className="text-xs text-gray-500">{sub}</p>
      </CardContent>
    </Card>
  );
}