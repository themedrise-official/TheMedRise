// MedRise auth guard — loaded on every page except login.html.
//  * Protected pages (dashboard / notes / mocktest) stay hidden until Firebase
//    says the user is signed in; otherwise the user is sent to login.html.
//  * Every page gets `window.medrise = { user, ready }` plus a
//    "medrise:auth" event, so pages can use the uid for per-user storage.
//  * Elements with data-auth="in" / data-auth="out" are shown/hidden
//    depending on login state (e.g. Login vs Dashboard button on the homepage).
//
// NOTE: this is a convenience guard for a static site, not real security.
// Anything that must be private needs server-side rules (see firestore.rules).
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const PROTECTED = ["dashboard", "notes", "mocktest", "admin", "pay", "community"];

// Works for /notes.html, /notes (GitHub Pages clean URL) and /repo/notes.html
const lastSegment = location.pathname.split("/").filter(Boolean).pop() || "index";
const pageName = lastSegment.toLowerCase().replace(/\.html$/, "");
const isProtected = PROTECTED.includes(pageName);

function reveal() {
  clearTimeout(window.__mrReveal);
  document.documentElement.style.visibility = "";
}

function goToLogin() {
  location.replace("./login.html?redirect=" + encodeURIComponent(pageName + ".html" + location.search));
}

function applyAuthUi(user) {
  document.documentElement.dataset.authReady = "true";
  document.querySelectorAll('[data-auth="in"]').forEach(el => { el.hidden = !user; el.style.visibility = "visible"; });
  document.querySelectorAll('[data-auth="out"]').forEach(el => { el.hidden = !!user; el.style.visibility = "visible"; });
  const label = user ? (user.displayName || user.email || user.phoneNumber || "Student") : "";
  document.querySelectorAll("[data-medrise-user]").forEach(el => { el.textContent = label; });
}

function remember(user) {
  try {
    if (user) localStorage.setItem("medrise-last-uid", user.uid);
    else localStorage.removeItem("medrise-last-uid");
  } catch (_) { /* storage blocked — pages fall back to "guest" */ }
}

window.medrise = window.medrise || { user: null, ready: false };

onAuthStateChanged(
  auth,
  user => {
    window.medrise.user = user || null;
    window.medrise.ready = true;
    remember(user);
    applyAuthUi(user);
    document.dispatchEvent(new CustomEvent("medrise:auth", { detail: { user: user || null } }));
    if (isProtected && !user) { goToLogin(); return; }
    reveal();
    // Admin-controlled settings (maintenance, page on/off, paid access ...). Never blocks the page load.
    import("./site-control.js").then(m => m.init(user || null, pageName)).catch(e => console.warn("site-control:", e));
  },
  error => {
    // Auth could not be checked (network / config problem): don't leave a blank page.
    console.error("MedRise auth check failed:", error);
    applyAuthUi(null);
    reveal();
  }
);

// Back/forward cache: after logout, pressing Back must not show a protected page.
window.addEventListener("pageshow", event => {
  if (event.persisted && isProtected && !auth.currentUser) goToLogin();
});
