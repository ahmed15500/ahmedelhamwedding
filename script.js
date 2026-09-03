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

document.querySelector("#open-invitation").addEventListener("click", () => {
  openingScreen.classList.add("hidden");
});

function formatCalendarDate(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(".000", "");
}

document.querySelector("#calendar-link").href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
  "زفاف د. أحمد بحراوي ود. إلهام عبد العال",
)}&dates=${formatCalendarDate(weddingDate)}/${formatCalendarDate(weddingEndDate)}&location=${encodeURIComponent(
  "Chateau M",
)}&details=${encodeURIComponent(
  "يتشرف الحاج بحراوي منصور والمهندس عبدالعال علي بدعوتكم لحضور حفل زفاف د. أحمد بحراوي ود. إلهام عبد العال في Chateau M. الخريطة: https://maps.app.goo.gl/3n4PE4BDrfPfru816",
)}`;

updateCountdown();
setInterval(updateCountdown, 1000);
