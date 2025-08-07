import type { FC } from "react";

import { Modal, type ModalProps } from "antd";

const BaseModal: FC<ModalProps> = (props) => {
  return <Modal {...props} />;
};

const MyModal = Object.assign(Modal, BaseModal);

export default MyModal;
