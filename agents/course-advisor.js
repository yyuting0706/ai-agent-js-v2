import { Agent, MCPServerStdio } from "@openai/agents";
import { toAgentTool } from "../utils/agent-tool.js";
import { buildInstructions } from "../profiles/agent-profiles.js";
import { courseAdvisorProfile } from "../profiles/course-advisor.js";
import { courseSearchTool, learningPlanTool } from "../tools/courses.js";
import { currentTimeTool } from "../tools/current_time.js";
import {
  DEFAULT_AGENT_MODEL,
  DEFAULT_AGENT_MODEL_SETTINGS,
} from "./classroom.js";

export const defaultCourseAdvisorToolset = {
  searchCourses: courseSearchTool,
  buildLearningPlan: learningPlanTool,
  currentTime: currentTimeTool,
};

export async function buildCourseAdvisor({
  model = DEFAULT_AGENT_MODEL,
  modelSettings = DEFAULT_AGENT_MODEL_SETTINGS,
  useMcp = true,
  toolset = defaultCourseAdvisorToolset,
} = {}) {
  const tenlongMcp = useMcp
    ? new MCPServerStdio({
        fullCommand: "node mcp-server.js",
        name: "tenlong",
        cacheToolsList: true,
      })
    : null;

  if (tenlongMcp) await tenlongMcp.connect();

  const agent = Agent.create({
    name: courseAdvisorProfile.name,
    model,
    modelSettings,
    instructions: buildInstructions(courseAdvisorProfile),
    tools: [
      toAgentTool(toolset.searchCourses),
      toAgentTool(toolset.buildLearningPlan),
      toAgentTool(toolset.currentTime),
    ],
    ...(tenlongMcp && { mcpServers: [tenlongMcp] }),
  });

  return {
    agent,
    close: async () => {
      if (tenlongMcp) await tenlongMcp.close();
    },
  };
}
