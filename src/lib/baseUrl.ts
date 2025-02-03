export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side
    return window.location.origin;
  }

  // Server-side
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return `${process.env.NEXT_PUBLIC_BASE_URL}`;
  }

  // Default for local development
  return "http://localhost:3000";
};
