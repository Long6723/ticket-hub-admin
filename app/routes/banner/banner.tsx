import { ConfigProvider, Form, notification, Upload } from "antd";
import { useContext, useEffect, useMemo, useState, type FC } from "react";
import { FaPlus, FaReddit, FaTrash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { createBannerApi, updateBannerApi } from "~/api/banner.api";
import { mediaUploadApi } from "~/api/media.api";
import Seo from "~/components/seo/seo";
import MyButton from "~/components/ui/button";
import { useAppDispatch } from "~/store";
import {
  deleteBanner,
  getBanners,
  reorderBanners,
} from "~/store/banner/banner.action";
import type { ColumnsType } from "antd/es/table";
import MyTable from "~/components/ui/table";
import MyModal from "~/components/ui/modal";
import MyInputNumber from "~/components/ui/input-number";
import MySelect from "~/components/ui/select";
import MyInput from "~/components/input/input";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { HolderOutlined } from "@ant-design/icons";

interface Banner {
  _id: string;
  title: string;
  description: string;
  imageId: string;
  linkUrl: string;
  status: "ACTIVE" | "INACTIVE";
  sortOrder?: number;
}

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}
const RowContext = React.createContext<RowContextProps>({});

const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <span
      ref={setActivatorNodeRef}
      {...listeners}
      style={{ cursor: "grab", display: "inline-flex", alignItems: "center" }}
    >
      <HolderOutlined />
    </span>
  );
};

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const Row: React.FC<RowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners],
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

const BannerPage: FC = () => {
  const dispatch = useAppDispatch();
  const { listBanners, loading: bannersLoading } = useSelector(
    (state: any) => state.banner,
  );
  const [bannerDetail, setBannerDetail] = useState<Banner | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  // const [pagination, setPagination] = useState({
  //   current: 1,
  //   pageSize: 10,
  //   total: 0,
  // });

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  // useEffect(() => {
  //   if (listBanners && listBanners.length > 0) {
  //     console.log("Danh sách banner hiện tại:", listBanners);
  //   }
  // }, [listBanners]);

  const getMaxSortOrder = () => {
    if (!listBanners || listBanners.length === 0) return 0;
    return Math.max(
      ...listBanners.map((banner: Banner) => banner.sortOrder || 0),
    );
  };

  const handleImageUpload = async (file: File) => {
    try {
      const response = await mediaUploadApi({ image: file });
      return response._id;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Lỗi khi tải lên hình ảnh");
    }
  };

  const handleBannerSubmit = async (formData: any) => {
    setFormLoading(true);
    try {
      let imageId = formData.imageId;

      if (imageFile) {
        imageId = await handleImageUpload(imageFile);
      }

      const bannerData = {
        ...formData,
        imageId,
        // sortOrder: bannerDetail
        //   ? formData.sortOrder
        //   : formData.sortOrder || getMaxSortOrder() + 1,
        sortOrder: bannerDetail ? formData.sortOrder : getMaxSortOrder() + 1,
      };

      if (bannerDetail) {
        await updateBannerApi({
          id: bannerDetail._id,
          body: bannerData,
        });
        api.success({
          message: "Thành công",
          description: "Cập nhật banner thành công!",
        });
      } else {
        await createBannerApi(bannerData);
        api.success({
          message: "Thành công",
          description: "Tạo banner mới thành công!",
        });
      }

      dispatch(getBanners());
      setShowModal(false);
      setBannerDetail(null);
      setImageFile(null);
      setImagePreview(null);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting banner:", error);
      api.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra! Vui lòng thử lại.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditBanner = (banner: Banner) => {
    setBannerDetail(banner);
    form.setFieldsValue({
      title: banner.title,
      description: banner.description,
      linkUrl: banner.linkUrl,
      status: banner.status,
      sortOrder: banner.sortOrder,
      imageId: banner.imageId,
    });
    setShowModal(true);
  };

  const handleDeleteBanner = async (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteBanner(deleteId));
      api.success({
        message: "Thành công",
        description: "Xóa banner thành công!",
      });
      dispatch(getBanners());
    } catch (error) {
      api.error({
        message: "Lỗi",
        description: "Có lỗi khi xóa banner!",
      });
    }
    setShowDeleteModal(false);
  };

  const handleAddBanner = () => {
    setBannerDetail(null);
    setImageFile(null);
    setImagePreview(null);
    form.resetFields();
    form.setFieldsValue({ status: "ACTIVE", sortOrder: 0 });
    setShowModal(true);
  };

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id && listBanners) {
      const activeIndex = listBanners.findIndex(
        (record: { _id: string }) => record._id === active?.id,
      );
      const overIndex = listBanners.findIndex(
        (record: { _id: string }) => record._id === over?.id,
      );

      const newBanners = arrayMove(listBanners, activeIndex, overIndex);

      try {
        const ids = newBanners.map((banner: any) => banner._id);
        await dispatch(reorderBanners(ids)).unwrap();

        api.success({
          message: "Thành công",
          description: "Sắp xếp banner thành công!",
        });

        dispatch(getBanners());
      } catch (error) {
        dispatch(getBanners());
        api.error({
          message: "Lỗi",
          description: "Có lỗi khi sắp xếp banner!",
        });
      }
    }
  };
  const columns: ColumnsType<Banner> = [
    {
      key: "sort",
      align: "center",
      width: 60,
      render: () => <DragHandle />,
    },
    {
      title: "STT",
      key: "stt",
      render: (_: any, __: Banner, index: number) => index + 1,
      // {
      //   const current = listBanners?.current || pagination.current;
      //   const pageSize = listBanners?.pageSize || pagination.pageSize;
      //   return (current - 1) * pageSize + index + 1;
      // },
      width: 80,
      align: "center",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },

    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 200,
      render: (_: any, record: Banner) => (
        <div className="flex gap-2 w-[30px]">
          <MyButton
            className="!px-3 !py-2 !text-sm !rounded-md !border !border-blue-500 !text-blue-600 hover:!bg-blue-50"
            onClick={() => handleEditBanner(record)}
          >
            <FaReddit /> Sửa
          </MyButton>
          <MyButton
            className="!px-3 !py-2 !text-sm !rounded-md !border !border-red-500 !text-red-600 hover:!bg-red-50"
            onClick={() => handleDeleteBanner(record._id)}
          >
            <FaTrash /> Xóa
          </MyButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <Seo title="Quản lý banner" />
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
          <div className="text-4xl">Quản lý banner phim</div>
          <MyButton
            className="!ml-auto !px-[40px] !py-[20px] !text-[16px] !rounded-lg !border !border-green-600 !bg-green-600 !text-white hover:!bg-green-700"
            onClick={handleAddBanner}
          >
            <FaPlus /> Thêm banner mới
          </MyButton>
        </div>
        <div className="mt-6 bg-white shadow-md rounded-xl p-6">
          <DndContext
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={listBanners?.map((b: { _id: string }) => b._id) || []}
              strategy={verticalListSortingStrategy}
            >
              <MyTable
                components={{
                  body: {
                    row: Row,
                  },
                }}
                columns={columns}
                dataSource={listBanners || []}
                rowKey="_id"
                loading={bannersLoading}
                pagination={false}
                // className="w-[70%] mx-auto"
              />
            </SortableContext>
          </DndContext>
        </div>
        <MyModal
          key={bannerDetail?._id || "new"}
          title={bannerDetail ? "Cập nhật banner" : "Thêm banner mới"}
          open={showModal}
          onCancel={() => {
            setShowModal(false);
            setBannerDetail(null);
            setImageFile(null);
            setImagePreview(null);
            form.resetFields();
          }}
          onOk={() => form.submit()}
          confirmLoading={formLoading}
        >
          <Form form={form} layout="vertical" onFinish={handleBannerSubmit}>
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <MyInput className="w-full border p-2 rounded" />
            </Form.Item>

            <Form.Item name="description" label="Mô tả">
              <textarea className="w-full border p-2 rounded" rows={3} />
            </Form.Item>

            <Form.Item name="linkUrl" label="Đường dẫn">
              <MyInput className="w-full border p-2 rounded" />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <MySelect className="w-full  p-2 rounded">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </MySelect>
            </Form.Item>

            <Form.Item
              name="sortOrder"
              label="Thứ tự"
              rules={[{ required: true, message: "Vui lòng nhập thứ tự" }]}
            >
              <MyInputNumber
                type="number"
                className="w-full border p-2 rounded"
                min={0}
                // disabled={!!bannerDetail}
                disabled
              />
            </Form.Item>

            <Form.Item label="Hình ảnh">
              <Upload
                listType="picture-card"
                maxCount={1}
                showUploadList={false}
                beforeUpload={(file) => {
                  setImageFile(file);
                  const reader = new FileReader();
                  reader.onload = (e) =>
                    setImagePreview(e.target?.result as string);
                  reader.readAsDataURL(file);
                  return false;
                }}
              >
                {imagePreview || bannerDetail?.imageId ? (
                  <img
                    src={
                      imagePreview ||
                      `http://localhost:8081/api/v1/admin/files/${bannerDetail?.imageId}`
                    }
                    alt="banner"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div>Upload</div>
                )}
              </Upload>
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
          <p>Bạn có chắc chắn muốn xóa banner này không?</p>
        </MyModal>
      </ConfigProvider>
    </>
  );
};

export default BannerPage;
