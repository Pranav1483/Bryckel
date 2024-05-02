import axios from "axios";
import Cookies from "js-cookie";

export const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const api = axios.create({});

const refreshToken = async () => {
    const refresh = Cookies.get("bryckel_refresh");
    try {
        const response = await axios.post(`${BACKEND_BASE_URL}/auth/v1/refresh`, {refresh: refresh})
        const newAccess = response.data.access;
        Cookies.set("bryckel_access", newAccess);
        return newAccess;
    } catch {
        return null;
    }
}

const axiosRequest = async (method, url, data=null) => {
    try {
        const access = Cookies.get("bryckel_access");
        const response = await api({
            method,
            url,
            headers: {
                Authorization: `Bearer ${access}`
            },
            data,
        });
        return [response.data, response.status];
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                const newAccess = await refreshToken();
                if (!newAccess) {
                    return [null, null];
                }
                const response = await api({
                    method,
                    url,
                    headers: {
                        Authorization: `Bearer ${newAccess}`
                    },
                    data
                });
                return [response.data, response.status]
            } catch (refreshError) {
                return [null, null];
            }
        } else {
            return [null, null];
        }
    }
};

export default axiosRequest;