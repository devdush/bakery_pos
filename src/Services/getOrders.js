import apiConfig from "../config.json";
import httpService from "./httpService";

const apiEndpoint = `${apiConfig.apiURL}/api/pos-bakery-orders`;

export function getOrders() {
  return httpService.get(apiEndpoint);
}
