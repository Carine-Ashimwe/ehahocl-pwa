import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddPurchases = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/purchases', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const GetPurchases = async ({ ...payload }) => {
  try {
    const response = await axios.get(`/purchases`,{params:payload});
    const purchases = response.data.result
    const number_purchases = response.data.number_purchases
    if(purchases != undefined){
      return [purchases, number_purchases];
    }else{
      return response.data
    }
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};


export const GetPurchase = async () => {};

export const UpdatePurchases = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/purchases/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const DeletePurchase = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`/purchases/${id}`, {
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
