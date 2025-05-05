export const EmailInput = ({name,value,type,onChange,placeholder,inputclassName}) =>
{
    return (
        <div className = {`relative ${inputclassName}`}>
        <input
         name = {name}
         type = {type}
         value = {value}
         onChange = {onChange}     
         placeholder = {placeholder}
         className = "rounded-lg ring-2 w-full ring-sky-50 2xl:p-6 p-2   bg-sky-100 focus:ring-4 focus:ring-sky-200  "
         />
         <ion-icon
           name="close-circle-outline"
           class="absolute  top-1/2 -translate-y-1/2 text-gray-400 text-xl  pr-6" onClick = {()=>onChange({target:{name,value:''}})} ></ion-icon>
        </div>
    );
}
export default EmailInput;