import { createEvent, createStore } from "effector";
import { ACCU_WEATHER_API_KEY } from "../axios-instance/axios-instance";
import { getForecastNowAccuWeather } from "../forecast-api/get-forecast-now";
import { getLocationByPosition } from "../get-location/get-location-by-position";

//Browser location
export interface IInfoPermissionLocation {
  latitude: number | null;
  longitude: number | null;
}
export const $infoPermissionLocation =
  createStore<IInfoPermissionLocation | null>(null);
export const setInfoPermissionLocation =
  createEvent<IInfoPermissionLocation | null>();
$infoPermissionLocation.on(setInfoPermissionLocation, (_, val) => val);

$infoPermissionLocation.updates.watch(
  (location: IInfoPermissionLocation | null) => {
    console.log("WATCH. infoPermissionLocation location:", location);
    if (location && location.latitude && location.longitude)
      getLocationByPosition(
        location.latitude,
        location.longitude,
        ACCU_WEATHER_API_KEY
      );
  }
);

//AccuWeather Info Location
export const $infoLocation = createStore<any | null>(null);
export const setLocation = createEvent<any | null>();
$infoLocation.on(setLocation, (_, val) => val);

$infoLocation.updates.watch((info: any | null) => {
  console.log("WATCH. infoLocation info:", info);
  if (info) {
    getForecastNowAccuWeather(info?.Key, ACCU_WEATHER_API_KEY);
  }
});