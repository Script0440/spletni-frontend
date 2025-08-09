import React, { useEffect, useRef } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const EmojiPicker = ({ onSelect, offsetX, offsetY, onClose }) => {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose?.(); // вызвать только если передан
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={pickerRef}
      style={{
        position: 'absolute',
        top: offsetY,
        right: offsetX,
        zIndex: 1000
      }}
    >
      <Picker
        data={data}
        onEmojiSelect={(emoji) => onSelect(emoji.native)}
      />
    </div>
  );
};

export default EmojiPicker;
