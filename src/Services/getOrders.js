import apiConfig from "../config.json";
import httpService from "./httpService";

const apiEndpoint = `${apiConfig.apiURL}/api/pos-bakery-orders`;
const apiWeeklyEndpoint = `${apiConfig.apiURL}/api/pos-bakery-orders/this-week`;
const apiSalesDataEndpoint = `${apiConfig.apiURL}/api/pos-bakery-orders/today-sales`;
const apiTodayDetailsEndpoint = `${apiConfig.apiURL}/api/pos-bakery-orders/today-details`;
const apiDayByDayCategoryWiseSalesEndpoint = `${apiConfig.apiURL}/api/pos-bakery-orders/daily-category-sales`;
export function getOrders() {
  return httpService.get(apiEndpoint);
}
export function getWeeklySales() {
  return httpService.get(apiWeeklyEndpoint);
}

export function getSalesData() {
  return httpService.get(apiSalesDataEndpoint);
}
export function getTodayDetails() {
  return httpService.get(apiTodayDetailsEndpoint);
}
export function getDayByDayCategoryWiseSales() {
  return httpService.get(apiDayByDayCategoryWiseSalesEndpoint);
}