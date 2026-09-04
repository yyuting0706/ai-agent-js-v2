function tokenize(expression) {
  const tokens = [];
  let index = 0;

  while (index < expression.length) {
    if (/\s/.test(expression[index])) {
      index += 1;
      continue;
    }

    const number = expression.slice(index).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
    if (number) {
      tokens.push({ type: "number", value: Number(number[0]) });
      index += number[0].length;
      continue;
    }

    if ("+-*/()".includes(expression[index])) {
      tokens.push({ type: expression[index], value: expression[index] });
      index += 1;
      continue;
    }

    throw new Error(`不支援的字元：${expression[index]}`);
  }

  return tokens;
}

function parseExpression(tokens) {
  let position = 0;

  function primary() {
    const token = tokens[position];

    if (token?.type === "number") {
      position += 1;
      return token.value;
    }

    if (token?.type === "(") {
      position += 1;
      const value = additive();
      if (tokens[position]?.type !== ")") {
        throw new Error("括號不完整");
      }
      position += 1;
      return value;
    }

    throw new Error("缺少數字或左括號");
  }

  function unary() {
    if (tokens[position]?.type === "+") {
      position += 1;
      return unary();
    }
    if (tokens[position]?.type === "-") {
      position += 1;
      return -unary();
    }
    return primary();
  }

  function multiplicative() {
    let value = unary();
    while (["*", "/"].includes(tokens[position]?.type)) {
      const operator = tokens[position++].type;
      const right = unary();
      if (operator === "/" && right === 0) {
        throw new Error("不能除以零");
      }
      value = operator === "*" ? value * right : value / right;
    }
    return value;
  }

  function additive() {
    let value = multiplicative();
    while (["+", "-"].includes(tokens[position]?.type)) {
      const operator = tokens[position++].type;
      const right = multiplicative();
      value = operator === "+" ? value + right : value - right;
    }
    return value;
  }

  const result = additive();
  if (position !== tokens.length) {
    throw new Error("算式格式不正確");
  }
  return result;
}

export const calculatorTool = {
  type: "function",
  name: "calculate",
  description: "進行數學計算",
  parameters: {
    type: "object",
    properties: {
      expression: {
        type: "string",
        description: '要計算的算式，例如 "10 + 5 * 2"',
      },
    },
    required: ["expression"],
    additionalProperties: false,
  },
  strict: true,
};

export function calculate(expression) {
  if (typeof expression !== "string" || expression.trim() === "") {
    throw new Error("expression 必須是非空字串");
  }

  const result = parseExpression(tokenize(expression));
  if (!Number.isFinite(result)) {
    throw new Error("計算結果不是有限數值");
  }
  return result;
}