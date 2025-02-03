import React, {useEffect} from 'react';
import Layout from './Layout'
import PasienList from '../components/PasienList'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

const PasienDaftar = () => {
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
      <PasienList />
    </Layout>
  )
}

export default PasienDaftar
