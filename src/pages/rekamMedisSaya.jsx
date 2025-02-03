import React, {useEffect} from 'react';
import Layout from './Layout'
import RekamMedisSayaList from '../components/rekamMedisSayaList';

const rekamMedisSaya = () => {
  return (
    <div>
    <Layout>
      <RekamMedisSayaList />
    </Layout>
    </div>
  )
}

export default rekamMedisSaya
