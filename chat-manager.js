import { client, DEFAULT_MODEL } from "./lib/openai.js";
import { addMessage, getMessages } from "./db/messages.js";
import { callTool, tools } from "./tools/index.js";

export async function askAssistant(userQuestion) {
  await addMessage(userQuestion);

  let input = getMessages();
  while (true) {
    const response = await client.responses.create({
      model: DEFAULT_MODEL,
      input,
      tools,
      tool_choice: "auto",
    });

    const functionCalls = response.output.filter(
      (item) => item.type === "function_call"
    );

    if (functionCalls.length === 0) {
      const content = response.output_text;
      await addMessage(content, "assistant");
      return content;
    }

    input = [...input, ...response.output];
    const toolResults = functionCalls.map((call) => ({
      type: "function_call_output",
      call_id: call.call_id,
      output: String(callTool(call.name, call.arguments)),
    }));
    toolResults.forEach((result, index) => {
      console.log(`[工具呼叫] ${functionCalls[index].name}(${functionCalls[index].arguments})`);
      console.log(`[工具結果] ${result.output}`);
    });
    input = [...input, ...toolResults];
  }
}