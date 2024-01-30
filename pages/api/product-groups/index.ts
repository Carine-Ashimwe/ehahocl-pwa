import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddProductGroups = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/product_groups', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const GetProductGroups = async ({...payload}) => {
  try {
    const response = await axios.get('/product_groups',{params:payload});
    const data = response.data.result.map((item: { created_at: string | number | Date; }) => ({
      ...item,
      created_at: new Date(item.created_at).toLocaleDateString(),
    }));
    const number_groups = response.data.number_groups

    if(data != undefined){
      return [data,number_groups];
    }else{
      return response.data
    }
    // console.log(data)
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetProductGroup = async () => {};

export const UpdateProductGroups = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/product_groups/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const DeleteProductGroup = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`/product_groups/${id}`, {
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
