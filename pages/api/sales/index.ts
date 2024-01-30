import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddSales = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/orders', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const Intransit = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/check_delivery_code',payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};
export const Success = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/check_buyer_code',payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const GetSales = async ({ ...payload }) => {
  try {
    const response = await axios.get('/orders',{params:payload});
    const sales = response.data.result
    const number_sales = response.data.number_orders
    if(sales != undefined){
      return [sales, number_sales];
    }else{
      return response.data
    }
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetSale = async () => {};

export const UpdateSales = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/orders/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const UpdateStatus = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/order_products/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};



export const DeleteSale = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`/orders/${id}`, {
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
