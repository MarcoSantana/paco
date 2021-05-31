import GenericDB from './generic-db'

export default class CollegeCampiDB extends GenericDB {
  constructor(collegeId) {
    super(`colleges/${collegeId}/campi`)
  }
}
