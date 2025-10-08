import {
  ConfigProvider,
  Form,
  notification,
  Upload,
  type TablePaginationConfig,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState, type FC } from "react";
import { FaPlus, FaReddit, FaTrash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { mediaUploadApi } from "~/api/media.api";
import { createNewsApi, updateNewsApi } from "~/api/news.api";
import Seo from "~/components/seo/seo";
import MyButton from "~/components/ui/button";
import MyInput from "~/components/ui/input";
import { useAppDispatch } from "~/store";
import { deleteNews, getNews } from "~/store/news/news.action";
import MySelect from "~/components/ui/select";
import MyTable from "~/components/ui/table";
import MyModal from "~/components/ui/modal";
import CKEditorItem from "~/components/ui/ckeditor";

interface Author {
  _id: string;
  name: string;
  email: string;
}

interface ImageId {
  _id: string;
}
interface Tag {
  _id: string;
  name: string;
}
interface News {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: Author;
  imageId: ImageId;
  status: string;
  tags: Tag[];
  viewCount: number;
}

const NewsPage: FC = () => {
  const dispatch = useAppDispatch();
  const { listNews, loading: newsLoading } = useSelector(
    (state: any) => state.news,
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [newsDetail, setNewsDetail] = useState<News | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [formLoading, setFormLoading] = useState(false);
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(
      getNews({
        current: 1,
        pageSize: pagination.pageSize,
        sortBy: sortBy,
      }),
    );
  }, [dispatch, pagination.pageSize, sortBy]);

  useEffect(() => {
    if (!listNews) return;
    const nextTotal = Number(listNews?.total || 0);
    setPagination((prev) => ({
      ...prev,
      total: nextTotal,
      current: Number(listNews?.current || 1),
      pageSize: Number(listNews?.pageSize || prev.pageSize),
    }));
  }, [listNews]);

  const handleImageUpload = async (file: File) => {
    try {
      const response = await mediaUploadApi({ image: file });
      return response._id;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Lỗi khi tải lên hình ảnh");
    }
  };

  const handleNewsSubmit = async (formData: any) => {
    setFormLoading(true);
    try {
      let imageId = formData.imageId;

      if (imageFile) {
        imageId = await handleImageUpload(imageFile);
      }

      const newsData = {
        ...formData,
        imageId,
      };

      if (newsDetail) {
        await updateNewsApi({
          id: newsDetail._id,
          body: newsData,
        });
        api.success({
          message: "Thành công",
          description: "Cập nhật tin tức thành công!",
        });
      } else {
        await createNewsApi(newsData);
        api.success({
          message: "Thành công",
          description: "Tạo tin tức mới thành công!",
        });
      }
      dispatch(
        getNews({
          current: 1,
          pageSize: pagination.pageSize,
          search: search.trim() || undefined,
          sortBy: sortBy,
        }),
      );
      setShowModal(false);
      setNewsDetail(null);
      setImageFile(null);
      setImagePreview(null);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting news:", error);
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
      getNews({
        current: 1,
        pageSize: pagination.pageSize,
        search: keyword || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sortBy: sortBy,
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
      getNews({
        current: newCurrent || 1,
        pageSize: newPageSize || pagination.pageSize,
        search: search.trim() || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sortBy: sortBy,
      }),
    );
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(
        getNews({
          current: 1,
          pageSize: pagination.pageSize,
          search: search.trim() || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          sortBy: sortBy,
        }),
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [statusFilter, dispatch, sortBy]);

  const handleAddNews = () => {
    setNewsDetail(null);
    setImageFile(null);
    setImagePreview(null);
    form.resetFields();
    setShowModal(true);
  };

  const sortByOptions = [
    { label: "createdAt", value: "createdAt" },
    { label: "updatedAt", value: "updatedAt" },
  ];

  const handleEdit = (news: News) => {
    setNewsDetail(news);
    form.setFieldsValue({
      title: news.title,
      slug: news.title,
      summary: news.summary,
      content: news.content,
      author: news.author._id,
      imageId: news.imageId._id,
      tags: news.tags.map((tag) => tag._id),
      viewCount: news.viewCount,
      status: news.status,
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
      await dispatch(deleteNews(deleteId));
      api.success({
        message: "Thành công",
        description: "Xóa tin tức thành công!",
      });
      dispatch(
        getNews({
          current: 1,
          pageSize: pagination.pageSize,
          search: search.trim() || undefined,
          sortBy: sortBy,
        }),
      );
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

  const columns: ColumnsType<News> = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Tác giả",
      dataIndex: ["author", "name"],
      key: "author",
    },
    {
      title: "Tóm tắt",
      dataIndex: "summary",
      key: "summary",
      render: (text: string) => (
        <div
          className="line-clamp-3"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (text: string) => (
        <div
          className="line-clamp-3"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      ),
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Lượt xem",
      dataIndex: "viewCount",
      key: "viewCount",
    },
    {
      title: "Hành động",
      fixed: "right",
      width: 200,
      render: (_: any, record: News) => (
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
      <Seo title="Quản lý tin tức" />
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
          <div className="text-4xl">Quản lý tin tức</div>
          <MyButton
            className="!ml-auto !px-[40px] !py-[20px] !text-[16px] !rounded-lg !border !border-green-600 !bg-green-600 !text-white hover:!bg-green-700"
            onClick={handleAddNews}
          >
            <FaPlus /> Thêm tin tức mới
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
              { label: "draft", value: "draft" },
              { label: "published", value: "published" },
              { label: "archived", value: "archived" },
            ]}
          />

          <MySelect
            className="!w-[200px]"
            value={sortBy}
            onChange={(val) => setSortBy(val)}
            options={sortByOptions}
            placeholder="Sắp xếp theo"
          />

          <MyButton
            className="!py-[20px] !px-[14px] !rounded-lg !border !border-gray-400 
               !bg-gray-100 hover:!bg-gray-200 !text-gray-700"
            onClick={() => {
              setStatusFilter("all");
              setSortBy("createdAt");
              setSearch("");
              setPagination((prev) => ({ ...prev, current: 1 }));
              dispatch(
                getNews({
                  current: 1,
                  pageSize: pagination.pageSize,
                  sortBy: "createdAt",
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
            dataSource={listNews?.news || []}
            rowKey="_id"
            loading={newsLoading}
            pagination={{
              current: listNews?.current || pagination.current,
              pageSize: listNews?.pageSize || pagination.pageSize,
              total: listNews?.total || pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} phim`,
              pageSizeOptions: ["10", "20", "50"],
            }}
            onChange={handleTableChange}
          />
        </div>

        <MyModal
          key={newsDetail?._id || "new"}
          title={newsDetail ? "Cập nhật tin tức" : "Thêm tin tức mới"}
          open={showModal}
          onCancel={() => {
            setShowModal(false);
            setNewsDetail(null);
            setImageFile(null);
            setImagePreview(null);
            form.resetFields();
          }}
          onOk={() => form.submit()}
          confirmLoading={formLoading}
        >
          <Form form={form} layout="vertical" onFinish={handleNewsSubmit}>
            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <MyInput placeholder="Nhập tiêu đề" />
            </Form.Item>

            <Form.Item
              label="Tóm tắt"
              name="summary"
              rules={[{ required: true, message: "Vui lòng nhập tóm tắt" }]}
            >
              <CKEditorItem />
            </Form.Item>

            <Form.Item
              label="Nội dung"
              name="content"
              rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
            >
              <CKEditorItem />
            </Form.Item>

            <Form.Item
              label="Tác giả (ID)"
              name="author"
              rules={[{ required: true, message: "Vui lòng nhập tác giả" }]}
            >
              <MyInput placeholder="Nhập ID tác giả" />
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
                {imagePreview || newsDetail?.imageId ? (
                  <img
                    src={
                      imagePreview ||
                      `http://localhost:8081/api/v1/admin/files/${newsDetail?.imageId._id}`
                    }
                    alt="news"
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

            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <MySelect
                options={[
                  { label: "draft", value: "draft" },
                  { label: "published", value: "published" },
                  { label: "archived", value: "archived" },
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
export default NewsPage;
