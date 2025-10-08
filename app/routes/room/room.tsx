import { ConfigProvider, Form, notification } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState, type FC } from "react";
import { FaPlus, FaReddit, FaTrash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { createRoomApi, updateRoomApi } from "~/api/room.api";
import Seo from "~/components/seo/seo";
import MyButton from "~/components/ui/button";
import MyInput from "~/components/ui/input";
import MyModal from "~/components/ui/modal";
import MySelect from "~/components/ui/select";
import MyTable from "~/components/ui/table";
import { useAppDispatch } from "~/store";
import { getRoomLayout } from "~/store/room-layout/room-layout.action";
import { deleteRoom, getRooms } from "~/store/room/room.action";

interface RoomLayout {
  _id: string;
  name: string;
}
interface Room {
  _id: string;
  name: string;
  roomLayout: RoomLayout;
  format: string;
  status: "active" | "inactive";
}

const RoomPage: FC = () => {
  const dispatch = useAppDispatch();
  const { listRoom, loading: roomLoading } = useSelector(
    (state: any) => state.room,
  );
  const [roomDetail, setRoomDetail] = useState<Room | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [formLoading, setFormLoading] = useState(false);
  const [form] = Form.useForm();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { listRoomLayout } = useSelector((state: any) => state.roomLayout);

  useEffect(() => {
    dispatch(getRooms());
    dispatch(getRoomLayout());
  }, [dispatch]);

  const handleRoomSubmit = async (formData: any) => {
    setFormLoading(true);
    try {
      if (roomDetail) {
        await updateRoomApi({
          id: roomDetail._id,
          body: formData,
        });
        api.success({
          message: "Thành công",
          description: "Cập nhật phòng chiếu thành công!",
        });
      } else {
        await createRoomApi(formData);
        api.success({
          message: "Thành công",
          description: "Tạo phòng chiếu mới thành công!",
        });
      }
      dispatch(getRooms());
      setShowModal(false);
      setRoomDetail(null);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting room:", error);
      api.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra! Vui lòng thử lại.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddRoom = () => {
    setRoomDetail(null);
    form.resetFields();
    setShowModal(true);
  };

  const handleEdit = (room: Room) => {
    setRoomDetail(room);
    form.setFieldsValue({
      name: room.name,
      roomLayout: room.roomLayout._id,
      format: room.format,
      status: room.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteRoom(deleteId));
      api.success({
        message: "Thành công",
        description: "Xóa thể loại thành công!",
      });
      dispatch(getRooms());
    } catch (error) {
      api.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra! Vui lòng thử lại.",
      });
    } finally {
      setDeleteId(null);
      setShowDeleteModal(false);
    }
  };

  const columns: ColumnsType<Room> = [
    { title: "Tên phòng", dataIndex: "name" },
    {
      title: "Layout",
      dataIndex: "roomLayout",
      render: (roomLayout: any) => {
        return roomLayout?.name;
      },
    },

    { title: "Định dạng", dataIndex: "format" },
    { title: "Trạng thái", dataIndex: "status" },
    {
      title: "Hành động",
      fixed: "right",
      width: 200,
      render: (_: any, record: Room) => (
        <div className="flex gap-2">
          <MyButton
            className="!px-3 !py-2 !text-sm !rounded-md !border !border-blue-500 !text-blue-600 hover:!bg-blue-50"
            onClick={() => handleEdit(record)}
          >
            <FaReddit /> Sửa
          </MyButton>
          <MyButton
            className="!px-3 !py-2 !text-sm !rounded-md !border !border-red-500 !text-red-600 hover:!bg-red-50 "
            onClick={() => handleDelete(record._id)}
          >
            <FaTrash /> Xóa
          </MyButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <Seo title="Quản lý phòng chiếu" />
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
        <div className="flex items-center mb-6">
          <div className="text-4xl">Quản lý phòng chiếu phim</div>
          <MyButton
            className="!ml-auto !px-[40px] !py-[20px] !text-[16px] !rounded-lg !border !border-green-600 !bg-green-600 !text-white hover:!bg-green-700"
            onClick={handleAddRoom}
          >
            <FaPlus /> Thêm phòng chiếu mới
          </MyButton>
        </div>

        <div className="mt-6 bg-white shadow-md rounded-xl p-6">
          <MyTable
            columns={columns}
            dataSource={listRoom || []}
            rowKey="_id"
            loading={roomLoading}
            pagination={false}
          />
        </div>

        <MyModal
          open={showModal}
          onCancel={() => {
            setShowModal(false);
            form.resetFields();
          }}
          onOk={() => form.submit()}
        >
          <Form form={form} layout="vertical" onFinish={handleRoomSubmit}>
            <Form.Item
              name="name"
              label="Tên phòng"
              rules={[{ required: true, message: "Nhập tên phòng" }]}
            >
              <MyInput />
            </Form.Item>

            <Form.Item
              name="roomLayout"
              label="Loại phòng"
              rules={[{ required: true, message: "Chọn loại phòng" }]}
            >
              <MySelect
                options={listRoomLayout.map((roomLayout: any) => ({
                  label: roomLayout.name,
                  value: roomLayout._id,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="format"
              label="Định dạng"
              rules={[{ required: true, message: "Chọn định dạng" }]}
            >
              <MySelect
                options={[
                  { label: "2D", value: "2D" },
                  { label: "3D", value: "3D" },
                  { label: "IMAX", value: "IMAX" },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Chọn trạng thái" }]}
            >
              <MySelect
                options={[
                  { label: "active", value: "active" },
                  { label: "inactive", value: "inactive" },
                ]}
              />
            </Form.Item>
          </Form>
        </MyModal>
        <MyModal
          open={showDeleteModal}
          onCancel={() => {
            setDeleteId(null);
            setShowDeleteModal(false);
          }}
          onOk={confirmDelete}
          title="Xác nhận xóa"
        >
          <p>Bạn có chắc chắn muốn xóa thể loại này không?</p>
        </MyModal>
      </ConfigProvider>
    </>
  );
};

export default RoomPage;
