function toJoined(str) {
  return str.replace("-", "");
}

function toSnake(str) {
  return str.replace("-", "_");
}

function toCamel(str) {
  const tokens = str.split("-");
  return `${tokens[0]}${tokens
    .slice(1)
    .map((s) => `${s[0].toUpperCase()}${s.slice(1)}`)
    .join("")}`;
}

function toPascal(str) {
  const tokens = str.split("-");
  return tokens.map((s) => `${s[0].toUpperCase()}${s.slice(1)}`).join("");
}

module.exports = {
  toJoined,
  toSnake,
  toCamel,
  toPascal,
};
