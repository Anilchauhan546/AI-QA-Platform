// src/api/api.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

// ─── Token helpers ────────────────────────────────────────────────────────────
export const getToken  = ()  => localStorage.getItem("token")
export const setToken  = (t) => localStorage.setItem("token", t)
export const setUser   = (u) => localStorage.setItem("user", JSON.stringify(u))
export const getUser   = ()  => JSON.parse(localStorage.getItem("user") || "null")
export const clearAuth = ()  => { localStorage.removeItem("token"); localStorage.removeItem("user") }

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function request(method, path, body = null, auth = true) {
  const headers = { "Content-Type": "application/json" }
  if (auth) {
    const token = getToken()
    if (token) headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }))
    throw new Error(err.detail || "Request failed")
  }

  return res.json()
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (username, password) => {
    return fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Login failed" }))
        throw new Error(err.detail || "Login failed")
      }
      return res.json()
    })
  },
  register: (username, password, role) =>
    request("POST", "/auth/register", { username, password, role }, false),
}

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersAPI = {
  getAll:  ()                         => request("GET",    "/users/"),
  create:  (username, password, role) => request("POST",   "/users/",     { username, password, role }),
  update:  (id, data)                 => request("PUT",    `/users/${id}`, data),
  delete:  (id)                       => request("DELETE", `/users/${id}`),
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export const projectsAPI = {
  getAll:  ()         => request("GET",    "/projects/"),
  create:  (data)     => request("POST",   "/projects/",      data),
  update:  (id, data) => request("PUT",    `/projects/${id}`, data),
  delete:  (id)       => request("DELETE", `/projects/${id}`),
}

// ─── Test Cases ───────────────────────────────────────────────────────────────
export const testcasesAPI = {
  getAll:  ()         => request("GET",    "/testcases/"),
  create:  (data)     => request("POST",   "/testcases/",      data),
  update:  (id, data) => request("PUT",    `/testcases/${id}`, data),
  delete:  (id)       => request("DELETE", `/testcases/${id}`),
}

// ─── Defects ──────────────────────────────────────────────────────────────────
export const defectsAPI = {
  getAll:  ()         => request("GET",    "/defects/"),
  create:  (data)     => request("POST",   "/defects/",      data),
  update:  (id, data) => request("PUT",    `/defects/${id}`, data),
  delete:  (id)       => request("DELETE", `/defects/${id}`),
}