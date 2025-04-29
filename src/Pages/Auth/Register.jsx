import {Link} from 'react-router-dom'
import {BkavIcon} from '../../Component/Login/BkavIcon' 
import {Layout} from './Layout'     
export const Register =() => {
    return (
    <>
     <Layout>
     <img src ="./images/Register.png" alt ="Not found" className = " object-contain w-3/4 h-3/4"/>
     <form className = "grid grid-cols-[30%_70%] grid-rows-7 w-4/5 gap-2 md:gap-4 2xl:gap-10 h-4/6 mt-24">
                                <h3 className = " text-start 2xl:text-[2.6rem] text-[1.5rem] font-[400] col-start-2 row-start-1 row-span-2 ">Đăng ký</h3>
                                <div className = "flex items-center justify-start col-start-1 row-start-2 max-h-[60px]">
                                     <h4 className = "text-start text-[1rem] ">Tên tài khoản</h4>    
                                </div>
                                <input
                                type = "text"
                                placeholder = "Tên tài khoản/Email"
                                className = "rounded-lg ring-2 ring-sky-50 p-2  bg-sky-100 focus:ring-4 focus:ring-sky-200 col-start-2 row-start-2 max-h-[60px] "
                                />
                                <div className = "flex items-center justify-start col-start-1 row-start-3">
                                     <h4 className = "text-start text-[1rem] font-[400] ">Địa chỉ email</h4>    
                                </div>
                                <input
                                type = "text"
                                placeholder = "Mật khẩu"
                                className = " rounded-lg ring-2 ring-sky-50 p-2 bg-sky-100 focus:ring-4 focus:ring-sky-200 col-start-2 row-start-3 max-h-[60px]"
                                />
                                <div className = "flex items-center justify-start col-start-1 row-start-4">
                                     <h4 className = "text-start text-[1rem] ">Mật khẩu</h4>    
                                </div>
                                <input
                                type = "password"
                                placeholder = "Mật khẩu"
                                className = " rounded-lg ring-2 ring-sky-50 p-2  bg-sky-100 focus:ring-4 focus:ring-sky-200 col-start-2 row-start-4"
                                />
                                <div className = "flex items-center justify-start col-start-1 row-start-5">
                                     <h4 className = "text-start text-[1rem] ">Nhập lại mật khẩu</h4>    
                                </div>
                                <input
                                type = "password"
                                placeholder = "Nhập lại mật khẩu"
                                className = " rounded-lg ring-2 ring-sky-50 p-2  bg-sky-100 focus:ring-4 focus:ring-sky-200 col-start-2 row-start-5"
                                />
                                <button className = "p-2   bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 shadow-lg shadow-slate-300 col-start-2 row-start-6">
                                Đăng nhập  
                                </button>
                                <button className = "text-start mt-4 italic col-start-2 row-start-7">Đã có tài khoản, đang nhập tại <a className = "text-sky-700 ">đây!</a></button>
                        </form>
                        <div className = "flex flex-col justify-between h-1/6 mb-4">
                       </div>
     </Layout>
    </>
    );
 }
 export default Register;