import { auth } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Pages that require login
const protectedPages = [
  "dashboard.html",
  "notes.html",
  "mocktest.html"
];

// Safely get current page name, fallback to index.html or handle trailing slashes
const pathSegments = window.location.pathname.split("/").filter(Boolean);
const currentPage = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1].toLowerCase() : "index.html";

if (protectedPages.includes(currentPage)) {
  // Hide the page until Firebase confirms login status
  document.documentElement.style.visibility = "hidden";

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is logged in
      document.documentElement.style.visibility = "visible";
    } else {
      // Save the page they wanted to open
      const redirectPage = encodeURIComponent(currentPage);

      window.location.replace(
        "./login.html?redirect=" + redirectPage
      );
    }
  });
}
