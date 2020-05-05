import mutations from '@/store/documents/documents.mutations'
import { cloneDeep } from 'lodash'

const document1 = { id: 1, name: 'document1' }
const document2 = { id: 2, name: 'document2' }
const baseState = {
  documents: [document1, document2],
  documentNameToCreate: '',
  documentDeletionPending: [1],
  documentCreationPending: false,
}

describe('documents module mutations', () => {
  describe('setDocumentNameToCreate', () => {
    it('should set document name to create correctly', () => {
      const state = cloneDeep(baseState)
      mutations.setDocumentNameToCreate(state, 'toto')
      expect(state).toEqual({
        ...baseState,
        documentNameToCreate: 'toto',
      })
    })
  })

  describe('setDocuments', () => {
    it('should set documents correctly', () => {
      const state = { ...cloneDeep(baseState), documents: [] }
      mutations.setDocuments(state, [document2, document1])
      expect(state).toEqual({
        ...baseState,
        documents: [document2, document1],
      })
    })
  })

  describe('addDocuments', () => {
    it('should add document correctly', () => {
      const state = { ...cloneDeep(baseState), documents: [] }
      mutations.addDocument(state, document1)
      expect(state).toEqual({
        ...baseState,
        documents: [document1],
      })
    })
  })

  describe('removeDocumentById', () => {
    it('should remove document correctly', () => {
      const state = cloneDeep(baseState)
      mutations.removeDocumentById(state, 2)
      expect(state).toEqual({
        ...baseState,
        documents: [document1],
      })
    })
  })

  describe('addDocumentDeletionPending', () => {
    it('should mark document as deletion correctly', () => {
      const state = cloneDeep(baseState)
      mutations.addDocumentDeletionPending(state, 2)
      expect(state).toEqual({
        ...baseState,
        documentDeletionPending: [1, 2],
      })
    })
  })

  describe('removeDocumentDeletionPending', () => {
    it('should unmark document as deletion correctly', () => {
      const state = cloneDeep(baseState)
      mutations.removeDocumentDeletionPending(state, 1)
      expect(state).toEqual({
        ...baseState,
        documentDeletionPending: [],
      })
    })
  })

  describe('setDocumentCreationPending', () => {
    it('should set document creation pending correctly', () => {
      const state = cloneDeep(baseState)
      mutations.setDocumentCreationPending(state, true)
      expect(state).toEqual({
        ...baseState,
        documentCreationPending: true,
      })
    })
  })
})
