// Switches between different environments
const configSwitcher = (environmentType) => {
  let configuration = [];

  switch (environmentType) {
    case "http://127.0.0.1:3000/":
      configuration = {
        /* Local Config */
        // API_URL: "http://13.235.48.234:8000/",
        API_URL: "https://apis.nfsasurat.in/", //"http://13.234.32.188:8000/",
        // API_URL: "https://apiresolab.dazzlesoft.in/",
      };
      break;
    case "reso-lab.vercel.app":
      configuration = {
        /* Local Config */
        API_URL: "https://apiresolab.dazzlesoft.in/",
      };
      break;
    default:
      configuration = {
        /* Default Local Config */
        // API_URL: "http://15.207.21.219/",
        // API_URL: "http://13.235.48.234:8000/",
        // API_URL: "http://13.234.32.188:8000/",
        API_URL: "https://apis.nfsasurat.in/",
      };
  }

  return configuration;
};

// Just change the string to 'local', 'sandbox', 'staging' or 'prod' to switch between different environments.
export const config = configSwitcher(window.location.hostname);
