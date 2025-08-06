/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "antd";

const MyButton = ({ children }: { children: any }) => {
  return (
    <div>
      <Button>{children}</Button>
    </div>
  );
};

export default MyButton;
