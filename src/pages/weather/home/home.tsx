import {
  HomeWrapper,
  HomeProps,
  HomeInfoContainer,
  HomeInfoCardsContainer,
} from '.'
import {
  HomeAirQuality,
  HomeDayForecast,
  HomeFeelsLike,
  HomeGeneral,
  HomeHourlyForecast,
  HomeHumidity,
  HomeMap,
  HomeRainfall,
  HomeSunrise,
  HomeUVIndex,
  HomeWind,
} from './components'
import {
  WEATHER_LANGUAGES,
  useGetHoursForecast,
  useGetForecastDay,
  useGetRealtime,
} from '@api/weather'
import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'

export const Home: FC<HomeProps> = (props) => {
  /****************************************** Query *************************************************/
  const { data: data8GetHoursForecast, isPending: isPending8GetHoursForecast } =
    useQuery({
      ...useGetHoursForecast({
        hours: 12,
        params: {
          q: props.IPAddress,
          days: 3,
          lang: WEATHER_LANGUAGES.ru,
          aqi: 'yes',
          alerts: 'yes',
        },
      }),
    })

  const { data: dataGetForecast, isPending: isPendingGetForecastDay } =
    useQuery({
      ...useGetForecastDay({
        params: {
          q: props.IPAddress,
          days: 3,
          lang: WEATHER_LANGUAGES.ru,
          aqi: 'yes',
          alerts: 'yes',
        },
      }),
    })

  const { data: dataGetRealtime, isPending: isPendingGetRealtime } = useQuery({
    ...useGetRealtime({
      params: {
        q: props.IPAddress,
        lang: WEATHER_LANGUAGES.ru,
      },
    }),
  })

  const isPending =
    isPendingGetRealtime ||
    isPendingGetForecastDay ||
    isPending8GetHoursForecast

  /****************************************** useEffect *************************************************/

  return (
    !isPending &&
    dataGetRealtime &&
    data8GetHoursForecast &&
    dataGetForecast && (
      <HomeWrapper>
        <HomeGeneral
          dataGetRealtime={dataGetRealtime}
          dataGetForecastDay={dataGetForecast.forecast.forecastday}
        />
        <HomeInfoContainer>
          <HomeHourlyForecast data8GetHoursForecast={data8GetHoursForecast} />
          <HomeDayForecast
            dataGetRealtime={dataGetRealtime}
            dataGetForecastDay={dataGetForecast.forecast.forecastday}
          />
          <HomeAirQuality realtimeCurrent={dataGetForecast.current} />
          <HomeMap dataGetRealtime={dataGetRealtime} />
          <HomeInfoCardsContainer>
            <HomeUVIndex />
            <HomeSunrise />
          </HomeInfoCardsContainer>
          <HomeInfoCardsContainer>
            <HomeWind />
            <HomeRainfall />
          </HomeInfoCardsContainer>
          <HomeInfoCardsContainer>
            <HomeFeelsLike />
            <HomeHumidity />
          </HomeInfoCardsContainer>
        </HomeInfoContainer>
      </HomeWrapper>
    )
  )
}