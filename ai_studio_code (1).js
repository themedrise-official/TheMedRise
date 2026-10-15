--- FILE: auth-guard.js ---
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const PROTECTED = ["dashboard", "notes", "mocktest", "admin", "pay", "community"];
const pageName = location.pathname.split("/").pop().replace(".html", "") || "index";

window.medrise = { user: null, ready: false };

onAuthStateChanged(auth, u => {
  window.medrise.user = u;
  window.medrise.ready = true;
  
  // Instant Login UI Update
  document.querySelectorAll('[data-auth="out"]').forEach(el => {
      el.style.display = u ? "none" : "flex";
      el.hidden = !!u;
  });
  document.querySelectorAll('[data-auth="in"]').forEach(el => {
      el.style.display = u ? "flex" : "none";
      el.hidden = !u;
  });

  if (PROTECTED.includes(pageName) && !u) {
    location.replace("./login.html?redirect=" + encodeURIComponent(location.pathname + location.search));
  }
  
  document.dispatchEvent(new CustomEvent("medrise:auth", { detail: { user: u } }));
  document.documentElement.style.visibility = "visible";
  
  import("./site-control.js").then(m => m.init(u, pageName)).catch(e => console.error(e));
});