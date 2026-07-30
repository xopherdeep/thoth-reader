import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThothCard } from '../../types';
import { TarotCardView } from '../TarotCardView';

interface CardGridProps {
  cards: ThothCard[];
  onSelectCard?: (card: ThothCard) => void;
  className?: string;
  gridClassName?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onSelectCard,
  className = '',
  gridClassName = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5',
}) => {
  return (
    <motion.div layout className={`grid justify-items-center ${gridClassName} ${className}`}>
      <AnimatePresence mode="popLayout">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <TarotCardView
              card={card}
              displayMode="thoth"
              size="lg"
              showDetailsOnClick={true}
              onSelect={onSelectCard ? () => onSelectCard(card) : undefined}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
