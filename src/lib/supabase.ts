import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let browserClient:
    | ReturnType<typeof createClient>
    | null
    | undefined;

// Returns true only when the value looks like a real URL, not a placeholder
function isValidUrl(value: string | undefined): value is string {
    if (!value) return false;
    try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
    } catch {
        return false;
    }
}

// Browser client — safe to use on the client side
export function getSupabaseBrowserClient() {
    if (!isValidUrl(supabaseUrl) || !supabaseAnonKey || supabaseAnonKey.startsWith("your_")) {
        // Silently disabled — Supabase not configured yet
        return null;
    }
    if (!browserClient) {
        browserClient = createClient(supabaseUrl, supabaseAnonKey);
    }

    return browserClient;
}

// Server client — uses service role key, never expose to browser
export function getSupabaseServerClient() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!isValidUrl(supabaseUrl) || !serviceRoleKey || serviceRoleKey.startsWith("your_")) {
        return null;
    }
    return createClient(supabaseUrl, serviceRoleKey);
}
