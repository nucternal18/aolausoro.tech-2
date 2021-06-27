import Link from 'next/link';
import Image from 'next/image';
import {Layout} from '../components/layout';

const NotFoundPage = () => {
    return (
        <Layout title="Page Not Found">
            <div className="flex flex-col items-center mt-20">
                <h1 className="my-5 text-6xl">Whoops!</h1>
                <h2 className="mb-5 text-4xl text-gray-500">This page does not exist.</h2>
            </div>
        </Layout>
    )
}

export default NotFoundPage;
