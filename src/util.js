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

function toKebab(str) {
  for (const c of str) {
    switch (c) {
      case "-":
        return str;
      case "_":
        return str.replaceAll("_", "-");
    }
  }

  let ret = str[0].toLowerCase();
  for (const c of str.slice(1)) {
    if (c === c.toUpperCase()) {
      ret += `-${c.toLowerCase()}`;
    } else {
      ret += c;
    }
  }
  return ret;
}

module.exports = {
  toJoined,
  toSnake,
  toCamel,
  toPascal,
  toKebab,
};
