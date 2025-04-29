import {toast} from 'react-toastify';
export const showToast = (message, type = "error") => {
    toast[type](message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      className : "bg-sky-500 text-slate-900 font-bold text-[0.5em] shadow-lg shadow-slate-300",
      progressClassName : "bg-sky-500",
    });
  };
  export default showToast;