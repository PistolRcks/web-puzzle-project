import React, { useEffect, useState } from "react";
import { getUserInfo } from "../../api/DataHelper";

/**
 * Renders a specific user's profile picture.
 * 
 * @prop {Number} userID - The userID of the user whose profile picture to render
 */
export function ProfileImage({ userID }) {
  // TODO: Make sure the endpoint doesn't get spammed!
  const [userIcon, setUserIcon] = useState("https://api.dicebear.com/5.x/adventurer/svg?seed=0&backgroundColor=000000&radius=20");
  const [style, setStyle] = useState({})
  const [hasResponded, setHasResponded] = useState(false)

  if (!hasResponded) {
    getUserInfo(userID)
      .then((res) => {
        const { profile_picture, profile_picture_top, profile_picture_left, profile_picture_zoom, pfp_seed, pfp_background_color } = res.data;

        // Basic parameters applicable to both the generated pfp and the user-set one
        const basicStyle = {
          width: "64px",
          height: "64px",
          overflow: "hidden"
        }

        // if the profile picture exists, use it instead of the pfp
        if (profile_picture) {
          setUserIcon(`data:image/png;base64,${profile_picture}`)
          setStyle({
            ...basicStyle,
            backgroundImage: userIcon,
            backgroundSize: `${profile_picture_zoom}%`,
            backgroundPosition: `top -${profile_picture_top}px left -${profile_picture_left}px`,
          })
        } else {
          setUserIcon(`https://api.dicebear.com/5.x/adventurer/svg?seed=${pfp_seed}&backgroundColor=${pfp_background_color}&radius=20`)
          setStyle({
            ...basicStyle,
            backgroundImage: userIcon,
          })
        }
        // Issue may occur: getUserInfo may continue to throw errors that are not related to OOB userID accesses
        // In which case, we will continue to spam re-renders
        // In most cases, this won't happen, so I won't work around it
        setHasResponded(true)
      })
      .catch((err) => {
        // Always throws an error the first time
        console.error(err)
      })
    }
  
    return (
      <div style={style}></div>
    )
}