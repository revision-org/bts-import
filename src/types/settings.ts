type attribute = {
  address?: number;
  transportType?: number;
  applicationName?: number;
  transforms?: number;
};

export type Settings = {
  apiKey: string;
  path: string;
  context?: string;
  sendPorts: {
    typeId?: number;
    attributes?: attribute;
  };
  receivePorts: {
    typeId?: number;
    attributes?: attribute;
  };
};
