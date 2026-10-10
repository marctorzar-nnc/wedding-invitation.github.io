/*
 * WEDDING INVITATION SETTINGS
 * Update these values when the date, venue, and names are confirmed.
 * Wedding date: October 28, 2026.
 */
const WEDDING = {
  names: "Marc & Angel",
  day: 28,
  month: "October",
  year: "2026",
  // Set as YYYY-MM-DD when confirmed, for example 2027-02-28.
  isoDate: "2026-10-28",
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

  // Soft original wedding ambience with melody, warm bass, and gentle chord harmony.
  // Attempt autoplay on page load; browsers may require one tap before allowing sound.
  const musicToggle = document.getElementById("music-toggle");
  if (musicToggle) {
    let audioContext = null;
    let musicTimer = null;
    let musicStep = 0;
    let musicPlaying = false;
    const melody = [523.25,659.25,783.99,659.25,587.33,659.25,523.25,392.00,440.00,523.25,659.25,523.25,493.88,587.33,659.25,493.88];
    const chords = [
      [261.63,329.63,392.00], // C major
      [220.00,261.63,329.63], // A minor
      [174.61,220.00,261.63], // F major
      [196.00,246.94,293.66]  // G major
    ];
    const bassNotes = [130.81,110.00,87.31,98.00];

    function playTone(frequency, startAt, duration, volume, wave, attack) {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = wave || "sine";
      oscillator.frequency.setValueAtTime(frequency, startAt);
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(volume, startAt + (attack || 0.09));
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + duration + 0.04);
    }

    function playHarmony(now) {
      const chordIndex = Math.floor(musicStep / 4) % chords.length;
      const chord = chords[chordIndex];
      // Sustained, quiet chord tones underneath the melody.
      chord.forEach(function (frequency, index) {
        playTone(frequency, now, 2.2, 0.014 - index * 0.002, "sine", 0.22);
      });
      // Gentle low bass note adds warmth without overpowering the melody.
      playTone(bassNotes[chordIndex], now, 1.65, 0.035, "triangle", 0.16);
      // A light broken-chord sparkle, like soft piano notes.
      playTone(chord[(musicStep / 2) % chord.length | 0], now + 0.31, 0.7, 0.018, "sine", 0.05);
      playTone(chord[(Math.floor(musicStep / 2) + 1) % chord.length], now + 0.62, 0.7, 0.015, "sine", 0.05);
    }

    function playMusicStep() {
      if (!musicPlaying || !audioContext) return;
      const now = audioContext.currentTime;
      const note = melody[musicStep % melody.length];
      playTone(note, now, 1.0, 0.065, "sine", 0.08);
      playTone(note * 2, now + 0.02, 0.48, 0.009, "triangle", 0.05);
      if (musicStep % 4 === 0) playHarmony(now);
      musicStep = (musicStep + 1) % melody.length;
    }

    async function startMusic() {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        musicToggle.querySelector(".music-toggle-label").textContent = "Audio unavailable";
        return false;
      }
      if (!audioContext) audioContext = new AudioContextClass();
      if (audioContext.state === "suspended") await audioContext.resume();
      if (audioContext.state !== "running") return false;
      if (musicTimer) window.clearInterval(musicTimer);
      musicPlaying = true;
      musicToggle.setAttribute("aria-pressed", "true");
      musicToggle.setAttribute("aria-label", "Pause wedding background music");
      musicToggle.querySelector(".music-toggle-label").textContent = "Pause music";
      playMusicStep();
      musicTimer = window.setInterval(playMusicStep, 620);
      return true;
    }

    async function stopMusic() {
      musicPlaying = false;
      if (musicTimer) window.clearInterval(musicTimer);
      musicTimer = null;
      if (audioContext && audioContext.state === "running") await audioContext.suspend();
      musicToggle.setAttribute("aria-pressed", "false");
      musicToggle.setAttribute("aria-label", "Play wedding background music");
      musicToggle.querySelector(".music-toggle-label").textContent = "Play music";
    }

    musicToggle.addEventListener("click", function () {
      if (musicPlaying) stopMusic();
      else startMusic().then(function (started) {
        if (!started) musicToggle.querySelector(".music-toggle-label").textContent = "Tap for music";
      }).catch(function () {
        musicToggle.querySelector(".music-toggle-label").textContent = "Tap for music";
      });
    });

    // Browsers that permit autoplay start immediately; otherwise leave a one-tap fallback.
    startMusic().then(function (started) {
      if (!started) musicToggle.querySelector(".music-toggle-label").textContent = "Tap for music";
    }).catch(function () {
      musicToggle.querySelector(".music-toggle-label").textContent = "Tap for music";
    });

    window.addEventListener("pagehide", function () {
      if (musicTimer) window.clearInterval(musicTimer);
      if (audioContext && audioContext.state !== "closed") audioContext.close();
    });
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
      formMessage.hidden = false;
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
        formMessage.hidden = false;
        formMessage.classList.remove("is-error", "is-accept", "is-decline");
        if (payload.attendance === "Joyfully accepts") {
          formMessage.classList.add("is-accept");
          formMessage.innerHTML = '<span class="confirmation-icon" aria-hidden="true">✓</span><div class="acceptance-confirmation"><strong>Thank you for saying yes!</strong><p>Your RSVP request has been sent. We can’t wait to celebrate this special day with you.</p><div class="album-qr-panel"><span class="album-qr-heading">A little keepsake for our celebration</span><p>Scan this code to open our shared photo album. Album access is still limited to guests invited through Google Photos.</p><img class="album-qr-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAIAAACx0UUtAAAE1UlEQVR42u3dvW6cQBQG0DjKG6Xx+1dp8jwuLEvpXWx0df8GOKd1sgvspxk+AcPb1+fHDzjYT4cAGQUZRUZBRkFGkVGQUWQUZBRkFBkFGQUZRUZBRpFRkFGQUW7jV+Y//35/n9nKv3/+zGzVty/69lGv/5rZ5te7EPre0Gac+QsaRzHXg4wio3CXzlR4Xhw6lw+VlVD/KOxbhV7vwhV/QeMo5nqQUZBRHtmZMmfNobP1zHWXvtIQajaFNajvOPd9snEUcz3IKMgoOtOeUB3JXJQKVbdMSerriMZRkFFkFGQUnteZCotO5nsLe8+ZdwwaR0FGkVGQUXSmzg6RkekQfdd7CldbKLyvr3B/jaMgo8goyCg6016VKSxnfXfQZf4a2ubCrbrEL2gcxVwPMoqMwk0705n3fY1VmcKjccgdg8ZRkFFkFGQUvnv7+vxY+eKxtyiFvveQZeUyG3nI0ShsY8ZRzPUgo8gobKp8p+3YK1/7NnJr2fK+wpEpdmP3BBpHMdeDjCKjcK7UdabMWXPfmgihHpDpEFsVqq8GFW6V60yY60FGQUa5icbnmTIPEvUVrLE2NlZ0QutHFP7cYxXKOIq5HmQUGYXLdqbX58WFJ/5bN/KFNmNsJfLQ9xbur+tMIKPIKMgoOlOnwutMY6vb9S2gcMiq3qGnu/oW9zOOYq4HGUVG4RmdaezKSl8PKKxufU9Z3WDJQeMo5nqQUZBRLmNtrfG+rjZ2Lp9pkH3b3HdxyPNMIKPIKMgoOlNndwmdgG/940wbK+wQWy+RyhzJvqpqHMVcDzKKjMKmxueZxrrL6388tk553wuZxhYVzNxeaBzFXA8yCjKKzlRakjIn/n0n71uvbc3s0dZh905bkFFkFGQUnSl31rz1gqLMVZnMF2WOxlY5y3S1zJE0jmKuBxkFGeUy5p5nusHbYwsLZV/D6PuNtrbZOIq5HmQUGYXLdqaxJRL6HtkJbfOWrbUYthZ9MI5irgcZRUbhLp2pT+FFmq02Vnif29YeFe6gcRRzPcgoyCiP7ExXvAuur9hlFC6m3vdCpsJf3ziKuR5kFGSUy5hbazzTPwoXfRh7XWxmmwuXwht7l6578zDXg4yCjKIz5RpG5gR8bP3sTN/qKzqZcpapUKGtMo5irgcZBRlFZ/pfS+jrW33XP/oeQhorlJn2mXmXrnEUZBQZBRnlERrXgBhbXmHrsaqxB4n6HtgqXB6+b5uNo5jrQUaRUdhU+U7brb4VKhxbCzdkNnJsvfBMo+ordsZRzPUgo8gobDp0rfGxRvX6k7cuShUuWBfa/UxnMo5irgcZBRnlng69zhQ6PQ81jMxqC5lWtLVAeGaVh8z+Gkcx14OMgoyiMwW7S18b61vebWyh7tD3Ft58WLichHvzMNeDjIKMojN19p6tJdoK15HrW/Oi8KPGHm8yjmKuBxkFGUVn2tN3+1nmYsnWLYKFa99ljrNxFHM9yCjIKDrTHW29vanwrr+xS3R9x8o4irkeZBQZhUd2pkPeiJo50888V9R3japw6fHMI0pjl52Mo5jrQUaRUdiUWmv8kHXzMi0hUykKe0/fSuSZXeh7l5VxFHM9yCjIKM/oTGAcBRlFRkFGkVGQUZBRZBRkFBkFGQUZRUZBRkFGkVGQUWQUZBQC/gEaSMiWigU8bQAAAABJRU5ErkJggg==" alt="QR code for the private Marc and Angel wedding photo album"><span class="album-qr-caption">Our Wedding Memories · Marc &amp; Angel</span></div></div>';
        } else {
          formMessage.classList.add("is-decline");
          formMessage.innerHTML = '<span class="confirmation-icon" aria-hidden="true">♥</span><div><strong>Thank you for letting us know.</strong><p>We’re sorry you won’t be joining us in person, but we’re grateful you took a moment to respond. You’ll be in our hearts on our special day.</p></div>';
        }
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
