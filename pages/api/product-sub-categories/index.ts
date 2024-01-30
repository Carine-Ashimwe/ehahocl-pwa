import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddProductSubCategories = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/product_sub_categories', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const GetProductSubCategories = async ({...payload}) => {
  try {
    const response = await axios.get('/product_sub_categories',{params:payload});
    const subCategories = response.data.result
    const number_sub_categories = response.data.number_sub_categories
    
    if(subCategories != undefined){
      return [subCategories, number_sub_categories]
    }else{
      return response.data
    }
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetProductSubCategory = async () => {};

export const UpdateProductSubCategories = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/product_sub_categories/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const DeleteDamage = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`/product_sub_categories/${id}`, {
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
