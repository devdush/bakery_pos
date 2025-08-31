import apiConfig from "../config.json";
import httpService from "./httpService";

const apiEndpoint = `${apiConfig.apiURL}/api/pos-cashiers`;

export function createCashier(obj) {
  console.log("Creating cashier with data:", obj);
  return httpService.post(apiEndpoint, obj);
}

export default {
  createCashier,
};
