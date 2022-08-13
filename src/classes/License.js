import { I18n } from 'i18n-js' // eslint-disable-line
import es from '@/locales/es' // eslint-disable-line

const translate = new I18n({ es: { ...es } })
translate.locale = 'es'
translate.defaultLocale = 'es'

const options = { scope: 'academicProfile.license' }

// convert to utf8 unkown encoding

const toProperCase = str => {
  return str
    .replace(/\w\S*/g, txt => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
    .replace(/\s/g, '')
}

/**@typedef License
 * @property {string} type
 * @property {string} title
 * @property {number} registrationYear - i.e. 2015
 * @property {string} institution -- i.e. UNIVERSIDAD AUTÓNOMA DE TLAXCALA
 * @property {lastName} lastname
 * @property {lastName2} lastname2
 * @property {string} licenseNumber
 * @property {string} [curp]
 * @property {string} name
 */

/**
 * A license object factory
 * @param {License} license
 * @returns {License}
 */
const createLicense = ({
  curp,
  gender,
  institution,
  lastname,
  lastname2,
  licenseNumber,
  name,
  registrationYear,
  title,
  type,
}) => ({
  curp,
  gender,
  institution,
  lastname,
  lastname2,
  licenseNumber,
  name,
  registrationYear,
  title,
  type,
  // add a method taht returns the full name of the license
  fullName: () =>
    `${translate.t('name', {
      item: name,
      ...options,
    })}${name} ${lastname} ${lastname2}`,

  // documentName: () => translate(`documentName`),
  fullTitle: () => `${translate.t(`title`, { item: title, ...options })}`,
  toArray: () => [
    translate.t(`type`, { item: type, ...options }),
    translate.t(`title`, { item: title, ...options }),
    translate.t(`licenseNumber`, {
      item: licenseNumber,
      ...options,
    }),
    translate.t(`registrationYear`, {
      item: registrationYear,
      ...options,
    }),
    translate.t(`institution`, {
      item: toProperCase(institution),
      ...options,
    }),
    translate.t(`lastname`, { item: toProperCase(lastname), ...options }),
    translate.t(`lastname2`, { item: toProperCase(lastname2), ...options }),
    translate.t(`name`, { item: toProperCase(name), ...options }),
  ],
  fullName2: () =>
    Buffer.from(`${name} ${lastname} ${lastname2}`).toString('utf8'),
  fullNameProperCase: () => this.fullName.toString('utf8').toProperCase(),
})

export default createLicense
