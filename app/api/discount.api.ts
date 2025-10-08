import authorizedRequest from "~/config/axios";
import { ADMIN_DISCOUNT } from "./endpoint";

export const getDiscountApi = async () => {
  try {
    const response = await authorizedRequest.get(ADMIN_DISCOUNT);
    return response.data;
  } catch (error) {
    console.error("Error getDiscountApi:", error);
    throw error;
  }
};

export const updateDiscountApi = async (body: any) => {
  try {
    const response = await authorizedRequest.patch(
      `${ADMIN_DISCOUNT}/${body.id}`,
      body.body,
    );
    return response.data;
  } catch (error) {
    console.error("Error updateDiscountApi:", error);
    throw error;
  }
};

export const createDiscountApi = async (body: object) => {
  try {
    const response = await authorizedRequest.post(ADMIN_DISCOUNT, body);
    return response.data;
  } catch (error) {
    console.error("Error createDiscountApi:", error);
    throw error;
  }
};

export const deleteDiscountApi = async (id: string) => {
  try {
    const response = await authorizedRequest.delete(`${ADMIN_DISCOUNT}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleteDiscountApi:", error);
    throw error;
  }
};
