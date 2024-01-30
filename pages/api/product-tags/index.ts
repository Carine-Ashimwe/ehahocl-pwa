import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddProductTags = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/tags', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const GetProductTags = async ({...payload}) => {
  try {
    const response = await axios.get('/tags',{params:payload});
    const tags = response.data.result.map((tag: { created_at: string | number | Date; }) => ({
      ...tag,
      created_at: new Date(tag.created_at).toLocaleDateString(),
    }));
    const number_tags = response.data.number_tags
    return [tags,number_tags];
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};


export const GetProductTag = async () => {};

export const UpdateProductTags = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/tags/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const DeleteProductTag = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`/tags/${id}`, {
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
