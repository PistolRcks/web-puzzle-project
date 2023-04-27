import React, { useEffect, useState } from "react";
import { getUserInfo } from "../../api/DataHelper";

/**
 * Renders a specific user's profile picture.
 *
 * @prop {Number} userID - The userID of the user whose profile picture to render
 */
export function ProfileImage({ userID }) {
  // Basic parameters applicable to both the generated pfp and the user-set one
  const basicStyle = {
    width: "64px",
    height: "64px",
    borderRadius: "15%",
  };
  const [style, setStyle] = useState({
    ...basicStyle,
    objectFit: "contain",
    backgroundImage: "url(https://api.dicebear.com/5.x/adventurer/svg?seed=0&backgroundColor=000000)",
    backgroundPosition: "center",
  });
  const [hasResponded, setHasResponded] = useState(false);

  if (!hasResponded) {
    getUserInfo(userID)
      .then((res) => {
        const {
          profile_picture,
          profile_picture_top,
          profile_picture_left,
          profile_picture_zoom,
          pfp_seed,
          pfp_background_color,
        } = res.data;


        // if the profile picture exists, use it instead of the pfp
        if (profile_picture) {
          setStyle({
            ...basicStyle,
            overflow: "hidden",
            backgroundImage: `url(data:image/png;base64,${profile_picture})`,
            backgroundSize: `${profile_picture_zoom}%`,
            backgroundPosition: `top -${profile_picture_top}px left -${profile_picture_left}px`,
          });
        } else {
          setStyle({
            ...basicStyle,
            objectFit: "contain",
            backgroundImage: `url(https://api.dicebear.com/5.x/adventurer/svg?seed=${pfp_seed}&backgroundColor=${pfp_background_color})`,
            backgroundPosition: "center",
          });
        }
        setHasResponded(true);
      })
      .catch((err) => {
        // Don't do anything if the userID is out of bounds; should stop if not
        if (err !== "getUserInfo: Sent bad userID, passing...") {
          setHasResponded(false);
        }
        // Always throws an error the first time
        console.error(err);
      });
  }

  return <div data-testid="ProfileImage" style={style}></div>;
}
