/*
 * WEDDING INVITATION SETTINGS
 * Update these values when the date, venue, and names are confirmed.
 * Month/year are placeholders because only the day 28 was provided.
 */
const WEDDING = {
  names: "Marc & Your Name",
  day: 28,
  month: "MONTH",
  year: "YEAR",
  // Set as YYYY-MM-DD when confirmed, for example 2027-02-28.
  isoDate: "",
  time: "Time to be announced",
  venue: "Venue to be announced",
  address: "Quezon City, Philippines",
  hashtag: "#OurDayOnThe28th"
};

document.addEventListener("DOMContentLoaded", function () {
  function setText(id, value) {
    const element = document.getElementById(id);
    if (element && value) element.textContent = value;
  }

  setText("couple-names", WEDDING.names);
  setText("signature-names", WEDDING.names);
  setText("event-month", WEDDING.month);
  setText("event-year", WEDDING.year);
  setText("event-time", WEDDING.time);
  setText("event-venue", WEDDING.venue);
  setText("event-address", WEDDING.address);
  setText("event-hashtag", WEDDING.hashtag);
  document.title = WEDDING.names + " | Wedding Invitation";

  const mapLink = document.getElementById("map-link");
  if (mapLink) {
    const place = [WEDDING.venue, WEDDING.address].filter(Boolean).join(", ");
    mapLink.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(place);
  }

  // Fade in cards and text as they enter the viewport.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("in-view"); });
  }

  // Subtle page progress indicator.
  const progressBar = document.getElementById("progress-bar");
  let scrollQueued = false;
  function updateProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    if (progressBar) progressBar.style.width = Math.min(100, Math.max(0, progress)) + "%";
    scrollQueued = false;
  }
  window.addEventListener("scroll", function () {
    if (!scrollQueued) {
      window.requestAnimationFrame(updateProgress);
      scrollQueued = true;
    }
  }, { passive: true });
  updateProgress();

  // Open a Google Calendar event once the actual wedding date is configured.
  const calendarButton = document.getElementById("calendar-button");
  if (calendarButton) {
    calendarButton.addEventListener("click", function () {
      if (!WEDDING.isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(WEDDING.isoDate)) {
        window.alert("The wedding month and year have not been added yet. Update the WEDDING settings in script.js when the date is confirmed.");
        return;
      }
      const start = WEDDING.isoDate.replaceAll("-", "");
      const venue = [WEDDING.venue, WEDDING.address].filter(Boolean).join(", ");
      const params = new URLSearchParams({
        action: "TEMPLATE",
        text: "Wedding of " + WEDDING.names,
        dates: start + "/" + start,
        details: "We would love to celebrate this special day with you.",
        location: venue
      });
      window.open("https://calendar.google.com/calendar/render?" + params.toString(), "_blank", "noopener,noreferrer");
    });
  }

  // Demo-only RSVP: no guest details are sent or stored without a connected service.
  const rsvpForm = document.getElementById("rsvp-form");
  const formMessage = document.getElementById("form-message");
  if (rsvpForm && formMessage) {
    rsvpForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!rsvpForm.reportValidity()) return;
      formMessage.textContent = "Thanks! This demo form is working visually, but your RSVP has not been sent. Connect a form endpoint to receive responses.";
      rsvpForm.reset();
    });
  }

  // Highlight the active navigation section.
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            const active = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("active", active);
          });
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }
});