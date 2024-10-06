import { getData } from "../utils/api";
import { useCallback, useEffect, useState } from "react";

export const useGetData = ({
  url,
  onSuccess,
  onError,
  params,
  isEnabled = true,
  headers = {},
  ...otherParams
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState();

  const fetch = useCallback(
    async function () {
      try {
        setIsLoading(true);
        const response = await getData({
          url,
          headers,
          params,
          ...otherParams,
        });

        setIsSuccess(true);
        onSuccess?.(response);
        setData(response);
      } catch (error) {
        setError(error.message);
        setIsError(true);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [JSON.stringify(params)]
  );

  useEffect(() => {
    if (isEnabled) {
      fetch();
    }
  }, [isEnabled]);

  return { isSuccess, isLoading, data, isError, error, refecth: fetch };
};

