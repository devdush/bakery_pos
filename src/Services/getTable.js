import apiConfig from "../config.json";
import httpService from "./httpService";

const apiEndpoint = `${apiConfig.apiURL}/api/pos-tables`;

export function getTables() {
    console.log("Fetching tables from:", apiEndpoint);
  return httpService.get(apiEndpoint);
}
