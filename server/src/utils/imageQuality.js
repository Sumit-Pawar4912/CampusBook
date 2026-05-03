const Jimp = require('jimp');

const computeLaplacianVariance = async buffer => {
  const image = await Jimp.read(buffer);
  const maxWidth = 800;
  if (image.bitmap.width > maxWidth) {
    image.resize(maxWidth, Jimp.AUTO);
  }
  image.grayscale();

  const { width, height, data } = image.bitmap;
  const values = [];

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const idx = (y * width + x) * 4;
      const center = data[idx];
      const left = data[idx - 4];
      const right = data[idx + 4];
      const top = data[idx - width * 4];
      const bottom = data[idx + width * 4];
      const lap = center * 4 - left - right - top - bottom;
      values.push(lap);
    }
  }

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
  return variance;
};

const analyzeImageQuality = async buffer => {
  if (!buffer) {
    throw { statusCode: 400, message: 'Image file is required for quality analysis' };
  }

  const blurScore = await computeLaplacianVariance(buffer);
  const threshold = 100;
  const isBlurred = blurScore < threshold;
  const message = isBlurred ? 'Image appears blurred, try a sharper photo.' : 'Image quality is good.';

  return { isBlurred, blurScore: Number(blurScore.toFixed(2)), message };
};

module.exports = { analyzeImageQuality };
