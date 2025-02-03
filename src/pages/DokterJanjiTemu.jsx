import React, {useEffect} from 'react';
import Layout from './Layout'
import JanjiTemuList from '../components/DokterJanjiTemuList';

const DokterJanjiTemu = () => {
  return (
    <div>
      <Layout>
        <JanjiTemuList />
      </Layout>
    </div>
  )
}

export default DokterJanjiTemu
