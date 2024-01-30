import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddParameter = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/parameters', payload)
    .then((res) => {
      return res.data.message;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};


export const GetParameters = async () => {
  try {
    const response = await axios.get('/parameters');
    return response.data.message;
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetParameter = async () => {};

export const UpdateParameter = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/parameters/${payload.id}`, payload)
    .then((res) => {
      return res.data.message;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const DeleteParameter = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`/parameters/${id}`, {
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
//     .post('/parameters', payload)
//     .then((res) => {
//       return res.data;
//     })
//     .catch((error: any) => {
//       console.error(error.response?.data?.message);
//       throw new Error(error.response?.data?.message);
//     });
// };
