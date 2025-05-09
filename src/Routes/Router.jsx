import {Login } from "../Pages/Auth/Login";
import {Routes,Route} from "react-router-dom";
import {Register} from "../Pages/Auth/Register";
import {MainChat} from "../Pages/Main/MainChat";
export const Router = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path ="/MainChat" element ={<MainChat/>}/>
            </Routes>
        </>
    );
};
