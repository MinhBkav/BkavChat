import React from 'react';

export const LayoutIcon = ({ children, iconName }) => {
    const child = React.Children.toArray(children)[0]; // Lấy input

    return (
        <div className="relative w-full flex justify-end 2xl:mt-24 mt-5">
            {child} 
            <ion-icon
                name={iconName} // Sử dụng iconName truyền vào
                className ="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none pr-4"
            ></ion-icon>
        </div>
    );
};
export default LayoutIcon;
