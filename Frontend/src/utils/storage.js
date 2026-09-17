const EMPLOYEES_KEY = "cornor_ems_employees";
const STAFF_ACCOUNTS_KEY = "cornor_ems_staff_accounts";
const PROJECTS_KEY = "cornor_ems_projects";
const AUTH_KEY = "cornor_ems_auth";




export function getEmployees() {
  const raw = localStorage.getItem(EMPLOYEES_KEY);

  return raw ? JSON.parse(raw) : [];
}


export function saveEmployees(employees) {
  localStorage.setItem(
    EMPLOYEES_KEY,
    JSON.stringify(employees)
  );
}


export function addEmployee(employee) {
  const employees = getEmployees();

  const newEmployee = {
    ...employee,
    id: Date.now(),
  };

  saveEmployees([
    ...employees,
    newEmployee,
  ]);

  return newEmployee;
}


export function updateEmployee(id, updates) {
  const employees = getEmployees().map((emp) =>
    emp.id === Number(id)
      ? {
          ...emp,
          ...updates,
        }
      : emp
  );

  saveEmployees(employees);
}


export function deleteEmployee(id) {
  const employees = getEmployees().filter(
    (emp) => emp.id !== Number(id)
  );

  saveEmployees(employees);
}


export function getEmployeeById(id) {
  return getEmployees().find(
    (emp) => emp.id === Number(id)
  );
}


export function seedIfEmpty(seedData) {
  if (getEmployees().length === 0) {
    saveEmployees(seedData);
  }
}




export function getStaffAccounts() {
  const raw = localStorage.getItem(
    STAFF_ACCOUNTS_KEY
  );

  return raw ? JSON.parse(raw) : [];
}


export function saveStaffAccounts(accounts) {
  localStorage.setItem(
    STAFF_ACCOUNTS_KEY,
    JSON.stringify(accounts)
  );
}


// Create Staff Account
export function addStaffAccount(account) {
  const accounts = getStaffAccounts();

  const newAccount = {
    ...account,
    id: Date.now(),
  };

  saveStaffAccounts([
    ...accounts,
    newAccount,
  ]);

  return newAccount;
}


// Update Staff Account
export function updateStaffAccount(id, updates) {
  const accounts = getStaffAccounts().map(
    (account) =>
      account.id === Number(id)
        ? {
            ...account,
            ...updates,
          }
        : account
  );

  saveStaffAccounts(accounts);
}


// Delete Staff Account
export function deleteStaffAccount(id) {
  const accounts = getStaffAccounts().filter(
    (account) =>
      account.id !== Number(id)
  );

  saveStaffAccounts(accounts);
}


// Get Staff Account
export function getStaffAccountById(id) {
  return getStaffAccounts().find(
    (account) =>
      account.id === Number(id)
  );
}


// Get Staff Account for an Employee
export function getStaffAccountByEmployeeId(employeeId) {
  return getStaffAccounts().find(
    (account) =>
      Number(account.employeeId) === Number(employeeId)
  );
}


// Check whether employee already has a staff account
export function employeeHasStaffAccount(employeeId) {
  return getStaffAccounts().some(
    (account) =>
      Number(account.employeeId) === Number(employeeId)
  );
}


// =====================================================
// PROJECTS
// =====================================================

export function getProjects() {
  const raw = localStorage.getItem(PROJECTS_KEY);

  return raw ? JSON.parse(raw) : [];
}


export function saveProjects(projects) {
  localStorage.setItem(
    PROJECTS_KEY,
    JSON.stringify(projects)
  );
}


export function addProject(project) {
  const projects = getProjects();

  const newProject = {
    ...project,
    id: Date.now(),
  };

  saveProjects([
    ...projects,
    newProject,
  ]);

  return newProject;
}


export function updateProject(id, updates) {
  const projects = getProjects().map((project) =>
    project.id === Number(id)
      ? {
          ...project,
          ...updates,
        }
      : project
  );

  saveProjects(projects);
}


export function deleteProject(id) {
  const projects = getProjects().filter(
    (project) =>
      project.id !== Number(id)
  );

  saveProjects(projects);
}


export function getProjectById(id) {
  return getProjects().find(
    (project) =>
      project.id === Number(id)
  );
}




const DEMO_USER = {
  username: "admin",
  password: "cornor123",
};


export function login(username, password) {
  if (
    username === DEMO_USER.username &&
    password === DEMO_USER.password
  ) {
    localStorage.setItem(
      AUTH_KEY,
      "true"
    );

    return true;
  }

  return false;
}


export function logout() {
  localStorage.removeItem(AUTH_KEY);
}


export function isAuthenticated() {
  return (
    localStorage.getItem(AUTH_KEY) === "true"
  );
}