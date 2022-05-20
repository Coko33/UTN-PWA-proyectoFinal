export const helpHttp = () => {
  const customfetch = async (endpoint, options) => {
    const urlBase = "http://localhost:3000";

    const URL = `${urlBase}/${endpoint}`;

    const token = localStorage.getItem("JWT");

    const defaultHeader = {
      accept: "application/json",
      authorization: token,
    };

    const controller = new AbortController();
    options.signal = controller.signal;
    options.method = options.method || "GET";
    options.headers = options.headers
      ? { ...defaultHeader, ...options.headers }
      : defaultHeader;

    return fetch(URL, options)
      .then((res) =>
        res.ok
          ? res.json()
          : Promise.reject({
              err: true,
              status: res.status || "00",
              statusText: res.statusText || "Ocurrió un error",
            })
      )
      .catch((err) => err);
  };

  //verbos HTTP
  const get = (endpoint, options = {}) => customfetch(endpoint, options);

  const post = (endpoint, options = {}) => {
    options.method = "POST";
    return customfetch(endpoint, options);
  };

  const put = (endpoint, options = {}) => {
    options.method = "PUT";
    return customfetch(endpoint, options);
  };

  const del = (endpoint, options = {}) => {
    options.method = "DELETE";
    return customfetch(endpoint, options);
  };

  return {
    get,
    post,
    put,
    del,
  };
};
