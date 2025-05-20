import { useState } from "react";
export const PasswordInput = ({error,name,value,onChange,placeholder,inputclassName}) =>
    {
        const [showPassword,setShowPassword] = useState(false);
        const hasError = !!error
        return (
            <>
            <div className = {`relative z-0 ${inputclassName}`}>
            <input
             name = {name}
             type = {showPassword?'text' : 'password'}
             value = {value}
             onChange = {onChange}     
             placeholder = {placeholder}
             className = "rounded-lg  w-full  2xl:p-4 p-2 text-lg   bg-sky-100  focus:ring-sky-200  "
             />
                      <div className = "absolute z-10 left-2  lg:top-14 top-8 w-46">
            {hasError && (
                <p className = " text-sm text-red-700 mt-2">{error}</p>
            )}
             </div>
             <ion-icon
               name={showPassword?'eye-outline':'eye-off-outline'}
               class="absolute  top-1/2 -translate-y-1/2 text-gray-400 text-xl  pr-6" onClick = {()=>setShowPassword(!showPassword)} ></ion-icon>    
            </div>
        </>
        );
    }
    export default PasswordInput;