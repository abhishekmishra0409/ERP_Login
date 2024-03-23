const getTokenFromSessionStorage = localStorage.getItem("user")
  ? JSON.parse(sessionStorage.getItem("user"))
  : null;

export const config = {
  headers: {
    Authorization: `Bearer ${
      getTokenFromSessionStorage !== null ? getTokenFromSessionStorage.token : ""
    }`,
    Accept: "application/json",
  },
};