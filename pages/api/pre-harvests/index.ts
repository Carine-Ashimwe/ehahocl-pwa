import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddPreHarvests = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/pre_harvests', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const GetPreHarvests = async ({ ...payload }) => {
  try {
    const response = await axios.get('/pre_harvests',{params:payload});
    const products = response.data.result
    const number_products = response.data.number_products

    if(products != undefined){
      return [products, number_products];
    }else{
      return response.data
    }
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetPreHarvest = async () => {};

export const UpdatePreHarvests = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/pre_harvests/${payload.id}`, payload)
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
    .delete(`/pre_harvests/${id}`, {
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
