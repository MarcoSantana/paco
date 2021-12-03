import { isNil, keys, cloneDeep } from 'lodash'
import firebase from 'firebase/app'

import firestore from './async-firestore'

export default class GenericDB {
  constructor(collectionPath) {
    this.collectionPath = collectionPath
  }

  /**
   * Create a document in the collection
   * @param data
   * @param id
   */
  async create(data, id = null) {
    const collectionRef = (await firestore()).collection(this.collectionPath)
    const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp()

    const dataToCreate = {
      ...data,
      createTimestamp: serverTimestamp,
      updateTimestamp: serverTimestamp,
    }

    const createPromise = isNil(id)
      ? // Create doc with generated id
      collectionRef.add(dataToCreate).then(doc => doc.id)
      : // Create doc with custom id
      collectionRef
        .doc(id)
        .set(dataToCreate)
        .then(() => id)

    const docId = await createPromise

    return {
      id: docId,
      ...data,
      createTimestamp: new Date(),
      updateTimestamp: new Date(),
    }
  }

  /**
   * Read a document in the collection
   * @param id
   */
  async read(id) {
    const result = await (await firestore())
      .collection(this.collectionPath)
      .doc(id)
      .get()

    const data = result.exists ? result.data() : null

    if (isNil(data)) return null

    this.convertObjectTimestampPropertiesToDate(data)
    return { id, ...data }
  }

  /**
   * Read all documents in the collection following constraints
   * @param constraints
   */
  async readAll(constraints = null) {
    const collectionRef = (await firestore()).collection(this.collectionPath)
    let query = collectionRef

    if (constraints) {
      constraints.forEach(constraint => {
        query = query.where(...constraint)
      })
    }

    const formatResult = result =>
      result.docs.map(ref =>
        this.convertObjectTimestampPropertiesToDate({
          id: ref.id,
          ...ref.data(),
        })
      )

    return query.get().then(formatResult)
  }

  /**
   * Read the requested document collection with constraints, limits and
   * pagination
   */
  // WIP 🌠🚀: 202108.01-08.48

  async readWithPagination(constraints = null, startAt = null, endAt = null, limit = null, orderBy = null) {
    const collectionRef = (await firestore()).collection(this.collectionPath)
    let query = collectionRef
    if (startAt) {
      query = query.orderBy(firebase.firestore.FieldPath.documentId())
      query = query.startAfter(startAt)
    }
    if (endAt) {
      query = query.orderBy(firebase.firestore.FieldPath.documentId())
      query = query.endBefore(endAt)
    }
    if (constraints) {
      constraints.forEach(constraint => {
        query = query.where(...constraint)
      })
    }
    const formatResult = result =>
      result.docs.map(ref =>
        this.convertObjectTimestampPropertiesToDate({
          id: ref.id,
          ...ref.data(),
        })
      )
    if (orderBy) {
      orderBy.forEach(order => {
        console.log('orderBy', order)
        query = query.orderBy(...order)
      })
    }
    if (limit) query = query.limit(limit)
    if (endAt) {
      try {
        const querySnapshot = query.get()
        return querySnapshot.docs.reverse().then(formatResult)
      } catch (error) {
        console.log('error :>> ', error)
      }
    }
    return query.get().then(formatResult)
  }

  /**
   * Read all documents
   * @param constraints
   */
  async readAllAsAdmin(constraints = null) {
    const collectionRef = (await firestore()).collection(this.collectionPath)
    console.log('readAllAsAdmin')
    let query = collectionRef
    console.log('query', query)

    if (constraints) {
      constraints.forEach(constraint => {
        console.log('constraint :>> ', constraint)
        query = query.where(...constraint)
      })
    }

    const formatResult = result =>
      result.docs.map(ref =>
        this.convertObjectTimestampPropertiesToDate({
          id: ref.id,
          ...ref.data(),
        })
      )

    return query.get().then(formatResult)
  }

  /**
   * Update a document in the collection
   * @param data
   */
  async update(data) {
    const { id } = data
    const clonedData = cloneDeep(data)
    delete clonedData.id

    await (await firestore())
      .collection(this.collectionPath)
      .doc(id)
      .update({
        ...clonedData,
        updateTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })

    return id
  }

  /**
   * Delete a document in the collection
   * @param id
   */
  async delete(id) {
    return (await firestore())
      .collection(this.collectionPath)
      .doc(id)
      .delete()
  }

  /**
   * Soft Delete a document in the collection
   * @param id
   */
  async softDelete(id) {
    return (await firestore())
      .collection(this.collectionPath)
      .doc(id)
      .update({
        deletedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: 5,
        // status 5 "Borrado"
      })
  }

  /**
   * Convert all object Timestamp properties to date
   * @param obj
   */
  convertObjectTimestampPropertiesToDate(obj) {
    const newObj = {}

    keys(obj)
      .filter(prop => obj[prop] instanceof Object)
      .forEach(prop => {
        if (obj[prop] instanceof firebase.firestore.Timestamp) {
          newObj[prop] = obj[prop].toDate()
        } else {
          this.convertObjectTimestampPropertiesToDate(obj[prop])
        }
      })

    return {
      ...obj,
      ...newObj,
    }
  }
}
