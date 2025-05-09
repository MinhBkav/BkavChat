import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {BkavIcon} from '../../Component/Login/BkavIcon' 
import {Layout} from './Layout'    
import {useState} from 'react' 
import {EmailInput} from '../../Component/Login/EmailInput'
import {PasswordInput} from '../../Component/Login/PasswordInput'
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
     const navigate = useNavigate();
     const onCloseModal = () => {   
        setIsSuccess(false);
        setMessage("");
        setTitle("");
        navigate("/MainChat")
     
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
                                <EmailInput
                                name = "username"
                                type = "username"
                                value = {user.username}
                                onChange = {handleChange}
                                placeholder=""
                                inputclassName= "w-full col-start-2 row-start-2 max-h-[60px] flex justify-end"
                                />
                                <div className = "flex items-center justify-start col-start-1 row-start-3">
                                     <h4 className = "text-start text-[1rem] font-[400] ">Địa chỉ email</h4>    
                                </div>
                                <EmailInput
                                name = "email"
                                type = "email"
                                value = {user.email}
                                onChange = {handleChange}
                                placeholder=""
                                inputclassName= "w-full col-start-2 row-start-3 max-h-[60px] flex justify-end"
                                />
                                <div className = "flex items-center justify-start col-start-1 row-start-4">
                                     <h4 className = "text-start text-[1rem] ">Mật khẩu</h4>    
                                </div>
                                <PasswordInput
                                   name = "password"
                                   value ={user.password}
                                   onChange = {handleChange}     
                                   placeholder=""
                                   inputclassName="w-full col-start-2 row-start-4 max-h-[60px] flex justify-end"
                                   />
                                <div className = "flex items-center justify-start col-start-1 row-start-5">
                                     <h4 className = "text-start text-[1rem] ">Nhập lại mật khẩu</h4>    
                                </div>
                                <PasswordInput
                                   name = "password2"
                                   value ={user.password2}
                                   onChange = {handleChange}     
                                   placeholder=""
                                   inputclassName="w-full col-start-2 row-start-5 max-h-[60px] flex justify-end"
                                   />
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