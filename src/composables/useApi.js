export async function apiGet(path, params) {
    try {
        const url = new URL(path, window.location.origin);
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                url.searchParams.set(key, value);
            }
        }
        const response = await fetch(url.toString());
        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            return { ok: false, status: response.status, message: body.error || body.message || response.statusText };
        }
        const data = await response.json();
        return { ok: true, data };
    }
    catch {
        return { ok: false, status: 0, message: 'Erreur réseau. Veuillez réessayer.' };
    }
}
export async function apiPost(path, body) {
    try {
        const response = await fetch(path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            return { ok: false, status: response.status, message: data.error || data.message || response.statusText };
        }
        const data = await response.json();
        return { ok: true, data };
    }
    catch {
        return { ok: false, status: 0, message: 'Erreur réseau. Veuillez réessayer.' };
    }
}
