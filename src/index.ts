import commandLineArgs from "command-line-args";
import { Element } from "libxmljs";
import { sendData } from "./data-sender";
import { readBinding, readSettings } from "./file-reader";
import { parseReceivePort } from "./receive-port";
import { parseSendPort } from "./send-port";

const optionDefinitions = [{ name: "settings", alias: "s", type: String }];

async function main() {
  const options = commandLineArgs(optionDefinitions);

  const settings = await readSettings(options.settings);
  if (!settings) return;

  const binding = await readBinding(settings);

  var sendPorts = binding.get("//SendPortCollection")?.childNodes();

  const sendPortData = sendPorts
    ?.filter((sendPort) => sendPort.type() === "element")
    .map((sendPort) => parseSendPort(sendPort as Element, settings));

  var receivePorts = binding.get("//ReceivePortCollection")?.childNodes();

  const receivePortData = receivePorts
    ?.filter((receivePort) => receivePort.type() === "element")
    .map((receivePort) => parseReceivePort(receivePort as Element, settings));

  if (sendPortData) {
    for await (const sendPort of sendPortData) {
      await sendData(sendPort, settings);
    }
  }

  if (receivePortData) {
    for await (const receivePort of receivePortData) {
      await sendData(receivePort, settings);
    }
  }
}

main();
