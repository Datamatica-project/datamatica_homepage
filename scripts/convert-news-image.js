/**
 * PNG/JPG(혹은 확장자만 .avif인 HEIC 등) 이미지를 진짜 AVIF(AV1 코덱)로 변환합니다.
 *
 * 뉴스 기사 썸네일 등록 시, 온라인 변환기가 확장자만 .avif로 붙이고 실제로는
 * HEIC(HEVC)로 인코딩해주는 경우가 있어 Next.js 이미지 최적화가 실패하는 문제를 방지합니다.
 *
 * 사용법:
 *   node scripts/convert-news-image.js <입력파일...>
 *
 * 예시:
 *   node scripts/convert-news-image.js public/news/2026/26081103.png
 *   node scripts/convert-news-image.js public/news/2026/*.png
 *
 * 결과: 입력 파일과 같은 폴더에 같은 이름(.avif)으로 저장됩니다.
 *       입력 파일 자체가 .avif인 경우 그 자리에서 진짜 AVIF로 덮어씁니다.
 */

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const QUALITY = 80;
const EFFORT = 4;

async function convertOne(inputPath) {
  const full = path.resolve(inputPath);
  if (!fs.existsSync(full)) {
    console.error(`✗ 파일 없음: ${inputPath}`);
    return false;
  }

  const outPath = full.replace(/\.[^.]+$/, ".avif");
  const before = await sharp(full).metadata();
  const buf = await sharp(full).avif({ quality: QUALITY, effort: EFFORT }).toBuffer();
  fs.writeFileSync(outPath, buf);
  const after = await sharp(outPath).metadata();

  const beforeSize = fs.statSync(full).size;
  console.log(
    `✓ ${path.relative(process.cwd(), full)} ` +
      `(${before.compression ?? before.format}, ${beforeSize.toLocaleString()}B) ` +
      `→ ${path.relative(process.cwd(), outPath)} ` +
      `(${after.compression}, ${buf.length.toLocaleString()}B)`
  );

  // 원본이 .avif가 아니었다면(png/jpg 등) 원본은 그대로 두고 .avif만 새로 생성됨
  return true;
}

async function main() {
  const inputs = process.argv.slice(2);
  if (inputs.length === 0) {
    console.error("사용법: node scripts/convert-news-image.js <입력파일...>");
    process.exit(1);
  }

  let failed = 0;
  for (const input of inputs) {
    try {
      const ok = await convertOne(input);
      if (!ok) failed++;
    } catch (e) {
      console.error(`✗ 변환 실패: ${input} — ${e.message}`);
      failed++;
    }
  }

  if (failed > 0) {
    console.error(`\n${failed}개 파일 변환 실패`);
    process.exit(1);
  }
}

main();
