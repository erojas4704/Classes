const { BadRequestError } = require("../expressError");

/**
 * Converts a JSON object to a SQL command, allowing for partially updating a row in a table with 
 * an arbitrary list of properties.
 * @param {*} dataToUpdate The body of data with which we'll be updating our database row with.
 * @param {*} jsToSql A dictionary to translate names into their SQL counterparts. For example:
 * firstName to first_name, depending on the schema. If none is specified, it will default to the name of the 
 * key in the data supplied.
 * @returns A string with a formatted SQL query for a partial update.
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql = {}) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}
/**
 * Converts a JSON object to a SQL command, allowing for generating a WHERE clause with an arbitrary number of filters.
 * @param {*} criteria A dictionary containing the properties and values we're checking for.
 * @param {*} comparators A dictionary of operators we'll be using for comparison. Can be =, LIKE, <, >, and more.
 * @param {*} jsToSql A dictionary to translate names into their SQL counterparts. For example:
 * firstName to first_name, depending on the schema. If none is specified, it will default to the name of the 
 * key in the data supplied.
 * @returns A string with a formatted SQL query for a partial update.
 */
function generateWhereClause(criteria, comparators, jsToSql) {
  const keys = Object.keys(criteria);
  if (keys.length === 0) throw new BadRequestError("No data");

  const filters = keys.map((keyName, i) => {
    if(!comparators[keyName] || comparators[keyName] === 'ILIKE'){
      criteria[keyName] = `%${criteria[keyName]}%`; //Encapsulate in % if it's an ILIKE string.
    }

    return `${jsToSql[keyName] || keyName} ${comparators[keyName] || 'ILIKE'} $${i + 1}`
  });

  return {
    whereClause: `WHERE ${filters.join(" AND ")}`,
    values: Object.values(criteria)
  }
}
module.exports = { sqlForPartialUpdate, generateWhereClause };
