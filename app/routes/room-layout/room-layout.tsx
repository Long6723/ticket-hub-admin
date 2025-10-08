import { ConfigProvider, Form, notification } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState, type FC } from "react";
import { FaPlus, FaReddit, FaTrash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import {
  createRoomLayoutApi,
  updateRoomLayoutApi,
} from "~/api/room-layout.api";

import Seo from "~/components/seo/seo";
import MyButton from "~/components/ui/button";
import MyInput from "~/components/ui/input";
import MyModal from "~/components/ui/modal";
import MySelect from "~/components/ui/select";
import MyTable from "~/components/ui/table";
import { useAppDispatch } from "~/store";
import {
  deleteRoomLayout,
  getRoomLayout,
} from "~/store/room-layout/room-layout.action";

interface RoomLayout {
  _id: string;
  name: string;
  totalSeat: number;
  regularSeat: number;
  vipSeat: number;
  coupleSeat: number;
  seatLayout: string;
}

const ROOM_LAYOUT_TEMPLATES = [
  {
    key: "Room 1",
    name: "Room 1",
    totalSeat: 152,
    regularSeat: 56,
    vipSeat: 84,
    coupleSeat: 12,
    seatLayout: [
      { row: "A", numberSeat: 14, type: "regularSeat" },
      { row: "B", numberSeat: 14, type: "regularSeat" },
      { row: "C", numberSeat: 14, type: "regularSeat" },
      { row: "D", numberSeat: 14, type: "vipSeat" },
      { row: "E", numberSeat: 14, type: "vipSeat" },
      { row: "F", numberSeat: 14, type: "vipSeat" },
      { row: "G", numberSeat: 14, type: "vipSeat" },
      { row: "H", numberSeat: 14, type: "vipSeat" },
      { row: "I", numberSeat: 14, type: "vipSeat" },
      { row: "J", numberSeat: 14, type: "regularSeat" },
      { row: "K", numberSeat: 12, type: "coupleSeat" },
    ],
  },
  {
    key: "Room 2",
    name: "Room 2",
    totalSeat: 124,
    regularSeat: 42,
    vipSeat: 70,
    coupleSeat: 12,
    seatLayout: [
      { row: "A", numberSeat: 14, type: "regularSeat" },
      { row: "B", numberSeat: 14, type: "regularSeat" },
      { row: "C", numberSeat: 14, type: "regularSeat" },
      { row: "D", numberSeat: 14, type: "vipSeat" },
      { row: "E", numberSeat: 14, type: "vipSeat" },
      { row: "F", numberSeat: 14, type: "vipSeat" },
      { row: "G", numberSeat: 14, type: "vipSeat" },
      { row: "H", numberSeat: 14, type: "vipSeat" },
      { row: "I", numberSeat: 12, type: "coupleSeat" },
    ],
  },
  {
    key: "Room 3",
    name: "Room 3",
    totalSeat: 108,
    regularSeat: 40,
    vipSeat: 60,
    coupleSeat: 8,
    seatLayout: [
      { row: "A", numberSeat: 10, type: "regularSeat" },
      { row: "B", numberSeat: 10, type: "regularSeat" },
      { row: "C", numberSeat: 10, type: "regularSeat" },
      { row: "D", numberSeat: 10, type: "vipSeat" },
      { row: "E", numberSeat: 10, type: "vipSeat" },
      { row: "F", numberSeat: 10, type: "vipSeat" },
      { row: "G", numberSeat: 10, type: "vipSeat" },
      { row: "H", numberSeat: 10, type: "vipSeat" },
      { row: "I", numberSeat: 10, type: "vipSeat" },
      { row: "J", numberSeat: 10, type: "regularSeat" },
      { row: "K", numberSeat: 8, type: "coupleSeat" },
    ],
  },
  {
    key: "Room 4",
    name: "Room 4",
    totalSeat: 98,
    regularSeat: 33,
    vipSeat: 55,
    coupleSeat: 10,
    seatLayout: [
      { row: "A", numberSeat: 11, type: "regularSeat" },
      { row: "B", numberSeat: 11, type: "regularSeat" },
      { row: "C", numberSeat: 11, type: "regularSeat" },
      { row: "D", numberSeat: 11, type: "vipSeat" },
      { row: "E", numberSeat: 11, type: "vipSeat" },
      { row: "F", numberSeat: 11, type: "vipSeat" },
      { row: "G", numberSeat: 11, type: "vipSeat" },
      { row: "H", numberSeat: 11, type: "vipSeat" },
      { row: "K", numberSeat: 10, type: "coupleSeat" },
    ],
  },
  {
    key: "Room 5",
    name: "Room 5",
    totalSeat: 198,
    regularSeat: 72,
    vipSeat: 110,
    coupleSeat: 16,
    seatLayout: [
      { row: "A", numberSeat: 18, type: "regularSeat" },
      { row: "B", numberSeat: 18, type: "regularSeat" },
      { row: "C", numberSeat: 18, type: "regularSeat" },
      { row: "D", numberSeat: 18, type: "vipSeat" },
      { row: "E", numberSeat: 18, type: "vipSeat" },
      { row: "F", numberSeat: 18, type: "vipSeat" },
      { row: "G", numberSeat: 18, type: "vipSeat" },
      { row: "H", numberSeat: 18, type: "vipSeat" },
      { row: "I", numberSeat: 18, type: "vipSeat" },
      { row: "J", numberSeat: 18, type: "vipSeat" },
      { row: "K", numberSeat: 18, type: "regularSeat" },
      { row: "L", numberSeat: 16, type: "coupleSeat" },
    ],
  },
];

const RoomLayoutPage: FC = () => {
  const dispatch = useAppDispatch();
  const { listRoomLayout, loading: roomLayoutLoading } = useSelector(
    (state: any) => state.roomLayout,
  );
  const [roomLayoutDetail, setRoomLayoutDetail] = useState<RoomLayout | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [formLoading, setFormLoading] = useState(false);
  const [form] = Form.useForm();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getRoomLayout());
  }, [dispatch]);

  const handleRoomLayoutSubmit = async (formData: any) => {
    setFormLoading(true);
    // delete formData.totalSeat;
    // delete formData.regularSeat;
    // delete formData.vipSeat;
    // delete formData.coupleSeat;
    try {
      if (roomLayoutDetail) {
        await updateRoomLayoutApi({
          id: roomLayoutDetail._id,
          body: formData,
        });
        api.success({
          message: "Thành công",
          description: "Cập nhật loại phòng chiếu thành công!",
        });
      } else {
        await createRoomLayoutApi(formData);
        api.success({
          message: "Thành công",
          description: "Tạo loại phòng chiếu mới thành công!",
        });
      }
      dispatch(getRoomLayout());
      setShowModal(false);
      setRoomLayoutDetail(null);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting roomLayout:", error);
      api.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra! Vui lòng thử lại.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddRoomLayout = () => {
    setRoomLayoutDetail(null);
    form.resetFields();
    setShowModal(true);
  };

  const handleEdit = (roomLayout: RoomLayout) => {
    setRoomLayoutDetail(roomLayout);
    form.setFieldsValue({
      name: roomLayout.name,
      seatLayout: roomLayout.seatLayout,
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
      await dispatch(deleteRoomLayout(deleteId));
      api.success({
        message: "Thành công",
        description: "Xóa thể loại thành công!",
      });
      dispatch(getRoomLayout());
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

  const columns: ColumnsType<RoomLayout> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Total Seat", dataIndex: "totalSeat" },
    { title: "Regular", dataIndex: "regularSeat" },
    { title: "VIP", dataIndex: "vipSeat" },
    { title: "Couple", dataIndex: "coupleSeat" },
    {
      title: "Actions",
      fixed: "right",
      width: 200,
      render: (_: any, record: RoomLayout) => (
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
      <Seo title="Quản lý loại phòng chiếu" />
      {contextHolder}
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
          <div className="text-4xl">Quản lý loại phòng chiếu</div>
          <MyButton
            className="!ml-auto !px-[40px] !py-[20px] !text-[16px] !rounded-lg !border !border-green-600 !bg-green-600 !text-white hover:!bg-green-700"
            onClick={handleAddRoomLayout}
          >
            <FaPlus /> Thêm loại phòng chiếu mới
          </MyButton>
        </div>

        <div className="mt-6 bg-white shadow-md rounded-xl p-6">
          <MyTable
            columns={columns}
            dataSource={listRoomLayout || []}
            rowKey="_id"
            loading={roomLayoutLoading}
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
          confirmLoading={formLoading}
        >
          <Form form={form} layout="vertical" onFinish={handleRoomLayoutSubmit}>
            <Form.Item
              name="name"
              label="Tên loại phòng"
              rules={[{ required: true, message: "Nhập tên loại phòng" }]}
            >
              <MyInput />
            </Form.Item>
            <Form.Item name="totalSeat" noStyle>
              <MyInput type="hidden" />
            </Form.Item>
            <Form.Item name="regularSeat" noStyle>
              <MyInput type="hidden" />
            </Form.Item>
            <Form.Item name="vipSeat" noStyle>
              <MyInput type="hidden" />
            </Form.Item>
            <Form.Item name="coupleSeat" noStyle>
              <MyInput type="hidden" />
            </Form.Item>
            <Form.Item name="seatLayout" label="Chọn mẫu phòng">
              <MySelect
                options={ROOM_LAYOUT_TEMPLATES.map((tpl) => ({
                  label: tpl.name,
                  value: tpl.key,
                }))}
                onChange={(key) => {
                  const tpl = ROOM_LAYOUT_TEMPLATES.find((t) => t.key === key);
                  if (tpl) {
                    form.setFieldsValue({
                      name: tpl.name,
                      seatLayout: JSON.stringify(tpl.seatLayout),
                      totalSeat: tpl.totalSeat,
                      regularSeat: tpl.regularSeat,
                      vipSeat: tpl.vipSeat,
                      coupleSeat: tpl.coupleSeat,
                    });
                  }
                }}
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

export default RoomLayoutPage;
