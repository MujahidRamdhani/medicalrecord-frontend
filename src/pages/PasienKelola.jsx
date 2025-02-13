import React, {useEffect} from 'react';
import Layout from './Layout'
import PasienListKelola from '../components/PasienListKelola'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

const PasienKelola = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isError} = useSelector((state => state.auth));

  useEffect(()=>{
    dispatch(getMe());
  }, [dispatch]);

  useEffect(()=>{
    if(isError){
      navigate("/login")
    }
  }, [isError, navigate]);

  return (
    <Layout>
      <PasienListKelola />
    </Layout>
  )
}

export default PasienKelola
