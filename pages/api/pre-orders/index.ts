import { number } from 'yup';
import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddPreOrders = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/pre_orders', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const GetPreOrders = async ({ ...payload }) => {
  try {
    const response = await axios.get('/pre_order',{params:payload});
    const preOrders = response.data.result
    const numberPreOrders = response.data.number_pre_orders
    if(preOrders != undefined){
      return [preOrders,numberPreOrders];
    }else{
      return response.data
    }
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetPreOrder = async () => {};

export const UpdatePreOrders = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/pre_orders/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const DeletePreOrder = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`/pre_orders/${id}`, {
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
