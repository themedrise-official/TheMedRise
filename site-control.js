// MedRise site control — loaded by auth-guard.js on every page (except login).
// Reads admin settings from Firestore and applies them: maintenance, page on/off,
// announcement, blocked users, leaderboard, paid access. Fails OPEN if Firestore is unreachable.
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

export async function init(user, page) {
  const m = window.medrise;
  let fs; try { fs = await T(import(FS)); } catch (_) { return; }
  const db = fs.getFirestore(app);
  const rd = async (...path) => { try { const s = await T(fs.getDoc(fs.doc(db, ...path))); return s.exists() ? s.data() : null; } catch (_) { return null; } };
  const [cfg, acc, adm] = await Promise.all([rd("config", "site"), user ? rd("access", user.uid) : null, user ? rd("admins", user.uid) : null]);
  let claim = false; try { claim = !!user && (await user.getIdTokenResult()).claims.admin === true; } catch (_) {}
  const config = cfg || {}, access = acc || {}, isAdmin = !!adm || claim;

  let chapters = {};
  if (page === "notes") {
    try { (await T(fs.getDocs(fs.collection(db, "chapters")))).forEach(d => { chapters[d.id] = d.data(); }); } catch (_) {}
  }
  if (user) fs.setDoc(fs.doc(db, "users", user.uid), { uid: user.uid, email: user.email || "", phone: user.phoneNumber || "", name: user.displayName || "", lastSeen: Date.now() }, { merge: true }).catch(() => {});

  // Temporary access: after a student submits a UTR he gets PROV_MS of access until the admin verifies it.
  const PROV_MS = 24 * 3600 * 1000;   // keep in sync with firestore.rules (86400000)
  const provMs = () => (access.provAt && access.provAt.toMillis ? access.provAt.toMillis() : 0);
  const paidNow = () => isAdmin || (!access.blocked && ((access.paid === true && (!access.untilMs || access.untilMs > Date.now())) || provMs() + PROV_MS > Date.now()));
  Object.assign(m, {
    config, access, isAdmin, chapters, controlReady: true,
    entitled: paidNow,
    provisionalUntil: () => (provMs() ? provMs() + PROV_MS : 0),
    getChapterFile: async id => { const d = await rd("chapterFiles", String(id)); return d && d.file; },
    submitPayment: async utr => { const ref = await fs.addDoc(fs.collection(db, "payments"), {
      uid: user.uid, email: user.email || "", phone: user.phoneNumber || "", name: user.displayName || "", utr: String(utr).replace(/[\s-]/g, ""),
      amount: Number(config.payment?.price) || 0, status: "pending", createdAt: fs.serverTimestamp() });
      // one-time temporary access (rules allow it only once per account)
      try { if (!provMs() && !access.blocked) { await fs.setDoc(fs.doc(db, "access", user.uid), { provAt: fs.serverTimestamp() }, { merge: true }); const t = Date.now(); access.provAt = { toMillis: () => t }; } } catch (_) {}
      return ref; },
    myPayments: async () => { try { const s = await T(fs.getDocs(fs.query(fs.collection(db, "payments"), fs.where("uid", "==", user.uid)))); return s.docs.map(d => d.data()).sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)); } catch (_) { return []; } }
  });

  document.querySelectorAll("[data-admin-only]").forEach(el => { el.hidden = !isAdmin; });
  if (page !== "admin" && !isAdmin) {
    if (access.blocked) lock("Account blocked", "Aapka account admin ne band kiya hai. Support se sampark karein.");
    else if (config.maintenance) lock("Maintenance chal raha hai", config.maintenanceMsg || "Thodi der baad wapas aaiye.");
    else if (config.pages && config.pages[page] === false) lock("Ye section abhi band hai", "Admin ne ise abhi band rakha hai.", page !== "index");
  }
  if (page !== "admin") banner(config.announcement, config.pageNotice && config.pageNotice[page]);
  if (!isAdmin && page !== "admin") hideFeatures(config);
  document.dispatchEvent(new CustomEvent("medrise:control"));
}
