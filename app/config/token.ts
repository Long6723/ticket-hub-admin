const getAccessToken = () => {
  try {
    const accessToken = localStorage.getItem("accessToken") || "{}";
    return accessToken || "";
  } catch (error) {
    console.error("Error parsing token from localStorage:", error);
    return "";
  }
};

export default getAccessToken;
