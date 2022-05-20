import { useState } from "react";

export const useGetData = (dataKey) => {
  const data = JSON.parse(sessionStorage.getItem(dataKey));
  return data;
};
