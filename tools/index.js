import { calculate, calculatorTool } from "./calculator.js";

export const tools = [calculatorTool];

const implementations = {
  calculate: ({ expression }) => calculate(expression),
};

export function callTool(name, argumentsJson) {
  const implementation = implementations[name];
  if (!implementation) {
    throw new Error(`找不到工具：${name}`);
  }

  return implementation(JSON.parse(argumentsJson));
}