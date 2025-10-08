import { ConfigProvider, Form, notification } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState, type FC } from "react";
import { FaPlus, FaReddit, FaTrash } from "react-icons/fa6";
import Seo from "~/components/seo/seo";
import MyButton from "~/components/ui/button";
import MyModal from "~/components/ui/modal";
import MyTable from "~/components/ui/table";
import { useAppDispatch } from "~/store";
import { useSelector } from "react-redux";
import { deleteGenre, getGenres } from "~/store/genre/genre.action";
import { createGenreApi, updateGenreApi } from "~/api/genre.api";
import MySelect from "~/components/ui/select";
import MyInput from "~/components/input/input";

interface Genre {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

const GenrePage: FC = () => {
  const dispatch = useAppDispatch();
  const { listGenre, loading: genreLoading } = useSelector(
    (state: any) => state.genre,
  );
  const [genreDetail, setGenreDetail] = useState<Genre | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [formLoading, setFormLoading] = useState(false);
  const [form] = Form.useForm();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  const handleGenreSubmit = async (formData: any) => {
    setFormLoading(true);

    if (formData.isActive === "true") formData.isActive = true;
    if (formData.isActive === "false") formData.isActive = false;

    try {
      if (genreDetail) {
        await updateGenreApi({
          id: genreDetail._id,
          body: formData,
        });
        api.success({
          message: "Thành công",
          description: "Cập nhật thể loại thành công!",
        });
      } else {
        await createGenreApi(formData);
        api.success({
          message: "Thành công",
          description: "Tạo thể loại mới thành công!",
        });
      }
      dispatch(getGenres());
      setShowModal(false);
      setGenreDetail(null);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting genre:", error);
      api.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra! Vui lòng thử lại.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddGenre = () => {
    setGenreDetail(null);
    form.resetFields();
    form.setFieldsValue({ isActive: "true" });
    setShowModal(true);
  };

  const handleEditGenre = (genre: Genre) => {
    setGenreDetail(genre);
    form.setFieldsValue({
      name: genre.name,
      description: genre.description,
      isActive: genre.isActive ? "true" : "false",
    });
    setShowModal(true);
  };

  const handleDeleteGenre = async (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteGenre(deleteId));
      api.success({
        message: "Thành công",
        description: "Xóa thể loại thành công!",
      });
      dispatch(getGenres());
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

  const columns: ColumnsType<Genre> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Trạng thái",
      render: (_: boolean, record: Genre) => (
        <div>{record.isActive ? "ACTIVE" : "INACTIVE"}</div>
      ),
    },
    {
      title: "Actions",
      fixed: "right",
      width: 200,
      render: (_: any, record: Genre) => (
        <div className="flex gap-2 w-[50px]">
          <MyButton
            className="!px-3 !py-2 !text-sm !rounded-md !border !border-blue-500 !text-blue-600 hover:!bg-blue-50"
            onClick={() => handleEditGenre(record)}
          >
            <FaReddit /> Sửa
          </MyButton>
          <MyButton
            className="!px-3 !py-2 !text-sm !rounded-md !border !border-red-500 !text-red-600 hover:!bg-red-50"
            onClick={() => handleDeleteGenre(record._id)}
          >
            <FaTrash /> Xóa
          </MyButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <Seo title="Quản lý genre" />
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
          <div className="text-4xl">Quản lý thể loại phim</div>
          <MyButton
            className="!ml-auto !px-[40px] !py-[20px] !text-[16px] !rounded-lg !border !border-green-600 !bg-green-600 !text-white hover:!bg-green-700"
            onClick={handleAddGenre}
          >
            <FaPlus /> Thêm thể loại mới
          </MyButton>
        </div>

        <div className="mt-6 bg-white shadow-md rounded-xl p-6">
          <MyTable
            columns={columns}
            dataSource={listGenre || []}
            rowKey="_id"
            loading={genreLoading}
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
          <Form form={form} layout="vertical" onFinish={handleGenreSubmit}>
            <Form.Item
              name="name"
              label="Tên thể loại"
              rules={[{ required: true, message: "Nhập tên thể loại" }]}
            >
              <MyInput />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Nhập mô tả" }]}
              // getValueFromEvent={(_, editor) => editor.getData()}
            >
              {/* <CKEditor editor={ClassicEditor as any} /> */}
              <MyInput />
            </Form.Item>

            <Form.Item
              name="isActive"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <MySelect className="w-full  p-2 rounded">
                <option value="true">ACTIVE</option>
                <option value="false">INACTIVE</option>
              </MySelect>
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

export default GenrePage;
