import apiConfig from "../config.json";
import httpService from "./httpService";

const apiEndpoint = `${apiConfig.apiURL}/api/pos-bakery-orders`;

export function createOrder(obj) {
  console.log("Creating order with data:", obj);
  return httpService.post(apiEndpoint, obj);
}

export default {
  createOrder,
};
