import { CollectionAfterChangeHook } from 'payload'

export const sendNotificationEmail = (subjectPrefix: string): CollectionAfterChangeHook => async ({
  doc,
  operation,
  req: { payload },
}) => {
  if (operation === 'create') {
    try {
      // Get the support email from contact settings or fallback
      let toEmail = 'destek@dilim.com.tr'
      try {
        const contactSettings = await payload.findGlobal({ slug: 'contact-settings' })
        if (contactSettings && contactSettings.email) {
          toEmail = contactSettings.email as string
        }
      } catch (e) {
        // ignore
      }

      const htmlContent = `
        <h2>Yeni ${subjectPrefix}</h2>
        <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px;">
          ${Object.entries(doc)
            .filter(([key]) => !['id', 'createdAt', 'updatedAt', 'globalType'].includes(key))
            .map(([key, value]) => `
              <tr>
                <td style="font-weight: bold; width: 30%;">${key}</td>
                <td>${value}</td>
              </tr>
            `).join('')}
        </table>
      `

      await payload.sendEmail({
        to: toEmail,
        subject: `Yeni Bildirim: ${subjectPrefix} - Dilim Pastaneleri`,
        html: htmlContent,
      })
    } catch (error) {
      console.error('Bildirim e-postası gönderilirken hata oluştu:', error)
    }
  }
  return doc
}
