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

function createConversions(fromName, toName) {
  fromName = toKebab(fromName);
  toName = toKebab(toName);
  return [
    {
      from: fromName,
      to: toName,
    },
    {
      from: toJoined(fromName),
      to: toJoined(toName),
    },
    {
      from: toSnake(fromName),
      to: toSnake(toName),
    },
    {
      from: toCamel(fromName),
      to: toCamel(toName),
    },
    {
      from: toPascal(fromName),
      to: toPascal(toName),
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
  toJoined,
  toSnake,
  toCamel,
  toPascal,
  toKebab,
};
