export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Default for local development
  return "http://localhost:3000";
};
