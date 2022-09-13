import * as libxmljs from "libxmljs";
import { rawListeners } from "process";
import { Settings } from "./types/settings";

export const getAddress = (port?: libxmljs.Element) => {
  const address = port?.get("Address")?.text();

  const forwardSlash = address?.replace(/\\/g, "/");

  return forwardSlash?.replace(/[^a-z0-9 ,.?!/]/gi, "");
};

export const getTransportType = (port?: libxmljs.Element) => {
  return port?.get("ReceiveLocationTransportType")?.attr("Name")?.value();
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

// export const getTransport = (transport?: libxmljs.Element) => {
//   return {
//     address: getAddress(transport || undefined),
//     transportType: getTransportType(transport || undefined),
//   };
// };

export const getReceiveLocations = (receiveLocations?: libxmljs.Element[]) => {
  console.log("tt", receiveLocations?.length);
  return receiveLocations?.map((r) => {
    return {
      name: r.attr("Name"),
      address: getAddress(r || undefined),
      transportType: getTransportType(r || undefined),
    };
  });
};

export const parseReceivePort = async (
  receivePort: libxmljs.Element,
  settings: Settings
) => {
  const name = receivePort.attr("Name")?.value();
  console.log("ff", name);
  const rl = getReceiveLocations(
    receivePort
      .get("ReceiveLocations")
      ?.childNodes()
      .filter((n) => n.type() === "element")
      .map((n) => n as libxmljs.Element)
  );

  const transforms = getTransforms(receivePort);

  const app = getApplicationName(receivePort);

  let attributes = [];

  if (settings.receivePorts.attributes?.address)
    rl?.forEach((r) => {
      attributes.push({
        id: settings.receivePorts.attributes?.address,
        value: `${r.name} - ${r.address}`,
      });
    });

  if (settings.receivePorts.attributes?.transforms)
    attributes.push({
      id: settings.receivePorts.attributes?.transforms,
      value: transforms?.join(","),
    });

  if (settings.receivePorts.attributes?.applicationName)
    attributes.push({
      id: settings.receivePorts.attributes?.applicationName,
      value: app,
    });

  let data: any = {
    id: name,
    name: name,
    typeId: settings.receivePorts.typeId,
  };

  if (attributes.length) data.attributes = attributes;

  return data;
};
