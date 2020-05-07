import getters from '@/store/documents/documents.getters'

const state = { documentDeletionPending: [1, 2, 3] }

describe('documents module getters', () => {
  describe('isDocumentDeletionPending', () => {
    it('should return true if the given document id is marked as pending', () => {
      const result = getters.isDocumentDeletionPending(state)(1)
      expect(result).toBe(true)
    })

    it('should return false if the given document id is not marked as pending', () => {
      const result = getters.isDocumentDeletionPending(state)(4)
      expect(result).toBe(false)
    })
  })
})
