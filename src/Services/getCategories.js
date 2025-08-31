import apiConfig from "../config.json";
import httpService from "./httpService";

const apiEndpoint = `${apiConfig.apiURL}/api/pos-categories`;

export function getCategories() {
  return httpService.get(apiEndpoint);
}
