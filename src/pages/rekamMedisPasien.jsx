import React, {useEffect} from 'react';
import Layout from './Layout'
import RekamMedisPasienList from '../components/rekamMedisPasienList'

const rekamMedisPasien = () => {
  return (
    <div>
    <Layout>
      <RekamMedisPasienList />
    </Layout>
    </div>
  )
}

export default rekamMedisPasien
