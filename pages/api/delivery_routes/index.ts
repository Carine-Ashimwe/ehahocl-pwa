import axios from '../../../helpers/axios';
import { IResponse } from '../../../interfaces';

export const AddBusinessDeliveryRoutes = async ({ ...payload })=> {
  return await axios
    .post('/business_delivery_routes', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const AddRoutePackages = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/delivery_package_prices', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const GetBusinessDeliveryRoutes = async ({ ...payload }) => {
  try {
    const response = await axios.get(`/business_delivery_routes`,{params:payload});
    // return response.data;
    const delivery_routes = response.data.result
    const number_delivery_routes = response.data.number_delivery_routes

    if(delivery_routes != undefined){
      return [delivery_routes,number_delivery_routes];
    }else{
      return response.data
    }
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetDeliveryRoutes = async () => {
  try {
    const response = await axios.get(`/delivery_routes`);
    return response.data;
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetBusinessDelivery = async () => {};

export const UpdateBusinessDeliveryRoutes = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/business_delivery_routes/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const UpdateDeliveryPackages = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/delivery_package_prices/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const DeleteBusinessDelivery = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`/business_delivery_routes/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};
export const DeletRoutePackage = async (id: number): Promise<IResponse> => {
  return await axios
    .delete(`/delivery_package_prices/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};
