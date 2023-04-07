import React, {UseState} from 'react';

export default function UserPage () {
    const userIcon =
    "https://api.dicebear.com/5.x/adventurer/svg?seed=Gracie&scale=130&radius=20&backgroundType=solid,gradientLinear&randomizeIds=true&backgroundColor=c0aede,b6e3f4,d1d4f9,ffdfbf,ffd5dc";

    return(
        <div className="UserPage">
            <div >
                <img className = "userPage__ProfilePicture" src = {userIcon} height="75" />
            </div>
            <div>
                Profile Page
            </div>
        </div>
    )
}