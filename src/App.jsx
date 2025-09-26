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
    .empty{padding:16px;border:1px dashed #cbd5e1;border-radius:12px;background:#f8fafc;text-align:center}
    .imgdebug{font-size:11px;color:#64748b;margin-top:4px}
    .imgdebug a{color:#5b8def;text-decoration:underline}
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
      "ទារកទើបកើត (0–2 ខែ)","ទារកដំបូង (3–6 ខែ)","ទារកកណ្ដាល (7–12 ខែ)",
      "ក្មេងដើរដើម (13–24 ខែ)","ក្មេងដើរចុង (25–36 ខែ)","លើស 36 ខែ"
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
    q14_ppsu: "ប្លាស្ទិក (PPSU)", q14_sil: "ស៊ីលីខុន", q14_gls: "កញ្ចក់",
    q15_title: "ចន្លោះតម្លៃដែលចង់បាន (តម្លៃឯកត្តា)",
    price_1: "ក្រោម $5", price_2: "$5~$10", price_3: "$10~$15",
    price_4: "$15~$20", price_5: "លើស $20",
    q16_title: "រចនាក្រុមផលិតផល (multi-select)",
    q17_title: "ក្រុមផលិតផល តម្លៃ និងប្រូម៉ូសិន",
    reviewTitle: "ពិនិត្យចម្លើយរបស់អ្នកឡើងវិញ",
    recsTitle: "លទ្ធផលណែនាំផលិតផល",
    selectProducts: "ជ្រើសរើសផលិតផល",
    selectedCount: (n)=>`បានជ្រើស ${n} ធាតុ`,
    invoiceTitle: "វិក័យប័ត្រ",
    invoiceNote: "តម្លៃគិតជាដុល្លារ សម្រាប់ឧត្តមគតិ (VAT/អត្រាប្តូរ បន្ថែមបានពេលក្រោយ)"
  },
  en: {
    appTitle: "Moyuum Product Recommender (Khmer/English)",
    next: "Next", back: "Back", review: "Review",
    reviseAnswers: "Revise selected questions",
    proceedToRecs: "Proceed to Recommendations",
    toInvoice: "Proceed to Invoice",
    exportInvoice: "Export Invoice as Image",
    language: "Language", khmer: "Khmer", english: "English",
    q1_title: "Purpose of using this program",
    q1_purpose_1: "Finding baby products for your own baby",
    q1_purpose_2: "Finding baby products for gifting",
    q11_title: "Please select baby age (months)",
    q11_options: [
      "0–2 months (Newborn)","3–6 months (Early infancy)","7–12 months (Middle infancy)",
      "13–24 months (Early toddlerhood)","25–36 months (Late toddlerhood)","Over 36 months"
    ],
    q12_title: "Situation/Purpose",
    q12_1: "Need feeding-related products",
    q12_2: "Convenience for outings/mobility",
    q12_3: "Oral development & comfort",
    q12_4: "Hygiene/cleanliness management",
    q13_title: "Primary selection factors",
    q13_1: "Material quality & safety", q13_2: "Price",
    q13_3: "Design", q13_4: "Ease of use", q13_5: "Ease of maintenance",
    q14_title: "Preferred material",
    q14_ppsu: "Plastic (PPSU)", q14_sil: "Silicone", q14_gls: "Glass",
    q15_title: "Desired unit price",
    price_1: "Under $5", price_2: "$5~$10", price_3: "$10~$15",
    price_4: "$15~$20", price_5: "Over $20",
    q16_title: "Product group designs (multi-select)",
    q17_title: "Product group, price & promotion",
    reviewTitle: "Review Your Answers",
    recsTitle: "Recommended Products",
    selectProducts: "Select Products",
    selectedCount: (n)=>`${n} selected`,
    invoiceTitle: "Invoice",
    invoiceNote: "Prices in USD for demo; VAT/exchange can be added later."
  }
};

/* ========== helpers: normalize & mapping ========== */
const splitBarcodes = (csv) => !csv ? [] : String(csv).split(/,\s*/).map(s=>s.trim()).filter(Boolean);
const norm = (s) => String(s||"").trim().toLowerCase();

const normalizeImageUrl = (u) => {
  if (!u) return "";
  const s = String(u).trim();
  const m1 = s.match(/https?:\/\/drive\.google\.com\/file\/d\/([^/]+)\/view/i);
  if (m1) return `https://drive.google.com/uc?export=view&id=${m1[1]}`;
  const m2 = s.match(/https?:\/\/drive\.google\.com\/open\?id=([^&]+)/i);
  if (m2) return `https://drive.google.com/uc?export=view&id=${m2[1]}`;
  if (/https?:\/\/www\.dropbox\.com\//i.test(s)) return s.replace(/\?dl=0$/,'?raw=1').replace(/\?dl=1$/,'?raw=1');
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
const priceBandToRange = (band) =>
  band===1?[0,5]:band===2?[5,10]:band===3?[10,15]:band===4?[15,20]:band===5?[20,Infinity]:undefined;
const categoryFromQ12 = (c) => ({1:"Feeding",2:"Outing",3:"Oral",4:"Hygiene"}[c]);
const capacityByAge = (ageStage) => (ageStage<=2?170:270);

/* ===== display helpers ===== */
const pickFirst = (row, keys) => {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== "") return row[k];
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
    if (t.lastIndexOf(".") > t.lastIndexOf(",")) t = t.replace(/,/g, "");
    else t = t.replace(/\./g, "").replace(",", ".");
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
  return lang === "km"
    ? String(NameKH || NameEN || row.Name || "").trim()
    : String(NameEN || NameKH || row.Name || "").trim();
};

// 용량·수량 표기
const fmtSizeQty = (row) => {
  const size = pickFirst(row, ["Size","size","Volume","Capacity"]);
  const qty  = pickFirst(row, ["Quantity","Qty","qty","Pack"]);
  const a = size ? String(size).trim() : "";
  const b = qty  ? `x${String(qty).trim()}` : "";
  return a && b ? `${a} • ${b}` : (a || b || "");
};

/* ========== 이미지 폴백 컴포넌트 ========== */
const FallbackImg = ({ sources, alt }) => {
  const [idx, setIdx] = useState(0);
  const src = sources[idx] || "";
  if (!src) return <div className="imgframe"><span className="muted">No image</span></div>;
  return (
    <div>
      <div className="imgframe">
        <img src={src} alt={alt || "image"} onError={()=>setIdx(i=>i+1)} />
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
        freeLines.push({ Barcode: line.PromotionBarcode, Name: `FREE ITEM (${line.PromotionBarcode})`,
          Category: line.Category, Type: "Acc.", RetailPrice: 0, qty: toGive });
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
    if (Array.isArray(row?._acc_barcodes_norm) && row._acc_barcodes_norm.length)
      return row._acc_barcodes_norm.map(normBC).filter(Boolean);
    const raw = row?.["Acc. Barcode"] ?? row?.AccBarcode ?? row?.["Acc Barcode"] ?? "";
    return String(raw).split(/,\s*/).map(normBC).filter(Boolean);
  };

  const isNipple = (p) => {
    const name = norm(p?.Name);
    const rawCat = String(p?.Category || "");
    return ( /nipple|teat|젖꼭지|노즐/i.test(name) || /ទំពារ|មួកបំបៅ|ចំពុះ/i.test(name) ) && /bottle/i.test(rawCat);
  };

  const uniqByBC = (arr) => {
    const seen = new Set(), out = [];
    for (const x of arr) {
      const bc = normBC(x?._barcode_norm || x?.Barcode);
      if (!bc || seen.has(bc)) continue;
      seen.add(bc); out.push(x);
    }
    return out;
  };

  const mainsAll = products.filter(p => normalizeType(p.Type || p["Main/Acc. Item"]) === "Main");
  const accsAll  = products.filter(p => normalizeType(p.Type || p["Main/Acc. Item"]) === "Acc.");

  const surveyCat = categoryFromQ12(ans.category);
  let mainsPool = [...mainsAll];
  if (surveyCat) {
    const within = mainsPool.filter(p => normalizeCategory(p.Category) === surveyCat);
    if (within.length) mainsPool = within;
  }
  const accsPool = [...accsAll];

  const targetMat = ans.material ? normalizeMaterial(ans.material) : null;
  const sameMatAll  = targetMat ? mainsPool.filter(m => normalizeMaterial(m.Material) === targetMat) : [...mainsPool];
  const otherMatAll = targetMat ? mainsPool.filter(m => normalizeMaterial(m.Material) !== targetMat) : [];

  const targetVol = capacityByAge(ans.ageStage);
  const byVol = (a, b) => {
    if (!targetVol) return 0;
    const av = typeof a.Volume === "number" ? a.Volume : targetVol;
    const bv = typeof b.Volume === "number" ? b.Volume : targetVol;
    return Math.abs(av - targetVol) - Math.abs(bv - targetVol);
  };
  sameMatAll.sort(byVol); otherMatAll.sort(byVol);

  const range = priceBandToRange(ans.priceBand);
  const inBand = range ? (p)=> (p.RetailPrice||0)>=range[0] && (p.RetailPrice||0)<range[1] : ()=>true;

  const sameUse  = range ? sameMatAll.filter(inBand)  : sameMatAll;
  const otherUse = range ? otherMatAll.filter(inBand) : otherMatAll;

  const sameMains  = sameUse.length  ? sameUse  : sameMatAll;
  const otherMains = otherUse.length ? otherUse : otherMatAll;

  const usedAcc = new Set();
  const groupOneMain = (m) => {
    const key = normBC(m._barcode_norm || m.Barcode);
    const nipples = accsPool.filter(a =>
      !usedAcc.has(normBC(a._barcode_norm || a.Barcode)) &&
      isNipple(a) && parseAccList(a).includes(key)
    );
    nipples.forEach(n => usedAcc.add(normBC(n._barcode_norm || n.Barcode)));

    const others  = accsPool.filter(a =>
      !usedAcc.has(normBC(a._barcode_norm || a.Barcode)) &&
      !isNipple(a) && parseAccList(a).includes(key)
    );
    others.forEach(o => usedAcc.add(normBC(o._barcode_norm || o.Barcode)));

    return [m, ...nipples, ...others];
  };

  let ordered = [];
  for (const m of sameMains)  ordered.push(...groupOneMain(m));
  for (const m of otherMains) ordered.push(...groupOneMain(m));

  const remainingAcc = accsPool.filter(a => !usedAcc.has(normBC(a._barcode_norm || a.Barcode)));
  ordered = uniqByBC([...ordered, ...remainingAcc]);
  return ordered;
}

/* ========== App ========== */
export default function App() {
  const [lang, setLang] = useState("km");
  const t = i18n[lang];

  const [step, setStep] = useState("q1");
  const [ans, setAns] = useState({});
  const [db, setDb] = useState(null);
  const [selected, setSelected] = useState([]);

  // DB 로딩 & 정규화
  useEffect(()=>{
  const BASE = import.meta.env.BASE_URL;   // ← 추가
  const tryLoad = async () => {
    try {
      const r = await fetch(`${BASE}data/moyuum_products.json`);
      if (!r.ok) throw new Error("fallback");
      return await r.json();
    } catch {
      const r2 = await fetch(`${BASE}data/moyuum_products_by_barcode.json`);
      if (!r2.ok) throw new Error("no db");
      return await r2.json();
    }
  };
     
    tryLoad().then(rows=>{
      const cleaned = rows.map(r=>({
        ...r,
        NameKH: pickFirst(r, ["Name(KH.)","Name (KH.)","NameKH","KH Name","Khmer Name","Name"]),
        NameEN: pickFirst(r, ["Name(EN.)","Name (EN.)","NameEN","EN Name","English Name"]),
        Barcode: String(r.Barcode ?? "").trim(),
        _barcode_norm: r._barcode_norm || String(r.Barcode ?? "").replace(/[^0-9A-Za-z]/g,"").toUpperCase(),
        CategoryRaw: r.Category ?? "",
        Category: normalizeCategory(r.Category),
        Type: normalizeType(r.Type || r["Main/Acc. Item"] || r["Main/Acc.Item"]),
        AccBarcode: r.AccBarcode ?? r["Acc. Barcode"] ?? r["Acc Barcode"] ?? "",
        _acc_barcodes_norm: Array.isArray(r._acc_barcodes_norm) ? r._acc_barcodes_norm
          : splitBarcodes(r["Acc. Barcode"] || r.AccBarcode || r["Acc Barcode"]).map(x=>x.replace(/[^0-9A-Za-z]/g,"").toUpperCase()),
        Material: normalizeMaterial(r.Material),
        Volume: typeof r.Volume === "number" ? r.Volume : Number(r.Volume)||null,
        Size: r.Size ?? r.size ?? r.Volume ?? "",
        Quantity: r.Quantity ?? r.Qty ?? r.qty ?? "",
        // >>> FIX: read "Retail Price ($)" first
        RetailPrice: parsePrice(pickFirst(r, ["Retail Price ($)","RetailPrice","Retail Price","Price(USD)","Price USD","Price"])),
        Image1: normalizeImageUrl(r.Image1 ?? ""),
        Image2: normalizeImageUrl(r.Image2 ?? ""),
        PromotionType: r.PromotionType ?? r["Promotion Type"] ?? "",
        PromotionBarcode: r.PromotionBarcode ?? r["Promotion Barcode"] ?? "",
        PromotionQuantity: r.PromotionQuantity ? Number(r.PromotionQuantity) : (r["Promotion Quantity"] ? Number(r["Promotion Quantity"]) : null),
        FreeQuantity: r.FreeQuantity ? Number(r.FreeQuantity) : (r["Free Quantity"] ? Number(r["Free Quantity"]) : null),
        DiscountRate: r.DiscountRate ? Number(r.DiscountRate) : (r["Discount Rate"] ? Number(r["Discount Rate"]) : null),
      }));
      setDb(cleaned);
    }).catch(()=> setDb([]));
  },[]);

  const recs = useMemo(()=> db ? recommend(ans, db) : [], [ans, db]);
  const invoiceRef = useRef(null);

  // cart ops
  const addSel = (p) => setSelected(prev=>{
    const i = prev.findIndex(s=>s.Barcode===p.Barcode);
    if (i>=0) { const c=[...prev]; c[i] = {...c[i], qty:c[i].qty+1}; return c; }
    return [...prev, {...p, qty:1}];
  });
  const decSel = (bc) => setSelected(prev=>prev.map(s=>s.Barcode===bc? {...s, qty: Math.max(1, s.qty-1)}: s));
  const rmSel  = (bc) => setSelected(prev=>prev.filter(s=>s.Barcode!==bc));

  const invoice = useMemo(()=> computeInvoice(selected), [selected]);

  const doExportImage = async () => {
    const html2canvas = (await import("html2canvas")).default;
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current);
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url; a.download = "moyuum-invoice.png"; a.click();
  };

  const Price = ({v}) => <span className="price">${Number(v||0).toFixed(2)}</span>;

  const ageText = (ans.ageStage ? i18n[lang].q11_options[ans.ageStage-1] : "-");
  const categoryText = (ans.category ? t[`q12_${ans.category}`] : "-");
  const priceText = (ans.priceBand ? t[`price_${ans.priceBand}`] : "-");

  return (
    <div className="wrap">
      <GlobalStyles/>
      <div className="topbar">
        <span className="muted">{t.language}:</span>
        <button className={`langbtn ${lang==='km'?'active':''}`} onClick={()=>setLang('km')}>{t.khmer}</button>
        <button className={`langbtn ${lang==='en'?'active':''}`} onClick={()=>setLang('en')}>{t.english}</button>
      </div>

      <div className="card">
        <h1>{t.appTitle}</h1>
        <div className="muted">Bilingual survey → <b>review (confirm/edit)</b> → recommendations → cart → invoice (PNG export).</div>
      </div>

      {/* Q1 */}
      {step === "q1" && (
        <div className="card">
          <h2>{t.q1_title}</h2>
          <div className="grid">
            <div className={`opt ${ans.purpose===1?'selected':''}`} onClick={()=>setAns({...ans, purpose:1})}>{t.q1_purpose_1}</div>
            <div className={`opt ${ans.purpose===2?'selected':''}`} onClick={()=>setAns({...ans, purpose:2})}>{t.q1_purpose_2}</div>
          </div>
          <div className="row" style={{marginTop:12}}>
            <button className="btn" onClick={()=> setStep("q11_17")} disabled={!ans.purpose}>{t.next}</button>
          </div>
        </div>
      )}

      {/* Q1 → 1-1 ~ 1-7 */}
      {step === "q11_17" && (
        <div className="card">
          <h2>Q1 → 1-1 ~ 1-7</h2>

          {/* 1-1 */}
          <div className="q">1-1) {t.q11_title}</div>
          <div className="grid">
            {t.q11_options.map((label, idx) => (
              <div key={idx} className={`opt ${ans.ageStage === (idx+1) ? 'selected' : ''}`}
                   onClick={() => setAns({ ...ans, ageStage: (idx + 1) })}>
                {label}
              </div>
            ))}
          </div>

          {/* 1-2 */}
          <div className="q">1-2) {t.q12_title}</div>
          <div className="grid">
            {[1,2,3,4].map(k => (
              <div key={k} className={`opt ${ans.category===k?'selected':''}`}
                   onClick={()=>setAns({...ans, category:k})}>
                {t[`q12_${k}`]}
              </div>
            ))}
          </div>

          {/* 1-3 */}
          <div className="q">1-3) {t.q13_title}</div>
          <div className="grid">
            {[1,2,3,4,5].map(k => (
              <div key={k} className={`opt ${ans.factor===k?'selected':''}`}
                   onClick={()=>setAns({...ans, factor:k})}>
                {t[`q13_${k}`]}
              </div>
            ))}
          </div>

          {/* 1-4 */}
          <div className="q">1-4) {t.q14_title}</div>
          <div className="grid">
            {[{k:"PPSU", label:t.q14_ppsu},{k:"Silicone", label:t.q14_sil},{k:"Glass", label:t.q14_gls}].map(o => (
              <div key={o.k} className={`opt ${ans.material===o.k?'selected':''}`}
                   onClick={()=>setAns({...ans, material:o.k})}>{o.label}</div>
            ))}
          </div>

          {/* 1-5 */}
          <div className="q">1-5) {t.q15_title}</div>
          <div className="grid">
            {[1,2,3,4,5].map(k => (
              <div key={k} className={`opt ${ans.priceBand===k?'selected':''}`}
                   onClick={()=>setAns({...ans, priceBand:k})}>
                {t[`price_${k}`]}
              </div>
            ))}
          </div>

          <div className="row" style={{marginTop:12, justifyContent:'space-between'}}>
            <button className="btn ghost" onClick={()=> setStep("q1")}>{t.back}</button>
            <button className="btn" onClick={()=> setStep("review")}
                    disabled={!ans.ageStage||!ans.category||!ans.material||!ans.priceBand}>
              {t.review}
            </button>
          </div>
        </div>
      )}

      {/* REVIEW */}
      {step === "review" && (
        <div className="card">
          <h2>{t.reviewTitle}</h2>

          <div className="summaryGrid">
            <div className="summaryItem"><b>Q1</b><br/>{ans.purpose===1? t.q1_purpose_1 : ans.purpose===2? t.q1_purpose_2 : '-' }<br/>
              <button className="btn ghost" onClick={()=>setStep("q11_17")} style={{marginTop:8}}>Edit</button></div>
            <div className="summaryItem"><b>1-1</b><br/>{ans.ageStage ? i18n[lang].q11_options[ans.ageStage-1] : '-'}<br/>
              <button className="btn ghost" onClick={()=>setStep("q11_17")} style={{marginTop:8}}>Edit</button></div>
            <div className="summaryItem"><b>1-2</b><br/>{ans.category ? t[`q12_${ans.category}`] : '-'}<br/>
              <button className="btn ghost" onClick={()=>setStep("q11_17")} style={{marginTop:8}}>Edit</button></div>
            <div className="summaryItem"><b>1-3</b><br/>{ans.factor ? t[`q13_${ans.factor}`] : '-'}<br/>
              <button className="btn ghost" onClick={()=>setStep("q11_17")} style={{marginTop:8}}>Edit</button></div>
            <div className="summaryItem"><b>1-4</b><br/>{ans.material ?? '-'}<br/>
              <button className="btn ghost" onClick={()=>setStep("q11_17")} style={{marginTop:8}}>Edit</button></div>
            <div className="summaryItem"><b>1-5</b><br/>{ans.priceBand ? t[`price_${ans.priceBand}`] : '-'}<br/>
              <button className="btn ghost" onClick={()=>setStep("q11_17")} style={{marginTop:8}}>Edit</button></div>
          </div>

          <div className="row" style={{marginTop:16, justifyContent:'space-between'}}>
            <button className="btn ghost" onClick={()=> setStep("q11_17")}>{t.back}</button>
            <button className="btn" onClick={()=> setStep("recs")}>{t.proceedToRecs}</button>
          </div>
        </div>
      )}

      {/* RECOMMENDATIONS */}
      {step === "recs" && (
        <div className="card">
          <h2>{t.recsTitle}</h2>
          <div className="muted">{t.selectProducts} · <span className="pill">{i18n[lang].selectedCount(selected.length)}</span></div>

          <div className="card" style={{marginTop:12}}>
            <div className="summaryGrid">
              <div className="summaryItem"><b>1-1</b><br/>{ageText}</div>
              <div className="summaryItem"><b>1-2</b><br/>{categoryText}</div>
              <div className="summaryItem"><b>1-4</b><br/>{ans.material ?? '-'}</div>
              <div className="summaryItem"><b>1-5</b><br/>{priceText}</div>
            </div>
            <div className="row" style={{marginTop:8, justifyContent:'flex-end'}}>
              <button className="btn ghost" onClick={()=> setStep("review")}>{t.reviseAnswers}</button>
            </div>
          </div>

          {!db && <div className="muted" style={{marginTop:8}}>Loading product database…</div>}

          <div className="grid" style={{marginTop:12}}>
            {recs.map(p => {
              const local1 = `${import.meta.env.BASE_URL}images/${p.Barcode}_1.jpg` : "";
              const local2 = `${import.meta.env.BASE_URL}images/${p.Barcode}_2.jpg` : "";
              const srcs1 = [p.Image1, local1].filter(Boolean);
              const srcs2 = [p.Image2, local2].filter(Boolean);

              const title = getDisplayName(p, lang);
              const szq   = fmtSizeQty(p);

              return (
                <div className="opt" key={p.Barcode}>
                  <div className="row" style={{justifyContent:'space-between', alignItems:'baseline'}}>
                    <strong style={{lineHeight:1.2}}>{title || p.Name}</strong>
                    <span className="badge">{p.Type}</span>
                  </div>
                  <div className="muted">{p.Category} · {p.Material || '—'}{szq ? ` · ${szq}` : ""}</div>
                  <div className="imgpair" style={{marginTop:8}}>
                    <FallbackImg sources={srcs1} alt="Image1"/>
                    <FallbackImg sources={srcs2} alt="Image2"/>
                  </div>
                  <div className="row" style={{marginTop:8, justifyContent:'space-between', alignItems:'center'}}>
                    <div><Price v={p.RetailPrice}/></div>
                    <div className="row">
                      <button className="btn" onClick={()=> addSel(p)}>+ Add</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!!selected.length && (
            <div className="card" style={{marginTop:12}}>
              <h2>Cart</h2>
              <table className="table">
                <thead>
                  <tr><th>Product</th><th>Qty</th><th>Unit</th><th>Total</th><th/></tr>
                </thead>
                <tbody>
                  {selected.map(s => (
                    <tr key={s.Barcode}>
                      <td>{getDisplayName(s, lang) || s.Name}</td>
                      <td className="row">
                        <button className="btn ghost" onClick={()=> decSel(s.Barcode)}>-</button>
                        <span style={{minWidth:28,textAlign:'center'}}>{s.qty}</span>
                        <button className="btn ghost" onClick={()=> addSel(s)}>+</button>
                      </td>
                      <td><Price v={s.RetailPrice}/></td>
                      <td><Price v={(s.RetailPrice||0) * s.qty}/></td>
                      <td><button className="btn mute" onClick={()=> rmSel(s.Barcode)}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
                <button className="btn ghost" onClick={()=> setStep("review")}>{t.reviseAnswers}</button>
                <button className="btn" onClick={()=> setStep("invoice")}>{t.toInvoice}</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* INVOICE */}
      {step === "invoice" && (
        <div className="card">
          <div ref={invoiceRef} className="invoice">
            <h2>{t.invoiceTitle}</h2>
            <table className="table">
              <thead>
                <tr><th>Barcode</th><th>Product</th><th>Qty</th><th>Unit</th><th>Line</th></tr>
              </thead>
              <tbody>
                {invoice.lines.map((l, idx) => (
                  <tr key={idx}>
                    <td>{l.Barcode}</td>
                    <td>{getDisplayName(l, lang) || l.Name}</td>
                    <td>{l.qty}</td>
                    <td><Price v={l.RetailPrice}/></td>
                    <td><Price v={(l.RetailPrice||0) * l.qty}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="row" style={{justifyContent:'flex-end', gap:24, marginTop:8}}>
              <div>Subtotal: <strong><Price v={invoice.subtotal}/></strong></div>
              <div>Total: <strong><Price v={invoice.total}/></strong></div>
            </div>
            {invoice.details.length>0 && (
              <div style={{marginTop:8}}>
                <div className="caption">Promotion Details</div>
                <ul>
                  {invoice.details.map((d,i)=>(<li key={i}>{d.name}: {d.note}</li>))}
                </ul>
              </div>
            )}
            <div className="muted" style={{marginTop:6}}>{t.invoiceNote}</div>
          </div>

          <div className="row" style={{marginTop:12, justifyContent:'space-between'}}>
            <button className="btn ghost" onClick={()=> setStep("recs")}>{t.back}</button>
            <button className="btn" onClick={doExportImage}>{t.exportInvoice}</button>
          </div>
        </div>
      )}
    </div>
  );
}
