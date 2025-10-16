import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { mistral } from "@ai-sdk/mistral";
import { createOpenAI } from "@ai-sdk/openai";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from "./models.test";

type ModelInfo = {
  id: string;
  name: string;
  description: string;
  reasoning?: boolean;
};

const languageModels: Record<string, any> = {};
const modelInfos: ModelInfo[] = [];
const reasoningIds = new Set<string>();

function addModel({
  id,
  name,
  description,
  model,
  reasoning = false,
}: {
  id: string;
  name: string;
  description: string;
  model: any;
  reasoning?: boolean;
}) {
  languageModels[id] = model;
  modelInfos.push({ id, name, description, reasoning });
  if (reasoning) reasoningIds.add(id);
}

// Build dynamic providers if not in test environment
if (!isTestEnvironment) {
  // Google (Gemini)
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    addModel({
      id: "google/gemini-2.5-flash",
      name: "Gemini 2.5 Flash",
      description: "Google fast multimodal",
      model: google("gemini-2.5-flash"),
    });
    addModel({
      id: "google/gemini-2.5-pro",
      name: "Gemini 2.5 Pro",
      description: "Google advanced reasoning",
      model: wrapLanguageModel({
        model: google("gemini-2.5-pro"),
        middleware: extractReasoningMiddleware({ tagName: "think" }),
      }),
      reasoning: true,
    });
  }

  // OpenAI
  if (process.env.OPENAI_API_KEY) {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
    addModel({
      id: "openai/gpt-4o-mini",
      name: "GPT-4o mini",
      description: "OpenAI cost-efficient",
      model: openai("gpt-4o-mini"),
    });
    addModel({
      id: "openai/gpt-4o",
      name: "GPT-4o",
      description: "OpenAI flagship multimodal",
      model: openai("gpt-4o"),
    });
    // OpenAI Reasoning (o4-mini)
    addModel({
      id: "openai/o4-mini",
      name: "o4-mini (Reasoning)",
      description: "OpenAI lightweight reasoning",
      model: openai("o4-mini"),
      reasoning: true,
    });
  }

  // Anthropic
  if (process.env.ANTHROPIC_API_KEY) {
    addModel({
      id: "anthropic/claude-3-5-haiku-latest",
      name: "Claude 3.5 Haiku",
      description: "Anthropic efficient",
      model: anthropic("claude-3-5-haiku-latest"),
    });
    addModel({
      id: "anthropic/claude-3-5-sonnet-latest",
      name: "Claude 3.5 Sonnet",
      description: "Anthropic advanced reasoning",
      model: anthropic("claude-3-5-sonnet-latest"),
      reasoning: true,
    });
  }

  // Mistral
  if (process.env.MISTRAL_API_KEY) {
    addModel({
      id: "mistral/mistral-small-latest",
      name: "Mistral Small",
      description: "Mistral small",
      model: mistral("mistral-small-latest"),
    });
    addModel({
      id: "mistral/mistral-large-latest",
      name: "Mistral Large",
      description: "Mistral strong reasoning",
      model: mistral("mistral-large-latest"),
      reasoning: true,
    });
  }

  // DeepSeek (OpenAI compatible)
  if (process.env.DEEPSEEK_API_KEY) {
    const deepseek = createOpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com",
    });
    addModel({
      id: "deepseek/deepseek-chat",
      name: "DeepSeek Chat",
      description: "DeepSeek chat",
      model: deepseek("deepseek-chat"),
    });
    addModel({
      id: "deepseek/deepseek-reasoner",
      name: "DeepSeek Reasoner",
      description: "DeepSeek reasoning",
      model: deepseek("deepseek-reasoner"),
      reasoning: true,
    });
  }

  // xAI Grok (OpenAI compatible)
  if (process.env.XAI_API_KEY) {
    const xai = createOpenAI({
      apiKey: process.env.XAI_API_KEY,
      baseURL: "https://api.x.ai/v1",
    });
    addModel({
      id: "xai/grok-2-mini",
      name: "Grok-2 Mini",
      description: "xAI efficient",
      model: xai("grok-2-mini"),
    });
    addModel({
      id: "xai/grok-2-latest",
      name: "Grok-2",
      description: "xAI advanced reasoning",
      model: xai("grok-2-latest"),
      reasoning: true,
    });
  }
}

// Choose defaults for alias keys
function pickDefaultIds() {
  const nonReasoning = modelInfos.find((m) => !m.reasoning)?.id;
  const reasoning = modelInfos.find((m) => m.reasoning)?.id;
  return {
    defaultChatId: nonReasoning ?? "google/gemini-2.5-flash",
    defaultReasoningId: reasoning ?? "google/gemini-2.5-pro",
  };
}

const { defaultChatId, defaultReasoningId } = pickDefaultIds();

export const availableChatModels: Array<ModelInfo> = isTestEnvironment
  ? [
      {
        id: "chat-model",
        name: "Chat model",
        description: "Primary model",
        reasoning: false,
      },
      {
        id: "chat-model-reasoning",
        name: "Reasoning model",
        description: "Advanced reasoning",
        reasoning: true,
      },
    ]
  : [...modelInfos];

export function isReasoningModel(id: string) {
  return id === "chat-model-reasoning" || reasoningIds.has(id);
}

export function isModelAvailable(id: string) {
  if (isTestEnvironment)
    return (
      id === "chat-model" ||
      id === "chat-model-reasoning" ||
      id === "title-model" ||
      id === "artifact-model"
    );
  return (
    id in languageModels ||
    id === "chat-model" ||
    id === "chat-model-reasoning" ||
    id === "title-model" ||
    id === "artifact-model"
  );
}

// Expose provider with alias keys + dynamic models
export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        "chat-model": chatModel,
        "chat-model-reasoning": reasoningModel,
        "title-model": titleModel,
        "artifact-model": artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        // Stable alias ids
        "chat-model":
          languageModels[defaultChatId] ?? google("gemini-2.5-flash"),
        "chat-model-reasoning": languageModels[defaultReasoningId]
          ? wrapLanguageModel({
              model: languageModels[defaultReasoningId],
              middleware: extractReasoningMiddleware({ tagName: "think" }),
            })
          : wrapLanguageModel({
              model: google("gemini-2.5-pro"),
              middleware: extractReasoningMiddleware({ tagName: "think" }),
            }),
        "title-model":
          languageModels[defaultChatId] ?? google("gemini-2.5-flash"),
        "artifact-model":
          languageModels[defaultChatId] ?? google("gemini-2.5-flash"),
        // All dynamic models
        ...languageModels,
      },
    });

export const DEFAULT_ALIAS_CHAT_MODEL_ID = "chat-model";
export const DEFAULT_ALIAS_REASONING_MODEL_ID = "chat-model-reasoning";
