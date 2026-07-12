/* Ruhsat360 — etkileşimler */
(function () {
  "use strict";

  /* ---------- Navbar scroll durumu ---------- */
  var header = document.getElementById("site-header");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 30);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobil menü ---------- */
  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Scroll'da beliren bölümler ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-up");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Sayaç animasyonu (dashboard istatistikleri) ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var dur = 1400;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toString();
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-count");
    });
  }

  /* ---------- SSS: tek seferde bir cevap açık ---------- */
  function bindFaq() {
    var faqs = document.querySelectorAll(".faq details");
    faqs.forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (d.open) {
          faqs.forEach(function (other) {
            if (other !== d) other.open = false;
          });
        }
      });
    });
  }
  bindFaq();

  /* ---------- İçeriği data/content.json'dan render et (admin panelinden yönetilir) ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function renderPricing(p) {
    if (!p) return;
    var sub = document.getElementById("pricing-sub");
    var note = document.getElementById("pricing-note");
    var grid = document.getElementById("pricing-grid");
    if (sub && p.subtitle) sub.textContent = p.subtitle;
    if (note && p.note) note.textContent = p.note;
    if (grid && Array.isArray(p.plans)) {
      grid.innerHTML = p.plans.map(function (pl) {
        var feats = (pl.features || []).map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("");
        var badge = pl.popular ? '<span class="pop-badge">En Popüler</span>' : "";
        var per = pl.per ? '<span class="per">' + esc(pl.per) + "</span>" : "";
        var btnClass = pl.popular ? "btn btn-primary" : "btn btn-ghost";
        return '<article class="price-card' + (pl.popular ? " popular" : "") + '">' +
          badge +
          "<h3>" + esc(pl.name) + "</h3>" +
          '<div class="price"><span class="amount">' + esc(pl.price) + "</span>" + per + "</div>" +
          (pl.audience ? '<p class="price-audience">' + esc(pl.audience) + "</p>" : "") +
          (pl.desc ? '<p class="price-desc">' + esc(pl.desc) + "</p>" : "") +
          "<ul>" + feats + "</ul>" +
          '<a href="#iletisim" class="' + btnClass + '">' + esc(pl.cta || "Hemen Başla") + "</a>" +
          "</article>";
      }).join("");
    }
  }
  function renderConsulting(c) {
    if (!c) return;
    var sub = document.getElementById("consult-sub");
    var grid = document.getElementById("consult-grid");
    if (sub && c.subtitle) sub.textContent = c.subtitle;
    if (grid && Array.isArray(c.items)) {
      grid.innerHTML = c.items.map(function (it) {
        var meta = (it.meta || it.price)
          ? '<div class="consult-meta"><span>' + esc(it.meta || "") + "</span><b>" + esc(it.price || "") + "</b></div>"
          : "";
        return '<article class="card consult">' +
          '<div class="card-icon">' + esc(it.icon || "🧭") + "</div>" +
          "<h3>" + esc(it.title) + "</h3>" +
          "<p>" + esc(it.desc) + "</p>" +
          meta +
          '<a href="#iletisim" class="btn btn-ghost">' + esc(it.cta || "Randevu Al") + "</a>" +
          "</article>";
      }).join("");
    }
  }
  function renderFaq(items) {
    var wrap = document.getElementById("faq");
    if (!wrap || !Array.isArray(items) || !items.length) return;
    wrap.innerHTML = items.map(function (it) {
      return "<details><summary>" + esc(it.q) + "</summary><p>" + esc(it.a) + "</p></details>";
    }).join("");
    bindFaq();
  }
  fetch("data/content.json", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (data) {
      if (data.pricing) renderPricing(data.pricing);
      if (data.consulting) renderConsulting(data.consulting);
      if (data.faq) renderFaq(data.faq);
    })
    .catch(function () { /* JSON yüklenemezse sayfadaki statik içerik kalır */ });

  /* ---------- İletişim formu → otomatik demo daveti ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      var name = (document.getElementById("f-name").value || "").trim();
      var office = (document.getElementById("f-office").value || "").trim();
      var email = (document.getElementById("f-email").value || "").trim();
      var phone = (document.getElementById("f-phone").value || "").trim();
      var msg = (document.getElementById("f-msg").value || "").trim();
      var kvkk = document.getElementById("f-kvkk");
      var kvkkConsent = !!(kvkk && kvkk.checked);
      var button = form.querySelector('button[type="submit"]');
      var note = document.getElementById("form-note");

      if (!office || !email) {
        if (note) {
          note.textContent = "Lütfen ofis adı ve e-posta alanlarını doldurun.";
          note.className = "form-note error";
        }
        return;
      }

      if (!kvkkConsent) {
        if (note) {
          note.textContent = "Devam etmek için KVKK açık rıza onayını işaretlemelisiniz.";
          note.className = "form-note error";
        }
        return;
      }

      if (!kvkkConsent) {
        if (note) {
          note.textContent = "Devam etmek için KVKK açık rıza onayını işaretlemelisiniz.";
          note.className = "form-note error";
        }
        return;
      }

      var oldText = button ? button.textContent : "";
      if (button) {
        button.disabled = true;
        button.textContent = "Gönderiliyor...";
      }
      if (note) {
        note.textContent = "Demo talebiniz gönderiliyor...";
        note.className = "form-note";
      }

      try {
        var response = await fetch("https://europe-west1-artful-guru-474421-f9.cloudfunctions.net/createWebsitePlatformInvite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            companyName: office,
            contactName: name,
            email: email,
            phone: phone,
            message: msg,
            kvkkConsent: kvkkConsent,
            kvkkConsentAt: new Date().toISOString(),
            source: "ruhsat360.com"
          })
        });

        var result = await response.json();

        if (!response.ok || !result.ok) {
          throw new Error(result.message || "Başvuru gönderilemedi.");
        }

        if (note) {
          note.textContent = "Başvurunuz alındı. Ruhsat360 demo davetiniz oluşturuldu.";
          note.className = "form-note success";
        }

        form.reset();
      } catch (error) {
        if (note) {
          note.textContent = error.message || "Bir hata oluştu. Lütfen tekrar deneyin.";
          note.className = "form-note error";
        }
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = oldText || "Demo Talebi Gönder";
        }
      }
    });
  }

  /* ---------- MacBook galeri: otomatik kaydırma ---------- */
  var track = document.getElementById("mb-track");
  var dotsWrap = document.getElementById("mb-dots");
  if (track && dotsWrap) {
    var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll(".mb-dot"));
    var count = dots.length;
    var idx = 0;
    var timer = null;
    var DELAY = 3600;

    function go(i) {
      idx = (i + count) % count;
      track.style.transform = "translateX(" + (-idx * 25) + "%)";
      dots.forEach(function (d, n) { d.classList.toggle("active", n === idx); });
    }
    function next() { go(idx + 1); }
    function start() {
      stop();
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = setInterval(next, DELAY);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    dots.forEach(function (d, n) {
      d.addEventListener("click", function () { go(n); start(); });
    });

    var mb = document.querySelector(".macbook");
    if (mb) {
      mb.addEventListener("mouseenter", stop);
      mb.addEventListener("mouseleave", start);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });

    go(0);
    start();
  }
})();
