import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddMarket = async ({
  ...payload
}): Promise<IResponse | undefined> => {
  return await axios
    .post('/markets', payload)
    .then((res) => {
      return res.data.message;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      // throw new Error(error.response?.data?.message);
      return error.response?.data?.message;
    });
};

export const GetMarkets = async () => {
  try {
    const response = await axios.get('/markets');
    return response.data.message;
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetMarket = async () => {};

export const UpdateMarket = async ({
  ...payload
}): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/markets/${payload.id}`, payload)
    .then((res) => {
      return res.data.message;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const DeleteMarket = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`/markets/${id}`, {
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
//     .post('/markets', payload)
//     .then((res) => {
//       return res.data;
//     })
//     .catch((error: any) => {
//       console.error(error.response?.data?.message);
//       throw new Error(error.response?.data?.message);
//     });
// };
