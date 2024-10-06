import { sendData } from "../utils/api";
import { useState } from "react";

export const useSendData = ({
    onSuccess,
    onError,
    withAuthToken,
    headers = {},
    ...otherParams
  }) => {
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState();

  const handleSendData = async (data) => {
    try {
      setIsError(false)
      setError(null)
      setIsSending(true);
      const response = await sendData({ data, headers, ...otherParams })

      setIsSuccess(true);
      onSuccess?.(response);
      setResponseData(response);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
        setIsError(true);
        onError?.(error);
      }
    } finally {
      setIsSending(false);
    }
  }

  return { isSuccess, isSending, handleSendData, isError, error, responseData }
}