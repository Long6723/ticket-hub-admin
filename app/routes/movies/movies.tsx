import { ConfigProvider, Form, notification, Upload } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useEffect, useState, type FC } from "react";
import { FaPlus, FaReddit, FaTrash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { createMovieApi, updateMovieApi } from "~/api/movie.api";
import { SearchOutlined } from "@ant-design/icons";
import Seo from "~/components/seo/seo";
import MyButton from "~/components/ui/button";
import MyInput from "~/components/ui/input";
import MyModal from "~/components/ui/modal";
import MySelect from "~/components/ui/select";
import dayjs from "dayjs";
import MyTable from "~/components/ui/table";
import { useAppDispatch } from "~/store";
import { getGenres } from "~/store/genre/genre.action";
import { deleteMovie, getMovies } from "~/store/movie/movie.action";
import MyDatePicker from "~/components/ui/date-picker";
import MyInputNumber from "~/components/ui/input-number";
import { mediaUploadApi } from "~/api/media.api";

interface Genre {
  _id: string;
  name: string;
}

interface Movie {
  _id: string;
  name: string;
  description: string;
  genres: Genre[];
  cast: string;
  director: string;
  releaseDate: string;
  duration: number;
  posterId: string;
  trailerUrl: string;
  rating: string;
  type: string;
  ageRating: string;
  nation: string;
  status: string;
}

const MoviePage: FC = () => {
  const dispatch = useAppDispatch();
  const { listMovie, loading: movieLoading } = useSelector(
    (state: any) => state.movie,
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [movieDetail, setMovieDetail] = useState<Movie | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [formLoading, setFormLoading] = useState(false);
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { listGenre } = useSelector((state: any) => state.genre);

  useEffect(() => {
    dispatch(
      getMovies({
        current: 1,
        pageSize: pagination.pageSize,
        sortBy: sortBy,
      }),
    );
    dispatch(getGenres());
  }, [dispatch, pagination.pageSize, sortBy]);

  useEffect(() => {
    if (!listMovie) return;
    const nextTotal = Number(listMovie?.total || 0);
    setPagination((prev) => ({
      ...prev,
      total: nextTotal,
      current: Number(listMovie?.current || 1),
      pageSize: Number(listMovie?.pageSize || prev.pageSize),
    }));
  }, [listMovie]);

  const handleImageUpload = async (file: File) => {
    try {
      const response = await mediaUploadApi({ image: file });
      return response._id;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Lỗi khi tải lên hình ảnh");
    }
  };

  const handleMovieSubmit = async (formData: any) => {
    setFormLoading(true);
    try {
      let posterId = formData.posterId;

      if (imageFile) {
        posterId = await handleImageUpload(imageFile);
      }

      const movieData = {
        ...formData,
        posterId,
      };

      if (movieDetail) {
        await updateMovieApi({
          id: movieDetail._id,
          body: movieData,
        });
        api.success({
          message: "Thành công",
          description: "Cập nhật phim thành công!",
        });
      } else {
        await createMovieApi(movieData);
        api.success({
          message: "Thành công",
          description: "Tạo phim mới thành công!",
        });
      }
      dispatch(
        getMovies({
          current: 1,
          pageSize: pagination.pageSize,
          search: search.trim() || undefined,
          sortBy: sortBy,
        }),
      );
      setShowModal(false);
      setMovieDetail(null);
      setImageFile(null);
      setImagePreview(null);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting movie:", error);
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
      getMovies({
        current: 1,
        pageSize: pagination.pageSize,
        search: keyword || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        genreId: genreFilter !== "all" ? genreFilter : undefined,
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
      getMovies({
        current: newCurrent || 1,
        pageSize: newPageSize || pagination.pageSize,
        search: search.trim() || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        genreId: genreFilter !== "all" ? genreFilter : undefined,
        sortBy: sortBy,
      }),
    );
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(
        getMovies({
          current: 1,
          pageSize: pagination.pageSize,
          search: search.trim() || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          genreId: genreFilter !== "all" ? genreFilter : undefined,
          sortBy: sortBy,
        }),
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [statusFilter, genreFilter, dispatch, sortBy]);

  const handleAddMovie = () => {
    setMovieDetail(null);
    setImageFile(null);
    setImagePreview(null);
    form.resetFields();
    setShowModal(true);
  };

  const sortByOptions = [
    { label: "createdAt", value: "createdAt" },
    { label: "updatedAt", value: "updatedAt" },
  ];

  const handleEdit = (movie: Movie) => {
    setMovieDetail(movie);
    form.setFieldsValue({
      name: movie.name,
      description: movie.description,
      genres: movie.genres.map((g: Genre) => g._id),
      cast: movie.cast,
      director: movie.director,
      releaseDate: movie.releaseDate ? dayjs(movie.releaseDate) : null,
      duration: movie.duration,
      posterId: movie.posterId,
      trailerUrl: movie.trailerUrl,
      rating: movie.rating,
      type: movie.type,
      ageRating: movie.ageRating,
      nation: movie.nation,
      status: movie.status,
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
      await dispatch(deleteMovie(deleteId));
      api.success({
        message: "Thành công",
        description: "Xóa phim thành công!",
      });
      dispatch(
        getMovies({
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

  const columns: ColumnsType<Movie> = [
    {
      title: "STT",
      key: "stt",
      render: (_: any, record: any, index: number) => {
        const current = listMovie?.current || pagination.current;
        const pageSize = listMovie?.pageSize || pagination.pageSize;
        return (current - 1) * pageSize + index + 1;
      },
      width: 80,
      align: "center",
    },
    { title: "Tên phim", dataIndex: "name" },
    {
      title: "Thể loại",
      dataIndex: "genres",
      render: (genres: Genre[]) => genres?.map((g) => g.name).join(", ") || "",
    },
    { title: "Trạng thái", dataIndex: "status" },
    {
      title: "Ngày phát hành",
      dataIndex: "releaseDate",
      render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY") : ""),
    },
    {
      title: "Thời lượng phim",
      dataIndex: "duration",
      render: (duration: number) => `${duration} phút`,
    },
    {
      title: "Hành động",
      fixed: "right",
      width: 200,
      render: (_: any, record: Movie) => (
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
      <Seo title="Quản lý phim" />
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
          <div className="text-4xl">Quản lý phim</div>
          <MyButton
            className="!ml-auto !px-[40px] !py-[20px] !text-[16px] !rounded-lg !border !border-green-600 !bg-green-600 !text-white hover:!bg-green-700"
            onClick={handleAddMovie}
          >
            <FaPlus /> Thêm phim mới
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
              { label: "coming_soon", value: "coming_soon" },
              { label: "now_showing", value: "now_showing" },
              { label: "ended", value: "ended" },
              { label: "cancelled", value: "cancelled" },
            ]}
          />

          <MySelect
            className="!w-[200px]"
            value={genreFilter}
            onChange={(val) => setGenreFilter(val)}
            options={[
              { label: "All", value: "all" },
              ...(listGenre || []).map((g: Genre) => ({
                label: g.name,
                value: g._id,
              })),
            ]}
            placeholder="Lọc theo thể loại"
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
              setGenreFilter("all");
              setSortBy("createdAt");
              setSearch("");
              setPagination((prev) => ({ ...prev, current: 1 }));
              dispatch(
                getMovies({
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
            dataSource={listMovie?.movies || []}
            rowKey="_id"
            loading={movieLoading}
            pagination={{
              current: listMovie?.current || pagination.current,
              pageSize: listMovie?.pageSize || pagination.pageSize,
              total: listMovie?.total || pagination.total,
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
          key={movieDetail?._id || "new"}
          title={movieDetail ? "Cập nhật phim" : "Thêm phim mới"}
          open={showModal}
          onCancel={() => {
            setShowModal(false);
            setMovieDetail(null);
            setImageFile(null);
            setImagePreview(null);
            form.resetFields();
          }}
          onOk={() => form.submit()}
          width={900}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleMovieSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="flex flex-col gap-4">
              <Form.Item
                name="name"
                label="Tên phim"
                rules={[{ required: true, message: "Nhập tên phim" }]}
              >
                <MyInput />
              </Form.Item>

              <Form.Item name="description" label="Mô tả">
                <textarea className="w-full border p-2 rounded" rows={3} />
              </Form.Item>

              <Form.Item name="cast" label="Diễn viên">
                <MyInput />
              </Form.Item>

              <Form.Item name="director" label="Đạo diễn">
                <MyInput />
              </Form.Item>

              <Form.Item
                name="genres"
                label="Thể loại"
                rules={[{ required: true, message: "Chọn thể loại" }]}
              >
                <MySelect
                  mode="multiple"
                  options={(listGenre || []).map((g: any) => ({
                    label: g.name,
                    value: g._id,
                  }))}
                />
              </Form.Item>

              <Form.Item
                name="releaseDate"
                label="Ngày phát hành"
                rules={[{ required: true, message: "Nhập ngày phát hành" }]}
              >
                <MyDatePicker />
              </Form.Item>

              <Form.Item
                name="duration"
                label="Thời lượng phim"
                rules={[{ required: true, message: "Nhập thời lượng phim" }]}
              >
                <MyInputNumber />
              </Form.Item>
            </div>

            <div className="flex flex-col gap-4">
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
                  {imagePreview || movieDetail?.posterId ? (
                    <img
                      src={
                        imagePreview ||
                        `http://localhost:8081/api/v1/admin/files/${movieDetail?.posterId._id}`
                      }
                      alt="movies"
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

              <Form.Item name="trailerUrl" label="Trailer URL">
                <MyInput />
              </Form.Item>

              <Form.Item name="rating" label="Đánh giá">
                <MyInput />
              </Form.Item>

              <Form.Item name="type" label="Loại phim">
                <MySelect
                  options={[
                    { label: "2D", value: "2D" },
                    { label: "3D", value: "3D" },
                  ]}
                />
              </Form.Item>

              <Form.Item name="ageRating" label="Độ tuổi">
                <MySelect
                  options={[
                    { label: "P", value: "P" },
                    { label: "K", value: "K" },
                    { label: "T13", value: "T13" },
                    { label: "T16", value: "T16" },
                    { label: "T18", value: "T18" },
                  ]}
                />
              </Form.Item>

              <Form.Item name="nation" label="Quốc gia">
                <MyInput />
              </Form.Item>

              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: "Chọn trạng thái" }]}
              >
                <MySelect
                  options={[
                    { label: "coming_soon", value: "coming_soon" },
                    { label: "now_showing", value: "now_showing" },
                    { label: "ended", value: "ended" },
                    { label: "cancelled", value: "cancelled" },
                  ]}
                />
              </Form.Item>
            </div>
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

export default MoviePage;
