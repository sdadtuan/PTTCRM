(function () {
  const PAGES = {
    crm: {
      crumb: { vi: "Sản phẩm / CRM", en: "Product / CRM" },
      h1: { vi: "CRM Marketing", en: "Marketing CRM" },
      problems: {
        vi: ["Lead nằm ở Excel và inbox ads, không về một hàng.", "Không biết campaign nào ra hợp đồng.", "CSKH và Sales nhìn hai sự thật khác nhau."],
        en: ["Leads sit in Excel and ad inboxes.", "No one knows which campaign closed a contract.", "Care and Sales see two different truths."],
      },
      caps: {
        vi: ["Một pipeline lead → khách → hợp đồng.", "SLA phản hồi và bảng CSKH.", "Nguồn lead gắn UTM / campaign."],
        en: ["One pipeline: lead → customer → contract.", "Response SLA and care board.", "Lead source tied to UTM / campaign."],
      },
    },
    ads: {
      crumb: { vi: "Sản phẩm / Ads", en: "Product / Ads" },
      h1: { vi: "Ads — Meta và Zalo", en: "Ads — Meta and Google" },
      problems: {
        vi: ["Chi tiêu ads không khớp số lead về CRM.", "Zalo và Meta là hai thế giới.", "AM không chứng minh được ROAS cho khách."],
        en: ["Ad spend does not match CRM leads.", "Channels stay in separate tools.", "AMs cannot prove ROAS to the client."],
      },
      caps: {
        vi: ["Ingest lead Meta / Zalo (Zalo = gói Việt Nam).", "Gắn spend → lead → hợp đồng.", "EN: Meta + Google là core; Zalo không hứa trên bản EN."],
        en: ["Ingest Meta and Google leads.", "Tie spend → lead → contract.", "Zalo is a Vietnam pack, not on the English core."],
      },
    },
    portal: {
      crumb: { vi: "Sản phẩm / Portal", en: "Product / Portal" },
      h1: { vi: "Portal khách", en: "Client portal" },
      problems: {
        vi: ["Khách hỏi ROAS trên file Excel tuần.", "Không tách được số theo từng client.", "Duyệt creative / báo cáo qua Zalo."],
        en: ["Clients ask for ROAS on a weekly spreadsheet.", "Numbers are not split per client.", "Approvals happen in chat."],
      },
      caps: {
        vi: ["Dashboard CPL/ROAS theo hợp đồng.", "Phê duyệt trên portal.", "Đúng scope — không thấy client khác."],
        en: ["CPL/ROAS dashboard per contract.", "Approvals in the portal.", "Scoped access — no other clients."],
      },
    },
    ai: {
      crumb: { vi: "Sản phẩm / AI", en: "Product / AI" },
      h1: { vi: "AI Revenue", en: "AI Revenue" },
      problems: {
        vi: ["Lead tốt và lead rác vào cùng một hàng.", "Không có bước kế tiếp sau demo.", "Dự báo renewal dựa trên cảm tính."],
        en: ["Good and junk leads share one queue.", "No next step after the demo.", "Renewal forecast is a guess."],
      },
      caps: {
        vi: ["Chấm điểm lead.", "Gợi ý bước kế tiếp.", "Cảnh báo renewal — không chatbot Fanpage."],
        en: ["Lead scoring.", "Next-best action.", "Renewal alerts — not a page chatbot."],
      },
    },
  };

  const id = document.body.getAttribute("data-product");
  const spec = PAGES[id];
  if (!spec) return;
  function render() {
    const L = localStorage.getItem("pttcrm_demo_lang") === "en" ? "en" : "vi";
    const root = document.body.getAttribute("data-root") || "..";
    document.getElementById("p-crumb").textContent = spec.crumb[L];
    document.getElementById("p-h1").textContent = spec.h1[L];
    document.getElementById("p-problems").innerHTML = spec.problems[L].map((x) => "<li>" + x + "</li>").join("");
    document.getElementById("p-caps").innerHTML = spec.caps[L].map((x) => "<li>" + x + "</li>").join("");
    const demo = document.getElementById("p-demo");
    demo.href = root + "/dang-ky-demo.html";
    demo.textContent = L === "en" ? "Request demo" : "Đăng ký Demo";
  }
  document.addEventListener("pttcrm:lang", render);
  render();
})();
