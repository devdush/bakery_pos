import apiConfig from "../config.json";
import httpService from "./httpService";

const apiEndpoint = `${apiConfig.apiURL}/api/pos-categories`;

export function createCategory(obj) {
  console.log("Creating category with data:", obj);
  return httpService.post(apiEndpoint, obj);
}

export default {
  createCategory,
};
