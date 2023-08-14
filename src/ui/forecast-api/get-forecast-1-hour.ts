import { AccuWeatherOne } from "../axiosInstance/axiosInstance";
import { setForecast1Day } from "../stores/info-forecast";

export const getForecast1Hour = async (
  locationKey: string,
  accuWeatherApiKey: string
) => {
  AccuWeatherOne.get(`forecasts/v1/hourly/1hour/${locationKey}`, {
    params: {
      apikey: accuWeatherApiKey,
      metric: true,
    },
  })
    .then((res) => {
      setForecast1Day(res.data);
    })
    .catch((error) => {
      throw error;
    });
};