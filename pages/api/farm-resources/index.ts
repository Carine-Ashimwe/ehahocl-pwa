import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddFarmResource = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/farm_resources', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const GetFarmResources = async ({...payload}) => {
  try {
    const response = await axios.get('/farm_resources',{params:payload});
    const farmResources = response.data.result
    const number_resources = response.data.number_resources
    
    if(farmResources != undefined){
      return [farmResources,number_resources];
    }else{
      return response.data
    }
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const UpdateFarmResources = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/farm_resources/${payload.id}`, payload)
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
    .delete(`/farm_resources/${id}`, {
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
