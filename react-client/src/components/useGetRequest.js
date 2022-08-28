import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();
const endpoint = 'http://localhost:7000';

const useGetRequest = (url = '', options = null) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    axios.get(`${endpoint}${url}`, { headers: { 'auth-token': cookies.get('auth-token') } })
      .then((response) => {
        setData(response.data);
        setError(null);
      })
      .catch((error) => {
        setError(error);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
    
  }, [url, options]);

  return [ data, error, loading ];
};

export default useGetRequest;
