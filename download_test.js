const https = require('https');
const fs = require('fs');
const path = require('path');

const textures = {
  'sun.jpg': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/sun.jpg',
  'earth_atmos.jpg': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
  'earth_normal.jpg': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
  'earth_specular.jpg': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
  'earth_clouds.png': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png',
  'moon.jpg': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg',
  'mars.jpg': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars_1k_color.jpg'
};

const dir = path.join(__dirname, 'public', 'textures');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

async function download(name, url) {
  return new Promise((resolve) => {
    const filePath = path.join(dir, name);
    const file = fs.createWriteStream(filePath);
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('Downloaded:', name);
          resolve(true);
        });
      } else {
        console.log('Failed:', name, res.statusCode);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log('Error downloading', name, err.message);
      resolve(false);
    });
  });
}

(async () => {
  for (const [name, url] of Object.entries(textures)) {
    await download(name, url);
  }
})();
