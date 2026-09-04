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
  if (depth === 0) {
    el.tabIndex = 0;
    el.setAttribute("role", "article");
    el.setAttribute("aria-label", `${c.title}. Use the arrow keys to scroll; Retire and Confirm are in the toolbar.`);
  }
  const stances = schema?.stances ?? ["always", "never", "prefer", "avoid", "context"];
  const scopes = [...new Set([...(schema?.scopes ?? ["universal", "personal"]), "project:" + (c.occurrences[0] || "x"), c.scope])];
  const ev = c.evidence.map((e, i) => evidenceLine(e, c.evidenceParsed?.[i])).join("");
  const exList = listify(c.examples);
  const exBody = exList ? `<ul>${exList}</ul>` : c.examples && `<p>${md(c.examples)}</p>`;
  const sec = (title, body, quiet) => (body ? `<section class="${quiet ? "quiet" : ""}"><h2>${title}</h2>${body}</section>` : "");
  el.innerHTML = `
    <div class="stamp yes">CONFIRM</div><div class="stamp no">RETIRE</div>
    <div class="head"><h1>${esc(c.title)}</h1>
      <div class="chips">
        <span class="chip ${esc(c.stance)}"><em>stance</em><select name="stance" onchange="this.parentNode.className='chip '+this.value">${option(stances, c.stance)}</select></span>
        <span class="chip dim"><em>scope</em><select name="scope">${option(scopes, c.scope)}</select></span>
      </div>
    </div>
    <div class="body">
    <div class="chiprow">
      <div class="chips metarow">
        <span class="chip meta"><em>dimension</em>${esc(c.dimension)}</span>
        <span class="chip meta"><em>seen</em>${c.occurrences.length}×<button type="button" class="info" data-tip="${esc(c.occurrences.join("\n"))}" aria-label="Seen in ${esc(c.occurrences.join(", "))}">i</button></span>
        <span class="chip meta"><em>source</em>${esc(c.source ?? "unrecorded")}<button type="button" class="info" data-tip="${esc(c.id)}\n${esc(c.file)}" aria-label="${esc(c.id)}, file ${esc(c.file)}">i</button></span>
        ${c.kind !== "harvested" ? `<span class="chip meta"><em>kind</em>${esc(c.kind)}</span>` : ""}${c.component ? `<span class="chip meta"><em>component</em>${esc(c.component)}</span>` : ""}
        ${skipped.has(c.id) ? '<span class="chip meta">skipped earlier</span>' : ""}
        ${c.longParas ? `<span class="chip meta warn"><em>needs rewrite</em>${c.longParas} long paragraph${c.longParas > 1 ? "s" : ""}<button type="button" class="info" data-tip="A Rule or Why paragraph runs past five rows. Split it by idea or move detail to Examples." aria-label="Needs a rewrite: a Rule or Why paragraph runs past five rows.">i</button></span>` : ""}
      </div>
    </div>
    <div class="id">${esc(c.id)} · seen in ${esc(c.occurrences.join(", "))}</div>
    ${c.review_note ? `<div class="note">${md(c.review_note)}</div>` : ""}
    ${(c.conflicts || []).length ? `<div class="callout ${c.resolution ? "settled" : ""}">
      <h3>${c.resolution ? "Settled against" : "Disagrees with"} ${c.conflicts.length === 1 ? "one rule" : c.conflicts.length + " rules"}</h3>
      <ul class="clist">${c.conflicts.map((x) => `<li>
        <button type="button" class="rulelink" onclick="openRule('${esc(x.id)}')" title="Open ${esc(x.id)}">${esc(x.title)}</button>
        <span class="st ${esc(x.status)}">${esc(statusLabel(x.status))}</span></li>`).join("")}</ul>
      ${c.resolution ? `<p class="res"><b>Which wins:</b> ${md(c.resolution)}</p>` : `<p class="res">No resolution yet. Confirming this will ask which one wins, and when.</p>`}
    </div>` : ""}
    ${sec("Rule", `<p>${md(c.rule)}</p>`)}
    ${sec("Why", c.why && `<p>${md(c.why).replace(/\n\n/g, "</p><p>")}</p>`, true)}
    ${sec("Examples", exBody, true)}
    ${sec("Exceptions", c.exceptions && `<p>${md(c.exceptions)}</p>`, true)}
    ${sec(`Evidence · ${c.evidence.length}`, `<ul>${ev}</ul>`, true)}
    ${sec("See also", c.seeAlso && `<p>${md(c.seeAlso)}</p>`, true)}
    ${sec("Review notes", c.notes && `<p>${md(c.notes)}</p>`)}
    </div>`;
  const onScroll = () => {
    el.querySelector(".head").classList.toggle("stuck", el.scrollTop > 4);
    // the fade says "there is more below", so it goes once there is not
    el.classList.toggle("at-end", el.scrollTop + el.clientHeight >= el.scrollHeight - 2);
  };
  el.addEventListener("scroll", onScroll, { passive: true });
  requestAnimationFrame(onScroll);
  return el;
}

/** The three editable chips, diffed against the card they were rendered from. */
export function cardEdits(el, c) {
  const g = (n) => el.querySelector(`[name=${n}]`)?.value;
  const e = {};
  if (g("stance") && g("stance") !== c.stance) e.stance = g("stance");
  if (g("scope") && g("scope") !== c.scope) e.scope = g("scope");
  return Object.keys(e).length ? e : undefined;
}

/**
 * A SKILL.md rendered for reading: headings, lists, quotes, fenced code and paragraphs.
 * Deliberately small and dependency-free — the app ships no third-party runtime.
 */
export function renderMarkdown(text) {
  const out = [];
  const lines = String(text).replace(/\r\n/g, "\n").split("\n");
  let para = [];
  let list = null;
  const inline = (s) =>
    md(s)
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
      .replace(/(^|[\s(])_([^_]+)_(?=[\s.,;:)]|$)/g, "$1<em>$2</em>");
  const flushPara = () => {
    if (para.length) out.push(`<p>${inline(para.join(" "))}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list) out.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join("")}</${list.tag}>`);
    list = null;
  };
  const flush = () => { flushPara(); flushList(); };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fence = line.match(/^```(\w*)/);
    if (fence) {
      flush();
      const body = [];
      while (++i < lines.length && !/^```/.test(lines[i])) body.push(lines[i]);
      out.push(`<pre><code>${esc(body.join("\n"))}</code></pre>`);
      continue;
    }
    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      flush();
      out.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`);
      continue;
    }
    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      flush();
      out.push(`<blockquote>${inline(quote[1])}</blockquote>`);
      continue;
    }
    const item = line.match(/^\s*(?:[-*]|(\d+)\.)\s+(.*)$/);
    if (item) {
      flushPara();
      const tag = item[1] ? "ol" : "ul";
      if (list && list.tag !== tag) flushList();
      list = list ?? { tag, items: [] };
      list.items.push(item[2]);
      continue;
    }
    if (!line.trim()) { flush(); continue; }
    if (list) { list.items[list.items.length - 1] += " " + line.trim(); continue; }
    if (/^\s*\|/.test(line)) { flush(); out.push(`<p class="row">${inline(line.replace(/^\||\|$/g, "").split("|").join(" · "))}</p>`); continue; }
    para.push(line.trim());
  }
  flush();
  return out.join("\n");
}
