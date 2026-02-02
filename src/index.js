let memoryCache = { value: null, expiresAt: 0 };

export default {
    async fetch(request, env) {
        const now = Date.now();

        // Best-effort in-memory cache (reduces even cached KV reads)
        if (memoryCache.value && now < memoryCache.expiresAt) {
            return redirectWeighted(memoryCache.value);
        }

        // KV read with edge caching (Free plan: cacheTtl must be >= 230s)
        const raw = await env.COSMOS_KV.get("targets.json", {
            cacheTtl: 300,
            type: "text",
        });

        if (!raw) return new Response("No targets configured in KV.", { status: 500 });

        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch {
            return new Response("KV targets.json is not valid JSON.", { status: 500 });
        }

        const targets = Array.isArray(parsed.targets) ? parsed.targets : [];
        const normalized = normalizeTargets(targets);

        if (!normalized.length) {
            return new Response("targets list is empty or invalid.", { status: 500 });
        }

        // Cache in memory briefly (optional)
        memoryCache = { value: normalized, expiresAt: now + 60_000 };

        return redirectWeighted(normalized);
    },
};

function normalizeTargets(targets) {
    const out = [];

    for (const t of targets) {
        const url = typeof t?.url === "string" ? t.url.trim() : "";
        if (!url) continue;

        const w = t?.weight ?? 1;
        const weight = Number.isFinite(Number(w)) ? Number(w) : 1;

        // weight <= 0 means "disabled"
        if (weight <= 0) continue;

        out.push({ url, weight });
    }

    return out;
}

function redirectWeighted(targets) {
    const url = weightedChoice(targets);
    return new Response(null, {
        status: 302,
        headers: {
            Location: url,
            "Cache-Control": "no-store, max-age=0",
        },
    });
}

function weightedChoice(targets) {
    let total = 0;
    for (const t of targets) total += t.weight;

    if (!(total > 0)) {
        return targets[Math.floor(Math.random() * targets.length)].url;
    }

    let r = Math.random() * total;
    for (const t of targets) {
        r -= t.weight;
        if (r < 0) return t.url;
    }
    return targets[targets.length - 1].url;
}
