/* MedRise AI: sirf ek jagah se on/off aur Worker URL.
   Ye file main website ka hissa nahi hai. Delete karne par bhi baaki site normal chalti hai.
   enabled:false -> home par AI card nahi dikhega, ai.html "abhi available nahi" dikhayega. */
window.MEDRISE_AI = {
  enabled: false,   // true karne par AI card dikhega
  workerUrl: "",    // Cloudflare Worker ka URL, jaise https://medrise-ai.tumhara-naam.workers.dev
  demo: false       // true: bina Worker ke demo jawab (sirf testing ke liye)
};
