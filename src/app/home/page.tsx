import { Metadata } from 'next';
import HomeClient from './components/HomeClient'


export const metadata: Metadata = {
  title: "Home"
};

const HomePage = () => {
  return <HomeClient />
}

export default HomePage
