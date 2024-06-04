import axios from "axios";

// userTable 접근
export const saveUser = ({ user_id, email, pw, username, provider, token }) => {
  return axios
    .post("http://localhost:8080/api/users", {
      // 서버에 보낼 것들
      user_id,
      email,
      pw,
      username,
      provider,
      token,
    })
    .then((response) => {
      console.log("User saved:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("error: ", error);
    });
};

export const getUser = (user_id) => {
  return axios
    .get(`http://localhost:8080/api/users?key1=${user_id}`)
    .then((response) => {
      console.log("User fetched:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("error: ", error);
    });
};

// dailyTable 접근
export const saveDaily = ({ date, user_id, state }) => {
  return axios
    .post("http://localhost:8080/api/dailys", {
      // 서버에 보낼것들
      date,
      user_id,
      state,
    })
    .then((response) => {
      console.log("Daily saved:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("error: ", error);
    });
};

export const getDaily = ({ date, user_id }) => {
  return axios
    .get(`http://localhost:8080/api/dailys?key1=${date}&key2=${user_id}`)
    .then((response) => {
      console.log("Daily fetched:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("error: ", error);
    });
};

// detailTable 접근
export const saveDetail = ({
  date,
  user_id,
  detail_home,
  detail_school,
  detail_hospital,
}) => {
  return axios
    .post("http://localhost:8080/api/details", {
      // 서버에 보낼것들
      date,
      user_id,
      detail_home,
      detail_school,
      detail_hospital,
    })
    .then((response) => {
      console.log("Detail saved:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("error: ", error);
    });
};

export const getDetail = ({ date, user_id }) => {
  return axios
    .get(`http://localhost:8080/api/details?key1=${date}&key2=${user_id}`)
    .then((response) => {
      console.log("Detail fetched:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("error: ", error);
    });
};
