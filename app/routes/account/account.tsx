import { type FC, useEffect, useState } from "react";
import {
  ConfigProvider,
  Form,
  notification,
  type TablePaginationConfig,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FaPlus, FaReddit } from "react-icons/fa6";

import MyButton from "~/components/ui/button";
import MyModal from "~/components/ui/modal";
import MyTable from "~/components/ui/table";
import MySelect from "~/components/ui/select";
import { useSelector } from "react-redux";
import { getUsers } from "~/store/users/users.action";
import { useAppDispatch } from "~/store";
import { createUserApi, updateUserApi } from "~/api/users.api";
import MyInput from "~/components/input/input";
import Seo from "~/components/seo/seo";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status: "ACTIVE" | "INACTIVE";
  user_id?: string;
}

const Account: FC = () => {
  const dispatch = useAppDispatch();
  const { listUsers, loading: usersLoading } = useSelector(
    (state: any) => state.users,
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<string>("createdAt");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [showUserModal, setShowModal] = useState(false);
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(
      getUsers({
        current: 1,
        pageSize: pagination.pageSize,
        sortField: sortField,
      }),
    );
  }, [pagination.pageSize, dispatch, sortField]);

  useEffect(() => {
    if (!listUsers) return;
    const nextTotal = Number(listUsers?.totalItems || 0);
    setPagination((prev) => ({
      ...prev,
      total: nextTotal,
      current: Number(listUsers?.current || 1),
      pageSize: Number(listUsers?.pageSize || prev.pageSize),
    }));
  }, [listUsers]);

  const handleUserSubmit = async (formData: any) => {
    setFormLoading(true);
    try {
      if (userDetail) {
        delete formData.password;
        delete formData.email;
        await updateUserApi({
          id: userDetail._id,
          body: formData,
        });
        api.success({
          message: "Thành công",
          description: "Cập nhật người dùng thành công!",
        });
      } else {
        await createUserApi(formData);
        api.success({
          message: "Thành công",
          description: "Tạo người dùng mới thành công!",
        });
      }

      dispatch(
        getUsers({
          current: 1,
          pageSize: pagination.pageSize,
          search: search.trim() || undefined,
          sortField: sortField,
        }),
      );

      setShowModal(false);
      setUserDetail(null);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting user:", error);
      api.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra! Vui lòng thử lại.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleSearch = () => {
    const keyword = search.trim();
    setPagination((prev) => ({ ...prev, current: 1 }));
    dispatch(
      getUsers({
        current: 1,
        pageSize: pagination.pageSize,
        search: keyword || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sortField: sortField,
      }),
    );
  };

  const handleTableChange = (paginationInfo: TablePaginationConfig) => {
    const { current, pageSize } = paginationInfo;
    const newPageSize = pageSize;
    const newCurrent = pagination.pageSize !== pageSize ? 1 : current;

    setPagination((prev) => ({
      ...prev,
      current: newCurrent || prev.current,
      pageSize: newPageSize || prev.pageSize,
    }));

    dispatch(
      getUsers({
        current: newCurrent || 1,
        pageSize: newPageSize || pagination.pageSize,
        search: search.trim() || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sortField: sortField,
      }),
    );
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(
        getUsers({
          current: 1,
          pageSize: pagination.pageSize,
          search: search.trim() || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          sortField: sortField,
        }),
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [statusFilter, dispatch, sortField]);

  const handleEditUser = (user: User) => {
    setUserDetail(user);
    form.setFieldsValue({
      ...user,
      status: user.status,
    });
    setShowModal(true);
  };

  const handleAddUser = () => {
    setUserDetail(null);
    form.resetFields();
    form.setFieldsValue({ role: "CLIENT", status: "ACTIVE" });
    setShowModal(true);
  };

  const sortFieldOptions = [
    { label: "createdAt", value: "createdAt" },
    { label: "updatedAt", value: "updatedAt" },
  ];

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_: any, record: any, index: number) => {
        const current = listUsers?.current || pagination.current;
        const pageSize = listUsers?.pageSize || pagination.pageSize;
        return (current - 1) * pageSize + index + 1;
      },
      width: 80,
      align: "center" as const,
    },
    { title: "Tên người dùng", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "SDT", dataIndex: "phone", key: "phone" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      key: "action",
      fixed: "right" as const,
      width: 150,
      render: (_: any, record: User) => (
        <div className="flex gap-2">
          <MyButton
            className="!px-3 !py-2 !text-sm !rounded-md !border !border-blue-500 !text-blue-600 hover:!bg-blue-50"
            onClick={() => handleEditUser(record)}
          >
            <FaReddit /> Sửa
          </MyButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <Seo title="Quản lý người dùng" />
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1677ff",
          },
          components: {
            Pagination: {
              colorPrimary: "#1677ff",
              colorPrimaryHover: "#4096ff",
            },
          },
        }}
      >
        {contextHolder}
        <div className="flex items-center mb-6">
          <div className="text-4xl">Quản lý người dùng</div>
          <MyButton
            className="!ml-auto !px-[40px] !py-[20px] !text-[16px] !rounded-lg !border !border-green-600 !bg-green-600 !text-white hover:!bg-green-700"
            onClick={handleAddUser}
          >
            <FaPlus /> Thêm người dùng mới
          </MyButton>
        </div>

        <div className="flex flex-wrap gap-4 bg-white shadow-md rounded-xl py-4 px-6 items-center  w-full">
          <MyInput
            className="!w-[500px] !p-2 !pl-6 !text-[16px] !rounded-lg !border !border-gray-300 "
            placeholder="Tìm kiếm người dùng"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <MyButton
            className="!py-[20px] !px-[14px] !rounded-lg !border !border-gray-400 
               !bg-gray-200 hover:!bg-gray-300 !text-gray-700"
            onClick={handleSearch}
          >
            <SearchOutlined className="text-xl" />
          </MyButton>

          <MySelect
            className="!w-[200px]"
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={[
              { label: "All", value: "all" },
              { label: "ACTIVE", value: "ACTIVE" },
              { label: "INACTIVE", value: "INACTIVE" },
            ]}
          />

          <MySelect
            className="!w-[200px]"
            value={sortField}
            onChange={(val) => setSortField(val)}
            options={sortFieldOptions}
            placeholder="Sắp xếp theo"
          />

          <MyButton
            className="!py-[20px] !px-[14px] !rounded-lg !border !border-gray-400 
               !bg-gray-100 hover:!bg-gray-200 !text-gray-700"
            onClick={() => {
              setStatusFilter("all");
              setSortField("createdAt");
              setSearch("");
              setPagination((prev) => ({ ...prev, current: 1 }));
              dispatch(
                getUsers({
                  current: 1,
                  pageSize: pagination.pageSize,
                  sortField: "createdAt",
                }),
              );
            }}
          >
            Xóa bộ lọc
          </MyButton>
        </div>

        <div className="mt-6 bg-white shadow-md rounded-xl p-6">
          <MyTable
            columns={columns}
            dataSource={listUsers?.results || []}
            rowKey="_id"
            loading={usersLoading}
            pagination={{
              current: listUsers?.current || pagination.current,
              pageSize: listUsers?.pageSize || pagination.pageSize,
              total: listUsers?.totalItems || pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} người dùng`,
              pageSizeOptions: ["10", "20", "50"],
            }}
            onChange={handleTableChange}
          />
        </div>

        <MyModal
          title={userDetail ? "Cập nhật người dùng" : "Thêm người dùng mới"}
          open={showUserModal}
          onCancel={() => {
            setShowModal(false);
            setUserDetail(null);
            form.resetFields();
          }}
          onOk={() => form.submit()}
          confirmLoading={formLoading}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUserSubmit}
            initialValues={{ role: "CLIENT", status: "ACTIVE" }}
          >
            <Form.Item
              label="Tên người dùng"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <MyInput placeholder="Tên người dùng" />
            </Form.Item>

            {!userDetail && (
              <>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <MyInput placeholder="Email" />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                    { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();

                        const hasNumber = /\d/.test(value);
                        const hasUpper = /[A-Z]/.test(value);
                        const hasLower = /[a-z]/.test(value);
                        const hasSpecial = /[@$!%*?&#]/.test(value);

                        if (!hasNumber) {
                          return Promise.reject(
                            "Mật khẩu phải chứa ít nhất 1 số",
                          );
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
                  <MyInput type="password" placeholder="Mật khẩu" />
                </Form.Item>
              </>
            )}

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern:
                    /^(0|\+84)(3[2-9]|5[25689]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
            >
              <MyInput placeholder="Số điện thoại" />
            </Form.Item>

            <Form.Item label="Role" name="role">
              <MySelect
                options={[
                  { label: "ADMIN", value: "ADMIN" },
                  { label: "CLIENT", value: "CLIENT" },
                ]}
              />
            </Form.Item>

            <Form.Item label="Trạng thái" name="status">
              <MySelect
                options={[
                  { label: "ACTIVE", value: "ACTIVE" },
                  { label: "INACTIVE", value: "INACTIVE" },
                ]}
              />
            </Form.Item>
          </Form>
        </MyModal>
      </ConfigProvider>
    </>
  );
};

export default Account;
