// MedRise site control — loaded by auth-guard.js on every page (except login).
// Reads the admin's settings + catalogue from Firestore and applies them:
//   maintenance, page on/off, announcement, blocked users, hidden features,
//   notes (short/full), combo packs, tests/quizzes, and what the student has bought.
// Fails OPEN if Firestore is unreachable (the page still opens).
import app from "./firebase.js";
const FS = "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
const T = (p, ms = 6000) => Promise.race([p, new Promise((_, r) => setTimeout(() => r(new Error("timeout")), ms))]);

function lock(title, msg, home) {
  document.getElementById("mr-lock")?.remove();
  const d = document.createElement("div"); d.id = "mr-lock";
  d.style.cssText = "position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;background:#080d16;color:#e8eefc;font-family:system-ui,sans-serif";
  const b = document.createElement("div"); b.style.maxWidth = "360px";
  const h = document.createElement("h2"); h.textContent = title;
  const p = document.createElement("p"); p.textContent = msg; p.style.cssText = "opacity:.8;line-height:1.5";
  b.append(h, p);
  if (home) { const a = document.createElement("a"); a.href = "./index.html"; a.textContent = "← Home"; a.style.color = "#7dd3fc"; b.append(a); }
  d.append(b); document.body.append(d);
}
function banner(...texts) {
  document.getElementById("mr-banner")?.remove();
  texts = texts.filter(Boolean);
  if (!texts.length) return;
  const d = document.createElement("div"); d.id = "mr-banner"; d.textContent = "📢 " + texts.join("  •  ");
  d.style.cssText = "padding:9px 14px;text-align:center;font:600 13px system-ui,sans-serif;background:#1d4ed8;color:#fff";
  document.body.prepend(d);
}

// Features the admin can hide (CSS selectors of buttons / sections in dashboard & mocktest)
const FEATURES = {
  leaderboard: '[data-page="leaderboard"],[data-open="leaderboard"],#leaderShortcut,#leaderPanel',
  progress: '[data-page="progress"],[data-open="progress"],#analysisShortcut',
  history: '[data-page="history"],[data-open="history"],#historyShortcut',
  bookmarks: '[data-page="bookmarks"],[data-open="bookmarks"]',
  planner: '[data-page="planner"],[data-open="planner"]'
};
function hideFeatures(config) {
  document.getElementById("mr-hide")?.remove();
  const sel = Object.keys(FEATURES).filter(k => (k === "leaderboard" ? config.leaderboard === false : (config.features || {})[k] === false)).map(k => FEATURES[k]);
  if (!sel.length) return;
  const s = document.createElement("style"); s.id = "mr-hide"; s.textContent = sel.join(",") + "{display:none!important}";
  document.head.append(s);
}

// ---- notices / schedule / alerts + home banners ----
const safeLink = l => { l = String(l || "").trim(); return /^(https:\/\/[^\s"'<>]+|[A-Za-z0-9_\-]+\.html(\?[A-Za-z0-9_=&%.\-]*)?)$/.test(l) ? l : ""; };
const fmtWhen = ms => { try { return new Date(ms).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }); } catch (_) { return ""; } };
async function cached(key, ttl, loader) {
  try { const c = JSON.parse(localStorage.getItem(key) || "null"); if (c && Date.now() - c.t < ttl) return c.d; } catch (_) {}
  const d = await loader();
  try {
    Object.keys(localStorage).filter(k => k.startsWith("medrise:notices:") && k !== key).forEach(k => localStorage.removeItem(k));
    localStorage.setItem(key, JSON.stringify({ t: Date.now(), d }));
  } catch (_) {}
  return d;
}
function showAlerts(list, ctx) {
  document.getElementById("mr-alerts")?.remove();
  const now = Date.now();
  const seen = k => { try { return localStorage.getItem("medrise:seen:" + k) === "1"; } catch (_) { return false; } };
  const mark = k => { try { localStorage.setItem("medrise:seen:" + k, "1"); } catch (_) {} };
  const aud = a => a === "paid" ? ctx.paid : a === "free" ? (!!ctx.user && !ctx.paid) : true;
  const cards = [];
  list.filter(n => n && n.active !== false && aud(n.audience || "all")).forEach(n => {
    if (n.type === "alert" && (!n.expiresMs || n.expiresMs > now) && !seen(n.id)) cards.push({ k: n.id, icon: "🔔", title: n.title, body: n.body, link: n.link });
    else if (n.type === "schedule" && n.whenMs > now && n.whenMs - now < 36 * 3600 * 1000 && !seen(n.id + ":r")) cards.push({ k: n.id + ":r", icon: "⏰", title: n.title, body: fmtWhen(n.whenMs) + (n.body ? " · " + n.body : ""), link: n.link });
  });
  if (!cards.length) return;
  const box = document.createElement("div"); box.id = "mr-alerts";
  box.style.cssText = "position:sticky;top:0;z-index:9990;display:flex;flex-direction:column;gap:6px;padding:8px;pointer-events:none;align-items:center";
  cards.slice(0, 3).forEach(c => {
    const d = document.createElement("div");
    d.style.cssText = "pointer-events:auto;width:min(560px,100%);display:flex;gap:10px;align-items:flex-start;padding:11px 12px;border-radius:14px;background:#0f1d33;color:#f3f7ff;border:1px solid #2a4a78;box-shadow:0 8px 24px rgba(0,0,0,.35);font:13px/1.45 system-ui,sans-serif";
    const ic = document.createElement("span"); ic.textContent = c.icon; ic.style.fontSize = "18px";
    const tx = document.createElement("div"); tx.style.flex = "1"; tx.style.minWidth = "0";
    const b = document.createElement("b"); b.textContent = c.title || ""; tx.append(b);
    if (c.body) { const p = document.createElement("div"); p.textContent = c.body; p.style.cssText = "opacity:.85;overflow-wrap:anywhere"; tx.append(p); }
    const lk = safeLink(c.link);
    if (lk) { const a = document.createElement("a"); a.href = lk; a.textContent = "Open →"; a.style.cssText = "display:inline-block;margin-top:5px;color:#7dd3fc;font-weight:700"; if (/^https:/.test(lk)) { a.target = "_blank"; a.rel = "noopener noreferrer"; } tx.append(a); }
    const x = document.createElement("button"); x.type = "button"; x.textContent = "✕"; x.setAttribute("aria-label", "Dismiss");
    x.style.cssText = "background:none;border:0;color:#9db3d3;font-size:16px;cursor:pointer;padding:0 2px";
    x.onclick = () => { mark(c.k); d.remove(); if (!box.children.length) box.remove(); };
    d.append(ic, tx, x); box.append(d);
  });
  document.body.prepend(box);
}

// Pages that need the catalogue (chapters / combo packs / tests)
const CATALOGUE_PAGES = new Set(["notes", "pay", "mocktest", "dashboard"]);
// Pages that need to know which payments are still waiting for the admin
const PENDING_PAGES = new Set(["notes", "pay", "mocktest"]);

export async function init(user, page) {
  const m = window.medrise;
  let fs; try { fs = await T(import(FS)); } catch (_) { return; }
  const db = fs.getFirestore(app);
  const rd = async (...path) => { try { const s = await T(fs.getDoc(fs.doc(db, ...path))); return s.exists() ? s.data() : null; } catch (_) { return null; } };
  const col = async name => { const out = {}; try { (await T(fs.getDocs(fs.collection(db, name)))).forEach(d => { out[d.id] = d.data(); }); } catch (_) {} return out; };
  const wantCat = CATALOGUE_PAGES.has(page);
  const [cfg, acc, adm, chapters, bundles, tests] = await Promise.all([
    rd("config", "site"),
    user ? rd("access", user.uid) : null,
    user ? rd("admins", user.uid) : null,
    wantCat ? col("chapters") : {},
    wantCat ? col("bundles") : {},
    wantCat ? col("tests") : {}
  ]);
  let claim = false; try { claim = !!user && (await user.getIdTokenResult()).claims.admin === true; } catch (_) {}
  const config = cfg || {}, access = acc || {}, isAdmin = !!adm || claim;
  if (user) fs.setDoc(fs.doc(db, "users", user.uid), { uid: user.uid, email: user.email || "", phone: user.phoneNumber || "", name: user.displayName || "", lastSeen: Date.now() }, { merge: true }).catch(() => {});

  // ---- what does this student own? ----
  // access/{uid} = { paid, untilMs, blocked, items: { "3_short": 0 | expiryMs, "t_abc": 0 | expiryMs } }
  const allPass = () => access.paid === true && (!access.untilMs || access.untilMs > Date.now());
  const itemUntil = key => { const v = (access.items || {})[key]; return v == null ? null : Number(v); };
  const owns = key => {
    if (isAdmin) return true;
    if (access.blocked === true) return false;
    if (allPass()) return true;
    const v = itemUntil(key);
    if (v != null && (v === 0 || v > Date.now())) return true;
    // older approvals (other admin version): access.owned = [keys], access.ownedUntil = { key: expiryMs }
    if (Array.isArray(access.owned) && access.owned.includes(key)) return true;
    return Number((access.ownedUntil || {})[key] || 0) > Date.now();
  };

  // ---- pending payments (so the UI can say "verification pending") ----
  const rows = async () => { try { const s = await T(fs.getDocs(fs.query(fs.collection(db, "payments"), fs.where("uid", "==", user.uid)))); return s.docs.map(d => d.data()).sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)); } catch (_) { return []; } };
  const pending = new Set();
  const markPending = list => list.forEach(p => { if (p.status === "pending") (p.items || []).forEach(k => pending.add(k)); });
  if (user && PENDING_PAGES.has(page)) markPending(await rows());

  // notices / schedule / alerts (cached 5 min, refreshed at once when admin saves) + home page banners (home only)
  const [notices, banners] = await Promise.all([
    cached("medrise:notices:" + (config.noticeVer || 0), 5 * 60 * 1000, async () => (await T(fs.getDocs(fs.query(fs.collection(db, "notices"), fs.limit(60))))).docs.map(d => ({ id: d.id, ...d.data() }))).catch(() => []),
    page !== "index" ? [] : T(fs.getDocs(fs.query(fs.collection(db, "banners"), fs.limit(8)))).then(sn => sn.docs.map(d => ({ id: d.id, ...d.data() }))
      .filter(b => b.active !== false && (!b.endMs || b.endMs > Date.now()))
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))).catch(() => [])
  ]);
  Object.assign(m, {
    config, access, isAdmin, chapters, bundles, tests, pending, controlReady: true, notices, banners, safeLink,
    owns, itemUntil,
    entitled: () => isAdmin || (access.blocked !== true && allPass()),   // "all access" pass only
    // The real PDF link of a PAID note. Firestore rules only return it to a student who bought it. Throws permission-denied otherwise.
    getChapterFile: async (id, kind) => {
      const s = await T(fs.getDoc(fs.doc(db, "chapterFiles", id + "_" + kind)));
      return s.exists() ? (s.data().file || "") : "";
    },
    // Questions of a test (free tests: any student; paid tests: only who bought it). Throws permission-denied otherwise.
    getTestQuestions: async id => {
      const s = await T(fs.getDoc(fs.doc(db, "testQuestions", String(id))));
      return s.exists() && Array.isArray(s.data().questions) ? s.data().questions : [];
    },
    // order = { items:[keys], bundleId:"", label:"", amount:Number }
    submitOrder: async (utr, order) => {
      const ref = await fs.addDoc(fs.collection(db, "payments"), {
        uid: user.uid, email: user.email || "", phone: user.phoneNumber || "", name: user.displayName || "",
        utr: String(utr).replace(/[\s-]/g, ""), amount: Number(order.amount) || 0, status: "pending", createdAt: fs.serverTimestamp(),
        items: order.items.slice(0, 300), bundleId: order.bundleId || "", label: String(order.label || "").slice(0, 120)
      });
      order.items.forEach(k => pending.add(k));
      return ref;
    },
    myPayments: rows
  });

  document.querySelectorAll("[data-admin-only]").forEach(el => { el.hidden = !isAdmin; });
  if (page !== "admin" && !isAdmin) {
    if (access.blocked) lock("Account blocked", "Aapka account admin ne band kiya hai. Support se sampark karein.");
    else if (config.maintenance) lock("Maintenance chal raha hai", config.maintenanceMsg || "Thodi der baad wapas aaiye.");
    else if (config.pages && config.pages[page] === false) lock("Ye section abhi band hai", "Admin ne ise abhi band rakha hai.", page !== "index");
  }
  if (page !== "admin") banner(config.announcement, config.pageNotice && config.pageNotice[page]);
  if (page !== "admin") { try { showAlerts(notices, { user, paid: allPass() || Object.keys(access.items || {}).length > 0 }); } catch (_) {} }
  if (!isAdmin && page !== "admin") hideFeatures(config);
  document.dispatchEvent(new CustomEvent("medrise:control"));
}
