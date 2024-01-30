import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddBusinessProduct = async ({
  ...payload
}): Promise<IResponse | undefined> => {
  return await axios
    .post('/business_products', payload)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
};

export const GetBusinessProducts = async (payload: any) => {
  try {
    const response = await axios.get('/business_products', { params: payload });
    let products = response.data.result.data;

    // Check if products include a created_at field
    if (products.length && products[0].created_at) {
      // Convert the date to a readable format for each product
      products = products.map(
        (product: { created_at: string | number | Date }) => {
          const date = new Date(product.created_at);
          product.created_at = date.toLocaleDateString(); // Change date format
          return product;
        }
      );
    }
    const number_products = response.data.number_products;

    return [products, number_products];
  } catch (error) {
    throw new Error(`Something went wrong ${error}.`);
  }
};

export const GetBusinessProduct = async () => {};

export const UpdateBusinessProduct = async ({
  ...payload
}): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/business_products/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};
export const UpdateStatus = async ({
  ...payload
}): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/business_products/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};
export const DeleteProduct = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`/business_products/${id}`, {
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
