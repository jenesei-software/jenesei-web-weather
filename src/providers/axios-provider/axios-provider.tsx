import {
  AXIOS_LOCAL_STORAGE_AUTH,
  AxiosContextProps,
  AxiosProviderProps,
} from '.'
import {
  ITokenData,
  postAuthTokenRefreshRequest,
  postAuthTokenRefreshResponse,
} from '@api/auth'
import { axiosInstance } from '@api/axios'
import { queryClient, queryKeys } from '@core/query'
import { createContext, useContext, useEffect, useState } from 'react'

const AxiosContext = createContext<AxiosContextProps | null>(null)

export const useAxios = () => {
  const context = useContext(AxiosContext)
  if (!context) {
    throw new Error('useAxios must be used within an AxiosProvider')
  }
  return context
}

export const AxiosProvider: React.FC<AxiosProviderProps> = (props) => {
  const [tokenData, setTokenData] = useState<ITokenData | null>(null)
  const isAuthorized = !!tokenData?.token

  useEffect(() => {
    try {
      const tokenData = localStorage.getItem(AXIOS_LOCAL_STORAGE_AUTH)
      const tokenDataObj: ITokenData = tokenData && JSON.parse(tokenData)

      if (tokenDataObj) {
        setTokenData(tokenDataObj)
      }
    } catch {
      console.error('Error parsing JSON')
    }
  }, [])

  const saveToLocalStorage = (data: ITokenData) => {
    setTokenData(data)
    try {
      const serializedData = JSON.stringify(data)
      localStorage.setItem(AXIOS_LOCAL_STORAGE_AUTH, serializedData)
      console.log(
        `Object saved to localStorage with key: ${AXIOS_LOCAL_STORAGE_AUTH}`
      )
    } catch (error) {
      console.error('Error saving object to localStorage:', error)
    }
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: [queryKeys.profile.profileData],
      }),
    ])
  }

  axiosInstance.interceptors.request.use((config) => {
    const tokenData = localStorage.getItem(AXIOS_LOCAL_STORAGE_AUTH)

    if (tokenData) {
      try {
        const tokenDataObj: ITokenData = JSON.parse(tokenData)
        const accessToken = tokenDataObj.token
        config.headers['Authorization'] = accessToken
          ? `Bearer ${accessToken}`
          : ''
      } catch {
        console.error('Error parsing JSON')
      }
    } else {
      console.error('Missing tokenData in localStorage')
    }

    return config
  })

  axiosInstance.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const originalRequest = error.config
      if (error.response.status === 401) {
        try {
          const tokenData = localStorage.getItem(AXIOS_LOCAL_STORAGE_AUTH)
          const tokenDataObj: ITokenData = tokenData && JSON.parse(tokenData)
          const refreshToken = tokenDataObj && tokenDataObj.refreshToken

          if (tokenData && refreshToken) {
            const response = await axiosInstance.post<
              postAuthTokenRefreshRequest,
              { data: postAuthTokenRefreshResponse }
            >(`/auth/token/refresh`, { token: refreshToken })

            if (response.data) {
              saveToLocalStorage(response.data)
              originalRequest._retry = true
              originalRequest.headers['Authorization'] =
                `Bearer ${response.data.token}`
            } else {
              localStorage.removeItem(AXIOS_LOCAL_STORAGE_AUTH)
            }
            return axiosInstance(error.config)
          } else {
            localStorage.removeItem(AXIOS_LOCAL_STORAGE_AUTH)
          }
        } catch (refreshError) {
          localStorage.removeItem(AXIOS_LOCAL_STORAGE_AUTH)
          return Promise.reject(refreshError)
        }
      }
    }
  )
  return (
    <AxiosContext.Provider
      value={{
        saveToLocalStorage,
        isAuthorized,
      }}
    >
      {props.children}
    </AxiosContext.Provider>
  )
}
