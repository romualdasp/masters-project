import Cookies from 'universal-cookie';

const useAuth = () => {
  const cookies = new Cookies();
  const auth = cookies.get('auth-token');
  const authName = cookies.get('auth-name');

  function setAuth(token, name) {
    cookies.set('auth-token', token, { path: '/', maxAge: (60 * 60 * 8), sameSite: 'none', secure: true });
    cookies.set('auth-name', name, { path: '/', maxAge: (60 * 60 * 8), sameSite: 'none', secure: true });
  }

  function clearAuth() {
    if (auth) {
      cookies.remove('auth-token');
      cookies.remove('auth-name');
    }
  }

  return [auth, setAuth, clearAuth, authName];
};

export default useAuth;
