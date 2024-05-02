import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/UserService';
import "../components/styles/global.css";
import {LogOut, Plus} from "lucide-react";

const Home = () => {

    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState(false);
    const [title, setTitle] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const [access, refresh] = userService.checkTokens();
        if (!access || !refresh) {
            userService.logout(navigate);
        } else {
            getAllNotes();
        }
    }, []);

    const getAllNotes = async () => {
        const [data, status] = await userService.getAllNotes();
        if (!data) {
            alert("Error Fetching User Notes");
        } else {
            setNotes(data.notes);
        }
    }

    const editPage = (note_id) => {
        navigate("/edit", {state: {note_id: note_id}});
    }

    const createNote = async () => {
        const [data, status] = await userService.createNote(title);
        if (status === 201) {
            const newNotes = [data, ...notes];
            setNotes(newNotes);
            alert("New Note Created");
            setNewNote(false);
            setTitle("");
        } else {
            alert("Failed Creating Note");
        }
    }

    return (
        <div>
            <div className='fixed left-0 top-0 -z-10 h-full w-full'>
                <div className="relative h-full w-full bg-slate-950"><div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div><div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div></div>
            </div>
            <div className='relative h-screen w-screen flex flex-col items-center justify-center'>
                <div className='h-16 w-full bg-inherit backdrop-blur-3xl flex items-center justify-end px-4 gap-10'>
                    <button className='flex items-center justify-center px-2 py-2 rounded-full border border-white text-white text-lg transition duration-500 hover:bg-green-500 hover:border-green-500 gap-1' onClick={() => {setNewNote(!newNote)}}>
                        <Plus/>
                        <span>Add Note</span>
                    </button>
                    <button className='flex items-center justify-center px-2 py-2 rounded-full border border-white text-white text-lg transition duration-500 hover:bg-red-600 hover:border-red-600 gap-2' onClick={() => {userService.logout(navigate)}}>
                        <LogOut />
                        <span>Logout</span>
                    </button>
                </div>
                <div className='w-5/6 grid grid-flow-col auto-cols-min overflow-auto gap-24 pt-40 px-4' style={{height: "calc(100% - 64px)"}}>
                    {newNote && <div className='w-40 h-60 bg-slate-300 rounded-2xl flex flex-col p-2 gap-5'>
                                    <textarea placeholder="Title" className='bg-inherit text-xl font-bold w-11/12 h-5/6 flex flex-col items-center focus:outline-none' value={title} onChange={(e) => {setTitle(e.target.value)}}/>
                                    <button className='px-2 py-1 bg-blue-500 rounded-full' onClick={(createNote)}>Confirm</button>
                                </div>}
                    {notes.map((note, index) => (
                        <button key={index} className='w-40 h-60 bg-slate-300 rounded-2xl hover:scale-105 flex flex-col p-2 gap-5' onClick={() => {editPage(note.id)}}>
                            <span className='text-xl font-bold'>{note.title}</span>
                            <span>------------------------------------------------------------------------------------</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;