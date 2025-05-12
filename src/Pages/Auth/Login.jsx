import {Link} from 'react-router-dom'
import {useState, useEffect} from 'react' 
import axios from 'axios'   
import {showToast} from '../../Component/Login/Showtoast'  
import {Layout} from './Layout'
import { useDispatch, useSelector } from "react-redux";
import {EmailInput} from '../../Component/Login/EmailInput'  
import {PasswordInput} from '../../Component/Login/PasswordInput'
import {login,sUser} from '../../feature/loginSlice'  
import {WindowModal} from '../../Component/Login/WindowModal'
export const Login =() => {
   const [user,setUser] = useState({
        email : '',
        password : ''
   });
   // const onLogin = async (e) => {
   //      e.preventDefault();
   //      try {
   //          const res = await axios.post('https://fe253d2d-1309-43a4-8ee6-250f4a9781f0.mock.pstmn.io/Login',user)
   //          const data = await res.data;
   //          localStorage.setItem("token", data.acess);
   //          localStorage.setItem("user", JSON.stringify(data.user));
   //          showToast("Đăng nhập thành công", "success");

   //      } catch (error) {
   //          console.error(error);
   //      }
   // }
   const [isSucess,setIsSuccess] = useState(false);
   const dispatch = useDispatch();
   const {error,isLoading} = useSelector((state)=>state.login)
   const [message,setMessage] = useState("")
   const [title,setTitle] = useState("")
   const onClose = () => {
      setIsSuccess(false)
   }
    
   const onLogin = (e) =>
   {
      e.preventDefault();
      dispatch(login(user))
      setIsSuccess(true)

   }
   useEffect(() => {
      if (isLoading) {
        setMessage('Loading...');
        setTitle('Đang đăng nhập');
      } else if (!isLoading && !error) {
        setMessage('Đăng nhập thành công!');
        setTitle('Chào mừng bạn!');
        dispatch(sUser(user));  // Cập nhật người dùng vào Redux state khi login thành công
        setIsSuccess(true);  // Hiển thị modal khi login thành công
      } else if (error) {
        setMessage('Đăng nhập thất bại. Vui lòng thử lại.');
        setTitle('Lỗi');
        setIsSuccess(true);  // Hiển thị modal khi có lỗi
      }
    }, [isLoading, error, user, dispatch]);
  
   return (
   <>
   <Layout isSucess ={isSucess} message={message} onClose={onClose} title ={title} >
   <img src ="./images/login.png" alt ="Not found" className = " object-contain w-3/4 h-3/4"/>
   <form className = "flex flex-col justify-center h-4/6  mt-12">
                        <h3 className = " text-center 2xl:text-[3rem] text-[1.5em] font-[400]">Đăng nhập</h3> 
                       <EmailInput 
                         name = "email"
                         type = "email"
                         value = {user.email}
                         onChange = {(e)=>setUser({...user,[e.target.name]:e.target.value})}   
                         placeholder="Tên tài khoản/Email"  
                         inputclassName= " w-full h-[3.8rem] flex justify-end 2xl:mt-10 mt-5 "
                         />
                        <PasswordInput
                        name = "password"
                        value ={user.password}
                        onChange = {(e)=>setUser({...user,[e.target.name]:e.target.value})}     
                        placeholder="Mật khẩu"
                        inputclassName="w-full h-[3.8rem] flex justify-end 2xl:mt-10 mt-5"
                        />
                        <button className = "text-end 2xl:text-[23px] md:text-sm text-xs mt-4 italic 2xl:mt-8 ">quên mật khẩu?</button>
                        <button onClick={(e)=>onLogin(e)} className = "2xl:p-4 p-2 mt-4 text-[1.2rem] 2xl:mt-8 bg-[#4461F2] text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-slate-300">
                        Đăng nhập  
                        </button>
                        <button  className = "text-end 2xl:text-[23px] md:text-sm text-xs  italic font-[400] 2xl:mt-6 md:mt-4 mt-2">bạn chưa có tài khoản, đang ký tại <a className = "text-sky-700">đây!</a></button>
                </form>
                <div className = "flex flex-col justify-between h-1/6 mb-12  ">
                     <div className = "flex justify-between items-center">
                        <div className = "h-0.5 w-56 bg-gray-200 "></div>
                        <h3 className = "mx- text-gray-500 2xl:text-[14px] font-[500] md:text-sm text-xs text-justify ">hoặc tiếp tục ở đây</h3>
                        <div className = "h-0.5 w-56 bg-gray-200 "></div>
                     </div>
                     <div className = "flex justify-center">  
                        <button className = "2xl:mx-4  2xl:py-4 2xl:px-12 mx-2 py-2 px-6 rounded-lg ring-1 ring-slate-300 hover:shadow-slate-400 hover:shadow-lg hover:bg-white hover:ring-slate-50">
                        <img src="./images/Fa.png" alt="" className =" w-6 h-6 object-contain" />
                        </button>
                        <button className = "2xl:mx-4  2xl:py-4 2xl:px-12 mx-2 py-2 px-6 rounded-lg ring-1 ring-slate-300 hover:shadow-slate-400 hover:shadow-lg hover:bg-white hover:ring-slate-50">
                        <img src="./images/Apple.png" alt="" className =" w-6 h-6 object-contain mb-1" />
                        </button>
                        <button className = "2xl:mx-4  2xl:py-4 2xl:px-12 mx-2 py-2 px-6 rounded-lg ring-1 ring-slate-300 hover:shadow-slate-400 hover:shadow-lg hover:bg-white hover:ring-slate-50">
                          <img src="./images/Go2.png" alt="" className =" w-8 h-8 object-contain" />
                        </button>  
                     </div>
                </div>
     </Layout>
   </>
   );
}
export default Login;