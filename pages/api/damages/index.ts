import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddDamages = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/damages', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const GetDamages = async ({ ...payload }) => {
  try {
    const response = await axios.get('/damages',{params:payload});
    const damages = response.data.result
    const nubmer_damages = response.data.nubmer_damages

    if(damages != undefined){
      return [damages, nubmer_damages];
    }else{
      return response.data
    }
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetDamage = async () => {};

export const UpdateDamages = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/damages/${payload.id}`, payload)
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
    .delete(`/damages/${id}`, {
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
