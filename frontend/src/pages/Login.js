import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import userService from '../services/UserService';
import { PencilLine } from "lucide-react";

const Login = () => {

    const navigate = useNavigate();
    const handleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                const responseObj = await userService.checkUser(response.access_token);
                const [responseData, responseStatus] = [responseObj.data, responseObj.status];
                if (!responseData) {
                    return;
                } else {
                    if (responseStatus === 200) {
                        userService.saveTokens(responseData.access, responseData.refresh);
                        navigate({pathname: "/"});
                        return;
                    } else {
                        const data = {
                            first_name: responseData.first_name,
                            last_name: responseData.last_name,
                            username: responseData.username,
                            access_token: response.access_token
                        }
                        navigate("/register", {state: data});
                        return;
                    }
                }
            } catch {

            }
        }
    })

    useEffect(() => {
        const [access, refresh] = userService.checkTokens();
        if (access && refresh) navigate({pathname: "/"});
    })

    return (
        <div>
            <div className='fixed left-0 top-0 -z-10 h-full w-full'>
                <div className="relative h-full w-full bg-slate-950"><div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div><div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div></div>
            </div>
            <div className='relative h-screen w-screen flex items-center justify-center'>
                <div className='h-1/2 w-7/12 bg-black bg-opacity-20 backdrop-blur-3xl rounded-3xl flex flex-col justify-center items-center gap-10 shadow-sm shadow-slate-600'>
                    <h1 className='text-white font-bold text-3xl flex items-center justify-center gap-2'>
                        Scribble
                        <PencilLine color='white' strokeWidth={2} size={30}/>
                    </h1>
                    <button className="px-4 py-2 border flex items-center gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150" onClick={handleLogin}>
                        <img className="w-10 h-10" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"/>
                        <span className='text-xl'>Login with Google</span>
                    </button>    
                </div>
            </div>
        </div>
    );
}

export default Login;