import apiConfig from "../config.json";
import httpService from "./httpService";

const apiEndpoint = `${apiConfig.apiURL}/api/pos-stuart-orders/table/`;

export function getSelectedTableOrderDetails(tableId) {
  return httpService.get(`${apiEndpoint}${tableId}`);
}
