import { useState } from "react";
export const PasswordInput = ({name,value,onChange,placeholder,inputclassName}) =>
    {
        const [showPassword,setShowPassword] = useState(false);
        return (
            <div className = {`relative ${inputclassName}`}>
            <input
             name = {name}
             type = {showPassword?'text' : 'password'}
             value = {value}
             onChange = {onChange}     
             placeholder = {placeholder}
             className = "rounded-lg ring-2 w-full ring-sky-50 2xl:p-6 p-2   bg-sky-100 focus:ring-4 focus:ring-sky-200  "
             />
             <ion-icon
               name={showPassword?'eye-outline':'eye-off-outline'}
               class="absolute  top-1/2 -translate-y-1/2 text-gray-400 text-xl  pr-6" onClick = {()=>setShowPassword(!showPassword)} ></ion-icon>
            </div>
        );
    }
    export default PasswordInput;