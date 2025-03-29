import axios, {AxiosPromise} from 'axios';

const ROOT_HTTP = 'http://10.0.2.2:5001/api/v1/';
type RequestMethod = 'POST' | 'GET' | 'PUT' | 'DELETE';

let token = '';

// Thiết lập token
export const setToken = (newToken: string) => {
  token = newToken;
};

// Lấy token hiện tại
export const getToken = () => token;

// Kiểu dữ liệu chung cho response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

// Request không cần xác thực
export const request = <T>(
  url: string,
  method: RequestMethod = 'GET',
  data?: object,
  headers?: object,
): Promise<ApiResponse<T>> => {
  return axios({
    method,
    url,
    baseURL: ROOT_HTTP,
    data,
    timeout: 60000,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });
};

// Request cần xác thực
export const authRequest = <T>(
  url: string,
  method: RequestMethod = 'GET',
  data?: object | null,
  headers?: object | null,
  params?: object,
): Promise<ApiResponse<T>> => {
  return axios({
    method,
    url,
    baseURL: ROOT_HTTP,
    data,
    params,
    timeout: 60000,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

// Request gửi form data có xác thực
export const authRequestFormData = <T>(
  url: string,
  method: RequestMethod = 'GET',
  data?: object,
  headers?: object,
  params?: object,
): Promise<ApiResponse<T>> => {
  return axios({
    method,
    url,
    baseURL: ROOT_HTTP,
    data,
    params,
    timeout: 60000,
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
};

// Kiểm tra kết nối API
export const testConnection = async () => {
  try {
    const response = await fetch(ROOT_HTTP);
    return response.ok;
  } catch (error) {
    console.error('Lỗi kết nối API:', error);
    return false;
  }
};

// Cấu hình interceptors
axios.interceptors.request.use(
  (config: any) => {
    if (__DEV__) {
      console.log('%c [API Request]', 'color: blue; font-weight: bold', {
        METHOD: config.method,
        HEADER: config.headers,
        DATA: config.data,
        URL: config.baseURL + config.url,
      });
    }
    return config;
  },
  error => {
    if (__DEV__) {
      console.log(
        '%c [API Request Error]',
        'color: red; font-weight: bold',
        error,
      );
    }
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  response => {
    if (__DEV__) {
      console.log('%c [API Response]', 'color: #248c1d; font-weight: bold', {
        METHOD: response.config.method,
        DATA: response.data,
        URL: response.config.url,
      });
    }
    return response.data;
  },
  error => {
    if (__DEV__) {
      console.log(
        '%c [API Response Error]',
        'color: red; font-weight: bold',
        error.response,
      );
    }
    return error.response;
  },
);
