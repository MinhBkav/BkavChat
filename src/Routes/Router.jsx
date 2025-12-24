import {Routes,Route} from "react-router-dom";
import React,{lazy,Suspense} from "react";
const Login = lazy(()=>import("../Pages/Login"))
const Register = lazy(()=>import("../Pages/Register"))
const PageChat = lazy(()=>import("../Pages/MainChat"))
const PageAdmin = lazy(()=>import("../Pages/PageAdmin"))
const Statics = lazy(()=> import("../Component/PageAdmin/Statics"));
const Messages = lazy(()=> import("../Component/PageAdmin/Messages"));
export const Router = () => {
    return (
        <>
           <Suspense fallback = {<div>Đang loading...</div>}>
             <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path ="/main-chat" element ={<PageChat/>}/>
                <Route path ="/main-chat/:type/:id" element ={<PageChat/>}/>
                <Route path ="/page-admin" element ={<PageAdmin/>}>
                  <Route index element={<Statics/>}/>
                  <Route path="stats" element={<Statics />} />
                  <Route path="messages" element={<Messages />} />
                </Route>
            </Routes>
           </Suspense>
        </>
    );
};
