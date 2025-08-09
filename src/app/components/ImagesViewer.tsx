import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { FaLongArrowAltRight, FaLongArrowAltLeft } from 'react-icons/fa';
import { useTheme } from '../hooks/useTheme';

const ViewerWrapper = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  flex-direction: column;
  user-select: none;
  outline: none;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 90vw;
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const MainImage = styled.img<{ scale: number }>`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transform: ${({ scale }) => `scale(${scale})`};
  transition: transform 0.15s ease-out;
  border-radius: 8px;
  user-select: none;
  display: block;
`;

const Arrow = styled.button<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  display: flex;
  ${({ position }) => (position === 'left' ? 'left: 16px;' : 'right: 16px;')}
  transform: translateY(-50%);
  background: ${({ theme }) => theme.hoverBgGray};
  opacity: 0.5;
  color: ${({ theme }) => theme.color};
  border: none;
  font-size: 32px;
  cursor: pointer;
  padding: 20px;
  border-radius: 8px;
  z-index: 1;
  transition: 0.3s all;

  &:hover {
    opacity: 1;
    ${({ position }) => (position === 'left' ? 'left: 5px;' : 'right: 5px;')}
  }
`;

const Counter = styled.div`
  margin-top: 12px;
  color: ${({ theme }) => theme.color};
  font-size: 16px;
`;

interface ImagesViewerProps {
  images: { imageUrl: string }[];
  onClose: () => void;
  startCount: number;
}

const ImagesViewer: React.FC<ImagesViewerProps> = ({ images, onClose, startCount }) => {
  const { themeObject } = useTheme();
  const total = images.length;

  const [current, setCurrent] = useState(startCount);
  const [scale, setScale] = useState(1);

  // Навигация по изображениям
  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
    setScale(1);
  }, [total]);

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
    setScale(1);
  }, [total]);

  // Обработчик колесика мыши — зум
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    let newScale = scale - e.deltaY * 0.0015;
    newScale = Math.min(Math.max(newScale, 1), 5);
    setScale(newScale);
  };

  // Клавиши Esc, стрелки
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, handleNext, handlePrev]);

  if (!images?.[0]) return null;

  return ReactDOM.createPortal(
    <ViewerWrapper
      theme={themeObject}
      onClick={(e) => {
        // Закрыть при клике вне картинки и кнопок
        const target = e.target as HTMLElement;
        if (target.tagName === 'IMG' || target.closest('button')) return;
        onClose();
      }}
      tabIndex={0}
    >
      <ImageContainer theme={themeObject} onWheel={onWheel}>
        {total > 1 && (
          <>
            <Arrow theme={themeObject} position="left" onClick={handlePrev} aria-label="Previous image">
              <FaLongArrowAltLeft />
            </Arrow>
            <Arrow theme={themeObject} position="right" onClick={handleNext} aria-label="Next image">
              <FaLongArrowAltRight />
            </Arrow>
          </>
        )}

        <MainImage
          src={`http://localhost:3001/${images[current].imageUrl}`}
          alt={`Image ${current + 1} of ${total}`}
          scale={scale}
          draggable={false}
        />
      </ImageContainer>

      {total > 1 && (
        <Counter theme={themeObject}>
          {current + 1} / {total}
        </Counter>
      )}
    </ViewerWrapper>,
    document.body
  );
};

export default ImagesViewer;
