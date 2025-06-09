import {Login } from "../Pages/Login";
import {Routes,Route} from "react-router-dom";
import {Register} from "../Pages/Register";
import {PageChat} from "../Pages/MainChat";
export const Router = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path ="/main-chat" element ={<PageChat/>}/>
            </Routes>
        </>
    );
};
