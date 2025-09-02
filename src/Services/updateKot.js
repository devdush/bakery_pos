import apiConfig from "../config.json";
import httpService from "./httpService";

const apiEndpoint = `${apiConfig.apiURL}/api/pos-kot`;

export function updateKOT(kotId, updateData) {
  return httpService.put(`${apiEndpoint}/${kotId}`, updateData);
}