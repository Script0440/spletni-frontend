import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { FaLongArrowAltRight, FaLongArrowAltLeft } from 'react-icons/fa';
import { useTheme } from '../hooks/useTheme';

const ViewerWrapper = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  flex-direction: column;
  user-select: none;
  outline: none;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 90vw;
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const MainVideo = styled.video`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
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

interface VideosViewerProps {
  videos: { videoUrl: string; posterUrl: string }[];
  onClose: () => void;
  startCount: number;
}

const VideosViewer: React.FC<VideosViewerProps> = ({ videos, onClose, startCount }) => {
  const { themeObject } = useTheme();
  const total = videos.length;

  const [current, setCurrent] = useState(startCount);

  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, handleNext, handlePrev]);

  if (!videos?.[0]) return null;

  const currentVideo = videos[current];

  return ReactDOM.createPortal(
    <ViewerWrapper
      theme={themeObject}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'VIDEO' || target.closest('button')) return;
        onClose();
      }}
      tabIndex={0}
    >
      <VideoContainer theme={themeObject}>
        {total > 1 && (
          <>
            <Arrow theme={themeObject} position="left" onClick={handlePrev} aria-label="Previous video">
              <FaLongArrowAltLeft />
            </Arrow>
            <Arrow theme={themeObject} position="right" onClick={handleNext} aria-label="Next video">
              <FaLongArrowAltRight />
            </Arrow>
          </>
        )}

        <MainVideo
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/${currentVideo.videoUrl}`}
			 poster={currentVideo.posterUrl ? `${process.env.NEXT_PUBLIC_BASE_URL}/${currentVideo.posterUrl}` : undefined}
          controls
          autoPlay
        />
      </VideoContainer>

      {total > 1 && (
        <Counter theme={themeObject}>
          {current + 1} / {total}
        </Counter>
      )}
    </ViewerWrapper>,
    document.body
  );
};

export default VideosViewer;
