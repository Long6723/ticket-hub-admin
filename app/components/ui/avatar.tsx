import { Avatar, type AvatarProps } from "antd";
import type { FC } from "react";

const BaseAvatar: FC<AvatarProps> = (props) => {
  return <Avatar {...props} />;
};

const MyAvatar = Object.assign(Avatar, BaseAvatar);

export default MyAvatar;
