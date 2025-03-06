import { Metadata } from 'next';
import Account from './client';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Account',
  icons: {
    icon: '/logo.png',
  },
};

const page = () => {
  return <Account />;
};

export default page;
