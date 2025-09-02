import apiConfig from "../config.json";
import httpService from "./httpService";

const apiEndpoint = `${apiConfig.apiURL}/api/pos-item-types`;

export function getItemTypes() {
  return httpService.get(apiEndpoint);
}
