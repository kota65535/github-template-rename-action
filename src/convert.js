const {
  camelCase,
  snakeCase,
  capitalCase,
  constantCase,
  noCase,
  paramCase,
} = require("change-case");

function createConversions(fromName, toName) {
  return [
    {
      from: fromName,
      to: toName,
    },
    // no case
    {
      from: noCase(fromName),
      to: noCase(toName),
    },
    // flatcase
    {
      from: noCase(fromName, { delimiter: "" }),
      to: noCase(toName, { delimiter: "" }),
    },
    // camelCase
    {
      from: camelCase(fromName),
      to: camelCase(toName),
    },
    // PascalCase
    {
      from: capitalCase(fromName, { delimiter: "" }),
      to: capitalCase(toName, { delimiter: "" }),
    },
    // snake_case
    {
      from: snakeCase(fromName),
      to: snakeCase(toName),
    },
    // SCREAMING_SNAKE_CASE
    {
      from: constantCase(fromName),
      to: constantCase(toName),
    },
    // kebab-case
    {
      from: paramCase(fromName),
      to: paramCase(toName),
    },
  ];
}

function convert(conversions, str) {
  conversions.forEach((c) => (str = str.replaceAll(c.from, c.to)));
  return str;
}

module.exports = {
  createConversions,
  convert,
};
