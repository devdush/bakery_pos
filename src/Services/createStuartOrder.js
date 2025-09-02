import apiConfig from "../config.json";
import httpService from "./httpService";

const apiEndpoint = `${apiConfig.apiURL}/api/pos-stuart-orders`;

export function createStuartOrder(obj) {
  return httpService.post(apiEndpoint, obj);
}

export default {
  createStuartOrder,
};
