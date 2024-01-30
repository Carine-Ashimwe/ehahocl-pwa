import axios from '../../../helpers/axios';
import { IResponse, IUser } from '../../../interfaces';

export const AddUser = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post('/signup', payload)
    .then((res) => {
      return res.data;
    })
    .catch((error: any) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const GetUserProfiles = async ({ ...payload }) => {
  try {
    const response = await axios.get(`/user_profiles`,{params:payload});
    const number_users = response.data.number_users;
    const data = response.data.result.map((item: { created_at: string | number | Date, user: { active: string, approved: string } }) => ({
      ...item,
      created_at: new Date(item.created_at).toLocaleDateString(),
      active: item.user.active,
      approved: item.user.approved
    }));   

    if(data != undefined){
      return [data,number_users];
    }else{
      return response.data
    }
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};


export const GetUsers = async () => {
  try {
    const response = await axios.get(`/users/search-role/${'Employer'}`);
    return response.data;
  } catch (error) {
    throw new Error('Something went wrong.');
  }
};

export const GetUser = async () => {};

export const GetAddress = async (id: number): Promise<IUser> => {
  return await axios
    .delete(`/users/delete/${id}`, {
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
export const UpdateUser = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .patch(`/user_profiles/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const UpdateUserInfo = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .put(`/user_info/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const UpdatePassword = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .post(`/change_password`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const UpdateBusiness = async ({ ...payload }): Promise<IResponse | undefined> => {
  return await axios
    .put(`/user_businesses/${payload.id}`, payload)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error.response?.data?.message);
      throw new Error(error.response?.data?.message);
    });
};

export const DeleteUser = async (id: number): Promise<IUser> => {
  return await axios
    .delete(`/users/delete/${id}`, {
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

export const disableBusiness = async ({ id }: { id: number }): Promise<IResponse> => {
  const token = localStorage.getItem('access_token');
  return await axios
    .put(`/user_businesses/${id}/disable`, null, {
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

export const enableBusiness = async ({ id }: { id: number }): Promise<IResponse> => {
  const token = localStorage.getItem('access_token');
  return await axios
    .put(`/user_businesses/${id}/enable`, null, {
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

export const enableProfile = async ({ id }: { id: number }): Promise<IResponse> => {
  const token = localStorage.getItem('access_token');
  return await axios
    .put(`/profiles/${id}/enable`, null, {
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

export const disableProfile = async ({ id }: { id: number }): Promise<IResponse> => {
  const token = localStorage.getItem('access_token');
  return await axios
    .put(`/profiles/${id}/disable`, null, {
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

export const approveProfile = async ({ id }: { id: number }): Promise<IResponse> => {
  const token = localStorage.getItem('access_token');
  return await axios
    .put(`/profiles/${id}/approve`, null, {
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

export const disapproveProfile = async ({ id }: { id: number }): Promise<IResponse> => {
  const token = localStorage.getItem('access_token');
  return await axios
    .put(`/profiles/${id}/disapprove`, null, {
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

export const deleteProfile = async ({ id }: { id: number }): Promise<IResponse> => {
  const token = localStorage.getItem('access_token');
  return await axios
    .delete(`/profiles/${id}`, {
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
