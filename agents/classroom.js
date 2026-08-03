import { Agent, MCPServerStdio } from "@openai/agents";
import { toAgentTool } from "../utils/agent-tool.js";
import {
  weatherTool,
  youbikeTool,
  currentTimeTool,
  netflixTool,
  pythonBookTool,
} from "../tools/index.js";
import {
  buildInstructions,
  classroomProfile,
  teacherProfiles,
} from "../profiles/agent-profiles.js";
import {
  DEFAULT_MODEL,
  DEFAULT_MODEL_SETTINGS,
} from "../lib/models.js";

export const DEFAULT_AGENT_MODEL = DEFAULT_MODEL;
export const DEFAULT_AGENT_MODEL_SETTINGS = DEFAULT_MODEL_SETTINGS;

export const defaultClassroomToolset = {
  currentTime: currentTimeTool,
  weather: weatherTool,
  youbike: youbikeTool,
  netflix: netflixTool,
  pythonBook: pythonBookTool,
};

export async function buildClassroomAgent({
  model = DEFAULT_AGENT_MODEL,
  modelSettings = DEFAULT_AGENT_MODEL_SETTINGS,
  useMcp = true,
  memoryContext = "",
  toolset = defaultClassroomToolset,
} = {}) {
  const tenlongMcp = useMcp
    ? new MCPServerStdio({
        fullCommand: "node mcp-server.js",
        name: "tenlong",
        cacheToolsList: true,
      })
    : null;

  if (tenlongMcp) {
    await tenlongMcp.connect();
  }

  const phpTeacher = new Agent({
    name: teacherProfiles.php.name,
    model,
    modelSettings,
    instructions: buildInstructions(teacherProfiles.php),
    handoffDescription: teacherProfiles.php.handoffDescription,
  });

  const vueTeacher = new Agent({
    name: teacherProfiles.vue.name,
    model,
    modelSettings,
    instructions: buildInstructions(teacherProfiles.vue),
    handoffDescription: teacherProfiles.vue.handoffDescription,
  });

  const pythonTeacher = new Agent({
    name: teacherProfiles.python.name,
    model,
    modelSettings,
    instructions: buildInstructions(teacherProfiles.python),
    handoffDescription: teacherProfiles.python.handoffDescription,
    tools: [toAgentTool(toolset.pythonBook)],
  });

  const homeroom = Agent.create({
    name: classroomProfile.name,
    model,
    modelSettings,
    instructions: buildInstructions(classroomProfile, memoryContext),
    tools: [
      toAgentTool(toolset.currentTime),
      toAgentTool(toolset.weather),
      toAgentTool(toolset.youbike),
      toAgentTool(toolset.netflix),
    ],
    handoffs: [phpTeacher, vueTeacher, pythonTeacher],
    ...(tenlongMcp && { mcpServers: [tenlongMcp] }),
  });

  return {
    agent: homeroom,
    close: async () => {
      if (tenlongMcp) {
        await tenlongMcp.close();
      }
    },
  };
}
