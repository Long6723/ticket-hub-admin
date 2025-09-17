import type { FC } from "react";
import { getProfileApi } from "~/api/profile";
import MyButton from "~/components/ui/button";

const ProfilePage: FC = () => {
  return (
    <div>
      <MyButton onClick={getProfileApi}>click</MyButton>
    </div>
  );
};

export default ProfilePage;
