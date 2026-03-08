// for creating users, not for login, login is in auth module

export class CreateUserDto {
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;         // character varying in DB (e.g. "3", "4")
  company_id?: string;     // only used by System Admin — Admin gets this from their JWT
  department_id?: string;  // optional — can be assigned later
  start_date?: string;     // optional — ISO date string e.g. "2026-03-09"
}
