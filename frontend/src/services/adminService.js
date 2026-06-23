// import axiosInstance from "../api/axiosInstance";

// export const getAdminStats = async () => {
//   const { data } = await axiosInstance.get("/admin/stats");

//   return data;
// };

// export const getUsers = async () => {
//   const { data } = await axiosInstance.get("/admin/users");

//   return data;
// };

// export const deleteUser = async (id) => {
//   const { data } = await axiosInstance.delete(`/admin/users/${id}`);

//   return data;
// };

import axiosInstance from "../api/axiosInstance";

export const getAdminStats = async () => {
  const { data } = await axiosInstance.get("/admin/stats");
  return data;
};

export const getUsers = async () => {
  const { data } = await axiosInstance.get("/admin/users");
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await axiosInstance.delete(`/admin/users/${id}`);

  return data;
};

export const updateUserRole = async (id, role) => {
  const { data } = await axiosInstance.patch(`/admin/users/${id}/role`, {
    role,
  });

  return data;
};
