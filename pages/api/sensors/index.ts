import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddSensor = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/sensors', payload)
    .then((res) => {
      return res.data.message;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};


export const GetSensors = async () => {
  try {
    const response = await axios.get('/sensors');
    return response.data.message;
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetSensor = async () => {};

export const UpdateSensor = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/sensors/${payload.id}`, payload)
    .then((res) => {
      return res.data.message;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const DeleteSensor = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`/sensors/${id}`, {
      headers: {
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('access_token') || ''),
      },
    })
    .then((res) => {
      return res.data.message;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};
