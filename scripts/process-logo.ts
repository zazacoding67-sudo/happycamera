import sharp from "sharp";

const THRESHOLD_LOW = 235;
const THRESHOLD_HIGH = 245;

async function main() {
  const img = sharp("public/images/happy-logo.jpg");
  const meta = await img.metadata();
  console.log(`Source: ${meta.width}x${meta.height}, ${meta.format}`);

  const { data, info } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const output = Buffer.alloc(info.width * info.height * 4);

  for (let i = 0; i < info.width * info.height; i++) {
    const offset = i * 4;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const a = data[offset + 3];

    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);

    let alpha = a;

    if (max >= THRESHOLD_LOW) {
      if (min >= THRESHOLD_HIGH) {
        alpha = 0;
      } else {
        const brightness = (r + g + b) / 3;
        const t = (brightness - THRESHOLD_LOW) / (THRESHOLD_HIGH - THRESHOLD_LOW);
        alpha = Math.round(a * (1 - Math.min(1, Math.max(0, t))));
      }
    }

    output[offset] = r;
    output[offset + 1] = g;
    output[offset + 2] = b;
    output[offset + 3] = alpha;
  }

  await sharp(output, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile("public/images/logo-transparent.png");

  const result = await sharp("public/images/logo-transparent.png").metadata();
  console.log(
    `Output: ${result.width}x${result.height}, ${result.format}, channels: ${result.channels}`
  );

  const outData = await sharp("public/images/logo-transparent.png")
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let transparentPixels = 0;
  let totalPixels = 0;
  for (let i = 0; i < outData.info.width * outData.info.height; i++) {
    const offset = i * 4;
    if (outData.data[offset + 3] === 0) transparentPixels++;
    totalPixels++;
  }
  console.log(
    `Transparent pixels: ${transparentPixels}/${totalPixels} (${Math.round(
      (transparentPixels / totalPixels) * 100
    )}%)`
  );
}

main().catch(console.error);
