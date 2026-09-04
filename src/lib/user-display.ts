export function displayName(
  claims: { user_metadata?: Record<string, unknown> } | undefined,
) {
  const metadata = claims?.user_metadata ?? {};
  const name = metadata.name ?? metadata.full_name ?? metadata.nickname;
  return typeof name === "string" && name.trim() ? name : undefined;
}
