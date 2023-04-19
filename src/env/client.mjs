// @ts-check
import { clientEnv, clientSchema } from "./schema.mjs";

const _clientEnv = clientSchema.safeParse(clientEnv);

export const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors,
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
    })
    .filter(Boolean);

if (!_clientEnv.success) {
  console.error(
    "❌ 无效的环境变量:\n",
    ...formatErrors(_clientEnv.error.format()),
  );
  throw new Error("无效的环境变量");
}

for (let key of Object.keys(_clientEnv.data)) {
  if (!key.startsWith("NEXT_PUBLIC_")) {
    console.warn(
      `❌ 无效的公共环境变量名称: ${key}. It must begin with 'NEXT_PUBLIC_'`,
    );

    throw new Error("无效的公共环境变量名称");
  }
}

export const env = _clientEnv.data;
