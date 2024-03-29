import { callUpdateDocumentStatus } from '@/firebase/functions'
import DocumentsDB from '@/firebase/documents-db'
import UserDocumentsDB from '@/firebase/user-documents-db'
import UsersDB from '@/firebase/users-db'
import { storage } from 'firebase'
import { isNil } from 'lodash'

export default {
  /**
   * Fetch documents of current loggedin user
   */
  getUserDocuments: async ({ rootState, commit }) => {
    const userDocumentDb = new UserDocumentsDB(rootState.authentication.user.id)
    const documents = await userDocumentDb.readAll()
    commit('setDocuments', documents)
  },

  /**
   * Fetch documents for the user
   * @param {string} userId
   * @return void
   */
  getUserDocumentsById: async ({ commit }, userId) => {
    const userDocumentDB = new UserDocumentsDB(userId)
    const documents = await userDocumentDB.readAllAsAdmin()
    commit('setDocuments', documents)
  }, // getUserDocumentsById

  /*
   * Fetch all documents if logged user is admin
   */
  getAllDocuments: async ({ rootState, commit }) => {
    // FIXME romove all "clos"
    console.log('Get All Documents')
    console.log('rootState: ', rootState)
    const usersDb = new UsersDB(`${rootState.authentication.user.id}/**`)
    const documents = await usersDb.readAllAsAdmin()
    console.log('documents: ', documents)
    commit('setDocuments', documents)
  },

  // uploadFile: async ({ rootState }, file) => {
  //   try {
  //     const storageRef = storage().ref(`documents/${rootState.authentication.user.id}`)
  //       storageRef
  //         .child(`${file.name}/${element}`)
  //         .putString(upload[element], 'data_url')
  //         .then(snapshot => console.log(snapshot))
  //     })
  //   } catch (error) {
  //     commit('setDocumentCreationMessage', { type: 'error', message: error })
  //     throw new Error('Error al subir el documento', error)
  //   }
  // },

  /**
   * Create a document for current loggedin user
   */
  createUserDocument: async ({ commit, rootState }, document) => {
    let createdDocument = null
    const userDocumentDB = new UserDocumentsDB(rootState.authentication.user.id)
    // const documentsDB = new DocumentsDB(rootState.authentication.user.id)
    commit('setDocumentCreationPending', true)
    commit('setDocumentCreationMessage', {
      type: 'info',
      message: 'Creando documento',
    })
    const docUnique = await userDocumentDB.isUniqueUserDocument(
      document.name,
      rootState.authentication.user.id
    )
    const { upload } = document
    delete document.upload
    try {
      // console.log('docUnique', docUnique)
      userDocumentDB.set({ ...document }, { merge: true })
      if (docUnique) {
        document.status = 1
        try {
          createdDocument = await userDocumentDB.set(document, { merge: true })
          commit('addDocument', createdDocument)
          commit('setDocumentCreationPending', false)
          commit('setDocumentCreationMessage', {
            type: 'info',
            message: 'Documento creado',
          })
        } catch (error) {
          commit('setDocumentCreationMessage', {
            type: 'error',
            message: 'Error al crear el documento',
          })
          throw new Error('Error al crear el documento', error)
        }
      } else {
        try {
          // if (isNil(document.id)) throw new Error('Documento no encontrado')
          const result = await userDocumentDB.getDocumentByName(document.name)

          createdDocument = result.shift()
        } catch (error) {
          throw new Error('Error al obtener el documento', error)
        }
      }
      if (upload) {
        try {
          commit('setDocumentCreationPending', true)
          commit('setDocumentCreationMessage', {
            type: 'warning',
            message: 'Guardando documento',
          })
          const documentsRef = []
          try {
            upload.forEach((element, index) => {
              const documentName = index
              const refDoc = `documents/${rootState.authentication.user.id}/${createdDocument.id}/${documentName}`
              // TODO refctor extract to func 202112.27-09.21
              storage()
                .ref(refDoc)
                .put(element)
                .then(async () => {
                  try {
                    documentsRef.push(refDoc)
                  } catch (error) {
                    commit('setDocumentCreationMessage', {
                      type: 'danger',
                      message:
                        'Error al actualizar el documento vuelva a intentar de nuevo más tarde',
                    })
                    commit('setDocumentCreationPending', false)
                  }
                })
                .then(() => {
                  try {
                    documentsRef.map((documentRef) => {
                      const node = `files.${documentName}`
                      return userDocumentDB.update(
                        {
                          ...createdDocument,
                          [node]: documentRef,
                        },
                        { merge: true }
                      )
                    })
                  } catch (error) {
                    commit('setDocumentCreationMessage', {
                      type: 'danger',
                      message:
                        'Error al actualizar la referencia del documento vuelva a intentar de nuevo más tarde',
                    })
                    commit('setDocumentCreationPending', false)
                  }
                })
                .finally(() => {
                  commit('setDocumentCreationMessage', {
                    type: 'success',
                    message: 'Éxito',
                  })
                  commit('setDocumentCreationPending', false)
                })
            })
          } catch (error) {
            commit('setDocumentCreationMessage', {
              type: 'danger',
              message:
                'Error al crear el documento vuelva a intentar de nuevo más tarde',
            })
            commit('setDocumentCreationPending', false)
          }
        } catch (error) {
          commit('setDocumentCreationMessage', {
            type: 'error',
            message: error,
          })
          commit('setDocumentCreationPending', false)
          throw new Error('Error al subir el documento', error)
        }
      }
      // return createdDocument
    } catch (error) {
      commit('setDocumentCreationMessage', { type: 'error', message: error })
      console.log('Error', error)
    }
    return createdDocument
  },

  /** Updates or insert document based on the presence of id */
  upsertUserDocument: async ({ commit, rootState }, document) => {
    const userDocumentDB = new UserDocumentsDB(rootState.authentication.user.id)
    commit('setDocumentCreationPending', true)
    commit('setDocumentCreationMessage', {
      type: 'info',
      message: 'Actualizando documento',
    })
    try {
      const { upload, ...restDocument } = document
      const createdDocument = await userDocumentDB
        .upsert(restDocument)
        .then((doc) => userDocumentDB.upload(doc, upload))
      commit('setDocumentCreationPending', false)
      commit('setDocumentCreationMessage', {
        type: 'success',
        message: 'Éxito',
      })
      return createdDocument
    } catch (error) {
      commit('setDocumentCreationMessage', {
        type: 'error',
        message: `Error al procesar el documento ${error}`,
      })
    }
    commit('setDocumentCreationMessage', {
      type: 'error',
      message: `Error al procesar el documento`,
    })
    return null
  },

  /** Update document status to "for revision"
this is fixed so de user can not accept her own documents
 */
  setDocumentForReview: async ({ rootState, state }, data) => {
    if (isNil(data) || isNil(data.id)) return null
    async function getDocumentReference(id) {
      console.log('id :>> ', id)
      const documentsDB = new DocumentsDB(rootState.authentication.user.id)
      const constraints = [['documentId', '==', id]]
      const docs = await documentsDB.readAll(constraints)
      console.log('docs :>> ', docs[0].id)
      return docs[0].id
    }
    const documentReference = await getDocumentReference(data.id)
    console.log('documentReference :>> ', documentReference)
    data.status = Number(1)
    console.log('state :>> ', state)
    console.log('data :>> ', data)
    const userDocumentDb = new UserDocumentsDB(rootState.authentication.user.id)
    const res = await userDocumentDb
      .update(data)
      .then((result) => {
        // TODO Sedn message back to caller 202108.08-13.32
        return result
      })
      .then(() => {
        console.log('callUpdateDocumentStatus')
        return callUpdateDocumentStatus(documentReference, 1, '')
      })
    // .then(result => {
    //   // this.message = result.data.message
    //   console.log('callUpdateDocumentStatus')
    //   console.log('result :>> ', result)
    // })
    return res
  },

  /**
   * Create a new document for current loggedin user and reset document name input
   */
  triggerAddDocumentAction: ({ dispatch, state, commit }, data) => {
    if (state.documentNameToCreate === '') return

    const document = { name: state.documentNameToCreate, ...data }
    commit('setDocumentNameToCreate', '')
    dispatch('createUserDocument', document)
  },

  /**
   * Delete a user document from its id
   */
  deleteUserDocument: async ({ rootState, commit, getters }, documentId) => {
    if (getters.isDocumentDeletionPending(documentId)) return

    const userDocumentsDb = new UserDocumentsDB(
      rootState.authentication.user.id
    )
    commit('addDocumentDeletionPending', documentId)
    await userDocumentsDb.delete(documentId)
    commit('removeDocumentById', documentId)
    commit('removeDocumentDeletionPending', documentId)
  },

  rejectDocument: async ({ commit }, { documentId, message }) => {
    commit('addDocumentRejectionPending', documentId)
    commit('setDocumentRejectionMessage', {
      type: 'info',
      message: 'Rechazando documento',
    })
    const documentsDB = new DocumentsDB()
    return documentsDB
      .reject(documentId, message)
      .then((document) => {
        commit('removeDocumentRejectionPending', documentId)
        commit('setCurrentDocument', document)
      })
      .catch((error) => {
        commit('setDocumentRejectionMessage', { type: 'error', message: error })
        commit('removeDocumentRejectionPending', documentId)
        return { type: 'error', message: error }
      })
      .finally(() => {
        commit('setDocumentRejectionMessage', {
          type: 'success',
          message: 'Documento rechazado exitosamente',
        })
      }) // end finally
  }, // end rejectDocument
  acceptDocument: async ({ commit }, { documentId }) => {
    // commit('addDocumentAcceptationPending', documentId)
    commit('setDocumentAcceptMessage', {
      type: 'info',
      message: 'Aceptando documento',
    })
    const documentsDB = new DocumentsDB()
    return documentsDB
      .accept(documentId)
      .then((document) => {
        // commit('removeDocumentAcceptationPending', documentId)
        commit('setCurrentDocument', document)
      })
      .catch((error) => {
        commit('setDocumentAcceptMessage', {
          type: 'error',
          message: error,
        })
        // commit('removeDocumentAcceptationPending', documentId)
        return { type: 'error', message: error }
      })
      .finally(() => {
        commit('setDocumentAcceptMessage', {
          type: 'success',
          message: 'Documento aceptado',
        })
      }) // end finally
  }, // end acceptDocument
  deleteDocument: async ({ commit }, { documentId }) => {
    commit('setDocumentDeleteMessage', {
      type: 'info',
      message: 'Borrando el documento',
    })
    const documentsDB = new DocumentsDB()
    return documentsDB
      .delete(documentId)
      .then(() => {
        // commit('removeDocumentById', documentId)
        commit('setCurrentDocument', null)
      })
      .catch((error) => {
        commit('setDocumentDeleteMessage', {
          type: 'error',
          message: error,
        })
        // commit('removeDocumentAcceptationPending', documentId)
        return { type: 'error', message: error }
      })
      .finally(() => {
        commit('setDocumentDeleteMessage', {
          type: 'success',
          message: 'Documento borrado',
        })
      }) // end finally
  }, // end deleteDocument
}
