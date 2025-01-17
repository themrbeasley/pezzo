import axios, { AxiosInstance } from "axios";
import { IntegrationSettings } from "./types";
import { BaseExecutor, ExecuteProps, ExecuteResult } from "../BaseExecutor";
import { Pezzo } from "@pezzo/client";

interface ExecutorOptions {
  apiKey: string;
}

export class Executor extends BaseExecutor {
  private readonly axios: AxiosInstance;

  constructor(pezzo: Pezzo, options: ExecutorOptions) {
    super(pezzo);

    this.axios = axios.create({
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  async execute<T>(
    props: ExecuteProps<IntegrationSettings>
  ): Promise<ExecuteResult<T>> {
    const { settings, content } = props;
    const url = `https://api.ai21.com/studio/v1/${settings.model}/complete`;

    try {
      const result = await this.axios.post(url, {
        prompt: content,
        ...settings.modelSettings,
      });

      const data = result.data as any;

      const promptTokens = data.prompt.tokens.length;
      const completionTokens = data.completions[0].data.tokens.length;
      const costPer1000Tokens = this.getCostPer1000Tokens(settings.model);

      const promptCost = (promptTokens / 1000) * costPer1000Tokens;
      const completionCost = (completionTokens / 1000) * costPer1000Tokens;

      return {
        status: "Success",
        promptTokens,
        completionTokens,
        promptCost,
        completionCost,
        result: data.completions[0].data.text,
      };
    } catch (error) {
      console.log("error", error);
      const errorResult = error.response.data;
      const statusCode = error.response.status;

      return {
        status: "Error",
        promptTokens: 0,
        completionTokens: 0,
        promptCost: 0,
        completionCost: 0,
        result: null,
        error: {
          error: errorResult,
          printableError: JSON.stringify(errorResult),
          status: statusCode,
        },
      };
    }
  }

  private getCostPer1000Tokens(model: string) {
    switch (model) {
      case "j2-jumbo-instruct":
        return 0.015;
      case "j2-jumbo":
        return 0.015;
      case "j2-grande-instruct":
        return 0.01;
      case "j2-grande":
        return 0.01;
      default:
        return 0;
    }
  }
}
