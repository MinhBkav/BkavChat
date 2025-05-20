export const Search = () =>
{
    return (
       <>
       <div className = "fixed w-[360px] h-[60px] top-0 flex flex-col justify-center ">
       <div className = "relative flex  py-2">
        <button><ion-icon name="menu-outline" className = "w-8 h-8 mx-4"></ion-icon></button>
         <input
         placeholder="Tìm kiếm"
         className = "rounded-full  w-[78%]  text-lg ring-1 ring-slate-300 pl-12 py-[6px] focus:ring-sky-200  "
         />
        <ion-icon
           name="search-outline"
           class="absolute  top-1/2 -translate-y-1/2 text-gray-400 text-xl pl-20 " ></ion-icon>    
       </div>
       </div>
       <div className = "w-[360px] h-[60px]"></div>
        </>
    )
}
export default Search;