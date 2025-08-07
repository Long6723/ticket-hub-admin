import { List } from "antd";
import type { FC } from "react";

const BaseList: FC = (props) => {
  return <List {...props} />;
};

const MyList = Object.assign(List, BaseList);

export default MyList;
