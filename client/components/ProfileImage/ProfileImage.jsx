import { useState, View, Image } from "react";
import { getUserInfo } from "../../api/DataHelper";

/**
 * Renders a specific user's profile picture.
 * 
 * @prop {Number} userID - The userID of the user whose profile picture to render
 */
export default function ProfileImage({ userID }) {
  const [userIcon, setUserIcon] = useState("https://api.dicebear.com/5.x/adventurer/svg?seed=0&backgroundColor=000000&radius=20");
  const [croppingStyle, setCroppingStyle] = useState({})

  getUserInfo(userID)
    .then((res) => {
      const { profile_picture, profile_picture_top, profile_picture_left, pfp_seed, pfp_background_color } = res.data;

      // if the profile picture exists, use it instead of the pfp
      if (profile_picture) {
        setUserIcon(`data:image/png;base64, ${profile_picture}`)
        setCroppingStyle({
          top: profile_picture_top,
          left: profile_picture_left
        })
      } else {
        setUserIcon(`https://api.dicebear.com/5.x/adventurer/svg?seed=${pfp_seed}&backgroundColor=${pfp_background_color}&radius=20`)
      }
    })
  
    return (
      <View style={{ width: 75, height: 75, overflow: 'hidden' }}>
        <Image alt={"User profile picture"} source={{uri: userIcon}} style={croppingStyle} />
      </View>
    )
}