import React, {useEffect} from 'react';
import Layout from './Layout'
import HakAksesList from '../components/HakAksesList copy';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

const HakAkses = () => {
  return (
    <Layout>
      <HakAksesList />
    </Layout>
  )
}

export default HakAkses
