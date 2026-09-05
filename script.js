const openingScreen = document.querySelector("#opening-screen");
const weddingDate = new Date("2026-09-09T19:00:00+03:00");
const weddingEndDate = new Date("2026-09-09T23:00:00+03:00");
const countdownIds = ["days", "hours", "minutes", "seconds"];

function updateCountdown() {
  const diff = Math.max(weddingDate.getTime() - Date.now(), 0);
  const values = [
    Math.floor(diff / 86400000),
    Math.floor((diff / 3600000) % 24),
    Math.floor((diff / 60000) % 60),
    Math.floor((diff / 1000) % 60),
  ];

  countdownIds.forEach((id, index) => {
    document.getElementById(id).textContent = String(values[index]).padStart(2, "0");
  });
}

const openButton = document.querySelector("#open-invitation");
const invitationSections = [...document.querySelector(".invitation-shell").children]
  .filter((section) => section !== openingScreen);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let isOpening = false;

invitationSections.forEach((section) => { section.inert = true; });

function revealInvitation() {
  openingScreen.classList.add("hidden");
  openingScreen.inert = true;
  document.body.classList.remove("invitation-closed", "invitation-opening");
  invitationSections.forEach((section) => { section.inert = false; });
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.querySelector("#hero").focus({ preventScroll: true });
}

openButton.addEventListener("click", () => {
  if (isOpening) return;
  isOpening = true;
  openButton.disabled = true;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.body.classList.add("invitation-opening");
  openingScreen.classList.add("is-opening");
  // Match the CSS opening sequence: immediate smoke and zoom, then crossfade.
  window.setTimeout(revealInvitation, reducedMotion.matches ? 120 : 1800);
});

function formatCalendarDate(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(".000", "");
}

document.querySelector("#calendar-link").href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
  "زفاف د. أحمد بحراوي ود. إلهام عبد العال",
)}&dates=${formatCalendarDate(weddingDate)}/${formatCalendarDate(weddingEndDate)}&location=${encodeURIComponent(
  "عرابي فيلا 700 Chateau M",
)}&details=${encodeURIComponent(
  "يتشرف الحاج بحراوي منصور والمهندس عبدالعال علي بدعوتكم لحضور حفل زفاف د. أحمد بحراوي ود. إلهام عبد العال في عرابي فيلا 700 Chateau M. الخريطه: https://maps.app.goo.gl/3n4PE4BDrfPfru816",
)}`;

updateCountdown();
setInterval(updateCountdown, 1000);
