// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const Models = require('../../domain/models');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  buildDomainObjects,
  buildDomainObject,
};

function buildDomainObjects(BookshelfClass: any, bookshelfObjects: any) {
  return bookshelfObjects.map((bookshelfObject: any) => buildDomainObject(BookshelfClass, bookshelfObject));
}

function buildDomainObject(BookshelfClass: any, bookshelfObject: any) {
  if (bookshelfObject) {
    return _buildDomainObject(BookshelfClass, bookshelfObject.toJSON());
  }
  return null;
}

function _buildDomainObject(BookshelfClass: any, bookshelfObjectJson: any) {
  const Model = Models[BookshelfClass.modelName];
  const domainObject = new Model();

  const mappedObject = _.mapValues(domainObject, (value: any, key: any) => {
    const { relationshipType, relationshipClass } = _getBookshelfRelationshipInfo(BookshelfClass, key);

    if ((relationshipType === 'belongsTo' || relationshipType === 'hasOne') && _.isObject(bookshelfObjectJson[key])) {
      return _buildDomainObject(relationshipClass, bookshelfObjectJson[key]);
    }

    if (
      (relationshipType === 'hasMany' || relationshipType === 'belongsToMany') &&
      _.isArray(bookshelfObjectJson[key])
    ) {
      return bookshelfObjectJson[key].map((bookshelfObject: any) => _buildDomainObject(relationshipClass, bookshelfObject));
    }

    return bookshelfObjectJson[key];
  });

  return new Model(mappedObject);
}

function _getBookshelfRelationshipInfo(BookshelfClass: any, key: any) {
  const relatedData =
    typeof BookshelfClass.prototype[key] === 'function' && BookshelfClass.prototype[key]().relatedData;

  if (relatedData) {
    return { relationshipType: relatedData.type, relationshipClass: relatedData.target };
  } else {
    return {};
  }
}
