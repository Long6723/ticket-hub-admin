import {
  ConfigProvider,
  Form,
  notification,
  type TablePaginationConfig,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState, type FC } from "react";
import { FaPlus, FaReddit, FaTrash } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { createShowtimeApi, updateShowtimeApi } from "~/api/showtime.api";
import Seo from "~/components/seo/seo";
import MyButton from "~/components/ui/button";
import MySelect from "~/components/ui/select";
import MyTable from "~/components/ui/table";
import { useAppDispatch } from "~/store";
import { getMovies } from "~/store/movie/movie.action";
import { getRooms } from "~/store/room/room.action";
import { deleteShowtime, getShowtimes } from "~/store/showtime/showtime.action";
import dayjs from "dayjs";
import MyModal from "~/components/ui/modal";
import MyInput from "~/components/ui/input";
import MyDatePicker from "~/components/ui/date-picker";

interface Showtime {
  _id: string;
  movie: {
    _id: string;
    name: string;
  };
  cinema: string;
  address: string;
  showtime: string;
  date: string;
  room: {
    _id: string;
    name: string;
  };
  status: string;
}

const ShowtimePage: FC = () => {
  const dispatch = useAppDispatch();
  const { listShowtime, loading: showtimeLoading } = useSelector(
    (state: any) => state.showtime,
  );
  const [movieFilter, setMovieFilter] = useState("all");
  const [cinemaFilter, setCinemaFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [showtimeDetail, setShowtimeDetail] = useState<Showtime | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [formLoading, setFormLoading] = useState(false);
  const [form] = Form.useForm();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { listMovie } = useSelector((state: any) => state.movie);
  const { listRoom } = useSelector((state: any) => state.room);

  useEffect(() => {
    dispatch(
      getShowtimes({
        current: 1,
        pageSize: pagination.pageSize,
        sortBy: sortBy,
      }),
    );
    dispatch(
      getMovies({
        current: 1,
        pageSize: pagination.pageSize,
        sortBy: sortBy,
      }),
    );
    dispatch(getRooms());
  }, [dispatch, pagination.pageSize, sortBy]);

  useEffect(() => {
    if (!listShowtime) return;
    const nextTotal = Number(listShowtime?.total || 0);
    setPagination((prev) => ({
      ...prev,
      total: nextTotal,
      current: Number(listShowtime?.current || 1),
      pageSize: Number(listShowtime?.pageSize || prev.pageSize),
    }));
  }, [listShowtime]);

  const handleShowtimeSubmit = async (formData: any) => {
    setFormLoading(true);
    try {
      if (showtimeDetail) {
        await updateShowtimeApi({
          id: showtimeDetail._id,
          body: formData,
        });
        api.success({
          message: "Thành công",
          description: "Cập nhật lịch chiếu thành công!",
        });
      } else {
        await createShowtimeApi(formData);
        api.success({
          message: "Thành công",
          description: "Tạo lịch chiếu mới thành công!",
        });
      }
      dispatch(
        getShowtimes({
          current: 1,
          pageSize: pagination.pageSize,
          sortBy: sortBy,
        }),
      );
      setShowModal(false);
      setShowtimeDetail(null);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting showtime:", error);
      api.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra! Vui lòng thử lại.",
      });
    } finally {
      setFormLoading(false);
    }
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
      getShowtimes({
        current: newCurrent || 1,
        pageSize: newPageSize || pagination.pageSize,
        movieId: movieFilter !== "all" ? movieFilter : undefined,
        cinema: cinemaFilter !== "all" ? cinemaFilter : undefined,
        date: dateFilter !== "all" ? dateFilter : undefined,
        roomId: roomFilter !== "all" ? roomFilter : undefined,
        sortBy: sortBy,
      }),
    );
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(
        getShowtimes({
          current: 1,
          pageSize: pagination.pageSize,
          movieId: movieFilter !== "all" ? movieFilter : undefined,
          cinema: cinemaFilter !== "all" ? cinemaFilter : undefined,
          date: dateFilter !== "all" ? dateFilter : undefined,
          roomId: roomFilter !== "all" ? roomFilter : undefined,
          sortBy: sortBy,
        }),
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [movieFilter, cinemaFilter, dateFilter, roomFilter, dispatch, sortBy]);

  const handleAddShowtime = () => {
    setShowtimeDetail(null);
    form.resetFields();
    setShowModal(true);
  };

  const sortByOptions = [
    { label: "createdAt", value: "createdAt" },
    { label: "updatedAt", value: "updatedAt" },
  ];

  const handleEdit = (showtime: Showtime) => {
    setShowtimeDetail(showtime);
    form.setFieldsValue({
      movie: showtime.movie._id,
      cinema: showtime.cinema,
      address: showtime.address,
      showtime: showtime.showtime ? dayjs(showtime.showtime) : null,
      date: showtime.date ? dayjs(showtime.date) : null,
      room: showtime.room._id,
      status: showtime.status,
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
      await dispatch(deleteShowtime(deleteId));
      api.success({
        message: "Thành công",
        description: "Xóa lịch chiếu thành công!",
      });
      dispatch(
        getShowtimes({
          current: 1,
          pageSize: pagination.pageSize,
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

  const columns: ColumnsType<Showtime> = [
    { title: "Phim", dataIndex: ["movie", "name"], key: "movie" },
    { title: "Rạp", dataIndex: "cinema", key: "cinema" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    {
      title: "Thời gian chiếu",
      dataIndex: "showtime",
      key: "showtime",
      render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY") : ""),
    },
    {
      title: "Ngày chiếu",
      dataIndex: "date",
      key: "date",
      render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY") : ""),
    },
    { title: "Phòng", dataIndex: ["room", "name"], key: "room" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Showtime) => (
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
  console.log("listMovie structure:", listMovie);
  console.log("listRoom structure:", listRoom);

  return (
    <>
      <Seo title="Quản lý lịch chiếu" />
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
          <div className="text-4xl">Quản lý lịch chiếu</div>
          <MyButton
            className="!ml-auto !px-[40px] !py-[20px] !text-[16px] !rounded-lg !border !border-green-600 !bg-green-600 !text-white hover:!bg-green-700"
            onClick={handleAddShowtime}
          >
            <FaPlus /> Thêm lịch chiếu mới
          </MyButton>
        </div>

        <div className="flex flex-wrap gap-4 bg-white shadow-md rounded-xl py-4 px-6 items-center  w-full">
          <MySelect
            className="!w-[200px]"
            value={movieFilter}
            onChange={(val) => setMovieFilter(val)}
            options={[
              { label: "All", value: "all" },
              ...(listMovie?.movies || listMovie || []).map((m: any) => ({
                label: m.name,
                value: m._id,
              })),
            ]}
            placeholder="Lọc theo phim"
          />

          {/* <MySelect
            className="!w-[200px]"
            value={dateFilter}
            onChange={(val) => setDateFilter(val)}
            options={[
              { label: "All", value: "all" },
              ...(listShowtime
                ? Array.from(
                    new Set(listShowtime.data.map((s: any) => s.date)),
                  ).map((date) => ({
                    label: date,
                    value: date,
                  }))
                : []),
            ]}
            placeholder="Lọc theo ngày chiếu"
          /> */}

          <MySelect
            className="!w-[200px]"
            value={roomFilter}
            onChange={(val) => setRoomFilter(val)}
            options={[
              { label: "All", value: "all" },
              ...(listRoom || []).map((r: any) => ({
                label: r.name,
                value: r._id,
              })),
            ]}
            placeholder="Lọc theo phòng chiếu"
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
              setMovieFilter("all");
              setDateFilter("all");
              setRoomFilter("all");
              setSortBy("createdAt");
              setPagination((prev) => ({ ...prev, current: 1 }));
              dispatch(
                getShowtimes({
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
            dataSource={listShowtime?.showtimes || []}
            rowKey="_id"
            loading={showtimeLoading}
            pagination={{
              current: listShowtime?.current || pagination.current,
              pageSize: listShowtime?.pageSize || pagination.pageSize,
              total: listShowtime?.total || pagination.total,
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
          key={showtimeDetail ? showtimeDetail._id : "new"}
          title={showtimeDetail ? "Cập nhật lịch chiếu" : "Thêm lịch chiếu"}
          open={showModal}
          onCancel={() => {
            setShowModal(false);
            setShowtimeDetail(null);
            form.resetFields();
          }}
          onOk={() => form.submit()}
          confirmLoading={formLoading}
        >
          <Form form={form} layout="vertical" onFinish={handleShowtimeSubmit}>
            <Form.Item
              name="movie"
              label="Phim"
              rules={[{ required: true, message: "Chọn phim" }]}
            >
              <MySelect
                options={(listMovie?.movies || listMovie || []).map(
                  (movie: any) => ({
                    label: movie.name,
                    value: movie._id,
                  }),
                )}
              />
            </Form.Item>
            <Form.Item
              name="cinema"
              label="Rạp"
              rules={[{ required: true, message: "Nhập tên rạp" }]}
            >
              <MyInput />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: "Nhập địa chỉ rạp" }]}
            >
              <MyInput />
            </Form.Item>

            <Form.Item
              name="showtime"
              label="Thời gian chiếu"
              rules={[{ required: true, message: "Chọn thời gian chiếu" }]}
            >
              <MyDatePicker />
            </Form.Item>

            <Form.Item
              name="date"
              label="Ngày chiếu"
              rules={[{ required: true, message: "Chọn ngày chiếu" }]}
            >
              <MyDatePicker />
            </Form.Item>

            <Form.Item
              name="room"
              label="Phòng"
              rules={[{ required: true, message: "Chọn phòng chiếu" }]}
            >
              <MySelect
                options={(listRoom || []).map((room: any) => ({
                  label: room.name,
                  value: room._id,
                }))}
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

export default ShowtimePage;
