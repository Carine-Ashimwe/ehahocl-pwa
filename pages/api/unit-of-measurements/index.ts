import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddUnitOfMeasurements = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/unit_of_measurements', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const GetUnitOfMeasurements = async ({...payload}) => {
  try {
    const response = await axios.get('/unit_of_measurements',{params:payload});
    const units = response.data.result
    const number_units = response.data.number_units

    if(units != undefined){
      return [units, number_units];
    }else{
      return response.data
    }
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetUnitOfMeasurement = async () => {};

export const UpdateUnitOfMeasurements = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/unit_of_measurements/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const DeleteUnitOfMeasurement = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`/unit_of_measurements/${id}`, {
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
