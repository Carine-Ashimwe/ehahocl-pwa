import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddMarketprice = async ({
  ...payload
}): Promise<IResponse | undefined> => {
  return await axios
    .post('/market_prices', payload)
    .then((res) => {
      return res.data.message;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const GetMarketPrices = async () => {
  try {
    const response = await axios.get('/market_prices');
    return response.data.message;
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetMarketPrice = async () => {};

export const UpdateMarketPrice = async ({
  ...payload
}): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/market_prices/${payload.id}`, payload)
    .then((res) => {
      return res.data.message;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const DeleteMarketprice = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`/market_prices/${id}`, {
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
