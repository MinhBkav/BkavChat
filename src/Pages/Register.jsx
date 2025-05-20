import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {BkavIcon} from '../Component/Login/BkavIcon' 
import {Layout} from '../Layout/Layout'    
import {useState,useEffect} from 'react' 
import { useDispatch, useSelector } from "react-redux";
import {EmailInput} from '../Component/Login/EmailInput'
import {PasswordInput} from '../Component/Login/PasswordInput'
import {register,sUser} from '../feature/registerSlice'  
export const Register =() => {
     const [isSucess, setIsSuccess] = useState(false);
     const [message, setMessage] = useState("");
     const [title,  setTitle] = useState("");
     const [errorInput,setErrorInput] = useState({})
     const [user,setUser] = useState({
        username : "",
        email : "",
        password : "",
        password2 : ""
     });
     const dispatch = useDispatch();
     const {error,isLoading} = useSelector((state)=>state.register)
     const navigate = useNavigate();
       const onCloseModal = () => {   
     if(isLoading){
        setIsSuccess(true);
     }
     else {
        setIsSuccess(false)
     }
     }
     const validate = () => {
      const newError = {};
      const emailRule = /^[A-Za-z0-9]+@Bkav\.com$/;
         if(!user.username) {
          newError.username = "Vui long nhap ten"
         }
        if (!user.email){
          newError.email = "Vui long nhap email";
        } 
        else if (!emailRule.test(user.email)){
           newError.email = "Mail phai khong dung dinh dang"
        }
      if(!user.password){
        newError.password = "Vui long nhap mat khau"
      }
      if(!user.password2){
        newError.password2 = "Vui long nhap mat khau"
      }
      
      else {
          if(user.password !== user.password2){
               newError.password = "Mat khau khong khop"
          }
          else {
         if(/\s/.test(user.password)){
        newError.password = "Mat khau khong duoc chua dau cach "
             }
        else if(user.password.length <= 8){
        newError.password = "Mat khau phai lon hon 8 ky tu"
          }
       } 
      }
      setErrorInput(newError);
      return Object.keys(newError).length === 0;
      }
   
     
     const haldSubmit = async (e) => {
        e.preventDefault();
        if(validate()){
          dispatch(register(user))
                 }
     }
         useEffect(() => {
              if (isLoading) {
                setMessage('Loading...');
                setTitle('Đang đăng ký');
                setIsSuccess(true);
              } else if (isLoading === false && error === true) {
                  setMessage(`${user.email}`);
                  setTitle(`Chúng tôi đã gửi một liên kết xác thực đến ${user.email}.Vui lòng kiểm tra hòm thư của bạn.`);
                dispatch(sUser(user));  // Cập nhật người dùng vào Redux state khi login thành công
                navigate("/Login")
                setIsSuccess(true);  // Hiển thị modal khi login thành công
              } else if (error) {
                setMessage('Đăng nhập thất bại. Vui lòng thử lại.');
                setTitle('Lỗi');
                setIsSuccess(true);  // Hiển thị modal khi có lỗi
              }
            }, [isLoading, error, dispatch]);
          const handleChange = (e) => {
           const {name,value} = e.target;
           setUser((prev)=>({...prev,[name]:value}));};
     
    return (
    <>
     <Layout isSucess= {isSucess} message = {message} onClose = {onCloseModal} title = {title}>
     <img src ="./images/Register.png" alt ="Not found" className = " object-contain w-3/4 h-3/4"/>
     <form className = " grid grid-cols-[30%_70%] grid-rows-7 w-4/5 gap-4 md:gap-8  2xl:gap-[1.6rem] h-4/6 2xl:mt-24 mt-16">
                                <h3 className = " text-start 2xl:text-[3rem] text-[1.5rem] font-[400] col-start-2 row-start-1 row-span-2 2xl:row-span-1 pb-8">Đăng ký</h3>
                                <div className = "flex items-center justify-start col-start-1 row-start-2 max-h-[60px]">
                                     <h4 className = "text-start text-[1.2rem] ">Tên tài khoản</h4>    
                                </div>
                                <EmailInput
                                error = {errorInput.username}
                                name = "username"
                                type = "username"
                                value = {user.username}
                                onChange = {handleChange}
                                placeholder=""
                                inputclassName= "w-full col-start-2 row-start-2 max-h-[60px] flex justify-end"
                                />
                                <div className = "flex items-center justify-start col-start-1 row-start-3">
                                     <h4 className = "text-start text-[1.2rem] font-[400] ">Địa chỉ email</h4>    
                                </div>
                                <EmailInput
                                error = {errorInput.email}
                                name = "email"
                                type = "email"
                                value = {user.email}
                                onChange = {handleChange}
                                placeholder=""
                                inputclassName= "w-full col-start-2 row-start-3 max-h-[60px] flex justify-end"
                                />
                                <div className = "flex items-center justify-start col-start-1 row-start-4">
                                     <h4 className = "text-start text-[1.2rem] ">Mật khẩu</h4>    
                                </div>
                                <PasswordInput
                                   error = {errorInput.password}
                                   name = "password"
                                   value ={user.password}
                                   onChange = {handleChange}     
                                   placeholder=""
                                   inputclassName="w-full col-start-2 row-start-4 max-h-[60px] flex justify-end"
                                   />
                                <div className = "flex items-center justify-start col-start-1 row-start-5">
                                     <h4 className = "text-start text-[1.2rem] ">Nhập lại mật khẩu</h4>    
                                </div>
                                <PasswordInput
                                   error = {errorInput.password2}
                                   name = "password2"
                                   value ={user.password2}
                                   onChange = {handleChange}     
                                   placeholder=""
                                   inputclassName="w-full col-start-2 row-start-5 max-h-[60px] flex justify-end"
                                   />
                                <button className = "p-4 w-full  text-[1.2rem] bg-[#4461F2] text-white font-bold rounded-md hover:bg-blue-700 shadow-lg shadow-slate-300 col-start-2 row-start-6" onClick ={(e)=>haldSubmit(e)}>
                                Đăng ký 
                                </button>
                                <button className = "text-start mt-4 italic col-start-2 row-start-7 text-2xl">Đã có tài khoản, đang nhập tại <a className = "text-sky-700 ">đây!</a></button>
                        </form>
                        <div className = "flex flex-col justify-between h-1/6 mb-4">
                       </div>
     </Layout>

    </>
    );
 }
 export default Register;