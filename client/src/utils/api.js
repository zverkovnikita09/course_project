export const generateUrlParams = (
  params
) => {
  return Object.entries(params)
    .filter(
      ([_, value]) =>
        typeof value !== "undefined" && value !== null && value !== ""
    )
    .map(([key, value], index) => {
      if (Array.isArray(value)) {
        return value
          .filter(Boolean)
          .map((item) => `${key}[]=${item}`)
          .join("&");
      }

      if (typeof value === "object") {
        const resultArr = [];

        Object.entries(value).forEach(([objectKey, objectValue]) => {
          resultArr.push(`${key}[${index}][${objectKey}]=${objectValue}`);
        });

        return resultArr.join("&");
      }

      return `${key}=${value}`;
    })
    .join("&");
};

export const getData = async ({
  baseUrl = "http://localhost:5000",
  url,
  headers = {},
  params = {},
  defaultErrorMessage = "Произошла ошибка при получении данных",
}) => {
  const paramsString = generateUrlParams(params);
  const queryParams = paramsString ? "?" + paramsString : "";
  const response = await fetch(`${baseUrl}${url}${queryParams}`, {
    headers,
  });
  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error(data?.message ?? defaultErrorMessage);
  }
  return data;
};

export const sendData = async ({
  baseUrl = "http://localhost:5000",
  data,
  url,
  headers = {},
  method = "post",
  defaultErrorMessage = "Произошла ошибка при отправке данных",
}) => {
  let dataToSend = JSON.stringify(data);

  const response = await fetch(`${baseUrl}${url}`, {
    body: data ? dataToSend : undefined,
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
  });
  const dataJson = await response.json();

  if (!response.ok) {
    throw new Error(dataJson?.message ?? defaultErrorMessage);
  }

  return dataJson;
};

