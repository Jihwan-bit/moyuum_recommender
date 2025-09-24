import fs from "node:fs";
import path from "node:path";
import xlsx from "xlsx";

const SRC = process.env.SRC || "moyuum_products.xlsx";           // 루트에 엑셀 배치
const OUT = process.env.OUT || "public/data/moyuum_products.json"; // 출력 JSON

const wb = xlsx.readFile(SRC);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(ws, { defval: null });

// Alias & 정규화
const alias = new Map([
  ["bar_code","Barcode"],["code","Barcode"],["sku","Barcode"],["product_code","Barcode"],["item_barcode","Barcode"],
  ["name(en.)","Name"],["name(kh.)","Name"],["product_name","Name"],["item_name","Name"],
  ["main/acc. item","Type"],["main_acc","Type"],["main or acc","Type"],
  ["acc. barcode","AccBarcode"],["acc barcode","AccBarcode"],["accessory_barcode","AccBarcode"],
  ["retail price ($)","RetailPrice"],["usd","RetailPrice"],["price","RetailPrice"],
  ["discount rate","DiscountRate"],["promotion type","PromotionType"],["promotion barcode","PromotionBarcode"],
  ["promotion quantity","PromotionQuantity"],["free quantity","FreeQuantity"],
]);
const norm = s => String(s).trim().toLowerCase().replace(/\s+/g," ");

const sample = rows[0] || {};
const headers = Object.keys(sample);
const map = {};
for (const h of headers) {
  const n = norm(h);
  const direct = alias.get(n);
  if (direct) { map[h] = direct; continue; }
  if (n.includes("barcode") && !n.includes("promo")) { map[h] = "Barcode"; continue; }
  if (n.includes("name")) { map[h] = "Name"; continue; }
  if (n.includes("category")) { map[h] = "Category"; continue; }
  if (n.includes("main") || n.includes("acc")) { map[h] = "Type"; continue; }
  if (n.includes("acc") && n.includes("bar")) { map[h] = "AccBarcode"; continue; }
  if (n.includes("material") || n.includes("mat")) { map[h] = "Material"; continue; }
  if (n.includes("volume") || n.includes("capacity") || n === "ml") { map[h] = "Volume"; continue; }
  if (n.includes("retail") || n === "usd" || n === "price") { map[h] = "RetailPrice"; continue; }
  if (n.includes("image1") || n.includes("photo1")) { map[h] = "Image1"; continue; }
  if (n.includes("image2") || n.includes("photo2")) { map[h] = "Image2"; continue; }
  if (n.includes("promotion type")) { map[h] = "PromotionType"; continue; }
  if (n.includes("promotion barcode")) { map[h] = "PromotionBarcode"; continue; }
  if (n.includes("promotion quantity") || n.includes("promo qty")) { map[h] = "PromotionQuantity"; continue; }
  if (n.includes("free quantity") || n === "free qty") { map[h] = "FreeQuantity"; continue; }
  if (n.includes("discount")) { map[h] = "DiscountRate"; continue; }
  map[h] = h.replace(/\s+/g,"");
}

const outRows = rows.map((row) => {
  const acc = {};
  for (const [src, tgt] of Object.entries(map)) {
    const val = row[src];
    if (val == null || val === "") continue;
    if (acc[tgt] == null || acc[tgt] === "") acc[tgt] = val;
  }
  for (const k of ["Barcode","Name","Category","Type","RetailPrice"]) {
    if (!(k in acc)) acc[k] = null;
  }
  if (acc.RetailPrice != null) acc.RetailPrice = Number(acc.RetailPrice);
  if (acc.Volume != null) acc.Volume = Number(acc.Volume);
  if (acc.DiscountRate != null) acc.DiscountRate = Number(acc.DiscountRate);
  if (acc.PromotionQuantity != null) acc.PromotionQuantity = Number(acc.PromotionQuantity);
  if (acc.FreeQuantity != null) acc.FreeQuantity = Number(acc.FreeQuantity);
  return acc;
});

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(outRows, null, 2));
console.log(`Wrote ${outRows.length} rows to ${OUT}`);