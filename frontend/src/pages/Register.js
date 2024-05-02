import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import userService from '../services/UserService';
import Cookies from "js-cookie";
import { MoveRight } from 'lucide-react';

const Register = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState({first_name: "", last_name: "", username: "", access_token: ""});

    const handleSubmit = () => {
        userService.addUser(user)
        .then((response) => {
            if (response.status === 201) {
                Cookies.set("bryckel_access", response.data.access);
                Cookies.set("bryckel_refresh", response.data.refresh);
                navigate({pathname: "/"});
            }
        })
        .catch((e) => {
            if (e.response && e.response.status) {
                if (e.response.status === 409) {
                    if (e.response.data.FIELD === "USERNAME") alert("Username Exists ! Please Choose Another One");
                    else alert("Email Exists ! Cannot Create User");
                } else alert("Bad Token or Timeout, Please Try Again");
            } else alert("Unknown Client Error"); 
        })
    }

    useEffect(() => {
        try {
            const { first_name, last_name, username, access_token } = location.state;
            setUser({first_name, last_name, username, access_token});
        } catch {
            navigate({pathname: "/login"});
        }  
    }, [])

    return (
        <div>
            <div className='fixed left-0 top-0 -z-10 h-full w-full'>
                <div className="relative h-full w-full bg-slate-950"><div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div><div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div></div>
            </div>
            <div className='relative h-screen w-screen flex flex-col items-center justify-center'>
                <div className='h-3/4 w-5/6 flex flex-col items-center justify-center gap-10'>
                    <h2 className='text-2xl text-white font-extrabold'>Complete your Registration</h2>
                    <div className='flex flex-col gap-4 w-full items-center justify-center'>
                        <input className='bg-white px-1 py-2 rounded-xl w-1/2 text-lg font-bold' placeholder='First Name' value={user.first_name} onChange={(e) => {setUser({...user, first_name: e.target.value})}}/>
                        <input className='bg-white px-1 py-2 rounded-xl w-1/2 text-lg font-bold' placeholder='Last Name' value={user.last_name} onChange={(e) => {setUser({...user, last_name: e.target.value})}}/>
                        <input className='bg-white px-1 py-2 rounded-xl w-1/2 text-lg font-bold' placeholder='Username' value={user.username} onChange={(e) => {setUser({...user, username: e.target.value})}}/>
                    </div>
                    <button className="px-2 py-4 border border-white text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-purple-700 hover:border-purple-700 transition duration-500" onClick={handleSubmit}>
                        <MoveRight />
                        <span>Get Started</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;