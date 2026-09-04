// Every call the review app makes to its server. One place, so a view never hand-rolls a fetch
// and error handling is the same everywhere: transport failures throw, refused verdicts return ok:false.
async function json(path, init) {
  const r = await fetch(path, init);
  if (!r.ok && r.status !== 400) throw new Error(`${init?.method ?? "GET"} ${path} → ${r.status}`);
  return r.json();
}
const post = (path, body) =>
  json(path, { method: "POST", headers: body ? { "content-type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });

export const api = {
  queue: () => json("/api/queue"),
  rules: () => json("/api/rules"),
  schema: () => json("/api/schema"),
  skills: () => json("/api/skills"),
  install: () => post("/api/install"),
  verdict: (id, action, edits) => post("/api/verdict", { id, action, edits }),
  compile: () => post("/api/compile"),
};
