import apiConfig from "../config.json";
import httpService from "./httpService";

const apiEndpoint = `${apiConfig.apiURL}/api/pos-tables`;

export function updateTable(tableId, tableData) {
  return httpService.put(`${apiEndpoint}/${tableId}`, tableData);
}