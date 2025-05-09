import {Link} from 'react-router-dom'
import {NavLink} from 'react-router-dom'
import React from 'react'
import {useState} from 'react'
import {WindowModal} from '../../Component/Login/WindowModal'
export const Layout = ({children,isSucess,message,onClose,title}) => {
    const ChildArray = React.Children.toArray(children);
    const child = ChildArray[0];
    const rest = ChildArray.slice(1);
    
    return  (
        <>
        <div className = "relative z-1 flex justify-between max-w-screen  h-screen bg-[#f6f6f6] ">
                <div className = "relative z-2  md:flex md:flex-col md:justify-center md:m-[1rem] md:items-center md:w-[40%] md:h-[100%] ">
                        <div className = "relative z-1  glow-background-2 mt-60 ml-52 rounded-full"></div>
                        <div className = "absolute z-2 bottom-[470px] right-80 glow-background rounded-full"></div>
                </div>
                <div className = "absolute z-3 2xl:top-20 2xl:left-28 top-10 left-24 hidden md:flex md:flex-col md:justify-center md:m-[1rem] md:w-[40%]  ">
                        <div className = "flex h-1/4">
                                <div className = "flex items-center justify-center w-[60%] ml-16">
                                        <img src = "./images/IconChat.png" alt = "logo" className = "object-cover"/>
                                </div>
                        </div>
                        <div className = "p-10 mt-[1.5rem] ml-[1rem] w-[90%] h-2/3">
                        {child}
                        </div>
                </div>
                <div className = "flex flex-col justify-center h-full 2xl:w-[40%] md:w-[50%] w-full 2xl:pr-12 2xl:pt-14 2xl:pb-14 p-10 mr-6">
                        <ul className = "flex justify-center  mx-[6rem] h-1/12  ">
                                <li className = "btn mr-10" >
                                        <select name="lang" id="language " className ="bg-[#f6f6f6]">
                                                <option value="vi">Tiếng Việt</option>
                                                <option value="">Tiếng Anh</option>
                                        </select>
                                </li>
                                <li>
                                        <NavLink
                                        to="/login"
                                        className="btn"
                                        >
                                        Đăng nhập
                                        </NavLink>
                                        </li>
                                        <li>
                                        <NavLink
                                        to="/register"
                                        className="btn"
                                        >
                                        Đăng ký
                                        </NavLink>
                                 </li>
                        </ul>
                        {rest}
                </div>
        </div>
        <WindowModal isOpen ={isSucess} message={message} onClose={onClose} title ={title}/>
   </>
    );
}
export default Layout; 