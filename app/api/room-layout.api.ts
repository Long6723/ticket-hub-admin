import authorizedRequest from "~/config/axios";
import { ADMIN_ROOM_LAYOUT } from "./endpoint";

export const getRoomLayoutApi = async () => {
  try {
    const response = await authorizedRequest.get(ADMIN_ROOM_LAYOUT);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getRoomLayoutApi:", error);
    throw error;
  }
};

export const updateRoomLayoutApi = async (body: any) => {
  try {
    const response = await authorizedRequest.patch(
      `${ADMIN_ROOM_LAYOUT}/${body.id}`,
      body.body,
    );
    return response.data;
  } catch (error) {
    console.error("Error updateRoomLayoutApi:", error);
    throw error;
  }
};

export const createRoomLayoutApi = async (body: object) => {
  try {
    const response = await authorizedRequest.post(ADMIN_ROOM_LAYOUT, body);
    return response.data;
  } catch (error) {
    console.error("Error createRoomLayoutApi:", error);
    throw error;
  }
};

export const deleteRoomLayoutApi = async (id: string) => {
  try {
    const response = await authorizedRequest.delete(
      `${ADMIN_ROOM_LAYOUT}/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error deleteRoomLayoutApi:", error);
    throw error;
  }
};
