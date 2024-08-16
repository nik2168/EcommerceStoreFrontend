import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { server } from "./config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}`,
  }),
  tagTypes: [""],
  endpoints: (builder) => ({
    curWeather: builder.query({
      query: (name) => ({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=6cfb46eca0d4f9bd7c6518971820b06f`,
      }),
      providesTags: ["Weather"],
    }),
  }),
});

export default api;

export const {

} = api;
