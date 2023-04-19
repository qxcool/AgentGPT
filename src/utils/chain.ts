import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import type { ModelSettings } from "./types";
import { GPT_35_TURBO } from "./constants";

export const createModel = (settings: ModelSettings) =>
  new OpenAI({
    openAIApiKey:
      settings.customApiKey === ""
        ? process.env.OPENAI_API_KEY
        : settings.customApiKey,
    temperature: settings.customTemperature || 0.9,
    modelName:
      settings.customModelName === "" ? GPT_35_TURBO : settings.customModelName,
    maxTokens: 500,
  });

const startGoalPrompt = new PromptTemplate({
  template:
    "您是一个名为AgentGPT的自主任务创建AI。您有以下目标“{goal}”。创建一个由你的人工智能系统完成的零到三项任务的列表,以便更接近或完全达到你的目标。以字符串数组的形式返回响应,这些字符串可以在JSON.parse()中使用",
  inputVariables: ["goal"],
});
export const startGoalAgent = async (model: OpenAI, goal: string) => {
  return await new LLMChain({
    llm: model,
    prompt: startGoalPrompt,
  }).call({
    goal,
  });
};

const executeTaskPrompt = new PromptTemplate({
  template:
    "您是一个名为AgentGPT的自主任务执行AI。您有以下目标“{goal}”。您有以下任务“{task}”。执行任务并将响应作为字符串返回。",
  inputVariables: ["goal", "task"],
});
export const executeTaskAgent = async (
  model: OpenAI,
  goal: string,
  task: string
) => {
  return await new LLMChain({ llm: model, prompt: executeTaskPrompt }).call({
    goal,
    task,
  });
};

const createTaskPrompt = new PromptTemplate({
  template:
    "你是一个人工智能任务创建代理。您有以下目标“{goal}”。您有以下未完成的任务“{tasks}”，并且刚刚执行了以下任务“{lastTask}”并收到了以下结果“{result}”。在此基础上,创建一个新任务,只有在需要时才能由您的人工智能系统完成,以便更接近或完全达到您的目标。以字符串数组的形式返回响应,这些字符串可以在JSON.parse()和NOTHING ELSE中使用",
  inputVariables: ["goal", "tasks", "lastTask", "result"],
});
export const executeCreateTaskAgent = async (
  model: OpenAI,
  goal: string,
  tasks: string[],
  lastTask: string,
  result: string
) => {
  return await new LLMChain({ llm: model, prompt: createTaskPrompt }).call({
    goal,
    tasks,
    lastTask,
    result,
  });
};

export const extractArray = (inputStr: string): string[] => {
  // Match an outer array of strings (including nested arrays)
  const regex = /(\[(?:\s*"(?:[^"\\]|\\.)*"\s*,?)+\s*\])/;
  const match = inputStr.match(regex);

  if (match && match[0]) {
    try {
      // Parse the matched string to get the array
      return JSON.parse(match[0]) as string[];
    } catch (error) {
      console.error("分析匹配的数组时出错:", error);
    }
  }

  console.warn("错误,无法从inputString中提取数组:", inputStr);
  return [];
};

// Model will return tasks such as "No tasks added". We should filter these
export const realTasksFilter = (input: string): boolean => {
  const noTaskRegex =
    /^No( (new|further|additional|extra|other))? tasks? (is )?(required|needed|added|created|inputted).*$/i;
  const taskCompleteRegex =
    /^Task (complete|completed|finished|done|over|success).*/i;
  const doNothingRegex = /^(\s*|Do nothing(\s.*)?)$/i;

  return (
    !noTaskRegex.test(input) &&
    !taskCompleteRegex.test(input) &&
    !doNothingRegex.test(input)
  );
};
