const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("kairos_token") : null;

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Erro na requisição: ${res.status}`);
    }

    return res.json() as Promise<T>;
}

export const api = {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, data?: unknown) =>
        request<T>(path, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
};
