import React, { useEffect, useMemo, useRef, useState } from "react";

/* =========================
   Minimal CSS (no Tailwind)
   ========================= */
const GlobalStyles = () => (
  <style>{`
    :root{--bg:#f8fafc;--card:#ffffff;--text:#0f172a;--muted:#475569;--brand:#5b8def;--ok:#16a34a;--warn:#f59e0b;--danger:#ef4444;}
    *{box-sizing:border-box;font-family:Inter, "Noto Sans Khmer", system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial}
    body{margin:0;background:var(--bg);color:var(--text)}
    .wrap{max-width:1040px;margin:24px auto;padding:16px}
    .topbar{display:flex;gap:12px;justify-content:flex-end;align-items:center;margin-bottom:12px}
    .langbtn{border:1px solid #cbd5e1;background:#fff;padding:6px 10px;border-radius:10px;cursor:pointer}
    .langbtn.active{border-color:var(--brand);color:var(--brand);font-weight:600}
    .card{background:var(--card);border:1px solid #e2e8f0;border-radius:16px;padding:18px;box-shadow:0 2px 10px rgba(0,0,0,.04);margin-bottom:16px}
    h1{font-size:22px;margin:4px 0 12px}
    h2{font-size:18px;margin:0 0 10px}
    .q{margin:24px 0 10px;font-weight:600}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
    .opt{border:1px solid #e2e8f0;border-radius:12px;padding:12px;background:#fff;cursor:pointer}
    .opt.selected{border-color:var(--brand);box-shadow:0 0 0 3px rgba(91,141,239,.2)}
    .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
    .btn{background:var(--brand);color:#fff;border:none;border-radius:12px;padding:10px 14px;cursor:pointer}
    .btn.ghost{background:#fff;color:var(--brand);border:1px solid var(--brand)}
    .btn.mute{background:#e2e8f0;color:#111}
    .btn:disabled{opacity:.6;cursor:not-allowed}
    .muted{color:var(--muted);font-size:12px}
    .pill{display:inline-block;padding:3px 8px;border-radius:999px;background:#eef2ff;border:1px solid #c7d2fe;color:#3730a3;font-size:12px}
    .table{width:100%;border-collapse:collapse}
    .table th,.table td{border-bottom:1px solid #e5e7eb;padding:8px;text-align:left}
    .price{font-variant-numeric:tabular-nums}
    .imgpair{display:flex;gap:8px}
    .imgframe{width:88px;height:88px;border:1px solid #e2e8f0;border-radius:10px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#fff}
    .imgframe img{width:100%;height:100%;object-fit:cover}
    .badge{font-size:12px;background:#ecfeff;border:1px solid #a5f3fc;color:#155e75;padding:3px 6px;border-radius:999px}
    .invoice{background:#fff;border:1px dashed #94a3b8;border-radius:16px;padding:16px}
    .caption{font-size:12px;color:#64748b}
    .summaryGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px}
    .summaryItem{background:#f1f5f9;border:1px solid #e2e8f0;border-radius:12px;padding:10px}
    .imgdebug{font-size:11px;color:#64748b;margin-top:4px}
    .imgdebug a{color:#5b8def;text-decoration:underline}

    /* Contact section */
    .contactWrap{display:flex;flex-direction:column;align-items:center;gap:12px}
    .qrRow{display:flex;gap:32px;align-items:flex-start;justify-content:center;flex-wrap:wrap}
    .qrCard{border:1px solid #e2e8f0;background:#fff;border-radius:14px;padding:12px;width:220px}
    .qrImgBox{width:100%;height:160px;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0}
    .qrImgBox img{height:160px;width:auto;object-fit:contain}
    .qrTitle{font-weight:600;margin-top:8px}
    .qrLink{font-size:13px;color:#2563eb;overflow-wrap:anywhere}
  `}</style>
);

/* ===== i18n ===== */
const i18n = {
  km: {
    appTitle: "កម្មវិធីណែនាំផលិតផល Moyuum (Khmer/English)",
    next: "បន្ត",
    back: "ថយក្រោយ",
    review: "ពិនិត្យឡើងវិញ",
    reviseAnswers: "កែតម្រូវចម្លើយ",
    proceedToRecs: "បន្តទៅការណែនាំផលិតផល",
    toInvoice: "បន្តទៅវិក័យប័ត្រ",
    exportInvoice: "ទាញយកវិក័យប័ត្រជារូបភាព",
    language: "ភាសា",
    khmer: "ខ្មែរ",
    english: "English",
    q1_title: "គោលបំណងប្រើកម្មវិធី",
    q1_purpose_1: "ស្វែងរកផលិតផលសមស្របសម្រាប់កូនផ្ទាល់",
    q1_purpose_2: "ស្វែងរកផលិតផលសមស្របសម្រាប់ផ្តល់ជាអំណោយ",
    q11_title: "សូមជ្រើសរើសអាយុកូន (ខែ)",
    q11_options: [
      "ទារកទើបកើត (0–2 ខែ)",
      "ទារកដំបូង (3–6 ខែ)",
      "ទារកកណ្ដាល (7–12 ខែ)",
      "ក្មេងដើរដើម (13–24 ខែ)",
      "ក្មេងដើរចុង (25–36 ខែ)",
      "លើស 36 ខែ"
    ],
    q12_title: "ស្ថានភាព/គោលបំណង",
    q12_1: "ត្រូវការផលិតផលទាក់ទងការបំបៅ",
    q12_2: "ស្វែងរកផលិតផលសម្រួលពេលចេញក្រៅ/ធ្វើដំណើរ",
    q12_3: "ត្រូវការផលិតផលជួយអភិវឌ្ឍមាត់ និងផ្តល់ផាសុកភាព",
    q12_4: "ស្វែងរកផលិតផលជួយគ្រប់គ្រងអនាម័យ/សម្អាត",
    q13_title: "កត្តាដែលពិចារណាចម្បងពេលជ្រើសផលិតផល",
    q13_1: "គុណភាព និងសុវត្ថិភាពសម្ភារៈ",
    q13_2: "តម្លៃ",
    q13_3: "រចនាប័ទ្ម",
    q13_4: "ងាយស្រួលប្រើ",
    q13_5: "ងាយស្រួលថែទាំ",
    q14_title: "សម្ភារៈដែលចូលចិត្ត",
    q14_ppsu: "ប្លាស្ទិក (PPSU)",
    q14_sil: "ស៊ីលីខុន",
    q14_gls: "កញ្ចក់",
    q15_title: "ចន្លោះតម្លៃដែលចង់បាន (តម្លៃឯកត្តា)",
    price_1: "ក្រោម $5",
    price_2: "$5~$10",
    price_3: "$10~$15",
    price_4: "$15~$20",
    price_5: "លើស $20",
    reviewTitle: "ពិនិត្យចម្លើយរបស់អ្នកឡើងវិញ",
    recsTitle: "លទ្ធផលណែនាំផលិតផល",
    selectProducts: "ជ្រើសរើសផលិតផល",
    selectedCount: (n)=>`បានជ្រើស ${n} ធាតុ`,
    invoiceTitle: "វិក័យប័ត្រ",
    invoiceNote: "តម្លៃគិតជាដុល្លារ សម្រាប់ឧត្តមគតិ (VAT/អត្រាប្តូរ បន្ថែមបានពេលក្រោយ)",
    thanks: "សូមអរគុណ!",
    thanksDesc: "បើមានសំណួរ សូមទាក់ទងតាមបណ្តាញខាងក្រោម។"
  },
  en: {
    appTitle: "Moyuum Product Recommender (Khmer/English)",
    next: "Next",
    back: "Back",
    review: "Review",
    reviseAnswers: "Revise selected questions",
    proceedToRecs: "Proceed to Recommendations",
    toInvoice: "Proceed to Invoice",
    exportInvoice: "Export Invoice as Image",
    language: "Language",
    khmer: "Khmer",
    english: "English",
    q1_title: "Purpose of using this program",
    q1_purpose_1: "Finding baby products for your own baby",
    q1_purpose_2: "Finding baby products for gifting",
    q11_title: "Please select baby age (months)",
    q11_options: [
      "0–2 months (Newborn)",
      "3–6 months (Early infancy)",
      "7–12 months (Middle infancy)",
      "13–24 months (Early toddlerhood)",
      "25–36 months (Late toddlerhood)",
      "Over 36 months"
    ],
    q12_title: "Situation/Purpose",
    q12_1: "Need feeding-related products",
    q12_2: "Convenience for outings/mobility",
    q12_3: "Oral development & comfort",
    q12_4: "Hygiene/cleanliness management",
    q13_title: "Primary selection factors",
    q13_1: "Material quality & safety",
    q13_2: "Price",
    q13_3: "Design",
    q13_4: "Ease of use",
    q13_5: "Ease of maintenance",
    q14_title: "Preferred material",
    q14_ppsu: "Plastic (PPSU)",
    q14_sil: "Silicone",
    q14_gls: "Glass",
    q15_title: "Desired unit price",
    price_1: "Under $5",
    price_2: "$5~$10",
    price_3: "$10~$15",
    price_4: "$15~$20",
    price_5: "Over $20",
    reviewTitle: "Review Your Answers",
    recsTitle: "Recommended Products",
    selectProducts: "Select Products",
    selectedCount: (n)=>`${n} selected`,
    invoiceTitle: "Invoice",
    invoiceNote: "Prices in USD for demo; VAT/exchange can be added later.",
    thanks: "Thank you!",
    thanksDesc: "If you have any questions, feel free to reach us below."
  }
};

/* ========== helpers: normalize & mapping ========== */
const splitBarcodes = (csv) => {
  if (!csv) return [];
  return String(csv).split(/,\s*/).map(s => s.trim()).filter(Boolean);
};
const norm = (s) => String(s||"").trim().toLowerCase();

const withBase = (p="") => `${import.meta.env.BASE_URL || "/"}${p}`.replace(/\/+$/,'/');

const normalizeImageUrl = (u) => {
  if (!u) return "";
  const s = String(u).trim();
  if (!s) return "";
  const m1 = s.match(/https?:\/\/drive\.google\.com\/file\/d\/([^/]+)\/view/i);
  if (m1) return `https://drive.google.com/uc?export=view&id=${m1[1]}`;
  const m2 = s.match(/https?:\/\/drive\.google\.com\/open\?id=([^&]+)/i);
  if (m2) return `https://drive.google.com/uc?export=view&id=${m2[1]}`;
  if (/https?:\/\/www\.dropbox\.com\//i.test(s)) {
    return s.replace(/\?dl=0$/,'?raw=1').replace(/\?dl=1$/,'?raw=1');
  }
  if (s.startsWith('http://')) return 'https://' + s.slice(7);
  return s;
};

const normalizeCategory = (c) => {
  const n = norm(c);
  if (/feed/.test(n)) return "Feeding";
  if (/out/i.test(n) || /travel|mobility/.test(n)) return "Outing";
  if (/oral|teeth|teether/.test(n)) return "Oral";
  if (/hyg|clean|wipe/.test(n)) return "Hygiene";
  return c || "";
};
const normalizeType = (t) => {
  const n = norm(t);
  if (n.startsWith("main")) return "Main";
  if (n.startsWith("acc")) return "Acc.";
  return t || "";
};
const normalizeMaterial = (m) => {
  const n = norm(m);
  if (/ppsu|plastic/.test(n)) return "PPSU";
  if (/sil/.test(n)) return "Silicone";
  if (/glass|gls/.test(n)) return "Glass";
  return m || "";
};
const priceBandToRange = (band) => {
  switch (band) {
    case 1: return [0, 5];
    case 2: return [5, 10];
    case 3: return [10, 15];
    case 4: return [15, 20];
    case 5: return [20, Infinity];
    default: return undefined;
  }
};
const categoryFromQ12 = (c) => ({1:"Feeding",2:"Outing",3:"Oral",4:"Hygiene"}[c]);
const capacityByAge = (ageStage) => {
  switch (ageStage) { case 1: return 170; case 2: return 170; default: return 270; }
};

/* ===== display helpers ===== */
const pickFirst = (row, keys) => {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== "") {
      return row[k];
    }
  }
  return "";
};

// 통화기호·천단위 제거 후 안전 파싱
const parsePrice = (v) => {
  if (v === null || v === undefined) return 0;
  let t = String(v).trim();
  if (!t) return 0;
  t = t.replace(/[^0-9.,-]/g, "");
  if (t.includes(",") && t.includes(".")) {
    if (t.lastIndexOf(".") > t.lastIndexOf(",")) {
      t = t.replace(/,/g, "");
    } else {
      t = t.replace(/\./g, "").replace(",", ".");
    }
  } else {
    t = t.replace(/,/g, "");
  }
  const n = parseFloat(t);
  return isNaN(n) ? 0 : n;
};

// 이름 선택
const getDisplayName = (row, lang) => {
  const NameKH = pickFirst(row, ["Name(KH.)","Name (KH.)","NameKH","KH Name","Khmer Name","Name"]);
  const NameEN = pickFirst(row, ["Name(EN.)","Name (EN.)","NameEN","EN Name","English Name"]);
  if (lang === "km") return String(NameKH || NameEN || row.Name || "").trim();
  return String(NameEN || NameKH || row.Name || "").trim();
};

// 용량·수량 표기
const fmtSizeQty = (row) => {
  const size = pickFirst(row, ["Size","size","Volume","Capacity"]);
  const qty  = pickFirst(row, ["Quantity","Qty","qty","Pack"]);
  const a = (size!=="" && size!==null) ? String(size).trim() : "";
  const b = (qty!==""  && qty!==null)  ? `x${String(qty).trim()}` : "";
  if (a && b) return `${a} • ${b}`;
  return a || b || "";
};

/* ========== 이미지 폴백 컴포넌트 ========== */
const FallbackImg = ({ sources, alt }) => {
  const [idx, setIdx] = useState(0);
  const src = sources[idx] || "";
  if (!src) return <div className="imgframe"><span className="muted">No image</span></div>;
  return (
    <div>
      <div className="imgframe">
        <img
          src={src}
          alt={alt || "image"}
          onError={() => setIdx((i) => i + 1)}
        />
      </div>
      <div className="imgdebug">
        <a href={src} target="_blank" rel="noreferrer">open</a>
        {sources.length > 1 ? ` · trying ${idx+1}/${sources.length}` : ""}
      </div>
    </div>
  );
};

/* ========== Invoice / Promotion ========== */
function computeInvoice(lines) {
  let subtotal = 0;
  const freeLines = [];
  const details = [];
  const byBc = new Map();
  lines.forEach(l=>{
    const prev = byBc.get(l.Barcode);
    if (prev) prev.qty += l.qty; else byBc.set(l.Barcode, {...l});
  });
  byBc.forEach(line=>{
    let linePrice = (line.RetailPrice||0) * line.qty;
    if (line.PromotionType === "Discount" && line.DiscountRate) {
      const disc = linePrice * line.DiscountRate;
      linePrice -= disc;
      details.push({name: line.Name, note: `Discount ${(line.DiscountRate*100).toFixed(0)}% applied (-$${disc.toFixed(2)})`});
    }
    subtotal += linePrice;
  });
  byBc.forEach(line=>{
    if (line.PromotionType === "Free" && line.PromotionBarcode && line.PromotionQuantity && line.FreeQuantity) {
      const threshold = Math.floor(line.qty / line.PromotionQuantity);
      const toGive = threshold * line.FreeQuantity;
      if (threshold > 0 && toGive > 0) {
        details.push({name: line.Name, note: `Promo: Buy ${line.PromotionQuantity} get ${line.FreeQuantity} free (Barcode ${line.PromotionBarcode})`});
        freeLines.push({
          Barcode: line.PromotionBarcode,
          Name: `FREE ITEM (${line.PromotionBarcode})`,
          Category: line.Category, Type: "Acc.", RetailPrice: 0, qty: toGive
        });
      }
    }
  });
  return { lines: [...byBc.values(), ...freeLines], subtotal, total: subtotal, details };
}

/* ===== Recommendation: group-by-main ===== */
function recommend(ans, products) {
  const norm = (s) => String(s || "").trim().toLowerCase();
  const normBC = (s) => String(s || "").replace(/[^0-9A-Za-z]/g, "").toUpperCase();

  const parseAccList = (row) => {
    if (Array.isArray(row?._acc_barcodes_norm) && row._acc_barcodes_norm.length) {
      return row._acc_barcodes_norm.map(normBC).filter(Boolean);
    }
    const raw = row?.["Acc. Barcode"] ?? row?.AccBarcode ?? row?.["Acc Barcode"] ?? "";
    retur
