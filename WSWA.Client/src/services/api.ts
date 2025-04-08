const baseUrl = localStorage.getItem('apiBaseUrl') || import.meta.env.VITE_API_URL;

export async function registerUser(data: any) {
  const res = await fetch(`${baseUrl}/subscription`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function loginUser(email: string) {
    const res = await fetch(`${baseUrl}/subscription/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(email),
    });
  
    const contentType = res.headers.get("content-type");
  
    if (res.ok) {
      return contentType?.includes("application/json")
        ? await res.json()
        : await res.text();
    } else {
      const error = contentType?.includes("application/json")
        ? await res.json()
        : await res.text();
      return { message: error };
    }
  }