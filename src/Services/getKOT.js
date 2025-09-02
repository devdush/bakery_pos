import apiConfig from "../config.json";
import httpService from "./httpService";

const apiEndpoint = `${apiConfig.apiURL}/api/pos-stuart-orders/pending-kots`;

export function getKOTData(itemTypeId) {
    console.log("API Endpoint:", itemTypeId);
    console.log("Fetching KOT data for Item Type ID:", `${apiEndpoint}/${itemTypeId}`);
  return httpService.get(`${apiEndpoint}/${itemTypeId}`);
}
