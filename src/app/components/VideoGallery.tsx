import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import VideosViewer from './VideosViewer'; // заменили на видео-вьювер
import { FaRegCirclePlay } from "react-icons/fa6";

interface VideosProps {
  count: number;
}

const TwoStacked = styled.div`
  display: grid;
  gap: 8px;
  height: 100%;
  grid-template-rows: calc(50% - 4px) calc(50% - 4px);
`;

const FourGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  height: 100%;
`;

const VideosWrapper = styled.div<VideosProps>`
  display: grid;
  gap: 8px;
  border-radius: 15px 15px 0 0;
  overflow: hidden;

  video {
    cursor: pointer;
    &:hover {
      opacity: 0.5;
    }
  }

  ${({ count }) => {
    switch (count) {
      case 1:
        return css`
          grid-template-columns: 1fr;
          width: 300px;
          height: auto;
        `;
      case 2:
        return css`
          grid-template-columns: 1fr 1fr;
          width: 600px;
          height: auto;
        `;
      case 3:
        return css`
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 300px;
          width: 600px;
          height: auto;
        `;
      case 4:
        return css`
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          width: 300px;
          height: auto;
        `;
      case 5:
        return css`
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr;
          width: 600px;
          height: auto;
        `;
      case 6:
        return css`
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, 1fr);
          width: 600px;
          height: auto;
        `;
      case 7:
        return css`
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr;
          width: 600px;
          height: auto;
        `;
      default:
        return css`
          grid-template-columns: 2fr 1fr;
          width: 600px;
          height: 300px;
        `;
    }
  }}
`;

const LargeVideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const SmallVideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  gap: 8px;
  height: 100%;
  overflow: hidden;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  display: block;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const PlayIcon = styled(FaRegCirclePlay)`
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 32px;
  opacity:0.6;
  fill: ${({theme}) => theme.color} !important;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
`;



interface Props {
	videoUrl: string;
	type: string;
	posterUrl?: string;
 }

const VideoGallery: React.FC<Props> = ({ videos,theme }) => {
  const [showViewer, setShowViewer] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const count = videos.length;
  if (count === 0) return null;

  const baseUrl = 'http://localhost:3001/';

  const handleVideoClick = (index: number) => {
    setStartIndex(index);
    setShowViewer(true);
  };

  const renderVideo = (
	video: { videoUrl: string; type: string; posterUrl?: string },
	index: number,
	isLarge = false
 ) => {
	return (
	  <VideoContainer key={video.videoUrl}>
		 <StyledVideo
			src={`${baseUrl}${video.videoUrl}`}
			poster={video.posterUrl ? `${baseUrl}${video.posterUrl}` : undefined}
			onClick={() => handleVideoClick(index)}
			muted
			preload="metadata"
		 />
		 <PlayIcon theme={theme}/>
	  </VideoContainer>
	);
 };
 

  // Разметка по шаблонам
  if ([2, 4, 6].includes(count)) {
    return (
      <>
        <VideosWrapper count={count}>
          {videos.map((video, i) => (
            <LargeVideoWrapper key={video.videoUrl}>
              {renderVideo(video, i, true)}
            </LargeVideoWrapper>
          ))}
        </VideosWrapper>
        {showViewer && (
          <VideosViewer
            startCount={startIndex}
            onClose={() => setShowViewer(false)}
            videos={videos}
          />
        )}
      </>
    );
  }

  if (count === 3) {
    return (
      <>
        <VideosWrapper count={count}>
          <LargeVideoWrapper>{renderVideo(videos[0], 0, true)}</LargeVideoWrapper>
          <TwoStacked>
            {videos.slice(1, 3).map((video, idx) => renderVideo(video, idx + 1))}
          </TwoStacked>
        </VideosWrapper>
        {showViewer && (
          <VideosViewer
            startCount={startIndex}
            onClose={() => setShowViewer(false)}
            videos={videos}
          />
        )}
      </>
    );
  }

  if (count === 5) {
    const [first, ...rest] = videos;
    return (
      <>
        <VideosWrapper count={count}>
          <LargeVideoWrapper>{renderVideo(first, 0, true)}</LargeVideoWrapper>
          <FourGrid>{rest.map((video, idx) => renderVideo(video, idx + 1))}</FourGrid>
        </VideosWrapper>
        {showViewer && (
          <VideosViewer
            startCount={startIndex}
            onClose={() => setShowViewer(false)}
            videos={videos}
          />
        )}
      </>
    );
  }

  const [first, ...rest] = videos.slice(0, 10);
  return (
    <>
      <VideosWrapper count={count}>
        <LargeVideoWrapper>{renderVideo(first, 0, true)}</LargeVideoWrapper>
        <SmallVideosGrid>
          {rest.map((video, idx) => renderVideo(video, idx + 1))}
        </SmallVideosGrid>
      </VideosWrapper>
      {showViewer && (
        <VideosViewer
          startCount={startIndex}
          onClose={() => setShowViewer(false)}
          videos={videos}
        />
      )}
    </>
  );
};

export default VideoGallery;
