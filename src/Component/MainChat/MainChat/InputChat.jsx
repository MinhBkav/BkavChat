export const InputChat = () => {
      return (
            <>
                  <div className="fixed  flex-grow-0 h-[56px] bottom-0 flex flex-col justify-center items-center">
                        <div className="relative w-full flex justify-end">
                              <div className="flex justify-center items-center">
                                    <ion-icon name="add-circle-outline" className="w-[1.8rem] h-[1.8rem] "></ion-icon>
                              </div>
                              <input
                                    placeholder="Tìm kiếm"
                                    className="rounded-full  w-[94.3%] py-[0.4rem] text-lg ring-1 ring-slate-300  focus:ring-sky-200  "
                              />
                              <ion-icon
                                    name="search-outline"
                                    class="absolute  top-1/2 -translate-y-1/2 text-gray-400 text-xl right-0 " ></ion-icon>
                              <div className="">
                                    <ion-icon name="send-outline" className="w-6 h-6 bg-slate-700 p-2 rounded-full"></ion-icon>
                              </div>
                        </div>

                  </div>
                  <div className="w-full h-[56px]"></div>
            </>
      )
}
export default InputChat;