import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddFarmResourceCategories = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('farm_resource_categories', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const GetFarmResourceCategories = async ({...payload}) => {
  try {
    const response = await axios.get('/farm_resource_categories',{params:payload});
    const FarmResourceCategories = response.data.result
    const number_categories = response.data.number_categories
    
    if(FarmResourceCategories != undefined){
      return [FarmResourceCategories, number_categories];
    }else{
      return response.data
    }
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const UpdateFarmResourceCategories = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`farm_resource_categories/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const DeleteFarmResourceCategories = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`farm_resource_categories/${id}`, {
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
