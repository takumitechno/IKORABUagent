import "server-only";
import { cache } from "react";
import { LocalContentRepository } from "./local-repository";
import type { ContentRepository } from "./repository";
import { SupabaseContentRepository } from "./supabase-repository";

export * from "./types";

function createRepository(): ContentRepository {
  if (process.env.CONTENT_SOURCE === "supabase") {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) throw new Error("CONTENT_SOURCE=supabase requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return new SupabaseContentRepository(url, anonKey);
  }
  return new LocalContentRepository();
}

export const getRepository = cache(createRepository);
