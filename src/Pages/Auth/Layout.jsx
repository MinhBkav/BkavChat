import {Link} from 'react-router-dom'
import React from 'react'
export const Layout = ({children}) => {
    const ChildArray = React.Children.toArray(children);
    const child = ChildArray[0];
    const rest = ChildArray.slice(1);
    return  (
        <>
   
   <div className = " flex justify-between p-[3rem] w-full h-screen bg-slate-50 2xl:pl-44 ">
        <div className = "relative z-1  hidden md:flex md:flex-col md:justify-center md:m-[1rem] md:items-center md:w-[40%] md:h-[100%]">
            <div className = "w-96 h-96 bg-slate-300 rounded-full">
            </div>
        </div>
        <div className = "absolute z-10 2xl:top-28 2xl:left-28 top-10 left-10 hidden md:flex md:flex-col md:justify-center md:m-[1rem] md:w-[40%]  ">
                 <div className = "flex h-1/4">
                         <div className = "flex items-center justify-center w-1/4">
                                 <img src = "./images/IconB.png" alt = "logo" className = "object-cover"/>
                         </div>
                         <div className = "flex items-center text-center">
                                 <h1 className = "  text-orange-500 2xl:text-[3.2rem] md:text-[2.2rem] font-bold">Bkav Chat</h1>
                         </div>
                 </div>
                 <div className = "p-10 mt-[2rem] w-full h-3/4">
                     {child}
                 </div>
         </div>
        <div className = "flex flex-col justify-center h-full md:w-[40%] w-full">
                <ul className = "flex justify-between  mx-[6rem] h-1/12  ">
                        <li className = "btn" >Tiếng việt</li>
                        <li className = "btn"><Link to = "/Login">Đăng nhập</Link></li>
                        <li className  = "btn"><Link to = "/Register">Đăng ký</Link></li>
                </ul>
                {rest}
        </div>
   </div>
   </>
    );
}
export default Layout;