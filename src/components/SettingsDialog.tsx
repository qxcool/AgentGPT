import React from "react";
import Button from "./Button";
import {
  FaKey,
  FaMicrochip,
  FaThermometerFull,
  FaExclamationCircle,
  FaSyncAlt,
} from "react-icons/fa";
import Dialog from "./Dialog";
import Input from "./Input";
import {
  GPT_MODEL_NAMES,
  GPT_4,
  DEFAULT_MAX_LOOPS_CUSTOM_API_KEY,
  DEFAULT_MAX_LOOPS_FREE,
} from "../utils/constants";
import Accordion from "./Accordion";
import type { reactModelStates } from "./types";

export default function SettingsDialog({
  show,
  close,
  reactModelStates,
}: {
  show: boolean;
  close: () => void;
  reactModelStates: reactModelStates;
}) {
  const {
    customApiKey,
    setCustomApiKey,
    customModelName,
    setCustomModelName,
    customTemperature,
    setCustomTemperature,
    customMaxLoops,
    setCustomMaxLoops,
  } = reactModelStates;

  const [key, setKey] = React.useState<string>(customApiKey);

  const handleClose = () => {
    setKey(customApiKey);
    close();
  };

  function is_valid_key(key: string) {
    const pattern = /^sk-[a-zA-Z0-9]{48}$/;
    return pattern.test(key);
  }

  const handleSave = () => {
    if (is_valid_key(key)) {
      setCustomApiKey(key);
      close();
    } else {
      alert(
        "密钥无效,请确保您已在OpenAI帐户中设置了计费"
      );
    }
  };

  React.useEffect(() => {
    setCustomMaxLoops(
      !key ? DEFAULT_MAX_LOOPS_FREE : DEFAULT_MAX_LOOPS_CUSTOM_API_KEY
    );

    return () => {
      setCustomMaxLoops(DEFAULT_MAX_LOOPS_FREE);
    };
  }, [key, setCustomMaxLoops]);

  const advancedSettings = (
    <>
      <Input
        left={
          <>
            <FaThermometerFull />
            <span className="ml-2">Temp: </span>
          </>
        }
        value={customTemperature}
        onChange={(e) => setCustomTemperature(parseFloat(e.target.value))}
        type="range"
        toolTipProperties={{
          message:
            "较高的值将使输出更随机，而较低的值使输出更加集中和确定性。",
          disabled: false,
        }}
        attributes={{
          min: 0,
          max: 1,
          step: 0.01,
        }}
      />
      <br />
      <Input
        left={
          <>
            <FaSyncAlt />
            <span className="ml-2">Loop #: </span>
          </>
        }
        value={customMaxLoops}
        disabled={!key}
        onChange={(e) => setCustomMaxLoops(parseFloat(e.target.value))}
        type="range"
        toolTipProperties={{
          message:
            "控制代理将运行的最大循环数(更高的值将产生更多API调用)。",
          disabled: false,
        }}
        attributes={{
          min: 1,
          max: 100,
          step: 1,
        }}
      />
    </>
  );

  return (
    <Dialog
      header="Settings ⚙"
      isShown={show}
      close={handleClose}
      footerButton={<Button onClick={handleSave}>Save</Button>}
    >
      <p>
      在这里,您可以添加OpenAI API密钥。
      </p>
      <br />
      <p
        className={
          customModelName === GPT_4
            ? "rounded-md border-[2px] border-white/10 bg-yellow-300 text-black"
            : ""
        }
      >
        <FaExclamationCircle className="inline-block" />
        &nbsp;
        <b>
          要使用GPT-4模型,您可以申请GPT-4.&nbsp;
          <a
            href="https://openai.com/waitlist/gpt-4-api"
            className="text-blue-500"
          >
            here
          </a>
          . (非ChatGPT Plus订阅用户,此功能将不起作用)
        </b>
      </p>
      <br />
      <div className="text-md relative flex-auto p-2 leading-relaxed">
        <Input
          left={
            <>
              <FaMicrochip />
              <span className="ml-2">Model:</span>
            </>
          }
          type="combobox"
          value={customModelName}
          onChange={() => null}
          setValue={setCustomModelName}
          attributes={{ options: GPT_MODEL_NAMES }}
        />
        <br className="hidden md:inline" />
        <Input
          left={
            <>
              <FaKey />
              <span className="ml-2">Key: </span>
            </>
          }
          placeholder={"sk-..."}
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <br className="md:inline" />
        <Accordion
          child={advancedSettings}
          name="Advanced Settings"
        ></Accordion>
        <br />
        <strong className="mt-10">
        注意:要获得密钥,请注册OpenAI帐户并访问 {" "}
          <a
            href="https://platform.openai.com/account/api-keys"
            className="text-blue-500"
          >

          </a>{" "}
          此密钥仅在当前浏览器会话中使用
        </strong>
      </div>
    </Dialog>
  );
}
