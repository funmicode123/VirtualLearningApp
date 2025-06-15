import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { googleAuthThunk } from '../../../store/slices/authSlice';

const GoogleLoginButton = () => {
  const dispatch = useDispatch();

  return (
    <GoogleLogin
      onSuccess={({ credential }) => dispatch(googleAuthThunk(credential))}
      onError={() => console.log('Google login failed')}
    />
  );
};

export default GoogleLoginButton;
