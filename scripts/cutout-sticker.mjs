/**
 * =============================================================================
 * STICKER KESİCİ — düz zeminli bir görselden şeffaf sticker üretir
 * =============================================================================
 *   node scripts/cutout-sticker.mjs <girdi.png> <cikti.png> [tolerans=34]
 *
 * NEDEN BU SCRIPT VAR: sticker çizimleri Canva'da üretiliyor ama Canva'nın
 * ÜCRETSİZ planı ŞEFFAF ZEMİNLİ PNG dışa aktarmıyor ("Users on the Canva Free
 * plan can not export PNGs with transparent background"). Üstelik plan ücretli
 * olsa bile üretilen karakter düz bir dikdörtgenin üzerine çiziliyor, yani
 * şeffaflık tek başına temiz bir siluet vermiyor.
 *
 * Zemin DÜZ olduğu için kesimi burada yapmak hem ücretsiz hem daha güvenilir:
 * opak PNG indir, bu scripti çalıştır, `public/img/stickers/` altına koy.
 *
 * TOLERANS: zemin rengine uzaklık eşiği. Kenarlarda krem artıklar kalıyorsa
 * artırın; karakterin açık renkli kısımları deliniyorsa azaltın.
 */

import sharp from 'sharp'

/**
 * Düz zeminli bir sticker görselinden zemini kaldırır.
 *
 * NEDEN FLOOD FILL, NEDEN "krem pikselleri sil" DEĞİL: karakterin İÇİNDE de
 * kreme yakın alanlar var (ineğin gövdesi neredeyse beyaz). Renge göre global
 * silme onları da delerdi. Kenarlardan yayılan bir dolgu ise yalnızca DIŞARIYA
 * bağlı pikselleri siler; siyah kontur duvar görevi görüp içeriyi korur.
 */
const [input, output, tolStr] = process.argv.slice(2)
const TOL = Number(tolStr ?? 34)

const src = sharp(input).ensureAlpha()
const { width, height } = await src.metadata()
const buf = await src.raw().toBuffer()          // RGBA
const idx = (x, y) => (y * width + x) * 4

// Zemin rengi dört köşenin ortalaması — tek köşe bozuk çıkarsa yanılmayalım.
const corners = [[0,0],[width-1,0],[0,height-1],[width-1,height-1]]
const bg = [0,1,2].map(c => Math.round(corners.reduce((s,[x,y]) => s + buf[idx(x,y)+c], 0) / 4))

const near = (i) => {
  const dr = buf[i] - bg[0], dg = buf[i+1] - bg[1], db = buf[i+2] - bg[2]
  return Math.sqrt(dr*dr + dg*dg + db*db) <= TOL
}

const seen = new Uint8Array(width * height)
const stack = []
for (let x = 0; x < width; x++) { stack.push(x, 0); stack.push(x, height-1) }
for (let y = 0; y < height; y++) { stack.push(0, y); stack.push(width-1, y) }

let cleared = 0
while (stack.length) {
  const y = stack.pop(), x = stack.pop()
  if (x < 0 || y < 0 || x >= width || y >= height) continue
  const p = y * width + x
  if (seen[p]) continue
  const i = p * 4
  if (!near(i)) continue
  seen[p] = 1
  buf[i+3] = 0
  cleared++
  stack.push(x+1, y); stack.push(x-1, y); stack.push(x, y+1); stack.push(x, y-1)
}

// İçerik sınırlarına kırp: sticker'ın etrafındaki boşluk yerleşimde işe yaramaz.
let minX = width, minY = height, maxX = 0, maxY = 0
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  if (buf[idx(x,y)+3] > 8) {
    if (x < minX) minX = x; if (x > maxX) maxX = x
    if (y < minY) minY = y; if (y > maxY) maxY = y
  }
}

const w = maxX - minX + 1, h = maxY - minY + 1
await sharp(buf, { raw: { width, height, channels: 4 } })
  .extract({ left: minX, top: minY, width: w, height: h })
  .resize({ width: 640, withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toFile(output)

const pct = ((cleared / (width * height)) * 100).toFixed(1)
console.log(`zemin: rgb(${bg}) | silinen: ${pct}% | kirpma: ${w}x${h} -> ${output}`)
