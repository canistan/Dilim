const https = require('https');
const url = 'https://unsplash.com/s/photos/baklava';
https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+[^"'\s]*/g;
    const matches = data.match(regex);
    if (!matches) return console.log('no matches');
    const urls = matches.map(u => u.replace(/&amp;/g, '&'));
    const unique = [...new Set(urls)].filter(u => !u.includes('profile-') && !u.includes('premium_photo'));
    console.log(unique[0].split('?')[0] + '?auto=format&fit=crop&w=800&q=80');
  });
});
