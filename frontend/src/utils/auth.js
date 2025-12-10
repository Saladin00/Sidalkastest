// src/utils/auth.js
export const getToken = () => sessionStorage.getItem("token");
export const getRole = () => sessionStorage.getItem("role");
export const getUser = () => JSON.parse(sessionStorage.getItem("user") || "{}");

export const logout = () => {
  sessionStorage.clear();
  window.location.href = "/";
};

export const redirectByRole = (navigate, role) => {
  switch (role) {
    case "admin":
      navigate("/admin");
      break;
    case "operator":
      navigate("/operator");
      break;
    case "lks":
      navigate("/lks");
      break;
    case "petugas":
      navigate("/petugas");
      break;
    default:
      navigate("/");
  }
};
