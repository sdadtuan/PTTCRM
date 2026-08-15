(function () {
  const PAGES = {
    bds: {
      h1: { vi: "PTTCRM cho bất động sản", en: "PTTCRM for real estate" },
      pains: {
        vi: ["Lead dự án trộn với lead chung.", "Không biết nguồn nào ra booking.", "Sàn và CĐT nhìn hai file khác nhau."],
        en: ["Project leads mix with generic leads.", "No one knows which source booked.", "Broker and developer see two files."],
      },
      proofs: {
        vi: ["Metric: lead → booking theo dự án", "Metric: CPL theo kênh", "Metric: tốc độ phản hồi lead"],
        en: ["Metric: lead → booking by project", "Metric: CPL by channel", "Metric: lead response time"],
      },
      sku: "ind",
      industry: "bds",
    },
    agency: {
      h1: { vi: "PTTCRM cho agency", en: "PTTCRM for agencies" },
      pains: {
        vi: ["ROAS từng client nằm ở file riêng.", "Handoff Sales–Solution không có chủ.", "Khách không có portal."],
        en: ["Per-client ROAS lives in separate files.", "Sales–Solution handoff has no owner.", "Clients have no portal."],
      },
      proofs: {
        vi: ["Metric: CPL/ROAS theo client", "Metric: SLA handoff", "Metric: portal login của khách"],
        en: ["Metric: CPL/ROAS per client", "Metric: handoff SLA", "Metric: client portal login"],
      },
      sku: "agy",
      industry: "agency",
    },
    fnb: {
      h1: { vi: "PTTCRM cho F&B", en: "PTTCRM for F&B" },
      pains: {
        vi: ["Campaign không gắn được lượt đặt.", "Chuỗi cửa hàng không có CRM chung.", "CSKH offline tách khỏi ads."],
        en: ["Campaigns do not attach to reservations.", "Stores have no shared CRM.", "Offline care is split from ads."],
      },
      proofs: {
        vi: ["Metric: campaign → đặt chỗ", "Metric: lead theo cửa hàng", "Metric: tái đặt / giữ khách"],
        en: ["Metric: campaign → reservation", "Metric: lead by store", "Metric: repeat / retention"],
      },
      sku: "ind",
      industry: "fnb",
    },
  };
  const id = document.body.getAttribute("data-industry");
  const spec = PAGES[id];
  if (!spec) return;
  function render() {
    const L = localStorage.getItem("pttcrm_demo_lang") === "en" ? "en" : "vi";
    const root = document.body.getAttribute("data-root") || "..";
    document.getElementById("i-h1").textContent = spec.h1[L];
    document.getElementById("i-pains").innerHTML = spec.pains[L].map((x) => "<li>" + x + "</li>").join("");
    document.getElementById("i-proofs").innerHTML = spec.proofs[L].map((x) => "<li>" + x + "</li>").join("");
    const a = document.getElementById("i-demo");
    a.href = root + "/dang-ky-demo.html?industry=" + spec.industry + "&sku=" + spec.sku;
    a.textContent = L === "en" ? "Request demo" : "Đăng ký Demo";
    const note = document.getElementById("i-sku-note");
    if (note) {
      note.textContent = spec.sku === "agy"
        ? (L === "en" ? "Agency OS — multi-client + portal." : "Agency OS — multi-client + portal.")
        : (L === "en" ? "Industry — one pack + attribution." : "Industry — 1 pack ngành + attribution.");
    }
  }
  document.addEventListener("pttcrm:lang", render);
  render();
})();
