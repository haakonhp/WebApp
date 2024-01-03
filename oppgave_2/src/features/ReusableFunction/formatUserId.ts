// --------    Display name without - Logic   ---- //
export function formatUserId(userId: string) {
  return userId.replace(/-/g, " ")
}
