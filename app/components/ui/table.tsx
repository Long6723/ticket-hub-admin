import { Table, type TableProps } from "antd";
import type { FC } from "react";

const BaseTable: FC<TableProps> = (props) => {
  return <Table {...props} />;
};

const MyTable = Object.assign(Table, BaseTable);

export default MyTable;
