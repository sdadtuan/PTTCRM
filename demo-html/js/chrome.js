(function () {
  const root = document.body.getAttribute("data-root") || ".";
  const page = document.body.getAttribute("data-page") || "home";
  const I18N_KEY = "pttcrm_demo_lang";
  const CONSENT_KEY = "ptt_consent";

  const T = {
    vi: {
      skip: "Tới nội dung",
      products: "Sản phẩm",
      solutions: "Giải pháp",
      pricing: "Bảng giá",
      login: "Đăng nhập",
      demo: "Đăng ký Demo",
      crm: "CRM",
      crmD: "Lead, pipeline, CSKH — một nguồn sự thật.",
      ads: "Ads",
      adsD: "Meta và Zalo (gói Việt Nam) vào cùng một lead.",
      portal: "Portal",
      portalD: "Khách xem CPL/ROAS theo hợp đồng.",
      ai: "AI",
      aiD: "Chấm điểm lead, gợi ý bước kế tiếp.",
      bds: "Bất động sản",
      bdsD: "Lead dự án tới booking.",
      agency: "Agency",
      agencyD: "Nhiều client, portal ROAS, SLA handoff.",
      fnb: "F&B",
      fnbD: "Campaign tới đặt chỗ / cửa hàng.",
      legal: "Pháp lý",
      privacy: "Bảo mật",
      terms: "Điều khoản",
      cookies: "Cookie",
      contact: "Liên hệ",
      cookie: "Chúng tôi dùng cookie cần thiết. Phân tích và quảng cáo chỉ khi bạn đồng ý.",
      ess: "Đồng ý cần thiết",
      all: "Đồng ý tất cả",
      about: "Về chúng tôi",
      company: "Công ty",
      news: "Tin tức",
      resources: "Tài nguyên",
      platform: "Nền tảng",
      megaSol: "Theo ngành",
      megaPlat: "Bốn module",
      megaRes: "Đọc & liên hệ",
      featK: "Xem nhanh",
      featSolH: "Chuyên biệt từng ngành",
      featSolP: "Cùng một nền tảng. Khác metric chốt: booking, ROAS client, đặt chỗ.",
      featPlatH: "Closed-loop trên một hệ",
      featPlatP: "Ads → lead → hợp đồng → portal ROAS. Không phình HRM hay ERP.",
      featResH: "Demo 60 phút",
      featResP: "Không trial 30 ngày. Một buổi với data theo ngành của bạn.",
      viewSol: "Xem giải pháp",
      viewMod: "Xem module",
      allNews: "Tất cả tin tức",
      slogan: "Một nền tảng, chuyên biệt từng ngành.",
    },
    en: {
      skip: "Skip to content",
      products: "Product",
      solutions: "Solutions",
      pricing: "Pricing",
      login: "Log in",
      demo: "Request demo",
      crm: "CRM",
      crmD: "Leads, pipeline, care — one source of truth.",
      ads: "Ads",
      adsD: "Meta and Google into the same lead record.",
      portal: "Portal",
      portalD: "Clients see CPL/ROAS per contract.",
      ai: "AI",
      aiD: "Lead score and next-best action.",
      bds: "Real estate",
      bdsD: "Project lead to booking.",
      agency: "Agency",
      agencyD: "Multi-client, ROAS portal, handoff SLA.",
      fnb: "F&B",
      fnbD: "Campaign to reservation / store CRM.",
      legal: "Legal",
      privacy: "Privacy",
      terms: "Terms",
      cookies: "Cookies",
      contact: "Contact",
      cookie: "We use essential cookies. Analytics and ads run only with your consent.",
      ess: "Essential only",
      all: "Accept all",
      about: "About",
      company: "Company",
      news: "News",
      resources: "Resources",
      platform: "Platform",
      megaSol: "By industry",
      megaPlat: "Four modules",
      megaRes: "Read & contact",
      featK: "Preview",
      featSolH: "Specialized by industry",
      featSolP: "One platform. Different closing metrics: booking, client ROAS, reservations.",
      featPlatH: "Closed-loop on one system",
      featPlatP: "Ads → lead → contract → portal ROAS. Not an HRM or ERP.",
      featResH: "60-minute demo",
      featResP: "No 30-day trial. One session on your industry data.",
      viewSol: "View solution",
      viewMod: "View module",
      allNews: "All news",
      slogan: "One platform, specialized by industry.",
    },
  };

  function lang() {
    return localStorage.getItem(I18N_KEY) === "en" ? "en" : "vi";
  }

  function href(vi, en) {
    return lang() === "en" ? en : vi;
  }

  function applyCopy() {
    const L = lang();
    document.documentElement.lang = L;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const vi = el.getAttribute("data-vi");
      const en = el.getAttribute("data-en");
      if (L === "en" && en) el.textContent = en;
      if (L === "vi" && vi) el.textContent = vi;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const vi = el.getAttribute("data-vi");
      const en = el.getAttribute("data-en");
      if (L === "en" && en) el.innerHTML = en;
      if (L === "vi" && vi) el.innerHTML = vi;
    });
    document.querySelectorAll("[data-show-vi]").forEach((el) => {
      el.hidden = L !== "vi";
    });
    document.querySelectorAll("[data-show-en]").forEach((el) => {
      el.hidden = L !== "en";
    });
  }

  function chrome() {
    const t = T[lang()];
    const p = (vi, en) => root + href(vi, en || vi);
    return `
<a class="skip" href="#main">${t.skip}</a>
<div class="scroll-progress" data-progress></div>
<header class="top">
  <div class="top-in">
    <a class="brand" href="${p("/index.html", "/index.html")}">
      <span class="brand-mark"><img src="${root}/assets/pttcrm-logo-monogram.png" alt=""></span>
      <span class="brand-name">PTTCRM</span>
    </a>
    <button class="menu-toggle" type="button" aria-label="Menu" data-menu>☰</button>
    <nav class="nav" data-nav>
      <div class="nav-item" data-mega="sol">
        <button class="nav-btn" type="button" aria-expanded="false" data-on="giai-phap">${t.solutions}</button>
        <div class="mega" role="menu">
          <div class="mega-in">
            <div class="mega-col">
              <p class="mega-k">${t.megaSol}</p>
              <a class="mega-link" href="${p("/giai-phap/bds.html")}" data-cta="${t.viewSol}">
                <span class="mega-ico">BĐS</span>
                <span class="mega-txt"><strong>${t.bds}</strong><span>${t.bdsD}</span></span>
              </a>
              <a class="mega-link" href="${p("/giai-phap/agency.html")}" data-cta="${t.viewSol}">
                <span class="mega-ico">AG</span>
                <span class="mega-txt"><strong>${t.agency}</strong><span>${t.agencyD}</span></span>
              </a>
              <a class="mega-link" href="${p("/giai-phap/fnb.html")}" data-cta="${t.viewSol}">
                <span class="mega-ico">F&amp;B</span>
                <span class="mega-txt"><strong>${t.fnb}</strong><span>${t.fnbD}</span></span>
              </a>
            </div>
            <aside class="mega-feat">
              <p class="mega-k">${t.featK}</p>
              <h3 data-feat-h>${t.featSolH}</h3>
              <p data-feat-p>${t.featSolP}</p>
              <a class="btn btn-solid" data-feat-a href="${p("/dang-ky-demo.html")}">${t.demo}</a>
            </aside>
          </div>
        </div>
      </div>
      <div class="nav-item" data-mega="plat">
        <button class="nav-btn" type="button" aria-expanded="false" data-on="san-pham">${t.platform}</button>
        <div class="mega" role="menu">
          <div class="mega-in">
            <div class="mega-col mega-grid">
              <p class="mega-k">${t.megaPlat}</p>
              <a class="mega-link" href="${p("/san-pham/crm.html")}" data-cta="${t.viewMod}">
                <span class="mega-ico">CRM</span>
                <span class="mega-txt"><strong>${t.crm}</strong><span>${t.crmD}</span></span>
              </a>
              <a class="mega-link" href="${p("/san-pham/ads.html")}" data-cta="${t.viewMod}">
                <span class="mega-ico">ADS</span>
                <span class="mega-txt"><strong>${t.ads}</strong><span>${t.adsD}</span></span>
              </a>
              <a class="mega-link" href="${p("/san-pham/portal.html")}" data-cta="${t.viewMod}">
                <span class="mega-ico">POR</span>
                <span class="mega-txt"><strong>${t.portal}</strong><span>${t.portalD}</span></span>
              </a>
              <a class="mega-link" href="${p("/san-pham/ai.html")}" data-cta="${t.viewMod}">
                <span class="mega-ico">AI</span>
                <span class="mega-txt"><strong>${t.ai}</strong><span>${t.aiD}</span></span>
              </a>
            </div>
            <aside class="mega-feat">
              <p class="mega-k">${t.featK}</p>
              <h3 data-feat-h>${t.featPlatH}</h3>
              <p data-feat-p>${t.featPlatP}</p>
              <a class="btn btn-solid" data-feat-a href="${p("/dang-ky-demo.html")}">${t.demo}</a>
            </aside>
          </div>
        </div>
      </div>
      <a class="nav-link" href="${p("/bang-gia.html")}" data-on="bang-gia">${t.pricing}</a>
      <div class="nav-item" data-mega="res">
        <button class="nav-btn" type="button" aria-expanded="false" data-on="tin-tuc|ve-chung-toi">${t.resources}</button>
        <div class="mega" role="menu">
          <div class="mega-in">
            <div class="mega-col">
              <p class="mega-k">${t.megaRes}</p>
              <a class="mega-link" href="${p("/tin-tuc.html")}" data-cta="${t.allNews}">
                <span class="mega-ico">TIN</span>
                <span class="mega-txt"><strong>${t.news}</strong><span data-i18n data-vi="Góc nhìn Marketing CRM." data-en="Marketing CRM insight."></span></span>
              </a>
              <a class="mega-link" href="${p("/ve-chung-toi.html")}" data-cta="${t.about}">
                <span class="mega-ico">PTT</span>
                <span class="mega-txt"><strong>${t.about}</strong><span data-i18n data-vi="Vị trí: CRM tốt nhất về Marketing." data-en="Position: best CRM for marketing."></span></span>
              </a>
              <a class="mega-link" href="${p("/dang-ky-demo.html")}" data-cta="${t.demo}">
                <span class="mega-ico">60'</span>
                <span class="mega-txt"><strong>${t.demo}</strong><span data-i18n data-vi="Form 2 phút. Không trial tự phục vụ." data-en="Two-minute form. No self-serve trial."></span></span>
              </a>
            </div>
            <aside class="mega-feat">
              <p class="mega-k">${t.featK}</p>
              <h3 data-feat-h>${t.featResH}</h3>
              <p data-feat-p>${t.featResP}</p>
              <a class="btn btn-solid" data-feat-a href="${p("/dang-ky-demo.html")}">${t.demo}</a>
            </aside>
          </div>
        </div>
      </div>
    </nav>
    <div class="top-end">
      <a class="phone-link" href="tel:+842473077979">024 7307 7979</a>
      <div class="lang">
        <button type="button" data-set-lang="vi" ${lang() === "vi" ? 'aria-current="true"' : ""}>VI</button>
        <span>|</span>
        <button type="button" data-set-lang="en" ${lang() === "en" ? 'aria-current="true"' : ""}>EN</button>
      </div>
      <a class="btn btn-ghost" href="https://rs.pttads.vn/login">${t.login}</a>
      <a class="btn btn-solid" href="${p("/dang-ky-demo.html", "/dang-ky-demo.html")}">${t.demo}</a>
    </div>
  </div>
</header>
<div class="nav-dim" data-dim hidden></div>`;
  }

  function footer() {
    const t = T[lang()];
    const p = (vi) => root + vi;
    return `
<footer class="foot">
  <div class="foot-in">
    <div class="foot-grid">
      <div class="foot-brand">
        <a class="brand" href="${p("/index.html")}"><span class="brand-mark"><img src="${root}/assets/pttcrm-logo-monogram.png" alt=""></span><span class="brand-name" style="color:#fff">PTTCRM</span></a>
        <p>${t.slogan}</p>
      </div>
      <div>
        <h4>${t.products}</h4>
        <ul>
          <li><a href="${p("/san-pham/crm.html")}">${t.crm}</a></li>
          <li><a href="${p("/san-pham/ads.html")}">${t.ads}</a></li>
          <li><a href="${p("/san-pham/portal.html")}">${t.portal}</a></li>
          <li><a href="${p("/san-pham/ai.html")}">${t.ai}</a></li>
        </ul>
      </div>
      <div>
        <h4>${t.solutions}</h4>
        <ul>
          <li><a href="${p("/giai-phap/bds.html")}">${t.bds}</a></li>
          <li><a href="${p("/giai-phap/agency.html")}">${t.agency}</a></li>
          <li><a href="${p("/giai-phap/fnb.html")}">${t.fnb}</a></li>
        </ul>
      </div>
      <div>
        <h4>${t.legal}</h4>
        <ul>
          <li><a href="${p("/phap-ly/bao-mat.html")}">${t.privacy}</a></li>
          <li><a href="${p("/phap-ly/dieu-khoan.html")}">${t.terms}</a></li>
          <li><a href="${p("/phap-ly/cookie.html")}">${t.cookies}</a></li>
        </ul>
      </div>
      <div>
        <h4>${t.resources}</h4>
        <ul>
          <li><a href="${p("/tin-tuc.html")}">${t.news}</a></li>
          <li><a href="${p("/ve-chung-toi.html")}">${t.about}</a></li>
          <li><a href="${p("/dang-ky-demo.html")}">${t.demo}</a></li>
          <li><a href="mailto:hello@pttcrm.com">hello@pttcrm.com</a></li>
          <li><a href="tel:+842473077979">+84 24 7307 7979</a></li>
        </ul>
      </div>
    </div>
    <div class="copy"><span>© 2026 PTTCRM</span><span>hello@pttcrm.com</span></div>
  </div>
</footer>
<div class="mobile-cta"><a class="btn btn-solid" href="${p("/dang-ky-demo.html")}">${t.demo}</a></div>
<div class="cookie" id="cookie" hidden>
  <span>${t.cookie}</span>
  <button class="btn btn-ghost" type="button" data-consent="ess">${t.ess}</button>
  <button class="btn btn-solid" type="button" data-consent="all">${t.all}</button>
</div>`;
  }

  function mount() {
    const head = document.getElementById("site-header");
    const foot = document.getElementById("site-footer");
    if (head) head.innerHTML = chrome();
    if (foot) foot.innerHTML = footer();
    applyCopy();

    document.querySelector("[data-menu]")?.addEventListener("click", () => {
      const nav = document.querySelector("[data-nav]");
      nav?.classList.toggle("open");
      if (!nav?.classList.contains("open")) closeMegas();
    });
    bindMega();
    markActive();
    document.querySelectorAll("[data-set-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        localStorage.setItem(I18N_KEY, btn.getAttribute("data-set-lang"));
        mount();
        document.dispatchEvent(new Event("pttcrm:lang"));
      });
    });
    document.dispatchEvent(new Event("pttcrm:lang"));

    const bar = document.getElementById("cookie");
    if (bar && !localStorage.getItem(CONSENT_KEY)) bar.hidden = false;
    document.querySelectorAll("[data-consent]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const all = btn.getAttribute("data-consent") === "all";
        localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics: all, ads: all }));
        if (bar) bar.hidden = true;
      });
    });
  }

  function closeMegas() {
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("is-open");
      item.querySelector(".nav-btn")?.setAttribute("aria-expanded", "false");
    });
    document.querySelector(".top")?.classList.remove("mega-on");
    const dim = document.querySelector("[data-dim]");
    if (dim) dim.hidden = true;
  }

  function setFeat(item, link) {
    const feat = item.querySelector(".mega-feat");
    if (!feat || !link) return;
    const title = link.querySelector("strong")?.textContent || "";
    const body = link.querySelector(".mega-txt > span")?.textContent || "";
    const href = link.getAttribute("href") || "#";
    const cta = link.getAttribute("data-cta") || "";
    const h = feat.querySelector("[data-feat-h]");
    const p = feat.querySelector("[data-feat-p]");
    const a = feat.querySelector("[data-feat-a]");
    if (h) h.textContent = title;
    if (p) p.textContent = body;
    if (a) {
      a.href = href;
      if (cta) a.textContent = cta;
    }
    item.querySelectorAll(".mega-link").forEach((el) => el.classList.toggle("is-hot", el === link));
  }

  function bindMega() {
    const header = document.querySelector(".top");
    const dim = document.querySelector("[data-dim]");
    const items = document.querySelectorAll(".nav-item");
    const mobile = () => window.matchMedia("(max-width: 720px)").matches;

    function open(item) {
      items.forEach((el) => {
        const on = el === item;
        el.classList.toggle("is-open", on);
        el.querySelector(".nav-btn")?.setAttribute("aria-expanded", on ? "true" : "false");
      });
      header?.classList.add("mega-on");
      if (dim && !mobile()) dim.hidden = false;
    }

    items.forEach((item) => {
      const btn = item.querySelector(".nav-btn");
      if (!btn) return;
      item.addEventListener("mouseenter", () => {
        if (!mobile()) open(item);
      });
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (item.classList.contains("is-open")) closeMegas();
        else open(item);
      });
      item.querySelectorAll(".mega-link").forEach((link) => {
        link.addEventListener("mouseenter", () => setFeat(item, link));
        link.addEventListener("focus", () => setFeat(item, link));
      });
    });

    header?.addEventListener("mouseleave", () => {
      if (!mobile()) closeMegas();
    });
    document.querySelectorAll(".nav-link, .top-end, .brand").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        if (!mobile()) closeMegas();
      });
    });
    dim?.addEventListener("click", closeMegas);
    if (!window.__pttEscMega) {
      window.__pttEscMega = true;
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMegas();
      });
    }
  }

  function markActive() {
    const path = location.pathname || "";
    document.querySelectorAll("[data-on]").forEach((el) => {
      const keys = el.getAttribute("data-on").split("|");
      const on = keys.some((k) => path.includes(k));
      el.classList.toggle("is-on", on);
      el.closest(".nav-item")?.classList.toggle("is-current", on);
    });
  }

  function loadMotion() {
    if (document.querySelector("script[data-motion]")) return;
    const s = document.createElement("script");
    s.src = root + "/js/motion.js";
    s.setAttribute("data-motion", "1");
    document.body.appendChild(s);
  }

  document.addEventListener("DOMContentLoaded", () => {
    mount();
    loadMotion();
  });
  window.PTTCRM_DEMO = { lang, page, root };
})();
