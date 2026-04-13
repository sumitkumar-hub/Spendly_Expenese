import api from "./axios";

// 🔥 UPDATE PROFILE API
export const updateProfile = async (data) => {
  const res = await api.put("/users/profile", data);
  return res.data;
};