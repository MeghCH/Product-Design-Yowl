// API Configuration
// Use window.location to dynamically get the correct host
const API_BASE =
  import.meta.env.VITE_API_URL ||
  `http://${window.location.hostname}:4000`;

export default API_BASE;
