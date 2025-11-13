import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonMessages() {
  return (
    <div className="space-y-3 py-2">
      {[...Array(6)].map((_, i) => {
        const isMe = i % 2 === 0; // alternate left/right
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: isMe ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
            <Skeleton
              className={`h-16 ${isMe ? 'w-1/3' : 'w-1/2'} rounded-2xl ${
                isMe ? 'rounded-br-none' : 'rounded-bl-none'
              }`}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
