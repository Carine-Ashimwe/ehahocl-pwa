import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddProduct = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/products', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};


export const GetProducts = async ({ ...payload }) => {
  try {
    const response = await axios.get('/products',{params:payload});
    const purchases = response.data.result
    const number_products = response.data.number_products;
    if(purchases != undefined){
      return [purchases, number_products]
    }else{
      return response.data
    }
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetProduct = async () => {};

export const UpdateProduct = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/products/${payload.id}`, payload)
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
    .delete(`/products/${id}`, {
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

export const disableProduct = async ({ id }: { id: number }): Promise<IResponse> => {
  const token = localStorage.getItem('access_token');
  return await axios
    .put(`/products/${id}/disable`, null, {
      headers: {
        Authorization: 'Bearer ' + token,
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

export const enableProduct = async ({ id }: { id: number }): Promise<IResponse> => {
  const token = localStorage.getItem('access_token');
  return await axios
    .put(`/products/${id}/enable`, null, {
      headers: {
        Authorization: 'Bearer ' + token,
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

// export const UploadImage = async ({ ...payload }): Promise<IResponse | undefined> => {
//   return await axios
//     .post('/products', payload)
//     .then((res) => {
//       return res.data;
//     })
//     .catch((error: any) => {
//       console.error(error.response?.data?.message);
//       throw new Error(error.response?.data?.message);
//     });
// };
