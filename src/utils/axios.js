import axios from "axios";

const instance = axios.create({
  baseURL: 'https://camp-coding.tech/test_api/products/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
export default instance;
