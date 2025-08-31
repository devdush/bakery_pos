import apiConfig from "../config.json";
import httpService from "./httpService";

const apiEndpoint = `${apiConfig.apiURL}/api/pos-products`;

export function getProducts() {
  return httpService.get(apiEndpoint);
}
