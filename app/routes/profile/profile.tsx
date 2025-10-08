import type { FC } from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Card, Spin, Alert, Row, Col, notification } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";

import MyInput from "~/components/input/input";
import MyButton from "~/components/ui/button";
import { updateUserApi } from "~/api/profile.api";
import { changePassword, getProfile } from "~/store/profile/profile.action";
import { profileAction } from "~/store/profile/profile.store";
import type { AppDispatch, RootState } from "~/store";
import Seo from "~/components/seo/seo";
import MyModal from "~/components/ui/modal";

interface ProfileData {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  role?: string;
  status?: string;
}

interface PasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    profile,
    loading,
    error,
    changePasswordSuccess,
    changePasswordLoading,
    changePasswordError,
  } = useSelector((state: RootState) => state.profile);

  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [passwordModal, setPasswordModal] = useState(false);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      form.setFieldsValue(profile);
    }
  }, [profile, form]);

  useEffect(() => {
    if (changePasswordSuccess) {
      setPasswordModal(false);
      passwordForm.resetFields();
      dispatch(profileAction.resetChangePasswordState());
    }
  }, [changePasswordSuccess, passwordForm, dispatch]);

  const handleUpdateProfile = async (values: ProfileData) => {
    try {
      const { email, role, status, ...updateData } = values;

      const updatedProfile = await updateUserApi(updateData);

      dispatch(profileAction.setProfile(updatedProfile));
      form.setFieldsValue(updatedProfile);

      api.success({
        message: "Thành công",
        description: "Cập nhật thông tin thành công",
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      api.error({
        message: "Lỗi",
        description: "Cập nhật thông tin thất bại",
      });
    }
  };

  const handleChangePassword = async (values: PasswordData) => {
    try {
      await dispatch(changePassword(values)).unwrap();
      api.success({
        message: "Thành công",
        description: "Đổi mật khẩu thành công",
      });
    } catch (err: any) {
      api.error({
        message: "Lỗi",
        description: err?.message || "Đổi mật khẩu thất bại",
      });
    }
  };

  const openPasswordModal = () => {
    setPasswordModal(true);
  };

  const closePasswordModal = () => {
    setPasswordModal(false);
    passwordForm.resetFields();
    dispatch(profileAction.resetChangePasswordState());
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  return (
    <>
      <Seo title="Thông tin tài khoản" />
      <div style={{ padding: "24px" }}>
        <Card
          title={
            <span style={{ fontSize: "24px", fontWeight: "bold" }}>
              Thông tin người dùng
            </span>
          }
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          {contextHolder}
          <Form
            form={form}
            layout="vertical"
            initialValues={profile || {}}
            onFinish={handleUpdateProfile}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tên"
                  name="name"
                  rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                >
                  <MyInput prefix={<UserOutlined />} placeholder="Tên" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Email" name="email">
                  <MyInput
                    prefix={<MailOutlined />}
                    placeholder="Email"
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Số điện thoại" name="phone">
                  <MyInput placeholder="Số điện thoại" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Địa chỉ" name="address">
                  <MyInput placeholder="Địa chỉ" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Vai trò" name="role">
                  <MyInput placeholder="Vai trò" disabled />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ textAlign: "end" }}>
              <MyButton
                onClick={openPasswordModal}
                style={{ marginRight: "8px" }}
              >
                Đổi mật khẩu
              </MyButton>
              <MyButton type="primary" htmlType="submit">
                Cập nhật thông tin
              </MyButton>
            </Form.Item>
          </Form>
        </Card>
        <MyModal
          title="Đổi mật khẩu"
          open={passwordModal}
          onCancel={closePasswordModal}
          footer={null}
          width={400}
        >
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleChangePassword}
          >
            <Form.Item
              label="Mật khẩu hiện tại"
              name="oldPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
              ]}
            >
              <MyInput type="password" placeholder="Mật khẩu hiện tại" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
                { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();

                    const hasNumber = /\d/.test(value);
                    const hasUpper = /[A-Z]/.test(value);
                    const hasLower = /[a-z]/.test(value);
                    const hasSpecial = /[@$!%*?&#]/.test(value);

                    if (!hasNumber) {
                      return Promise.reject("Mật khẩu phải chứa ít nhất 1 số");
                    }
                    if (!hasUpper) {
                      return Promise.reject(
                        "Mật khẩu phải chứa ít nhất 1 chữ hoa",
                      );
                    }
                    if (!hasLower) {
                      return Promise.reject(
                        "Mật khẩu phải chứa ít nhất 1 chữ thường",
                      );
                    }
                    if (!hasSpecial) {
                      return Promise.reject(
                        "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (@, $, !, %, *, ?, &, #)",
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <MyInput type="password" placeholder="Mật khẩu mới" />
            </Form.Item>

            <Form.Item style={{ textAlign: "end", marginBottom: 0 }}>
              <MyButton
                type="default"
                onClick={closePasswordModal}
                style={{ marginRight: "8px" }}
                disabled={changePasswordLoading}
              >
                Hủy
              </MyButton>
              <MyButton
                type="primary"
                htmlType="submit"
                loading={changePasswordLoading}
              >
                Đổi mật khẩu
              </MyButton>
            </Form.Item>
          </Form>
        </MyModal>
      </div>
    </>
  );
};

export default ProfilePage;
