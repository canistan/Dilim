import { CollectionAfterChangeHook } from 'payload'

const escapeHTML = (str: any) => {
  if (typeof str !== 'string') return String(str);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

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

      const keyMap: Record<string, string> = {
        name: 'Ad Soyad',
        email: 'E-posta Adresi',
        phone: 'Telefon Numarası',
        subject: 'Konu',
        message: 'Mesaj İçeriği',
        position: 'Başvurulan Pozisyon',
        experience: 'Tecrübe / Kapak Yazısı',
        resume: 'CV Dosyası (ID)',
        location: 'Düşünülen Lokasyon',
        background: 'Ticari Geçmiş / Bütçe',
        hasStore: 'Hazır Mağaza Var Mı?',
        source: 'Kayıt Kaynağı'
      }

      const formatValue = (key: string, value: any) => {
        if (typeof value === 'boolean') return value ? 'Evet' : 'Hayır'
        if (typeof value === 'object' && value !== null) {
          if (value.filename) return value.url || value.filename
          return JSON.stringify(value)
        }
        return escapeHTML(value)
      }

      const personalKeys = ['name', 'email', 'phone', 'location']
      
      const personalInfoHtml = personalKeys.filter(k => doc[k]).map(k => `
        <tr>
          <td style="font-weight: bold; width: 35%; padding: 8px; border-bottom: 1px solid #eee;">${keyMap[k] || k}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${formatValue(k, doc[k])}</td>
        </tr>
      `).join('')

      const otherKeys = Object.keys(doc).filter(k => !personalKeys.includes(k) && !['id', 'createdAt', 'updatedAt', 'globalType'].includes(k) && doc[k] !== undefined && doc[k] !== null && doc[k] !== '')

      const detailsHtml = otherKeys.map(k => `
        <tr>
          <td style="font-weight: bold; width: 35%; padding: 8px; border-bottom: 1px solid #eee;">${keyMap[k] || k}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${formatValue(k, doc[k])}</td>
        </tr>
      `).join('')

      const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #d35400; border-bottom: 2px solid #f39c12; padding-bottom: 10px;">Yeni ${escapeHTML(subjectPrefix)}</h2>
          
          ${personalInfoHtml ? `
          <h3 style="background-color: #f8f9fa; padding: 10px; margin-top: 20px; border-radius: 4px;">Gönderen / Kişisel Bilgiler</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${personalInfoHtml}
          </table>
          ` : ''}

          ${detailsHtml ? `
          <h3 style="background-color: #f8f9fa; padding: 10px; margin-top: 20px; border-radius: 4px;">İçerik / Detaylar</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${detailsHtml}
          </table>
          ` : ''}
        </div>
      `

      await payload.sendEmail({
        to: `${toEmail}, cuneydsahin@dilim.com.tr`,
        subject: `Yeni Bildirim: ${subjectPrefix} - Dilim Pastaneleri`,
        html: htmlContent,
      })
    } catch (error) {
      console.error('Bildirim e-postası gönderilirken hata oluştu:', error)
    }
  }
  return doc
}
