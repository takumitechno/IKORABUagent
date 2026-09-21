export interface AgentCharacterIdentity {
  slug: string;
  pokemon_jp?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
}

export interface AgentCharacterImage {
  agentId: string;
  displayName: string;
  aliases: readonly string[];
  imagePath: string | null;
}

// This is the single source of truth for Internal HQ character images.
// Keep imagePath null until a verified, repo-local asset exists. Do not map a
// different person or an external image merely to avoid the role-icon fallback.
export const AGENT_CHARACTER_IMAGES: readonly AgentCharacterImage[] = [
  { agentId: "sashihara-orchestrator", displayName: "指原", aliases: ["sashihara", "指原"], imagePath: null },
  { agentId: "iori-validator", displayName: "衣織", aliases: ["iori", "衣織"], imagePath: "/internal-assets/member-photos/iori.jpg" },
  { agentId: "maika-hypothesizer", displayName: "舞香", aliases: ["maika", "舞香"], imagePath: "/internal-assets/member-photos/maika.jpg" },
  { agentId: "hitomi-selector", displayName: "瞳", aliases: ["hitomi", "瞳"], imagePath: "/internal-assets/member-photos/hitomi.jpg" },
  { agentId: "anna-supervisor", displayName: "杏奈", aliases: ["anna", "杏奈"], imagePath: "/internal-assets/member-photos/anna.jpg" },
  { agentId: "kiara-executor", displayName: "樹愛羅", aliases: ["kiara", "樹愛羅"], imagePath: "/internal-assets/member-photos/kiara.jpg" },
  { agentId: "hana-heartbeat", displayName: "はな", aliases: ["hana", "はな"], imagePath: "/internal-assets/member-photos/hana.jpg" },
  { agentId: "risa-notifier", displayName: "りさ", aliases: ["risa", "りさ"], imagePath: "/internal-assets/member-photos/risa.jpg" },
  { agentId: "shoko-reporter", displayName: "しょうこ", aliases: ["shoko", "shoko-reporter", "しょうこ"], imagePath: "/internal-assets/member-photos/shoko.jpg" },
  { agentId: "mirinya-cost-analyst", displayName: "みりにゃ", aliases: ["mirinya", "みりにゃ"], imagePath: "/internal-assets/member-photos/mirinya.jpg" },
  { agentId: "sanatsun-knowledge-editor", displayName: "さなつん", aliases: ["sanatsun", "さなつん"], imagePath: "/internal-assets/member-photos/sanatsun.jpg" },
] as const;

function normalizeIdentity(value: string | null | undefined): string {
  return (value || "")
    .normalize("NFKC")
    .toLocaleLowerCase("ja-JP")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .replace(/[\s_.]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const characterByAlias = new Map<string, AgentCharacterImage>();
for (const character of AGENT_CHARACTER_IMAGES) {
  for (const alias of [character.agentId, character.displayName, ...character.aliases]) {
    characterByAlias.set(normalizeIdentity(alias), character);
  }
}

export function findAgentCharacter(identity: AgentCharacterIdentity): AgentCharacterImage | null {
  for (const candidate of [identity.slug, identity.pokemon_jp, identity.display_name]) {
    const match = characterByAlias.get(normalizeIdentity(candidate));
    if (match) return match;
  }
  return null;
}

function repoLocalImagePath(value: string | null | undefined): string | null {
  const path = value?.trim();
  if (!path || !path.startsWith("/") || path.startsWith("//")) return null;
  return path;
}

export function resolveAgentCharacterImage(identity: AgentCharacterIdentity): string | null {
  // A verified repo-local DB path is the most specific source. Remote URLs are
  // deliberately ignored so the dashboard never starts fetching people from an
  // external site as a side effect of rendering.
  const storedAvatar = repoLocalImagePath(identity.avatar_url);
  if (storedAvatar) return storedAvatar;
  return repoLocalImagePath(findAgentCharacter(identity)?.imagePath);
}
