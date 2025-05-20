export const EmailInput = ({error,name,value,type,onChange,placeholder,inputclassName}) =>
{
    const hasError = !!error
    return (
        <>
        <div className = {`relative z-0 ${inputclassName}`}>
        <input
         name = {name}
         type = {type}
         value = {value}
         onChange = {onChange}     
         placeholder = {placeholder}
         className = "rounded-lg  w-full  2xl:p-4 p-2  text-lg bg-sky-100  focus:ring-sky-200  "
         />
          <div className = "absolute z-10 left-2 lg:top-14 top-8 w-64">
            {hasError && (
                <p className = " text-sm text-red-700 mt-2">{error}</p>
            )}
        </div>
         <ion-icon
           name="close-circle-outline"
           class="absolute  top-1/2 -translate-y-1/2 text-gray-400 text-xl  pr-6" onClick = {()=>onChange({target:{name,value:''}})} ></ion-icon>
        </div>
                </>
      
    );
}
export default EmailInput;