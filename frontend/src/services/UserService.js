import axiosRequest, { BACKEND_BASE_URL } from "./Api";
import axios from "axios";
import Cookies from "js-cookie";

class UserService {

    saveTokens(access, refresh) {
        Cookies.set("bryckel_access", access);
        Cookies.set("bryckel_refresh", refresh)
        return
    }

    checkTokens() {
        return [Cookies.get("bryckel_access"), Cookies.get("bryckel_refresh")];
    }

    logout(navigate) {
        Cookies.remove("bryckel_access");
        Cookies.remove("bryckel_refresh");
        navigate({pathname: "/login"});
        return;
    }

    checkUser(access_token) {
        return axios.post(`${BACKEND_BASE_URL}/auth/v1`, {access_token: access_token})
    }

    addUser(user) {
        return axios.put(`${BACKEND_BASE_URL}/auth/v1`, user)
    }

    async getAllNotes() {
        return await axiosRequest("GET", `${BACKEND_BASE_URL}/api/v1/note`)
    }

    async getNote(id) {
        return await axiosRequest("GET", `${BACKEND_BASE_URL}/api/v1/note/${id}`)
    }

    async saveNote(title, text, id) {
        return await axiosRequest("PUT", `${BACKEND_BASE_URL}/api/v1/note/${id}`, {text: text, title: title})
    }

    async createNote(title) {
        return await axiosRequest("POST", `${BACKEND_BASE_URL}/api/v1/note`, {title: title})
    }

    async deleteNote(id) {
        return await axiosRequest("DELETE", `${BACKEND_BASE_URL}/api/v1/note/${id}`)
    }

}

const userService = new UserService();
export default userService;