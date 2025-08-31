import apiConfig from "../config.json";
import httpService from "./httpService";

const apiEndpoint = `${apiConfig.apiURL}/api/pos-products`;

export function createProduct(obj) {
  console.log("Creating product with data:", obj);
  return httpService.post(apiEndpoint, obj);
}

export default {
  createProduct,
};
