import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="relative mb-8">
        <h1 className="text-[150px] font-bold text-gray-200 dark:text-gray-800 leading-none">
          404
        </h1>
        <AlertTriangle
          size={60}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-500"
        />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Page Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      <Link to="/">
        <Button size="lg" icon={<Home size={20} />}>
          Back to Home
        </Button>
      </Link>
    </motion.div>
  );
};

export default NotFoundPage;
