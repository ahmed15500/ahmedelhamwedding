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
const hero = document.querySelector("#hero");
const card = hero.querySelector(".invitation-card");
const cardFrame = hero.querySelector(".invitation-card-frame");
const scene = document.querySelector(".envelope-scene");
const letterMask = document.querySelector(".envelope-letter-mask");
const letter = document.querySelector(".envelope-letter");
const openingAnimations = [];
let isOpening = false;
let isRevealed = false;
let openingFallback;

invitationSections.forEach((section) => { section.inert = true; });

function fitInvitationCard() {
  if (isOpening && !isRevealed) return;
  const padding = getComputedStyle(hero);
  const width = hero.clientWidth - parseFloat(padding.paddingLeft) - parseFloat(padding.paddingRight);
  const height = window.innerHeight - parseFloat(padding.paddingTop) - parseFloat(padding.paddingBottom);
  const scale = Math.min(1, width / card.offsetWidth, height / card.offsetHeight);
  cardFrame.style.width = `${card.offsetWidth * scale}px`;
  cardFrame.style.height = `${card.offsetHeight * scale}px`;
  cardFrame.style.setProperty("--card-scale", scale);
  cardFrame.classList.add("is-fitted");
}

function revealInvitation() {
  if (isRevealed) return;
  isRevealed = true;
  window.clearTimeout(openingFallback);
  openingScreen.classList.add("hidden");
  openingScreen.inert = true;
  document.body.classList.remove("invitation-closed");
  invitationSections.forEach((section) => { section.inert = false; });
  openingAnimations.forEach((animation) => animation.cancel());
  letter.replaceChildren();
  fitInvitationCard();
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  hero.focus({ preventScroll: true });
}

function animateOpening(element, keyframes, options) {
  const animation = element.animate(keyframes, { fill: "both", ...options });
  openingAnimations.push(animation);
  return animation.finished.catch(() => {});
}

openButton.addEventListener("click", async () => {
  if (isOpening) return;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  fitInvitationCard();
  isOpening = true;
  openButton.disabled = true;

  if (reducedMotion.matches || !letter.animate) {
    revealInvitation();
    return;
  }

  openingFallback = window.setTimeout(revealInvitation, 4500);
  try {
    // Animate the invitation's actual design, then hand off at its exact final bounds.
    const envelope = scene.getBoundingClientRect();
    const destination = card.getBoundingClientRect();
    const naturalWidth = card.offsetWidth;
    const naturalHeight = card.offsetHeight;
    const paperScale = envelope.width * 0.76 / naturalWidth;
    const paperX = envelope.left + envelope.width * 0.12;
    const insideY = envelope.top + 12;
    const liftedY = Math.max(20, envelope.top - naturalHeight * paperScale * 0.72);
    const transformAt = (x, y, scale) => `translate(${x}px, ${y}px) scale(${scale})`;
    const inside = transformAt(paperX, insideY, paperScale);
    const lifted = transformAt(paperX, liftedY, paperScale);
    const finalPosition = transformAt(destination.left, destination.top, destination.width / naturalWidth);

    const paper = card.cloneNode(true);
    paper.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
    paper.style.width = `${naturalWidth}px`;
    paper.style.height = `${naturalHeight}px`;
    paper.style.minHeight = "0";
    letter.replaceChildren(paper);
    letter.style.transform = inside;
    Object.assign(letterMask.style, {
      left: `${-envelope.left}px`,
      top: `${-envelope.top}px`,
      width: `${window.innerWidth}px`,
      height: `${window.innerHeight}px`,
      clipPath: `inset(0px 0px ${Math.max(0, window.innerHeight - envelope.bottom)}px 0px)`,
    });

    const flap = scene.querySelector(".envelope-flap");
    const seal = scene.querySelector(".envelope-seal");
    animateOpening(seal, [{ opacity: 1 }, { opacity: 0, transform: "translateY(10px)" }], { duration: 180 });
    openingScreen.classList.add("is-opening");
    await animateOpening(flap, [{ transform: "rotateX(180deg)" }, { transform: "rotateX(0deg)" }], {
      duration: 700, delay: 100, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
    });
    if (isRevealed) return;
    flap.style.zIndex = "0";

    await animateOpening(letter, [{ transform: inside }, { transform: lifted }], {
      duration: 650, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
    });
    if (isRevealed) return;

    // The envelope drops away as the paper settles into its readable, fitted size.
    const exit = [{ opacity: 1, translate: "0 0" }, { opacity: 0, translate: "0 80px" }];
    animateOpening(scene.querySelector(".envelope-body"), exit, { duration: 550, easing: "ease-in" });
    animateOpening(flap, exit, { duration: 550, easing: "ease-in" });
    animateOpening(document.querySelector(".opening-backdrop"), [{ opacity: 1 }, { opacity: 0 }], { duration: 750 });
    animateOpening(letterMask, [{ clipPath: letterMask.style.clipPath }, { clipPath: "inset(0px 0px 0px 0px)" }], { duration: 550 });
    await animateOpening(letter, [{ transform: lifted }, { transform: finalPosition }], {
      duration: 750, easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    });
  } catch {
    // Keep the invitation reachable if a browser cannot render an animation.
  } finally {
    revealInvitation();
  }
});

window.addEventListener("resize", () => {
  if (isOpening && !isRevealed) revealInvitation();
  fitInvitationCard();
});
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches && isOpening) revealInvitation();
});
fitInvitationCard();
if (document.fonts) document.fonts.ready.then(fitInvitationCard);
if (window.ResizeObserver) new ResizeObserver(fitInvitationCard).observe(card);

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
