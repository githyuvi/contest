import { generateSync } from 'text-to-image';

async function generateImage(text) {
  const dataUri = generateSync(text);
  return dataUri;
  // use the dataUri
}

export { generateImage }