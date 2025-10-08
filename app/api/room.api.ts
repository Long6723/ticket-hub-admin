import authorizedRequest from "~/config/axios";
import { ADMIN_ROOM } from "./endpoint";

export const getRoomApi = async () => {
  try {
    const response = await authorizedRequest.get(ADMIN_ROOM);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getRoomApi:", error);
    throw error;
  }
};

export const updateRoomApi = async (body: any) => {
  try {
    const response = await authorizedRequest.patch(
      `${ADMIN_ROOM}/${body.id}`,
      body.body,
    );
    return response.data;
  } catch (error) {
    console.error("Error updateRoomApi:", error);
    throw error;
  }
};

export const createRoomApi = async (body: object) => {
  try {
    const response = await authorizedRequest.post(ADMIN_ROOM, body);
    return response.data;
  } catch (error) {
    console.error("Error createRoomApi:", error);
    throw error;
  }
};

export const deleteRoomApi = async (id: string) => {
  try {
    const response = await authorizedRequest.delete(`${ADMIN_ROOM}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleteRoomApi:", error);
    throw error;
  }
};
