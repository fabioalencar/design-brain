// One card renderer. The queue swipes it and the drawer edits it; the mode is a parameter,
// not a DOM patch applied afterwards.
export const esc = (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
export const md = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");

/** An evidence line, already split by the server into type, label, reference and quote. */
export function evidenceLine(raw, parsed) {
  if (!parsed) return `<li>${md(raw)}</li>`;
  const { type, label, ref, quote } = parsed;
  const refHtml = ref ? `<span class="ref">${esc(ref.replace(/^~\/Code\//, ""))}</span>` : "";
  const q = quote ? `<span class="quote">${type === "transcript" ? "“" + md(quote) + "”" : md(quote)}</span>` : "";
  return `<li><span class="src">${esc(label)}</span>${q}${q && refHtml ? "<br>" : ""}${refHtml}</li>`;
}

/** "- project — value" lines become rows whose first segment is the label. */
export function listify(text) {
  if (!text) return "";
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (!lines.every((l) => /^[-*]\s/.test(l))) return "";
  return lines
    .map((l) => {
      const body = l.replace(/^[-*]\s+/, "");
      const parts = body.split(/\s[—–]\s/);
      return parts.length > 1 ? `<li><span class="who">${md(parts[0])}</span>${md(parts.slice(1).join(" — "))}</li>` : `<li>${md(body)}</li>`;
    })
    .join("");
}

export const statusLabel = (s) => (s === "candidate" ? "in review" : s);

const option = (list, cur) => list.map((s) => `<option ${s === cur ? "selected" : ""}>${s}</option>`).join("");

/**
 * @param c        a card from /api/queue or /api/rules
 * @param depth    0 = front of the stack, 1 and 2 = behind it (queue mode only)
 * @param schema   /api/schema, so the selects cannot drift from the validator
 * @param skipped  ids the reviewer pushed to the back of the queue
 */
export function cardEl(c, { depth = 0, schema, skipped = new Set() } = {}) {
  const el = document.createElement("div");
  el.className = "card" + (depth === 0 ? " top" : depth === 1 ? " next" : " next2");
  el.dataset.id = c.id;
  const stances = schema?.stances ?? ["always", "never", "prefer", "avoid", "context"];
  const scopes = [...new Set([...(schema?.scopes ?? ["universal", "personal"]), "project:" + (c.occurrences[0] || "x"), c.scope])];
  const ev = c.evidence.map((e, i) => evidenceLine(e, c.evidenceParsed?.[i])).join("");
  const exList = listify(c.examples);
  const exBody = exList ? `<ul>${exList}</ul>` : c.examples && `<p>${md(c.examples)}</p>`;
  const sec = (title, body, quiet) => (body ? `<section class="${quiet ? "quiet" : ""}"><h2>${title}</h2>${body}</section>` : "");
  el.innerHTML = `
    <div class="stamp yes">PROMOTE</div><div class="stamp no">RETIRE</div>
    <div class="head"><h1>${esc(c.title)}</h1>
      <div class="chips">
        <span class="chip ${esc(c.stance)}"><em>stance</em><select name="stance" onchange="this.parentNode.className='chip '+this.value">${option(stances, c.stance)}</select></span>
        <span class="chip dim"><em>confidence</em><input name="confidence" type="number" min="1" max="10" value="${c.confidence}"></span>
        <span class="chip dim"><em>scope</em><select name="scope">${option(scopes, c.scope)}</select></span>
      </div>
    </div>
    <div class="body">
    <div class="chiprow">
      <div class="chips metarow">
        <span class="chip meta"><em>dimension</em>${esc(c.dimension)}</span>
        <span class="chip meta"><em>seen</em>${c.occurrences.length}×<span class="info" tabindex="0" data-tip="${esc(c.occurrences.join("\n"))}">i</span></span>
        <span class="chip meta"><em>source</em>${esc(c.source ?? "unrecorded")}<span class="info" tabindex="0" data-tip="${esc(c.id)}\n${esc(c.file)}">i</span></span>
        ${c.kind !== "harvested" ? `<span class="chip meta"><em>kind</em>${esc(c.kind)}</span>` : ""}${c.component ? `<span class="chip meta"><em>component</em>${esc(c.component)}</span>` : ""}
        ${skipped.has(c.id) ? '<span class="chip meta">skipped earlier</span>' : ""}
        ${c.longParas ? `<span class="chip meta warn"><em>needs rewrite</em>${c.longParas} long paragraph${c.longParas > 1 ? "s" : ""}<span class="info" tabindex="0" data-tip="A Rule or Why paragraph runs past five rows. Split it by idea or move detail to Examples.">i</span></span>` : ""}
      </div>
    </div>
    <div class="id">${esc(c.id)} · seen in ${esc(c.occurrences.join(", "))}</div>
    ${c.review_note ? `<div class="note">${md(c.review_note)}</div>` : ""}
    ${(c.conflicts || []).length ? `<div class="callout"><b>Conflicts with</b> ${c.conflicts.map((x) => `${esc(x.id)} · ${esc(x.title)} <span class="st ${esc(x.status)}">${esc(statusLabel(x.status))}</span>`).join("<br>")}${c.resolution ? `<br><b>Resolution:</b> ${md(c.resolution)}` : `<br><span style="opacity:.8">No resolution yet. Promote will ask which wins.</span>`}</div>` : ""}
    ${sec("Rule", `<p>${md(c.rule)}</p>`)}
    ${sec("Why", c.why && `<p>${md(c.why).replace(/\n\n/g, "</p><p>")}</p>`, true)}
    ${sec("Examples", exBody, true)}
    ${sec("Exceptions", c.exceptions && `<p>${md(c.exceptions)}</p>`, true)}
    ${sec(`Evidence · ${c.evidence.length}`, `<ul>${ev}</ul>`, true)}
    ${sec("See also", c.seeAlso && `<p>${md(c.seeAlso)}</p>`, true)}
    ${sec("Review notes", c.notes && `<p>${md(c.notes)}</p>`)}
    </div>`;
  el.addEventListener("scroll", () => el.querySelector(".head").classList.toggle("stuck", el.scrollTop > 4), { passive: true });
  return el;
}

/** The three editable chips, diffed against the card they were rendered from. */
export function cardEdits(el, c) {
  const g = (n) => el.querySelector(`[name=${n}]`)?.value;
  const e = {};
  if (g("stance") && g("stance") !== c.stance) e.stance = g("stance");
  if (g("scope") && g("scope") !== c.scope) e.scope = g("scope");
  if (g("confidence") && Number(g("confidence")) !== Number(c.confidence)) e.confidence = Number(g("confidence"));
  return Object.keys(e).length ? e : undefined;
}
