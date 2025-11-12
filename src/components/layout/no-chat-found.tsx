import { motion } from 'framer-motion';
import { IconMessageOff } from '@tabler/icons-react';

export function NoChatFound() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}>
      <div className="p-4 bg-muted rounded-full mb-4">
        <IconMessageOff size={48} className="text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold mb-2">No chat found</h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-4">
        The chat you’re trying to open doesn’t exist or has been deleted. Please
        select another chat or start a new one.
      </p>
    </motion.div>
  );
}
