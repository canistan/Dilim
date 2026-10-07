const fs = require('fs');
const path = require('path');

const collectionsDir = path.join(__dirname, '../src/collections');
const globalsDir = path.join(__dirname, '../src/globals');

const groupMapping = {
  // Yönetim
  'Users.ts': 'Yönetim',
  'Media.ts': 'Yönetim',
  'Subscribers.ts': 'Yönetim',
  'AuditLogs.ts': 'Yönetim',
  'Coupons.ts': 'Yönetim',
  'Products.ts': 'Yönetim',
  'Categories.ts': 'Yönetim',

  // Kullanıcı Bilgi Deposu
  'Customers.ts': 'Kullanıcı Bilgi Deposu',
  'Orders.ts': 'Kullanıcı Bilgi Deposu',
  'Returns.ts': 'Kullanıcı Bilgi Deposu',
  'ContactMessages.ts': 'Kullanıcı Bilgi Deposu',
  'Resumes.ts': 'Kullanıcı Bilgi Deposu',
  'FranchiseApplications.ts': 'Kullanıcı Bilgi Deposu',

  // Site Yönetimi (Collections & Globals)
  'Blog.ts': 'Site Yönetimi',
  'CustomCakes.ts': 'Site Yönetimi',
};

const processFile = (filePath, fileName, isGlobal) => {
  let content = fs.readFileSync(filePath, 'utf8');

  const group = groupMapping[fileName] || 'Site Yönetimi';

  // Update group
  if (content.includes("group: '")) {
    content = content.replace(/group:\s*'[^']+'/, `group: '${group}'`);
  } else {
    // try to insert group inside admin: {
    content = content.replace(/admin:\s*\{/, `admin: {\n    group: '${group}',`);
  }

  // Handle access - only if it doesn't already have an access block (except Orders which I'll handle manually later if needed)
  if (!content.includes('access: {') && fileName !== 'Users.ts' && fileName !== 'Customers.ts') {
    // If it's a public facing collection that needs public read
    if (['Products.ts', 'Categories.ts', 'Media.ts', 'Blog.ts', 'CustomCakes.ts', 'About.ts', 'BirthdayCampaign.ts', 'ContactSettings.ts', 'CustomCakeOptions.ts', 'Homepage.ts', 'InstagramFeed.ts'].includes(fileName)) {
      content = content.replace(
        /export const \w+: [a-zA-Z]+ = \{/,
        `$&
  access: {
    read: () => true,
  },`
      );
    } else {
      // Need isAdmin access
      if (!content.includes("import { isAdmin }")) {
        content = `import { isAdmin } from '../access/isAdmin'\n` + content;
      }
      
      let accessBlock = `
  access: {
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,`;
      
      // Some allow public create
      if (['ContactMessages.ts', 'Resumes.ts', 'FranchiseApplications.ts', 'Subscribers.ts', 'Returns.ts'].includes(fileName)) {
        accessBlock += `\n    create: () => true,\n  },`;
      } else {
        accessBlock += `\n    create: isAdmin,\n  },`;
      }

      content = content.replace(/export const \w+: [a-zA-Z]+ = \{/, `$&${accessBlock}`);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${fileName}`);
};

fs.readdirSync(collectionsDir).forEach(file => {
  if (file.endsWith('.ts')) {
    processFile(path.join(collectionsDir, file), file, false);
  }
});

fs.readdirSync(globalsDir).forEach(file => {
  if (file.endsWith('.ts')) {
    processFile(path.join(globalsDir, file), file, true);
  }
});
