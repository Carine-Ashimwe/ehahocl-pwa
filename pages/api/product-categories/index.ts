import axios from '../../../helpers/axios';
import { IProductCategory, IResponse } from '../../../interfaces';

export const AddProductCategories = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('product_categories', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const GetProductCategories = async () => {
  try {
    const response = await axios.get(`product_categories`);
    const data = response.data.map((item: { created_at: string | number | Date; }) => ({
      ...item,
      created_at: new Date(item.created_at).toLocaleDateString(),
    }));
    return data;
    // console.log(data)
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetProductCategorie = async () => {};

export const handleDisable = async (category: IProductCategory) => {
  try {
    const response = await axios.patch(`product_categories/${category.id}`, {
      ...category,
      is_active: false,
    }, {
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('access_token') || ''),
      },
    });
    console.log(response.data);
  } catch (error: any) {
    console.error(error.response?.data?.message);
  }
};


export const UpdateProductCategories = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`product_categories/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const DeleteProductCategorie = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`product_categories/${id}`, {
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
