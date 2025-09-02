import apiConfig from "../config.json";
import httpService from "./httpService";

const apiEndpoint = `${apiConfig.apiURL}/api/pos-kot`;

export function createKot(obj) {
  return httpService.post(apiEndpoint, obj);
}

export default {
  createKot,
};
