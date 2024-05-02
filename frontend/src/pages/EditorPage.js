import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import userService from '../services/UserService';
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";

const EditorPage = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const editor = useCreateBlockNote();
    const [note, setNote] = useState(undefined);
    const [conf, setConf] = useState(false);

    const getNote = async (id) => {
        const [data, status] = await userService.getNote(id);
        if (status !== 200) {
            navigate({pathname: "/"});
        } else {
            setNote(data);
        }
    }

    useEffect(() => {
        const [access, refresh] = userService.checkTokens();
        if (!access || !refresh) {
            userService.logout();
        }
        try {
            const { note_id } = location.state;
            getNote(note_id);
        } catch {
            navigate("/");
        }
    }, [location.state, navigate])

    const loadNote = () => {
        if (note) {
            const markdown = (note.text === "")?[]:JSON.parse(note.text);
            editor.removeBlocks([...editor.document]);
            if (markdown.length > 0) editor.insertBlocks(markdown, editor.document[0], "before");
        }
    }

    const saveNote = async () => {
        if (note) {
            const [response, status] = await userService.saveNote(note.title, JSON.stringify(editor.document), note.id);
            if (status === 204) {
                alert("Saved Successfully");
            } else {
                alert("Error Saving Note");
            }
        }
    }

    const deleteNote = async () => {
        if (!conf) {
            setConf(!conf);
        } else {
            const [response, status] = await userService.deleteNote(note.id);
            if (status === 204) {
                navigate({pathname: "/"});
            } else {
                alert("Error Deleting Note");
            }
        }
    }

    if (!note) {
        
        return (
            <div>
                
            </div>
        )
    } else {
        setTimeout(loadNote, 1000);
        return (
            <div>
                <div className='fixed left-0 top-0 -z-10 h-full w-full'>
                    <div className="relative h-full w-full bg-slate-950"><div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div><div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div></div>
                </div>
                <div className='relative h-screen w-screen flex flex-col items-start justify-start p-4 gap-10'>
                    <div className='h-10 w-full flex justify-between'>
                        <input className='text-3xl font-extrabold text-white bg-inherit' value={note.title} onChange={(e) => {setNote({...note, title: e.target.value})}}/>
                        <div className='flex gap-5'>
                            <button className='rounded-full px-6 py-2 border border-white text-white font-semibold transition duration-500 hover:bg-green-500 hover:border-green-500' onClick={saveNote}>Save</button>
                            <button className='rounded-full px-6 py-2 border border-white text-white font-semibold transition duration-500 hover:bg-red-500 hover:border-red-500' onClick={deleteNote}>{(conf)?"Sure ?":"Delete"}</button>
                        </div>
                    </div>
                    <div className='w-full overflow-auto' style={{height: "calc(100% - 40px)"}}>
                        <BlockNoteView editor={editor}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default EditorPage;