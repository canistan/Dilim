const { getPayload } = require('payload')
const configPromise = require('@payload-config').default

async function checkUser() {
  const payload = await getPayload({ config: configPromise })
  const users = await payload.find({
    collection: 'customers',
    where: { email: { equals: 'can@deneme.com' } },
  })
  console.log(JSON.stringify(users.docs[0], null, 2))
}
checkUser().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); })
