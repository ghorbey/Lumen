/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper('concat', function (...values: unknown[]) {
  let outStr = '';
  for (const arg in values) {
    if (typeof values[arg] != 'object') {
      outStr += values[arg];
    }
  }
  return outStr;
});

// inc, for those off-by-one errors
Handlebars.registerHelper('inc', function (value: string) {
  return parseInt(value) + 1;
});

// dec, for those off-by-one errors
Handlebars.registerHelper('dec', function (value: string) {
  return parseInt(value) - 1;
});

// cons, to concatenate strs. Can take any number of args. Last is omitted (as it is just a handlebars ref object)
Handlebars.registerHelper('concat', function (...values: unknown[]) {
  return values.slice(0, values.length - 1).join('');
});

// get an index from an array
Handlebars.registerHelper('idx', function (array: unknown[], index: number) {
  return array[index];
});

// Equal-to evaluation
Handlebars.registerHelper('eq', function (val1: string | number, val2: string | number) {
  return val1 === val2;
});

// Equal-to evaluation
Handlebars.registerHelper('neq', function (val1: string | number, val2: string | number) {
  return val1 !== val2;
});

// Logical "or" evaluation
Handlebars.registerHelper('or', function (val1: string | number, val2: string | number) {
  return val1 || val2;
});

// Greater-than evaluation
Handlebars.registerHelper('gt', function (val1: string | number, val2: string | number) {
  return val1 > val2;
});

// Less-than evaluation
Handlebars.registerHelper('lt', function (val1: string | number, val2: string | number) {
  return val1 < val2;
});

Handlebars.registerHelper('lower-case', function (value: string) {
  return value.toLowerCase();
});

Handlebars.registerHelper('upper-case', function (value: string) {
  return value.toUpperCase();
});
