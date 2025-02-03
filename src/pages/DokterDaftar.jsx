import React, {useEffect} from 'react';
import Layout from './Layout';
import DokteraList from '../components/DokterList';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

const DokterDaftar = () => {
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
        <DokteraList />
    </Layout>
  )
}

export default DokterDaftar
