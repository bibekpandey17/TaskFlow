function getToken() {
  return localStorage.getItem("token");
}

async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const responseText = await response.text();
  let data = {};
  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error("Server returned an invalid response format.");
    }
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (Status: ${response.status})`);
  }

  return data;
}

export async function getEmployees() {
  const data = await apiRequest("/employees");
  return data;
}

export async function getEmployeeById(id) {
  const data = await apiRequest(`/employees/${id}`);
  return data;
}

export async function createEmployee(values) {
  const data = await apiRequest("/employees", {
    method: "POST",
    body: JSON.stringify(values),
  });
  return data.employee;
}

export async function updateEmployee(id, values) {
  const data = await apiRequest(`/employees/${id}`, {
    method: "PUT",
    body: JSON.stringify(values),
  });
  return data.employee;
}

export async function deleteEmployee(id) {
  return apiRequest(`/employees/${id}`, { method: "DELETE" });
}