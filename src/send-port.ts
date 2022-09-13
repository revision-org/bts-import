import * as libxmljs from "libxmljs";
import { Settings } from "./types/settings";

export const getAddress = (port?: libxmljs.Element) => {
  const address = port?.get("Address")?.text();

  const forwardSlash = address?.replace(/\\/g, "/");

  return forwardSlash?.replace(/[^a-z0-9 ,.?!/]/gi, "");
};

export const getTransportType = (port?: libxmljs.Element) => {
  return port?.get("TransportType")?.attr("Name")?.value();
};

export const getApplicationName = (port?: libxmljs.Element) => {
  return port?.get("ApplicationName")?.text();
};

export const getTransforms = (port?: libxmljs.Element) => {
  return port
    ?.get("Transforms")
    ?.childNodes()
    .filter((t) => t.type() === "element")
    .map((t) => (t as libxmljs.Element).attr("FullName")?.value());
};

export const getTransport = (transport?: libxmljs.Element) => {
  return {
    address: getAddress(transport || undefined),
    transportType: getTransportType(transport || undefined),
  };
};

export const parseSendPort = async (
  sendPort: libxmljs.Element,
  settings: Settings
) => {
  const name = sendPort.attr("Name")?.value();
  const primary = getTransport(sendPort.get("PrimaryTransport") || undefined);
  const secondary = getTransport(
    sendPort.get("SecondaryTransport") || undefined
  );

  const transforms = getTransforms(sendPort);

  const app = getApplicationName(sendPort);

  let attributes = [];

  if (settings.sendPorts.attributes?.address)
    attributes.push({
      id: settings.sendPorts.attributes?.address,
      value: [primary.address, secondary.address].join(","),
    });

  if (settings.sendPorts.attributes?.applicationName)
    attributes.push({
      id: settings.sendPorts.attributes?.applicationName,
      value: app,
    });

  if (settings.sendPorts.attributes?.transforms)
    attributes.push({
      id: settings.sendPorts.attributes?.transforms,
      value: transforms?.join(","),
    });

  if (settings.sendPorts.attributes?.transportType)
    attributes.push({
      id: settings.sendPorts.attributes?.transportType,
      value: [primary.transportType, secondary.transportType].join(","),
    });

  const data: any = {
    id: name,
    name: name,
    typeId: settings.sendPorts.typeId,
  };

  if (attributes.length) data.attributes = attributes;

  return data;
};
