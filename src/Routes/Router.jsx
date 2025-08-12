import {Routes,Route} from "react-router-dom";
import React,{lazy,Suspense} from "react";
const Login = lazy(()=>import("../Pages/Login"))
const Register = lazy(()=>import("../Pages/Register"))
const PageChat = lazy(()=>import("../Pages/MainChat"))
const Pagetest = lazy(()=>import("../Pages/Pagetest"))

export const Router = () => {
    return (
        <>
           <Suspense fallback = {<div>Đang loading...</div>}>
             <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path ="/main-chat" element ={<PageChat/>}/>
                <Route path ="page-test" element ={<Pagetest/>}/>
            </Routes>
           </Suspense>
        </>
    );
};
