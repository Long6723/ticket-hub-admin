import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  //   index("layout/main-layout.tsx"),
  //   route("about", "routes/about.tsx"),
  layout("./layout/main-layout.tsx", [
    index("./routes/home/home.tsx"),
    route("banner", "routes/banner/banner.tsx"),
    route("account", "routes/account/account.tsx"),
    route("movies", "routes/movies/movies.tsx"),
    route("voucher/discounts", "routes/discount/discount.tsx"),
    route("voucher/news", "routes/news/news.tsx"),
    route("order", "routes/order/order.tsx"),
    route("room", "routes/room/room.tsx"),
    route("room layout", "routes/room-layout/room-layout.tsx"),
    route("revenue", "routes/revenue/revenue.tsx"),
  ]),
  route("dev", "routes/dev/component.tsx"),
  route("login", "routes/login/login.tsx"),
] satisfies RouteConfig;
