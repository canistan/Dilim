const { Jimp } = require('jimp');
const path = require('path');

async function removeWhiteBackground() {
  const imagePath = path.join(__dirname, 'public', 'DilimLogo-real.png');
  const outPath = path.join(__dirname, 'public', 'DilimLogo-transparent.png');
  
  try {
    const image = await Jimp.read(imagePath);
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If the pixel is very close to white (tolerance), make it transparent
      if (red > 240 && green > 240 && blue > 240) {
        this.bitmap.data[idx + 3] = 0; // Alpha channel to 0 (transparent)
      } else if (red > 200 && green > 200 && blue > 200) {
        // Semi-transparent for anti-aliasing near edges
        this.bitmap.data[idx + 3] = (255 - red) * 2; 
      }
    });

    await image.write(outPath);
    console.log('Background removed successfully: DilimLogo-transparent.png');
  } catch (error) {
    console.error('Error removing background:', error);
  }
}

removeWhiteBackground();
