import {Link} from 'react-router-dom'
import {BkavIcon} from '../../Component/Login/BkavIcon' 
import {Layout} from './Layout'    
import {useState} from 'react' 
export const Register =() => {
     const [isSucess, setIsSuccess] = useState(false);
     const [message, setMessage] = useState("");
     const [title,  setTitle] = useState("");
     const [user,setUser] = useState({
        username : "",
        email : "",
        password : "",
        password2 : ""
     });
     const onCloseModal = () => {
          
        setIsSuccess(false);
        setMessage("");
        setTitle("");
     
     }
     const haldSubmit = async (e) => {
          setMessage(`${user.email}`);
          setTitle(`Chúng tôi đã gửi một liên kết xác thực đến ${user.email}.Vui lòng kiểm tra hòm thư của bạn.`);
          setIsSuccess(true);
        e.preventDefault();
     }
     const handleChange = (e) => {
          const {name,value} = e.target;
          setUser((prev)=>({...prev,[name]:value}));};
    return (
    <>
     <Layout isSucess= {isSucess} message = {message} onClose = {onCloseModal} title = {title}>
     <img src ="./images/Register.png" alt ="Not found" className = " object-contain w-3/4 h-3/4"/>
     <form className = "grid grid-cols-[30%_70%] grid-rows-7 w-4/5 gap-2 md:gap-4 2xl:gap-[30px] h-4/6 2xl:mt-24 mt-16">
                                <h3 className = " text-start 2xl:text-[3rem] text-[1.5rem] font-[400] col-start-2 row-start-1 row-span-2 2xl:row-span-1 pb-8">Đăng ký</h3>
                                <div className = "flex items-center justify-start col-start-1 row-start-2 max-h-[60px]">
                                     <h4 className = "text-start text-[1rem] ">Tên tài khoản</h4>    
                                </div>
                                <div className = "relative w-full col-start-2 row-start-2 max-h-[60px] flex justify-end ">
                                <input
                                   name = "username"
                                   type = "username" 
                                   placeholder = ""
                                   value = {user.username}
                                   onChange = {handleChange}
                                   className = "w-full rounded-lg ring-2 ring-sky-50 p-2 bg-sky-100 focus:ring-4 focus:ring-sky-200 "
                                   />
                                   <ion-icon
                                        name="close-circle-outline"
                                        className ="absolute  top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none pr-4" ></ion-icon>
                                </div>
                                <div className = "flex items-center justify-start col-start-1 row-start-3">
                                     <h4 className = "text-start text-[1rem] font-[400] ">Địa chỉ email</h4>    
                                </div>
               
                                <div className = "relative w-full col-start-2 row-start-3 max-h-[60px] flex justify-end ">
                                <input
                                   name = "email"
                                   type = "email"
                                   placeholder = ""
                                   value = {user.email}
                                   onChange = {handleChange}
                                   className = "w-full rounded-lg ring-2 ring-sky-50 p-2 bg-sky-100 focus:ring-4 focus:ring-sky-200 "
                                   />
                                   <ion-icon
                                        name="close-circle-outline"
                                        className ="absolute  top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none pr-4" ></ion-icon>
                                </div>
                                <div className = "flex items-center justify-start col-start-1 row-start-4">
                                     <h4 className = "text-start text-[1rem] ">Mật khẩu</h4>    
                                </div>
                                <div className = "relative w-full col-start-2 row-start-4 max-h-[60px] flex justify-end ">
                                <input
                                   name = "password"
                                   type = "password" 
                                   value = {user.password}
                                   onChange = {handleChange}
                                   placeholder = ""
                                   className = "w-full rounded-lg ring-2 ring-sky-50 p-2 bg-sky-100 focus:ring-4 focus:ring-sky-200 "
                                   />
                                   <ion-icon
                                        name="eye-off-outline"
                                        className ="absolute  top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none pr-4" ></ion-icon>
                                </div>
                                <div className = "flex items-center justify-start col-start-1 row-start-5">
                                     <h4 className = "text-start text-[1rem] ">Nhập lại mật khẩu</h4>    
                                </div>
                                <div className = "relative w-full col-start-2 row-start-5 max-h-[60px] flex justify-end ">
                                <input
                                   name = "password2"
                                   type = "password"
                                   value = {user.password2}
                                   onChange={handleChange} 
                                   placeholder = ""
                                   className = "w-full rounded-lg ring-2 ring-sky-50 p-2 bg-sky-100 focus:ring-4 focus:ring-sky-200 "
                                   />
                                   <ion-icon
                                        name="eye-off-outline"
                                        className ="absolute  top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none pr-4" ></ion-icon>
                                </div>
                                <button className = "p-2   bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 shadow-lg shadow-slate-300 col-start-2 row-start-6" onClick ={(e)=>haldSubmit(e)}>
                                Đăng ký 
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