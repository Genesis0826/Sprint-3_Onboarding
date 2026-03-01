export function roleToPath(roleName?: string) {
  switch (roleName) {
    case "System Admin":
      return "/system-admin";
    case "Admin":
      return "/admin";
    case "HR Manager":
      return "/hr-manager";
    case "HR Recruiter":
      return "/hr-recruiter";
    case "HR Interviewer":
      return "/hr-interviewer";
    case "Active Employee":
      return "/employee";
    case "Applicant":
      return "/applicant";
    default:
      return "/login";
  }
}