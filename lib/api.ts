const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${API_URL}${path}`;
  
  // Include credentials (cookies)
  options.credentials = "include";
  options.headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, options);

  if (response.status === 401 && !path.includes("/auth/login")) {
    // Optional: redirect to login if unauthorized
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  return response;
}
