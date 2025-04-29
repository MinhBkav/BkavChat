export const BkavIcon =() =>{
    return (
        <>
        <div className = "hidden md:flex md:flex-col md:justify-center md:m-[1rem] md:w-[40%]  ">
                 <div className = "flex h-1/4">
                         <div className = "flex items-center justify-center w-1/4">
                                 <img src = "./images/IconB.png" alt = "logo" className = "object-cover"/>
                         </div>
                         <div className = "flex items-center text-center">
                                 <h1 className = "  text-orange-500 text-[2rem] font-bold">Bkav Chat</h1>
                         </div>
                 </div>
                 <div className = "p-10 mt-[2rem] w-full h-3/4">
                         <img src ="./images/Register.png" alt ="Not found" className = " object-contain w-3/4 h-3/4"/>
                 </div>
         </div>
        </>
    );
}
export default BkavIcon;