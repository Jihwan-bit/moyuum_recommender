import React, { useEffect, useMemo, useRef, useState } from "react";

/* =========================
   Pastel UI (no Tailwind)
   ========================= */
const GlobalStyles = () => (
  <style>{`
    :root{
      --bg:#f7f9ff;--card:#ffffff;--text:#0f172a;--muted:#64748b;
      --brand:#7aa7ff;--ring:rgba(122,167,255,.25);--ring2:rgba(122,167,255,.15);
      --shadow:0 6px 24px rgba(15,23,42,.06);--shadow-sm:0 2px 10px rgba(15,23,42,.05);
    }
    *{box-sizing:border-box;font-family:Inter,"Noto Sans Khmer",system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial}
    body{margin:0;color:var(--text);
      background:radial-gradient(1200px 600px at -10% -10%,#e9f3ff 0%,transparent 60%),
                 radial-gradient(900px 500px at 110% 0%,#f7fff9 0%,transparent 55%),#f7f9ff;}
    .wrap{max-width:1120px;margin:28px auto;padding:16px}
    .topbar{display:flex;gap:12px;justify-content:flex-end;align-items:center;margin-bottom:12px}
    .langbtn{border:2px solid #dbe4ff;background:#fff;padding:7px 12px;border-radius:999px;cursor:pointer}
    .langbtn:hover{box-shadow:0 0 0 3px var(--ring2);border-color:var(--brand)}
    .langbtn.active{border-color:var(--brand);color:#2a5fd6;font-weight:700;box-shadow:0 0 0 3px var(--ring2)}
    .card{background:var(--card);border:1px solid #e6ecff;border-radius:16px;padding:20px;box-shadow:var(--shadow);margin-bottom:18px}
    h1{font-size:24px;margin:4px 0 12px} h2{font-size:19px;margin:0 0 10px}
    .muted{color:var(--muted);font-size:12px}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
    .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
    .pill{display:inline-block;padding:4px 10px;border-radius:999px;background:#eef2ff;border:1px solid #c7d2fe;color:#3730a3;font-size:12px}
    .table{width:100%;border-collapse:collapse}
    .table th,.table td{border-bottom:1px solid #edf2ff;padding:10px;text-align:left}
    .price{font-variant-numeric:tabular-nums}
    .imgpair{display:flex;gap:10px}
    .imgframe{width:92px;height:92px;border:1px solid #edf2ff;border-radius:12px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#fff}
    .imgframe img{width:100%;height:100%;object-fit:cover}
    .badge{font-size:12px;background:#ecfeff;border:1px solid #a5f3fc;color:#065f46;padding:3px 8px;border-radius:999px}
    .summaryGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px}
    .summaryItem{background:#f4f7ff;border:1px solid #e6ecff;border-radius:12px;padding:12px}
    .invoice{background:#f8fbff;border:1px dashed #cbd5e1;border-radius:16px;padding:16px}
    .caption{font-size:12px;color:#64748b}

    .opt{
      display:flex;align-items:center;justify-content:center;text-align:center;min-height:78px;
      background:#fff;border:2px solid #e7ecff;border-radius:14px;box-shadow:var(--shadow-sm);
      padding:16px;cursor:pointer;transition:border-color .15s, box-shadow .15s, transform .05s, background-color .15s;
    }
    .opt:hover{border-color:var(--brand);box-shadow:0 0 0 4px var(--ring2);background:linear-gradient(0deg,#f5f9ff,#fff)}
    .opt.selected{border-color:var(--brand);box-shadow:0 0 0 6px var(--ring)}
    .q{margin:24px 0 10px;font-weight:700}

    .btn{background:var(--brand);color:#fff;border:2px solid var(--brand);border-radius:14px;padding:12px 18px;cursor:pointer;box-shadow:var(--shadow-sm)}
    .btn:hover{filter:brightness(1.05);box-shadow:0 0 0 4px var(--ring2)}
    .btn.ghost{background:#fff;color:#2a5fd6;border:2px solid var(--brand)}
    .btn.mute{background:#eef2ff;color:#111;border:2px solid #eef2ff}
    .actions{display:flex;gap:12px;align-items:center;justify-content:center;margin-top:14px}
    .wide{min-width:220px;font-weight:700}

    /* contact QR same height */
    .qrWrap{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:10px}
    .qrCard{background:#fff;border:1px solid #e6ecff;border-radius:14px;padding:14px;box-shadow:var(--shadow-sm);text-align:center}
    .qrImgBox{height:220px;display:flex;align-items:center;justify-content:center;overflow:hidden}
    .qrImgBox img{height:100%;width:auto;object-fit:contain}
  `}</style>
);

/* ===== i18n ===== (생략 없이 유지) */
const i18n = {
  km: {
    appTitle: "កម្មវិធីណែនាំផលិតផល Moyuum (Khmer/English)",
    next: "បន្ត", back: "ថយក្រោយ", review: "ពិនិត្យឡើងវិញ",
    reviseAnswers: "កែតម្រូវចម្លើយ", proceedToRecs: "បន្តទៅការណែនាំផលិតផល",
    toInvoice: "បន្តទៅវិក័យប័ត្រ", exportInvoice: "ទាញយកវិក័យប័ត្រជារូបភាព",
    toContact: "បន្តទៅទំនាក់ទំនង",
    language: "ភាសា", khmer: "ខ្មែរ", english: "English",
    q1_title: "គោលបំណងប្រើកម្មវិធី",
    q1_purpose_1: "ស្វែងរកផលិតផលសមស្របសម្រាប់កូនផ្ទាល់",
    q1_purpose_2: "ស្វែងរកផលិតផលសមស្របសម្រាប់ផ្តល់ជាអំណោយ",
    q11_title: "សូមជ្រើសរើសអាយុកូន (ខែ)",
    q11_options: ["ទារកទើបកើត (0–2 ខែ)","ទារកដំបូង (3–6 ខែ)","ទារកកណ្ដាល (7–12 ខែ)","ក្មេងដើរដើម (13–24 ខែ)","ក្មេងដើរចុង (25–36 ខែ)","លើស 36 ខែ"],
    q12_title: "ស្ថានភាព/គោលបំណង",
    q12_1: "ត្រូវការផលិតផលទាក់ទងការបំបៅ",
    q12_2: "ស្វែងរកផលិតផលសម្រួលពេលចេញក្រៅ/ធ្វើដំណើរ",
    q12_3: "ត្រូវការផលិតផលជួយអភិវឌ្ឍមាត់ និងផ្តល់ផាសុកភាព",
    q12_4: "ស្វែងរកផលិតផលជួយគ្រប់គ្រងអនាម័យ/សម្អាត",
    q13_title: "កត្តាដែលពិចារណាចម្បងពេលជ្រើសផលិតផល",
    q13_1: "គុណភាព និងសុវត្ថិភាពសម្ភារៈ", q13_2: "តម្លៃ", q13_3: "រចនាប័ទ្ម", q13_4: "ងាយស្រួលប្រើ", q13_5: "ងាយស្រួលថែទាំ",
    q14_title: "សម្ភារៈដែលចូលចិត្ត", q14_ppsu: "ប្លាស្ទិក (PPSU)", q14_sil: "ស៊ីលីខុន", q14_gls: "កញ្ចក់",
    q15_title: "ចន្លោះតម្លៃដែលចង់បាន (តម្លៃឯកត្តា)",
    price_1: "ក្រោម $5", price_2: "$5~$10", price_3: "$10~$15", price_4: "$15~$20", price_5: "លើស $20",
    reviewTitle: "ពិនិត្យចម្លើយរបស់អ្នកឡើងវិញ",
    recsTitle: "លទ្ធផលណែនាំផលិតផល",
    selectProducts: "ជ្រើសរើសផលិតផល",
    selectedCount: (n)=>`បានជ្រើស ${n} ធាតុ`,
    invoiceTitle: "វិក័យប័ត្រ",
    invoiceNote: "តម្លៃគិតជាដុល្លារ សម្រាប់ឧត្តមគតិ (VAT/អត្រាប្តូរ បន្ថែមបានពេលក្រោយ)",
    thanks: "សូមអរគុណ!", thanksSub: "បើអ្នកមានសំណួរ សូមទាក់ទងតាមបណ្តាញខាងក្រោម។"
  },
  en: {
    appTitle: "Moyuum Product Recommender (Khmer/English)",
    next: "Next", back: "Back", review: "Review",
    reviseAnswers: "Revise selected questions", proceedToRecs: "Proceed to Recommendations",
    toInvoice: "Proceed to Invoice", exportInvoice: "Export Invoice as Image",
    toContact: "Go to Contact",
    language: "Language", khmer: "Khmer", english: "English",
    q1_title: "Purpose of using this program",
    q1_purpose_1: "Finding baby products for your own baby",
    q1_purpose_2: "Finding baby products for gifting",
    q11_title: "Please select baby age (months)",
    q11_options: ["0–2 months (Newborn)","3–6 months (Early infancy)","7–12 months (Middle infancy)","13–24 months (Early toddlerhood)","25–36 months (Late toddlerhood)","Over 36 months"],
    q12_title: "Situation/Purpose",
    q12_1: "Need feeding-related products", q12_2: "Convenience for outings/mobility",
    q12_3: "Oral development & comfort", q12_4: "Hygiene/cleanliness management",
    q13_title: "Primary selection factors",
    q13_1: "Material quality & safety", q13_2: "Price", q13_3: "Design", q13_4: "Ease of use", q13_5: "Ease of maintenance",
    q14_title: "Preferred material", q14_ppsu: "Plastic (PPSU)", q14_sil: "Silicone", q14_gls: "Glass",
    q15_title: "Desired unit price",
    price_1: "Under $5", price_2: "$5~$10", price_3: "$10~$15", price_4: "$15~$20", price_5: "Over $20",
    reviewTitle: "Review Your Answers",
    recsTitle: "Recommended Products",
    selectProducts: "Select Products",
    selectedCount: (n)=>`${n} selected`,
    invoiceTitle: "Invoice",
    invoiceNote: "Prices in USD for demo; VAT/exchange can be added later.",
    thanks: "Thank you!", thanksSub: "If you have any questions, please contact us below."
  }
};

/* helpers (동일) */
const splitBarcodes = (csv)=> csv? String(csv).split(/,\s*/).map(s=>s.trim()).filter(Boolean):[];
const norm = (s)=> String(s||"").trim().toLowerCase();
const normalizeImageUrl = (u)=>{ if(!u) return ""; const s=String(u).trim(); const m1=s.match(/drive\.google\.com\/file\/d\/([^/]+)\/view/i); if(m1) return `https://drive.google.com/uc?export=view&id=${m1[1]}`; const m2=s.match(/drive\.google\.com\/open\?id=([^&]+)/i); if(m2) return `https://drive.google.com/uc?export=view&id=${m2[1]}`; if(/https?:\/\/www\.dropbox\.com\//i.test(s)) return s.replace(/\?dl=0$/,'?raw=1').replace(/\?dl=1$/,'?raw=1'); if(s.startsWith('http://')) return 'https://'+s.slice(7); return s; };
const normalizeCategory=(c)=>{const n=norm(c); if(/feed/.test(n))return"Feeding"; if(/out|travel|mobility/.test(n))return"Outing"; if(/oral|teeth|teether/.test(n))return"Oral"; if(/hyg|clean|wipe/.test(n))return"Hygiene"; return c||"";};
const normalizeType=(t)=>{const n=norm(t); if(n.startsWith("main"))return"Main"; if(n.startsWith("acc"))return"Acc."; return t||"";};
const normalizeMaterial=(m)=>{const n=norm(m); if(/ppsu|plastic/.test(n))return"PPSU"; if(/sil/.test(n))return"Silicone"; if(/glass|gls/.test(n))return"Glass"; return m||"";};
const priceBandToRange=(b)=>({1:[0,5],2:[5,10],3:[10,15],4:[15,20],5:[20,Infinity]}[b]);
const categoryFromQ12=(c)=>({1:"Feeding",2:"Outing",3:"Oral",4:"Hygiene"}[c]);
const capacityByAge=(a)=> (a===1||a===2)?170:270;
const pickFirst=(row,keys)=>{for(const k of keys){if(row[k]!==undefined&&row[k]!==null&&String(row[k]).trim()!=="")return row[k];}return"";};
const parsePrice=(v)=>{if(v===null||v===undefined)return 0;let t=String(v).trim(); if(!t)return 0; t=t.replace(/[^0-9.,-]/g,""); if(t.includes(",")&&t.includes(".")){ if(t.lastIndexOf(".")>t.lastIndexOf(",")) t=t.replace(/,/g,""); else t=t.replace(/\./g,"").replace(",","."); } else t=t.replace(/,/g,""); const n=parseFloat(t); return isNaN(n)?0:n;};
const getDisplayName=(r,lang)=>{const kh=pickFirst(r,["Name(KH.)","Name (KH.)","NameKH","KH Name","Khmer Name","Name"]); const en=pickFirst(r,["Name(EN.)","Name (EN.)","NameEN","EN Name","English Name"]); return (lang==="km"? (kh||en||r.Name||"") : (en||kh||r.Name||"")).trim();};
const fmtSizeQty=(r)=>{const size=pickFirst(r,["Size","size","Volume","Capacity"]); const qty=pickFirst(r,["Quantity","Qty","qty","Pack"]); const a=size!==""&&size!==null?String(size).trim():""; const b=qty!==""&&qty!==null?`x${String(qty).trim()}`:""; return a&&b?`${a} • ${b}`:a||b||"";};

const FallbackImg=({sources,alt})=>{
  const [idx,setIdx]=useState(0);
  const src=sources[idx]||"";
  if(!src) return <div className="imgframe"><span className="muted">No image</span></div>;
  return(<div><div className="imgframe"><img src={src} alt={alt||"image"} onError={()=>setIdx(i=>i+1)}/></div>
    <div className="imgdebug"><a href={src} target="_blank" rel="noreferrer">open</a>{sources.length>1?` · trying ${idx+1}/${sources.length}`:""}</div></div>);
};

/* Invoice / Promotion */
function computeInvoice(lines){
  let subtotal=0; const freeLines=[]; const details=[]; const byBc=new Map();
  lines.forEach(l=>{const prev=byBc.get(l.Barcode); if(prev) prev.qty+=l.qty; else byBc.set(l.Barcode,{...l});});
  byBc.forEach(line=>{
    let linePrice=(line.RetailPrice||0)*line.qty;
    if(line.PromotionType==="Discount"&&line.DiscountRate){const disc=linePrice*line.DiscountRate; linePrice-=disc; details.push({name:line.Name,note:`Discount ${(line.DiscountRate*100).toFixed(0)}% applied (-$${disc.toFixed(2)})`});}
    subtotal+=linePrice;
  });
  byBc.forEach(line=>{
    if(line.PromotionType==="Free"&&line.PromotionBarcode&&line.PromotionQuantity&&line.FreeQuantity){
      const thr=Math.floor(line.qty/line.PromotionQuantity); const toGive=thr*line.FreeQuantity;
      if(thr>0&&toGive>0){details.push({name:line.Name,note:`Promo: Buy ${line.PromotionQuantity} get ${line.FreeQuantity} free (Barcode ${line.PromotionBarcode})`});
        freeLines.push({Barcode:line.PromotionBarcode,Name:`FREE ITEM (${line.PromotionBarcode})`,Category:line.Category,Type:"Acc.",RetailPrice:0,qty:toGive});}
    }
  });
  return {lines:[...byBc.values(),...freeLines], subtotal, total:subtotal, details};
}

/* Recommendation */
function recommend(ans, products) {
  const norm = (s) => String(s || "").trim().toLowerCase();
  const normBC = (s) => String(s || "").replace(/[^0-9A-Za-z]/g, "").toUpperCase();

  const parseAcc = (row) =>
    Array.isArray(row?._acc_barcodes_norm) && row._acc_barcodes_norm.length
      ? row._acc_barcodes_norm.map(normBC).filter(Boolean)
      : String(row?.["Acc. Barcode"] ?? row?.AccBarcode ?? row?.["Acc Barcode"] ?? "")
          .split(/,\s*/)
          .map(normBC)
          .filter(Boolean);

  // ---------- 타입 판별 도우미 ----------
  const isNipple = (p) =>
    (/nipple|teat|젖꼭지|노즐/i.test(String(p?.Name || "")) ||
      /ទំពារ|មួកបំបៅ|ចំពុះ/i.test(String(p?.Name || ""))) &&
    /bottle|feeding/i.test(String(p?.Category || ""));

  const isBottleMain = (p) =>
    /bottle/i.test(String(p?.Category || "")) ||
    /bottle/i.test(String(p?.Name || ""));

  const isStrawMain = (p) =>
    /(straw|one[\s-]?touch)/i.test(String(p?.Name || "")) ||
    /(straw|cup)/i.test(String(p?.Category || ""));

  const isPacifier = (p) =>
    /(pacifier|soother|binky|젖꼭지)/i.test(String(p?.Name || "")) ||
    /pacifier/i.test(String(p?.Category || ""));

  const isTeether = (p) =>
    /(teether|teething|치발기)/i.test(String(p?.Name || "")) ||
    /teether/i.test(String(p?.Category || ""));

  const isMilkPowderCase = (p) =>
    /(milk\s*powder|formula)\s*(case|container|dispenser)/i.test(String(p?.Name || "")) ||
    /(powder\s*case)/i.test(String(p?.Name || "")) ||
    /powder\s*case/i.test(String(p?.Category || ""));

  const isBrush = (p) =>
    /(brush|세척브러시|브러시)/i.test(String(p?.Name || "")) ||
    /brush/i.test(String(p?.Category || ""));

  // ---------- 중복 제거(바코드 기준, 순서 보존) ----------
  const dedupByBC = (arr) => {
    const seen = new Set();
    const out = [];
    for (const x of arr) {
      const bc = normBC(x?._barcode_norm || x?.Barcode);
      if (!bc || seen.has(bc)) continue;
      seen.add(bc);
      out.push(x);
    }
    return out;
  };

  // ---------- 메인 제품 라인 묶기 ----------
  const baseKeyFromName = (p) => {
    const raw = String(p?.NameEN || p?.Name || "").toLowerCase();
    return raw
      .replace(/\b\d{2,4}\s*(ml|oz)\b/g, "")
      .replace(/\b(xl|l|m|s)\b/g, "")
      .replace(/\([\s\S]*?\)/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const volNum = (p) => {
    if (typeof p?.Volume === "number") return p.Volume;
    const m = String(p?.Name || "").match(/(\d{2,4})\s*ml/i);
    return m ? Number(m[1]) : NaN;
  };

  // ---------- 풀 만들기 ----------
  const mainsAll = products.filter(
    (p) => normalizeType(p.Type || p["Main/Acc. Item"]) === "Main"
  );
  const accsAll = products.filter(
    (p) => normalizeType(p.Type || p["Main/Acc. Item"]) === "Acc."
  );

  const surveyCat = categoryFromQ12(ans.category);
  let mainsPool = [...mainsAll];
  if (surveyCat) {
    const within = mainsPool.filter(
      (p) => normalizeCategory(p.Category) === surveyCat
    );
    if (within.length) mainsPool = within;
  }
  // 프리룰(Outing/Hygiene)용으로는 타입 구분 없이 전체에서 찾기
  const allPool = dedupByBC([...mainsPool, ...accsAll]);
  const accsPool = dedupByBC(accsAll);

  // ---------- 소재/가격대 필터 ----------
  const targetMat = ans.material ? normalizeMaterial(ans.material) : null;
  const sameMatAll = targetMat
    ? mainsPool.filter((m) => normalizeMaterial(m.Material) === targetMat)
    : [...mainsPool];
  const otherMatAll = targetMat
    ? mainsPool.filter((m) => normalizeMaterial(m.Material) !== targetMat)
    : [];

  const range = priceBandToRange(ans.priceBand);
  const inBand = range
    ? (p) => (p.RetailPrice || 0) >= range[0] && (p.RetailPrice || 0) < range[1]
    : () => true;

  const sameUse = sameMatAll.filter(inBand);
  const otherUse = otherMatAll.filter(inBand);

  // 메인을 라인(baseKey)으로 묶고, 라인 내 볼륨 오름차순
  const groupMains = (arr) => {
    const map = new Map();
    for (const m of arr) {
      const key = baseKeyFromName(m) || norm(m.Name || m.Barcode);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(m);
    }
    const keys = [...map.keys()];
    return keys.map((k) => {
      const list = map
        .get(k)
        .slice()
        .sort((a, b) => (volNum(a) || 9999) - (volNum(b) || 9999));
      const hasBottle = list.some(isBottleMain);
      const hasStraw = list.some(isStrawMain);
      let gtype = "other";
      if (hasBottle && !hasStraw) gtype = "bottle";
      else if (hasStraw && !hasBottle) gtype = "straw";
      else if (hasBottle && hasStraw) gtype = "mixed";
      return { key: k, mains: list, gtype };
    });
  };

  const sameGroups = groupMains(sameUse.length ? sameUse : sameMatAll);
  const otherGroups = groupMains(otherUse.length ? otherUse : otherMatAll);

  // ---------- 기본(피딩) 우선순위(유지) ----------
  const feedingSelected = surveyCat === "Feeding";
  const early = [1, 2, 3].includes(ans.ageStage); // 0–12개월
  const late = [4, 5, 6].includes(ans.ageStage); // 13개월 이상

  const baseGroupWeight = (g) => {
    if (!feedingSelected) return 1;
    if (early) {
      if (g.gtype === "bottle") return 0;
      if (g.gtype === "straw") return 1;
      return 2;
    }
    if (late) {
      if (g.gtype === "straw") return 0;
      if (g.gtype === "bottle") return 1;
      return 2;
    }
    return 1;
  };

  // ---------- Outing/Hygiene 전용 우선순위 ----------
  const outingSelected = surveyCat === "Outing";
  const hygieneSelected = surveyCat === "Hygiene";

  // 그룹 정렬 함수 (카테고리별 가중치 오버라이드)
  const groupWeight = (g) => {
    if (outingSelected) {
      // 1) 12개월 초과면 Straw 우선, 그 뒤 Bottle, 나머지
      if (late) {
        if (g.gtype === "straw") return -10;
        if (g.gtype === "bottle") return -9;
        return -8;
      }
      // 2) 0–12개월이면 병/컵은 뒤쪽(프리룰: Pacifier/Teether/Milk Powder Case가 먼저 나감)
      if (early) {
        if (g.gtype === "straw") return 10;
        if (g.gtype === "bottle") return 11;
        return 12;
      }
      return 0;
    }
    if (hygieneSelected) {
      // 브러시/패시파이어는 프리룰에서 먼저 처리 → 메인 그룹은 기본 가중치로
      return 0;
    }
    // 기본(피딩 등)은 기존 로직
    return baseGroupWeight(g);
  };

  const sortGroups = (groups) =>
    groups
      .slice()
      .sort((a, b) => {
        const wa = groupWeight(a);
        const wb = groupWeight(b);
        if (wa !== wb) return wa - wb;
        return a.key.localeCompare(b.key);
      });

  const sameSorted = sortGroups(sameGroups);
  const otherSorted = sortGroups(otherGroups);

  // ---------- 악세서리 연결 & 중복 방지 ----------
  const usedAcc = new Set();
  const usedAny = new Set(); // 프리룰 포함 전체 중복 방지

  const accessoriesForMain = (m) => {
    const keyBC = normBC(m._barcode_norm || m.Barcode);
    const linked = accsPool.filter((a) => parseAcc(a).includes(keyBC));
    const uniq = dedupByBC(linked);
    return uniq.filter((a) => !usedAcc.has(normBC(a._barcode_norm || a.Barcode)));
  };

  const pushSafely = (arr, item) => {
    const bc = normBC(item?._barcode_norm || item?.Barcode);
    if (!bc || usedAny.has(bc)) return;
    usedAny.add(bc);
    arr.push(item);
  };

  const pushGroup = (group, out) => {
    // 1) 메인들 먼저
    for (const m of group.mains) pushSafely(out, m);

    // 2) 그룹 악세서리(니플 → 기타)
    const accs = [];
    for (const m of group.mains) accs.push(...accessoriesForMain(m));
    const uniqAccs = dedupByBC(accs);
    const nipples = uniqAccs.filter(isNipple);
    const others = uniqAccs.filter((a) => !isNipple(a));

    for (const a of [...nipples, ...others]) {
      pushSafely(out, a);
      usedAcc.add(normBC(a._barcode_norm || a.Barcode));
    }
  };

  // ---------- 프리룰(Outing / Hygiene) ----------
  const prelude = [];

  if (outingSelected) {
    if (early) {
      // B. 0–12개월: Pacifier → Teether → Milk Powder Case
      const pacis = allPool.filter(isPacifier);
      const teeth = allPool.filter(isTeether);
      const powders = allPool.filter(isMilkPowderCase);
      for (const it of dedupByBC([...pacis, ...teeth, ...powders])) pushSafely(prelude, it);
    } else if (late) {
      // C. 12개월 초과: Straw Cup 먼저, 그 뒤 Pacifier/Teether, 이후 기타
      // Straw 메인 그룹(선호소재 → 기타소재 순서)만 추출해 먼저 밀어넣기
      const pickStrawGroups = (groups) => groups.filter((g) => g.gtype === "straw");
      for (const g of pickStrawGroups(sameSorted)) pushGroup(g, prelude);
      for (const g of pickStrawGroups(otherSorted)) pushGroup(g, prelude);

      const pacis = allPool.filter(isPacifier);
      const teeth = allPool.filter(isTeether);
      for (const it of dedupByBC([...pacis, ...teeth])) pushSafely(prelude, it);
      // 나머지는 뒤에서 일반 그룹 순서에 따라 이어붙임
    } else {
      // 명시 안 된 경우: A. Pacifier, Teether, Milk Powder Case → Straw/Bottle → 기타
      const pacis = allPool.filter(isPacifier);
      const teeth = allPool.filter(isTeether);
      const powders = allPool.filter(isMilkPowderCase);
      for (const it of dedupByBC([...pacis, ...teeth, ...powders])) pushSafely(prelude, it);
    }
  }

  if (hygieneSelected) {
    // A. Brush 먼저 (선호 소재 매칭 우선)
    const brushes = allPool.filter(isBrush);
    const brushesSorted = brushes.slice().sort((a, b) => {
      const am = normalizeMaterial(a.Material);
      const bm = normalizeMaterial(b.Material);
      const aw = targetMat && am === targetMat ? 0 : 1;
      const bw = targetMat && bm === targetMat ? 0 : 1;
      return aw - bw;
    });
    for (const it of dedupByBC(brushesSorted)) pushSafely(prelude, it);

    // B. 그 다음 Pacifier
    const pacis = allPool.filter(isPacifier);
    for (const it of dedupByBC(pacis)) pushSafely(prelude, it);
    // C. 나머지는 뒤에서 이어붙임
  }

  // ---------- 본편(그룹) 구성 ----------
  const ordered = [];
  // 0) 프리룰 먼저
  for (const it of prelude) pushSafely(ordered, it);

  // 1) 선호 소재 그룹
  for (const g of sameSorted) {
    // Outing(late)인 경우 Straw는 이미 프리룰에서 넣었으니 스킵
    if (outingSelected && late && g.gtype === "straw") continue;
    pushGroup(g, ordered);
  }
  // 2) 기타 소재 그룹
  for (const g of otherSorted) {
    if (outingSelected && late && g.gtype === "straw") continue;
    pushGroup(g, ordered);
  }

  // 3) 남은 악세서리 정리
  const remainingAccs = accsPool.filter(
    (a) => !usedAcc.has(normBC(a._barcode_norm || a.Barcode))
  );
  const tail = [];
  for (const a of remainingAccs) pushSafely(tail, a);

  return dedupByBC([...ordered, ...tail]);
}


/* ========== App ========== */
export default function App(){
  const [lang,setLang]=useState("km"); const t=i18n[lang];
  const [step,setStep]=useState("q1");       // "q1" | "q11_17" | "review" | "recs" | "invoice" | "contact"
  const [ans,setAns]=useState({}); const [db,setDb]=useState(null); const [selected,setSelected]=useState([]);
  const invoiceRef=useRef(null);
  const BASE = import.meta.env.BASE_URL || "/";     // ★ GitHub Pages 대응

  // DB 로딩 (★ BASE 사용)
  useEffect(()=>{
    const tryLoad=async()=>{
      try{
        const r=await fetch(`${BASE}data/moyuum_products.json`);
        if(!r.ok) throw new Error("fallback");
        return await r.json();
      }catch{
        const r2=await fetch(`${BASE}data/moyuum_products_by_barcode.json`);
        if(!r2.ok) throw new Error("no db");
        return await r2.json();
      }
    };
    tryLoad().then(rows=>{
      const cleaned=rows.map(r=>({
        ...r,
        NameKH: pickFirst(r,["Name(KH.)","Name (KH.)","NameKH","KH Name","Khmer Name","Name"]),
        NameEN: pickFirst(r,["Name(EN.)","Name (EN.)","NameEN","EN Name","English Name"]),
        Barcode: String(r.Barcode??"").trim(),
        _barcode_norm: r._barcode_norm || String(r.Barcode??"").replace(/[^0-9A-Za-z]/g,"").toUpperCase(),
        CategoryRaw: r.Category??"", Category: normalizeCategory(r.Category),
        Type: normalizeType(r.Type||r["Main/Acc. Item"]||r["Main/Acc.Item"]),
        AccBarcode: r.AccBarcode??r["Acc. Barcode"]??r["Acc Barcode"]??"",
        _acc_barcodes_norm: Array.isArray(r._acc_barcodes_norm)? r._acc_barcodes_norm
          : splitBarcodes(r["Acc. Barcode"]||r.AccBarcode||r["Acc Barcode"]).map(x=>x.replace(/[^0-9A-Za-z]/g,"").toUpperCase()),
        Material: normalizeMaterial(r.Material),
        Volume: typeof r.Volume==="number"? r.Volume : Number(r.Volume)||null,
        Size: r.Size??r.size??r.Volume??"", Quantity: r.Quantity??r.Qty??r.qty??"",
        RetailPrice: parsePrice(pickFirst(r, ["RetailPrice", "Retail Price", "Retail Price ($)", "RetailPrice($)", "Price(USD)", "Price USD", "Price"])),
        Image1: normalizeImageUrl(r.Image1??""), Image2: normalizeImageUrl(r.Image2??""),
        PromotionType: r.PromotionType??r["Promotion Type"]??"",
        PromotionBarcode: r.PromotionBarcode??r["Promotion Barcode"]??"",
        PromotionQuantity: r.PromotionQuantity?Number(r.PromotionQuantity):(r["Promotion Quantity"]?Number(r["Promotion Quantity"]):null),
        FreeQuantity: r.FreeQuantity?Number(r.FreeQuantity):(r["Free Quantity"]?Number(r["Free Quantity"]):null),
        DiscountRate: r.DiscountRate?Number(r.DiscountRate):(r["Discount Rate"]?Number(r["Discount Rate"]):null),
      }));
      setDb(cleaned);
    }).catch(()=>setDb([]));
  },[BASE]);

  const recs=useMemo(()=> db? recommend(ans,db):[],[ans,db]);

  // cart ops
  const addSel=(p)=>setSelected(prev=>{const i=prev.findIndex(s=>s.Barcode===p.Barcode); if(i>=0){const c=[...prev]; c[i]={...c[i],qty:c[i].qty+1}; return c;} return [...prev,{...p,qty:1}];});
  const decSel=(bc)=>setSelected(prev=>prev.map(s=>s.Barcode===bc?{...s,qty:Math.max(1,s.qty-1)}:s));
  const rmSel =(bc)=>setSelected(prev=>prev.filter(s=>s.Barcode!==bc));

  const invoice=useMemo(()=>computeInvoice(selected),[selected]);
  const Price=({v})=> <span className="price">${Number(v||0).toFixed(2)}</span>;

  const doExportImage=async()=>{
    const html2canvas=(await import(/* @vite-ignore */ "html2canvas")).default;
    if(!invoiceRef.current) return;
    const canvas=await html2canvas(invoiceRef.current);
    const url=canvas.toDataURL("image/png");
    const a=document.createElement("a"); a.href=url; a.download="moyuum-invoice.png"; a.click();
  };

  const ageText=(ans.ageStage? i18n[lang].q11_options[ans.ageStage-1]:"-");
  const categoryText=(ans.category? t[`q12_${ans.category}`]:"-");
  const priceText=(ans.priceBand? t[`price_${ans.priceBand}`]:"-");

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
        <div className="muted">Bilingual survey → <b>review (confirm/edit)</b> → recommendations → cart → invoice → contact.</div>
      </div>

      {/* Q1 */}
      {step==="q1" && (
        <div className="card">
          <h2>{t.q1_title}</h2>
          <div className="grid">
            <div className={`opt ${ans.purpose===1?'selected':''}`} tabIndex={0} onClick={()=>setAns({...ans,purpose:1})}>{t.q1_purpose_1}</div>
            <div className={`opt ${ans.purpose===2?'selected':''}`} tabIndex={0} onClick={()=>setAns({...ans,purpose:2})}>{t.q1_purpose_2}</div>
          </div>
          <div className="actions">
            <button className="btn wide" onClick={()=>setStep("q11_17")} disabled={!ans.purpose}>{t.next}</button>
          </div>
        </div>
      )}

      {/* Q1 → Questions 1–5 */}
      {step==="q11_17" && (
        <div className="card">
          <h2>Q1 → Questions 1–5</h2>

          <div className="q">1) {t.q11_title}</div>
          <div className="grid">
            {t.q11_options.map((label,idx)=>(
              <div key={idx} className={`opt ${ans.ageStage===(idx+1)?'selected':''}`} tabIndex={0} onClick={()=>setAns({...ans,ageStage:(idx+1)})}>{label}</div>
            ))}
          </div>

          <div className="q">2) {t.q12_title}</div>
          <div className="grid">
            {[1,2,3,4].map(k=>(
              <div key={k} className={`opt ${ans.category===k?'selected':''}`} tabIndex={0} onClick={()=>setAns({...ans,category:k})}>{t[`q12_${k}`]}</div>
            ))}
          </div>

          <div className="q">3) {t.q13_title}</div>
          <div className="grid">
            {[1,2,3,4,5].map(k=>(
              <div key={k} className={`opt ${ans.factor===k?'selected':''}`} tabIndex={0} onClick={()=>setAns({...ans,factor:k})}>{t[`q13_${k}`]}</div>
            ))}
          </div>

          <div className="q">4) {t.q14_title}</div>
          <div className="grid">
            {[{k:"PPSU",label:t.q14_ppsu},{k:"Silicone",label:t.q14_sil},{k:"Glass",label:t.q14_gls}].map(o=>(
              <div key={o.k} className={`opt ${ans.material===o.k?'selected':''}`} tabIndex={0} onClick={()=>setAns({...ans,material:o.k})}>{o.label}</div>
            ))}
          </div>

          <div className="q">5) {t.q15_title}</div>
          <div className="grid">
            {[1,2,3,4,5].map(k=>(
              <div key={k} className={`opt ${ans.priceBand===k?'selected':''}`} tabIndex={0} onClick={()=>setAns({...ans,priceBand:k})}>{t[`price_${k}`]}</div>
            ))}
          </div>

          <div className="actions">
            <button className="btn ghost wide" onClick={()=>setStep("q1")}>{t.back}</button>
            <button className="btn wide" onClick={()=>setStep("review")} disabled={!ans.ageStage||!ans.category||!ans.material||!ans.priceBand}>{t.review}</button>
          </div>
        </div>
      )}

      {/* REVIEW */}
      {step==="review" && (
        <div className="card">
          <h2>{t.reviewTitle}</h2>
          <div className="summaryGrid">
            <div className="summaryItem"><b>Q1</b><br/>{ans.purpose===1? t.q1_purpose_1 : ans.purpose===2? t.q1_purpose_2 : '-' }</div>
            <div className="summaryItem"><b>1</b><br/>{ageText}</div>
            <div className="summaryItem"><b>2</b><br/>{categoryText}</div>
            <div className="summaryItem"><b>3</b><br/>{ans.factor? t[`q13_${ans.factor}`]:'-'}</div>
            <div className="summaryItem"><b>4</b><br/>{ans.material??'-'}</div>
            <div className="summaryItem"><b>5</b><br/>{priceText}</div>
          </div>
          <div className="actions">
            <button className="btn ghost wide" onClick={()=>setStep("q11_17")}>{t.back}</button>
            <button className="btn wide" onClick={()=>setStep("recs")}>{t.proceedToRecs}</button>
          </div>
        </div>
      )}

      {/* RECOMMENDATIONS */}
      {step==="recs" && (
        <div className="card">
          <h2>{t.recsTitle}</h2>
          <div className="muted">{t.selectProducts} · <span className="pill">{i18n[lang].selectedCount(selected.length)}</span></div>

          <div className="card" style={{marginTop:12}}>
            <div className="summaryGrid">
              <div className="summaryItem"><b>1</b><br/>{ageText}</div>
              <div className="summaryItem"><b>2</b><br/>{categoryText}</div>
              <div className="summaryItem"><b>4</b><br/>{ans.material ?? '-'}</div>
              <div className="summaryItem"><b>5</b><br/>{priceText}</div>
            </div>
            <div className="row" style={{marginTop:8,justifyContent:'flex-end'}}>
              <button className="btn ghost" onClick={()=>setStep("review")}>{t.reviseAnswers}</button>
            </div>
          </div>

          {!db && <div className="muted" style={{marginTop:8}}>Loading product database…</div>}

          <div className="grid" style={{marginTop:12}}>
            {recs.map(p=>{
              const local1 = p.Barcode? `${BASE}images/${p.Barcode}_1.jpg` : "";
              const local2 = p.Barcode? `${BASE}images/${p.Barcode}_2.jpg` : "";
              const srcs1  = [p.Image1, local1].filter(Boolean);
              const srcs2  = [p.Image2, local2].filter(Boolean);
              const title  = getDisplayName(p,lang);
              const szq    = fmtSizeQty(p);
              return (
                <div className="opt" key={p.Barcode} style={{alignItems:'stretch',flexDirection:'column'}}>
                  <div className="row" style={{justifyContent:'space-between',alignItems:'baseline',width:'100%'}}>
                    <strong style={{lineHeight:1.2}}>{title || p.Name}</strong>
                    <span className="badge">{p.Type}</span>
                  </div>
                  <div className="muted" style={{width:'100%'}}>{p.Category} · {p.Material || '—'}{szq?` · ${szq}`:""}</div>
                  <div className="imgpair" style={{marginTop:8}}>
                    <FallbackImg sources={srcs1} alt="Image1"/><FallbackImg sources={srcs2} alt="Image2"/>
                  </div>
                  <div className="row" style={{marginTop:8,justifyContent:'space-between',alignItems:'center',width:'100%'}}>
                    <div><Price v={p.RetailPrice}/></div>
                    <div className="row"><button className="btn" onClick={()=>addSel(p)}>+ Add</button></div>
                  </div>
                </div>
              );
            })}
          </div>

          {!!selected.length && (
            <div className="card" style={{marginTop:12}}>
              <h2>Cart</h2>
              <table className="table">
                <thead><tr><th>Product</th><th>Qty</th><th>Unit</th><th>Total</th><th/></tr></thead>
                <tbody>
                  {selected.map(s=>(
                    <tr key={s.Barcode}>
                      <td>{getDisplayName(s,lang)||s.Name}</td>
                      <td className="row"><button className="btn ghost" onClick={()=>decSel(s.Barcode)}>-</button>
                        <span style={{minWidth:28,textAlign:'center'}}>{s.qty}</span>
                        <button className="btn ghost" onClick={()=>addSel(s)}>+</button>
                      </td>
                      <td><Price v={s.RetailPrice}/></td>
                      <td><Price v={(s.RetailPrice||0)*s.qty}/></td>
                      <td><button className="btn mute" onClick={()=>rmSel(s.Barcode)}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="actions">
                <button className="btn ghost wide" onClick={()=>setStep("review")}>{t.back}</button>
                <button className="btn wide" onClick={()=>setStep("invoice")}>{t.toInvoice}</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* INVOICE */}
      {step==="invoice" && (
        <div className="card">
          <div ref={invoiceRef} className="invoice">
            <h2>{t.invoiceTitle}</h2>
            <table className="table">
              <thead><tr><th>Barcode</th><th>Product</th><th>Qty</th><th>Unit</th><th>Line</th></tr></thead>
              <tbody>
                {invoice.lines.map((l,idx)=>(
                  <tr key={idx}><td>{l.Barcode}</td><td>{getDisplayName(l,lang)||l.Name}</td>
                    <td>{l.qty}</td><td><Price v={l.RetailPrice}/></td><td><Price v={(l.RetailPrice||0)*l.qty}/></td></tr>
                ))}
              </tbody>
            </table>
            <div className="row" style={{justifyContent:'flex-end',gap:24,marginTop:8}}>
              <div>Subtotal: <strong><Price v={invoice.subtotal}/></strong></div>
              <div>Total: <strong><Price v={invoice.total}/></strong></div>
            </div>
            {invoice.details.length>0 && (
              <div style={{marginTop:8}}>
                <div className="caption">Promotion Details</div>
                <ul>{invoice.details.map((d,i)=>(<li key={i}>{d.name}: {d.note}</li>))}</ul>
              </div>
            )}
            <div className="muted" style={{marginTop:6}}>{t.invoiceNote}</div>
          </div>

          <div className="actions">
            <button className="btn ghost wide" onClick={()=>setStep("recs")}>{t.back}</button>
            <button className="btn wide" onClick={doExportImage}>{t.exportInvoice}</button>
            <button className="btn wide" onClick={()=>setStep("contact")}>{t.toContact}</button>
          </div>
        </div>
      )}

      {/* CONTACT / THANK-YOU + QR (최종 페이지) */}
      {step==="contact" && (
        <div className="card">
          <h2>{i18n[lang].thanks}</h2>
          <div className="muted">{i18n[lang].thanksSub}</div>

          <div className="qrWrap">
            <a className="qrCard" href="https://t.me/PrekorMoyuumKhmer" target="_blank" rel="noreferrer">
              <div className="qrImgBox">
                <img src={`${BASE}images/moyuum_khmer_telegram.png`} alt="Telegram QR"/>
              </div>
              <div style={{marginTop:8,fontWeight:700}}>Telegram</div>
              <div className="muted">t.me/PrekorMoyuumKhmer</div>
            </a>

            <a className="qrCard" href="https://www.facebook.com/MoyuumKhmer.kh/" target="_blank" rel="noreferrer">
              <div className="qrImgBox">
                <img src={`${BASE}images/moyuum_khmer_facebook.png`} alt="Facebook QR"/>
              </div>
              <div style={{marginTop:8,fontWeight:700}}>Facebook</div>
              <div className="muted">facebook.com/MoyuumKhmer.kh</div>
            </a>
          </div>

          <div className="actions">
            <button className="btn ghost wide" onClick={()=>setStep("invoice")}>{t.back}</button>
          </div>
        </div>
      )}
    </div>
  );
}
