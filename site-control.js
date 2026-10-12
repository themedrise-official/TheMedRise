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

  const all = async col => { const o = {}; try { (await T(fs.getDocs(fs.collection(db, col)))).forEach(d => { o[d.id] = d.data(); }); } catch (_) {} return o; };
  const needCat = ["notes", "pay", "mocktest"].includes(page);
  const [chapters, bundles, tests] = await Promise.all([needCat && page !== "mocktest" ? all("chapters") : {}, needCat && page !== "mocktest" ? all("bundles") : {}, page === "mocktest" || page === "pay" ? all("tests") : {}]);
  if (user) fs.setDoc(fs.doc(db, "users", user.uid), { uid: user.uid, email: user.email || "", phone: user.phoneNumber || "", name: user.displayName || "", lastSeen: Date.now() }, { merge: true }).catch(() => {});

  // Ownership: admin = everything. Otherwise per-product keys (access.owned / access.ownedUntil)
  // or the legacy account-wide paid flag (old payments without an item list). Keys: "<chapterId>_short|full", "t_<testId>".
  const legacyPaid = () => access.paid === true && (!access.untilMs || access.untilMs > Date.now());
  const owns = key => isAdmin || (!access.blocked && ((Array.isArray(access.owned) && access.owned.includes(key)) || ((access.ownedUntil || {})[key] || 0) > Date.now() || (legacyPaid() && !String(key).startsWith("t_"))));
  const mrLabel = (k, t) => { const [a, b] = String(k).split("_"); if (String(k).startsWith("t_")) { const x = (t || tests || {})[String(k).slice(2)]; return "Test: " + ((x && x.title) || String(k).slice(2)); } const c = (window.MR_CHAPTERS || []).find(x => String(x.id) === a); return (c ? c.name : "Chapter " + a) + " · " + (b === "short" ? "Short Notes" : "Full Notes"); };
  window.mrLabel = mrLabel;
  const payBase = () => ({ uid: user.uid, email: user.email || "", phone: user.phoneNumber || "", name: user.displayName || "", status: "pending", createdAt: fs.serverTimestamp() });
  Object.assign(m, {
    config, access, isAdmin, chapters, bundles, tests, controlReady: true,
    owns, mrLabel,
    entitled: () => isAdmin || (!access.blocked && legacyPaid()),
    provisionalUntil: () => 0,
    getChapterFile: async (id, kind) => { const d = await rd("chapterFiles", String(id) + "_" + kind) || await rd("chapterFiles", String(id)); return d && d.file; },
    getTestQuestions: async id => { const d = await rd("testQuestions", String(id)); return (d && d.questions) || []; },
    submitOrder: (utr, order) => fs.addDoc(fs.collection(db, "payments"), { ...payBase(), utr: String(utr).replace(/[\s-]/g, ""), amount: Number(order.amount) || 0, items: order.items, label: String(order.label || "").slice(0, 120), bundleId: order.bundleId || "", days: Number(order.days) || 0 }),
    submitPayment: utr => fs.addDoc(fs.collection(db, "payments"), { ...payBase(), utr: String(utr).replace(/[\s-]/g, ""), amount: Number(config.payment?.price) || 0 }),
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
