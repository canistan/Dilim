import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const auditLogAfterChange = (collectionName: string): CollectionAfterChangeHook => async ({ doc, previousDoc, operation, req }) => {
  // Only log if the action is done by a user in the 'users' collection (an Admin)
  const user = req.user
  if (user && user.collection === 'users') {
    try {
      let actionText = ''
      if (operation === 'create') {
        actionText = `${collectionName} tablosunda yeni bir kayıt oluşturuldu.`
      } else if (operation === 'update') {
        actionText = `${collectionName} tablosunda bir kayıt güncellendi.`
      }

      const docTitle = doc.name || doc.title || doc.slug || doc.orderNumber || doc.id

      await req.payload.create({
        collection: 'audit-logs' as any,
        data: {
          action: actionText,
          user: user.id,
          details: {
            operation,
            collection: collectionName,
            recordId: doc.id,
            docTitle
          }
        },
        req, // pass req to maintain transaction context if applicable
      })
    } catch (e) {
      console.error('Error creating audit log after change:', e)
    }
  }

  return doc
}

export const auditLogAfterDelete = (collectionName: string): CollectionAfterDeleteHook => async ({ req, id, doc }) => {
  const user = req.user
  if (user && user.collection === 'users') {
    try {
      const docTitle = doc.name || doc.title || doc.slug || doc.orderNumber || id

      await req.payload.create({
        collection: 'audit-logs' as any,
        data: {
          action: `${collectionName} tablosunda bir kayıt silindi.`,
          user: user.id,
          details: {
            operation: 'delete',
            collection: collectionName,
            recordId: id,
            docTitle
          }
        },
        req,
      })
    } catch (e) {
      console.error('Error creating audit log after delete:', e)
    }
  }
}
