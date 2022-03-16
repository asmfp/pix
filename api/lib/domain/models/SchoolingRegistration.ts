const STATUS = {
  STUDENT: 'ST',
  APPRENTICE: 'AP',
};
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
class SchoolingRegistration {
  MEFCode: any;
  birthCity: any;
  birthCityCode: any;
  birthCountryCode: any;
  birthProvinceCode: any;
  birthdate: any;
  division: any;
  firstName: any;
  id: any;
  isDisabled: any;
  lastName: any;
  middleName: any;
  nationalStudentId: any;
  organizationId: any;
  preferredLastName: any;
  sex: any;
  status: any;
  thirdName: any;
  updatedAt: any;
  userId: any;
  constructor({
    id,
    lastName,
    preferredLastName,
    firstName,
    middleName,
    thirdName,
    sex = null,
    birthdate,
    birthCity,
    birthCityCode,
    birthProvinceCode,
    birthCountryCode,
    MEFCode,
    status,
    nationalStudentId,
    division,
    isDisabled,
    updatedAt,
    userId,
    organizationId
  }: any = {}) {
    this.id = id;
    this.lastName = lastName;
    this.preferredLastName = preferredLastName;
    this.firstName = firstName;
    this.middleName = middleName;
    this.thirdName = thirdName;
    this.sex = sex;
    this.birthdate = birthdate;
    this.birthCity = birthCity;
    this.birthCityCode = birthCityCode;
    this.birthProvinceCode = birthProvinceCode;
    this.birthCountryCode = birthCountryCode;
    this.MEFCode = MEFCode;
    this.status = status;
    this.nationalStudentId = nationalStudentId;
    this.division = division;
    this.isDisabled = isDisabled;
    this.updatedAt = updatedAt;
    this.userId = userId;
    this.organizationId = organizationId;
  }
}

SchoolingRegistration.STATUS = STATUS;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SchoolingRegistration;
