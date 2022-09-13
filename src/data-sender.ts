import { Settings } from "./types/settings";
import fetch from "node-fetch";

export const sendData = async (data: object, settings: Settings) => {
  const response = await fetch("http://localhost:3000/api/external/component", {
    headers: {
      "x-revision-key": settings.apiKey,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });

  console.log("Response", await response.json());
};
