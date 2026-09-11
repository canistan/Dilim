export function getResetPasswordEmailHTML(resetUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Şifre Sıfırlama - Dilim Pastaneleri</title>
</head>
<body style="margin:0;padding:0;background-color:#f8f5f0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8f5f0;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:1px;">
                Dilim Pastaneleri
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#1a1a1a;font-size:22px;font-weight:700;">
                Şifre Sıfırlama Talebi
              </h2>
              <div style="width:48px;height:3px;background-color:#e8772e;border-radius:2px;margin-bottom:24px;"></div>
              
              <p style="margin:0 0 16px;color:#555555;font-size:15px;line-height:1.7;">
                Merhaba,
              </p>
              <p style="margin:0 0 24px;color:#555555;font-size:15px;line-height:1.7;">
                Hesabınız için bir şifre sıfırlama talebi aldık. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" target="_blank" style="display:inline-block;padding:16px 40px;background-color:#e8772e;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;border-radius:12px;letter-spacing:0.5px;">
                      Şifremi Sıfırla
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;color:#888888;font-size:13px;line-height:1.6;">
                Eğer buton çalışmıyorsa, aşağıdaki bağlantıyı tarayıcınıza yapıştırabilirsiniz:
              </p>
              <p style="margin:0 0 24px;word-break:break-all;">
                <a href="${resetUrl}" style="color:#e8772e;font-size:13px;text-decoration:underline;">${resetUrl}</a>
              </p>

              <div style="border-top:1px solid #eeeeee;padding-top:20px;margin-top:16px;">
                <p style="margin:0;color:#999999;font-size:12px;line-height:1.6;">
                  Bu bağlantı güvenliğiniz için <strong>1 saat</strong> içinde geçerliliğini yitirecektir.
                </p>
                <p style="margin:8px 0 0;color:#999999;font-size:12px;line-height:1.6;">
                  Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz. Şifreniz değişmeyecektir.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8f5f0;padding:24px 40px;text-align:center;border-top:1px solid #eeeeee;">
              <p style="margin:0 0 4px;color:#999999;font-size:12px;">
                © ${new Date().getFullYear()} Dilim Pastaneleri — Tüm Hakları Saklıdır
              </p>
              <p style="margin:0;color:#bbbbbb;font-size:11px;">
                Kavacık · Ümraniye · İstanbul
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
