import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddFarmResourceSubCategories = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/farm_resource_sub_categories', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const GetFarmResourceSubCategories = async ({...payload}) => {
  try {
    const response = await axios.get('/farm_resource_sub_categories',{params:payload});
    const FarmResourceSubCategories = response.data.result
    const number_subcategories = response.data.number_subcategories

    if(FarmResourceSubCategories != undefined){
      return [FarmResourceSubCategories, number_subcategories];
    }else{
      return response.data
    }
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const UpdateFarmResourceSubCategories = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/farm_resource_sub_categories/${payload.id}`, payload)
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
    .delete(`/farm_resource_sub_categories/${id}`, {
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
