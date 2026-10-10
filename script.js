/*
 * WEDDING INVITATION SETTINGS
 * Update these values when the date, venue, and names are confirmed.
 * Month/year are placeholders because only the day 28 was provided.
 */
const WEDDING = {
  names: "Marc & Angel",
  day: 28,
  month: "MONTH",
  year: "YEAR",
  // Set as YYYY-MM-DD when confirmed, for example 2027-02-28.
  isoDate: "",
  time: "Time to be announced",
  venue: "To Be Announced",
  address: "Quezon City, Philippines",
  hashtag: "#OurDayOnThe28th"
};

// Paste the deployed Google Apps Script Web App URL here (must end in /exec).
// Keep blank until the Apps Script is deployed; the form will explain what's missing.
const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbxgx6ooG7-gXN53skuGtYbeY5_AmZwmZE6UFgy099ctocA867kJws8X0eFjhIcgmUA6tg/exec";

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
    const venueIsKnown = WEDDING.venue && !/to be announced/i.test(WEDDING.venue);
    const place = [venueIsKnown ? WEDDING.venue : "", WEDDING.address].filter(Boolean).join(", ");
    mapLink.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(place);
    mapLink.setAttribute("aria-label", venueIsKnown ? "Open venue in Google Maps" : "Open the general area in Google Maps");
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

  // RSVP: posts to a Google Apps Script web app. Its URL must be configured after deployment.
  const rsvpForm = document.getElementById("rsvp-form");
  const formMessage = document.getElementById("form-message");
  const submitButton = rsvpForm ? rsvpForm.querySelector('button[type="submit"]') : null;
  if (rsvpForm && formMessage) {
    rsvpForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (!rsvpForm.reportValidity()) return;

      if (!RSVP_ENDPOINT || !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(RSVP_ENDPOINT)) {
        formMessage.textContent = "The RSVP form is ready, but the Google Sheets connection still needs to be deployed. Please check back soon.";
        formMessage.classList.add("is-error");
        return;
      }

      const data = new FormData(rsvpForm);
      const payload = {
        name: String(data.get("name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        attendance: String(data.get("attendance") || ""),
        notes: String(data.get("notes") || "").trim(),
        website: String(data.get("website") || "")
      };
      if (payload.website) return; // honeypot: silently ignore automated submissions

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
      }
      formMessage.classList.remove("is-error");
      formMessage.textContent = "Sending your RSVP…";

      try {
        // text/plain avoids a CORS preflight. Apps Script accepts JSON in postData.contents.
        // no-cors means the browser cannot inspect Google's response, so we cannot verify a row from here.
        await fetch(RSVP_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          body: JSON.stringify(payload)
        });
        formMessage.textContent = "Thank you! Your RSVP request has been sent. If you need to change your response, please contact us.";
        rsvpForm.reset();
      } catch (error) {
        formMessage.textContent = "We couldn't send your RSVP just now. Please try again later or contact us directly.";
        formMessage.classList.add("is-error");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute("aria-busy");
        }
      }
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
