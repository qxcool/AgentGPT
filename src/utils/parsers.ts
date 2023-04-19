import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

/*
 * Parsers are used by LangChain to easily prompt for a given format and also parse outputs.
 * https://js.langchain.com/docs/modules/prompts/output_parsers/
 */

export const respondAction = "Respond";
export const actionParser = StructuredOutputParser.fromZodSchema(
  z.object({
    // Enum type currently not supported
    action: z
      .string()
      .describe(`要采取的行动，“问题”或'${respondAction}'`),
    arg: z.string().describe("行动的论据"),
  })
);

export const tasksParser = StructuredOutputParser.fromZodSchema(
  z.array(z.string()).describe("要完成的任务列表")
);
