import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {BkavIcon} from '../Component/Login/BkavIcon' 
import {Layout} from '../Layout/Layout'    
import {useState,useEffect} from 'react' 
import { useDispatch, useSelector } from "react-redux";
import {EmailInput} from '../Component/Login/EmailInput'
import {PasswordInput} from '../Component/Login/PasswordInput'
import {register,sUser,resetRegister} from '../feature/registerSlice'  
const Register =() => {
     const [isSucess, setIsSuccess] = useState(false);
     const [message, setMessage] = useState("");
     const [title,  setTitle] = useState("");
     const [errorInput,setErrorInput] = useState({})
     const [user,setUser] = useState({
        Username : "",
        FullName : "",
        Password : "",
        Password2 : "",
        email : "",
     });
     console.log("Đã được render");
     const dispatch = useDispatch();
     const {error,isLoading} = useSelector((state)=>state.register)
     const navigate = useNavigate();
    //    const onCloseModal = () => {   
    //  if(isLoading){
    //     setIsSuccess(true);
    //  }
    //  else {
    //     setIsSuccess(false)
    //  }
    //  }
     const onCloseModal = () => {
    if (isLoading) {
      setIsSuccess(true)
    }
    else if(!isLoading && !error){
      setIsSuccess(false)
      navigate("/Login")
      dispatch(resetRegister())
    }
    else if(!isLoading && error){
      setIsSuccess(false)
    }
  }
     const validate = () => {
      const newError = {};
      const emailRule = /^[A-Za-z0-9]+@Bkav\.com$/;
         if(!user.Username) {
          newError.Username = "Vui long nhap ten"
         }
        if (!user.email){
          newError.email = "Vui long nhap email";
        } 
        else if (!emailRule.test(user.email)){
           newError.email = "Mail phai khong dung dinh dang"
        }
      if(!user.Password){
        newError.Password = "Vui long nhap mat khau"
      }
      if(!user.Password2){
        newError.Password2 = "Vui long nhap mat khau"
      }
      
      else {
          if(user.Password !== user.Password2){
               newError.Password = "Mat khau khong khop"
          }
          else {
         if(/\s/.test(user.Password)){
        newError.Password = "Mat khau khong duoc chua dau cach "
             }
        else if(user.Password.length <= 8){
        newError.Password = "Mat khau phai lon hon 8 ky tu"
          }
       } 
      }
      setErrorInput(newError);
      return Object.keys(newError).length === 0;
      }
   
     
     const haldSubmit = async (e) => {
        e.preventDefault();
        // if(validate()){
          dispatch(register(user))
                //  }
     }
         useEffect(() => {
              if (isLoading) {
                setMessage('Loading...');
                setTitle('Đang đăng ký');
                setIsSuccess(true);
              } else if (isLoading === false && error === false) {
                  setMessage(`${user.email}`);
                  setTitle(`Chúng tôi đã gửi một liên kết xác thực đến ${user.email}.Vui lòng kiểm tra hòm thư của bạn.`);
                dispatch(sUser(user));  // Cập nhật người dùng vào Redux state khi login thành công
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
     <form className = " sm:grid grid-cols-[30%_70%] grid-rows-7 2xl:w-4/5 w-full gap-4 md:gap-8  2xl:gap-[1.6rem] h-4/6 2xl:mt-24 mt-16 hidden">
                                <h3 className = " text-start 2xl:text-[3rem] text-[2.5rem] font-[400] col-start-2 row-start-1 row-span-2 2xl:row-span-1 pb-8">Đăng ký</h3>
                                <div className = "flex items-center justify-start col-start-1 row-start-2 max-h-[60px]">
                                     <h4 className = "text-start 2xl:text-[1.2rem] lg:text-xl md:text-base ">Tên tài khoản</h4>    
                                </div>
                                <EmailInput
                                error = {errorInput.Username}
                                name = "Username"
                                type = "Username"
                                value = {user.Username}
                                onChange = {handleChange}
                                placeholder=""
                               inputclassName= "w-full col-start-2 row-start-2 max-h-[60px] flex justify-end"
                                />
                                <div className = "flex items-center justify-start col-start-1 row-start-3">
                                      <h4 className = "text-start 2xl:text-[1.2rem] lg:text-xl md:text-base font-[400] ">Địa chỉ email</h4>    
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
                                     <h4 className = "text-start 2xl:text-[1.2rem] lg:text-xl md:text-base">Mật khẩu</h4>    
                                </div>
                                <PasswordInput
                                   error = {errorInput.Password}
                                   name = "Password"
                                   value ={user.Password}
                                   onChange = {handleChange}     
                                   placeholder=""
                                   inputclassName="w-full col-start-2 row-start-4 max-h-[60px] flex justify-end"
                                   />
                                <div className = "flex items-center justify-start col-start-1 row-start-5">
                                     <h4 className = "text-start 2xl:text-[1.2rem] lg:text-xl md:text-base">Nhập lại mật khẩu</h4>    
                                </div>
                                <PasswordInput
                                   error = {errorInput.Password2}
                                   name = "Password2"
                                   value ={user.Password2}
                                   onChange = {handleChange}     
                                   placeholder=""
                                   inputclassName="w-full col-start-2 row-start-5 max-h-[60px] flex justify-end"
                                   />
                                <button className = "px-4 w-full  text-[1.2rem] bg-[#4461F2] text-white font-bold rounded-md hover:bg-blue-700 shadow-lg shadow-slate-300 col-start-2 row-start-6" onClick ={(e)=>haldSubmit(e)}>
                                Đăng ký 
                                </button>
                                <button className = "text-start mt-4 italic col-start-2 row-start-7 2xl:text-2xl lg:text-xl ">Đã có tài khoản, đang nhập tại <a className = "text-sky-700 ">đây!</a></button>
                        </form>
     <form className = " grid grid-cols-1 grid-rows-7 2xl:w-4/5 w-full gap-4 md:gap-8  2xl:gap-[1.6rem] h-4/6 2xl:mt-24 mt-16 sm:hidden">
                                <h3 className = " text-start 2xl:text-[3rem] text-[2.5rem] font-[400]  row-start-1  pb-8">Đăng ký</h3>
                                <EmailInput
                                error = {errorInput.Username}
                                name = "Username"
                                type = "Username"
                                value = {user.Username}
                                onChange = {handleChange}
                                placeholder=""
                                inputclassName= "w-full row-start-2 max-h-[60px] flex justify-end"
                                />
                               
                                <EmailInput
                                error = {errorInput.email}
                                name = "email"
                                type = "email"
                                value = {user.email}
                                onChange = {handleChange}
                                placeholder=""
                                inputclassName= "w-full  row-start-3 max-h-[60px] flex justify-end"
                                />
                                
                                <PasswordInput
                                   error = {errorInput.Password}
                                   name = "Password"
                                   value ={user.Password}
                                   onChange = {handleChange}     
                                   placeholder=""
                                   inputclassName="w-full  row-start-4 max-h-[60px] flex justify-end"
                                   />
                               
                                <PasswordInput
                                   error = {errorInput.Password2}
                                   name = "Password2"
                                   value ={user.Password2}
                                   onChange = {handleChange}     
                                   placeholder=""
                                   inputclassName="w-full  row-start-5 max-h-[60px] flex justify-end"
                                   />
                                <button className = "px-4 w-full  text-[1.2rem] bg-[#4461F2] text-white font-bold rounded-md hover:bg-blue-700 shadow-lg shadow-slate-300  row-start-6" onClick ={(e)=>haldSubmit(e)}>
                                Đăng ký 
                                </button>
                                <button className = "text-start mt-4 italic  row-start-7 2xl:text-2xl lg:text-xl ">Đã có tài khoản, đang nhập tại <a className = "text-sky-700 ">đây!</a></button>
                        </form>
                        <div className = "flex flex-col justify-between h-1/6 mb-4">
                       </div>
     </Layout>

    </>
    );
 }
 export default Register;