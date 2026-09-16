const EMPLOYEES_KEY = 'cornor_ems_employees'
const AUTH_KEY = 'cornor_ems_auth'

// ---- Employees ----

export function getEmployees() {
  const raw = localStorage.getItem(EMPLOYEES_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveEmployees(employees) {
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees))
}

export function addEmployee(employee) {
  const employees = getEmployees()
  const newEmployee = { ...employee, id: Date.now() }
  saveEmployees([...employees, newEmployee])
  return newEmployee
}

export function updateEmployee(id, updates) {
  const employees = getEmployees().map((emp) =>
    emp.id === Number(id) ? { ...emp, ...updates } : emp
  )
  saveEmployees(employees)
}

export function deleteEmployee(id) {
  const employees = getEmployees().filter((emp) => emp.id !== Number(id))
  saveEmployees(employees)
}

export function getEmployeeById(id) {
  return getEmployees().find((emp) => emp.id === Number(id))
}

export function seedIfEmpty(seedData) {
  if (getEmployees().length === 0) {
    saveEmployees(seedData)
  }
}

// ---- Auth (simulated) ----

const DEMO_USER = { username: 'admin', password: 'cornor123' }

export function login(username, password) {
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    localStorage.setItem(AUTH_KEY, 'true')
    return true
  }
  return false
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}

export function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === 'true'
}