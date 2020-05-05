import actions from '@/store/documents/documents.actions'

jest.mock('@/firebase/user-documents-db', () => ({
  UserDocumentsDB: jest.mock(),
}))

const mockUsersDbReadAll = jest.fn()
const mockUsersDbCreate = jest.fn()
const mockUsersDbDelete = jest.fn()
jest.mock('@/firebase/user-documents-db', () =>
  jest.fn().mockImplementation(() => ({
    readAll: mockUsersDbReadAll,
    create: mockUsersDbCreate,
    delete: mockUsersDbDelete,
  }))
)

const commit = jest.fn()
const dispatch = jest.fn()
const isDocumentDeletionPending = jest.fn()
const userId = 11
const user = { id: userId }
const document1 = { id: 1, name: 'document1' }
const document2 = { id: 2, name: 'document2' }
const rootState = {
  authentication: {
    user,
  },
}
const getters = {
  isDocumentDeletionPending,
}

afterEach(() => {
  commit.mockReset()
  dispatch.mockReset()
  mockUsersDbReadAll.mockReset()
  mockUsersDbCreate.mockReset()
  mockUsersDbDelete.mockReset()
  isDocumentDeletionPending.mockReset()
})

describe('documents module action', () => {
  describe('getUserDocuments', () => {
    it('should set documents with ones owned by the current user', async () => {
      mockUsersDbReadAll.mockResolvedValue([document1, document2])
      await actions.getUserDocuments({ commit, rootState })
      expect(commit).toHaveBeenCalledWith('setDocuments', [document1, document2])
    })
  })

  describe('createUserDocument', () => {
    it('should set document creation as pending first', async () => {
      mockUsersDbCreate.mockResolvedValue(document2)
      await actions.createUserDocument({ commit, rootState })
      expect(commit).toHaveBeenNthCalledWith(1, 'setDocumentCreationPending', true)
    })

    it('should add document', async () => {
      mockUsersDbCreate.mockResolvedValue(document2)
      await actions.createUserDocument({ commit, rootState }, document1)
      expect(commit).toHaveBeenNthCalledWith(2, 'addDocument', document2)
    })

    it('should set document creation as not pending after adding document', async () => {
      mockUsersDbCreate.mockResolvedValue(document2)
      await actions.createUserDocument({ commit, rootState }, document1)
      expect(commit).toHaveBeenNthCalledWith(3, 'setDocumentCreationPending', false)
    })
  })

  describe('triggerAddDocumentAction', () => {
    describe('when the name of the document is empty', () => {
      const state = {
        documentNameToCreate: '',
      }

      it('should not set input name to empty', () => {
        actions.triggerAddDocumentAction({ dispatch, state, commit })
        expect(commit).not.toHaveBeenCalled()
      })

      it('should not dispatch create document action', () => {
        actions.triggerAddDocumentAction({ dispatch, state, commit })
        expect(dispatch).not.toHaveBeenCalled()
      })
    })

    describe('when the name of the document is not empty', () => {
      const state = {
        documentNameToCreate: 'todo',
      }

      it('should set input name to empty', () => {
        actions.triggerAddDocumentAction({ dispatch, state, commit })
        expect(commit).toHaveBeenCalledWith('setDocumentNameToCreate', '')
      })

      it('should dispatch create document action', () => {
        actions.triggerAddDocumentAction({ dispatch, state, commit })
        expect(dispatch).toHaveBeenCalledWith('createUserDocument', {
          name: 'todo',
        })
      })
    })
  })

  describe('deleteUserDocument', () => {
    describe('when the document is currently being deleted', () => {
      it('should not do anything', async () => {
        isDocumentDeletionPending.mockReturnValue(true)
        await actions.deleteUserDocument({ commit, rootState, getters }, 1)
        expect(commit).not.toHaveBeenCalled()
      })
    })

    describe('when the document is not currently being deleted', () => {
      it('should set document as deletion pending first', async () => {
        getters.isDocumentDeletionPending.mockReturnValue(false)
        await actions.deleteUserDocument({ commit, rootState, getters }, 1)
        expect(commit).toHaveBeenNthCalledWith(1, 'addDocumentDeletionPending', 1)
      })

      it('should remove document in store', async () => {
        await actions.deleteUserDocument({ commit, rootState, getters }, 1)
        expect(commit).toHaveBeenNthCalledWith(2, 'removeDocumentById', 1)
      })

      it('should remove document in db', async () => {
        await actions.deleteUserDocument({ commit, rootState, getters }, 1)
        expect(mockUsersDbDelete).toHaveBeenCalledWith(1)
      })

      it('should set document as not deletion pending after having removed the document', async () => {
        await actions.deleteUserDocument({ commit, rootState, getters }, 1)
        expect(commit).toHaveBeenNthCalledWith(3, 'removeDocumentDeletionPending', 1)
      })
    })
  })
})
