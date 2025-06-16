import {Link} from 'react-router-dom'
import {NavLink} from 'react-router-dom'
import React from 'react'
import {useState} from 'react'
import {WindowModal} from '../Component/Login/WindowModal'
export const Layout = ({children,isSucess,message,onClose,title}) => {
    const ChildArray = React.Children.toArray(children);
    const child = ChildArray[0];
    const rest = ChildArray.slice(1);
    return  (
        <>
        <div className = "relative z-0 flex 2xl:justify-between justify-center h-screen bg-[#f6f6f6] dark:bg-[#2d2d2e] ">
                <div className = "relative z-10 hidden  xl:flex xl:flex-col  xl:justify-center xl:m-[1rem] xl:items-center xl:w-[40%]  ">
                        <div className = "relative z-10  glow-background-2 mt-96 ml-52 rounded-full"></div>
                        <div className = "absolute z-20 bottom-[470px] right-96 glow-background top-16 rounded-full"></div>
                </div>
                <div className = "absolute z-30 2xl:top-20 2xl:left-28 top-10 left-24 hidden xl:flex xl:flex-col xl:justify-center xl:m-[1rem] xl:w-[40%]  ">
                        <div className = "flex h-1/4">
                                <div className = "flex items-center justify-center w-[60%] ml-16">
                                        <img src = "./images/IconChat.png" alt = "logo" className = "object-cover"/>
                                </div>
                        </div>
                        <div className = " p-10 mt-[3rem] ml-[1rem] w-[90%] h-2/3">
                        {child}
                        </div>
                </div>
                <div className = "flex flex-col justify-center h-full 2xl:w-[40%] w-2/3  2xl:pr-12 2xl:pt-14 2xl:pb-14 p-10 mr-6">
                        <ul className = "flex justify-center  mx-[6rem] h-1/12  ">
                                <li className = "btn" >
                                        <select name="lang" id="language " className ="bg-[#f6f6f6]">
                                                <option value="vi">Tiếng Việt</option>
                                                <option value="en">Tiếng Anh</option>
                                        </select>
                                </li>
                                <li className="">
                                        <NavLink
                                        to="/login"
                                        className = "btn"
                                        >
                                        Đăng nhập
                                        </NavLink>
                                        </li>
                                        <li className="">
                                        <NavLink
                                        to="/register"
                                        className = "btn"
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