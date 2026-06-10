export default function MenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="h-full m-0 p-0 overflow-hidden bg-black">
        {children}
      </body>
    </html>
  )
}
