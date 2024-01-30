import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddFarm = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/farms', payload)
    .then((res) => {
      return res.data.message;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};


export const GetFarms = async () => {
  try {
    const response = await axios.get('/farms');
    return response.data.message;
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetFarm = async () => {};

export const UpdateFarm = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/farms/${payload.id}`, payload)
    .then((res) => {
      return res.data.message;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const DeleteFarm = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`/farms/${id}`, {
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

// export const UploadImage = async ({ ...payload }): Promise<IResponse | undefined> => {
//   return await axios
//     .post('/farms', payload)
//     .then((res) => {
//       return res.data;
//     })
//     .catch((error: any) => {
//       console.error(error.response?.data?.message);
//       throw new Error(error.response?.data?.message);
//     });
// };
