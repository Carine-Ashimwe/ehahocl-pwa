import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddPurchaseRequests = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/order_requests', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const GetPurchaseRequests = async ({ ...payload }) => {
  try {
    const response = await axios.get('/order_requests',{params:payload});
    const purchaseRequests = response.data.result
    const number_order_requests = response.data.number_orders_requests
    console.log(response.data.result)
    return [purchaseRequests, number_order_requests];
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetPurchaseRequest = async () => {};

export const UpdatePurchaseRequests = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/order_requests/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const DeletePreHarvest = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`/order_requests/${id}`, {
      headers: {
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('access_token') || ''),
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};
