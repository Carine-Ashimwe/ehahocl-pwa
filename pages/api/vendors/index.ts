import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddVendors = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/user_businesses', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const GetVendors = async ({ ...payload }) => {
  try {
    const response = await axios.get('/user_businesses',{params:payload});
    const number_vendors = response.data.number_vendors;

    const data = response.data.result.map((item: { created_at: string | number | Date; }) => ({
      ...item,
      created_at: new Date(item.created_at).toLocaleDateString(),
    }));
    // console.log(data)
    if(data != undefined){
      return [data,number_vendors];
    }else{
      return response.data
    }
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetVendor = async () => {};

export const UpdateVendors = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/user_businesses/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const DeleteVendor = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`/user_businesses/${id}`, {
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
