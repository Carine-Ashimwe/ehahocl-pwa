import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const GetSensorDatas = async ({ ...payload }) => {
  try {
    const response = await axios.get('/sensor_data',{params:payload});
    return response.data.message;
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetSensorData = async () => {};

export const DeleteSensorData = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`/sensor_data/${id}`, {
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
