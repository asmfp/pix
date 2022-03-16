// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Course'.
const Course = require('../../domain/models/Course');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const courseDatasource = require('../datasources/learning-content/course-datasource');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'LearningCo... Remove this comment to see the full error message
const LearningContentResourceNotFound = require('../datasources/learning-content/LearningContentResourceNotFound');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_toDomain'... Remove this comment to see the full error message
function _toDomain(courseDataObject: any) {
  return new Course({
    id: courseDataObject.id,
    name: courseDataObject.name,
    description: courseDataObject.description,
    imageUrl: courseDataObject.imageUrl,
    challenges: courseDataObject.challenges,
    competences: courseDataObject.competences,
  });
}

// @ts-expect-error ts-migrate(2393) FIXME: Duplicate function implementation.
async function _get(id: any) {
  try {
    const courseDataObject = await courseDatasource.get(id);
    return _toDomain(courseDataObject);
  } catch (error) {
    if (error instanceof LearningContentResourceNotFound) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 0.
      throw new NotFoundError();
    }
    throw error;
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(id: any) {
    return _get(id);
  },

  async getCourseName(id: any) {
    try {
      const course = await _get(id);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'unknown'.
      return course.name;
    } catch (err) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      throw new NotFoundError("Le test demandé n'existe pas");
    }
  },
};
