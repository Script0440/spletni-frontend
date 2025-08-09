import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import ImagesViewer from './ImagesViewer';

interface ImagesProps {
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

const ImagesWrapper = styled.div<ImagesProps>`
  display: grid;
  gap: 8px;
  border-radius: 15px 15px 0 0;
  overflow: hidden;

  img {
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
          height: 300px;
        `;
      case 2:
        return css`
          grid-template-columns: 1fr 1fr;
          width: 600px;
          height: 300px;
        `;
      case 3:
        return css`
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 300px;
          width: 600px;
          height: 300px;
        `;
      case 4:
        return css`
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          width: 300px;
          height: 300px;
        `;
      case 5:
        return css`
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr;
          width: 600px;
          height: 300px;
        `;
      case 6:
        return css`
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, 1fr);
          width: 600px;
          height: 300px;
        `;
      case 7:
        return css`
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr;
          width: 600px;
          height: 300px;
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

const LargeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  display: block;
`;

const LargeImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const SmallImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  gap: 8px;
  height: 100%;
  overflow: hidden;
`;

const SmallImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  display: block;
`;

interface Props {
  images: { imageUrl: string }[];
}

const ImageGallery: React.FC<Props> = ({ images }) => {
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [startCount, setStartCount] = useState(0);
  const count = images.length;
  if (count === 0) return null;

  const handleImageClick = (index: number) => {
    setStartCount(index);
    setShowImageViewer(true);
  };

  const baseUrl = 'http://localhost:3001/';

  // Универсальный рендеринг для изображений
  const renderImage = (
    img: { imageUrl: string },
    index: number,
    isLarge = false
  ) => {
    const ImgComponent = isLarge ? LargeImage : SmallImage;
    return (
      <ImgComponent
        key={img.imageUrl}
        src={`${baseUrl}${img.imageUrl}`}
        alt={`Изображение ${index + 1} из галереи`}
        loading="lazy"
        onClick={() => handleImageClick(index)}
      />
    );
  };

  if (count === 2 || count === 4 || count === 6) {
    return (
      <>
        <ImagesWrapper count={count}>
          {images.map((img, i) => (
            <LargeImageWrapper key={img.imageUrl}>
              {renderImage(img, i, true)}
            </LargeImageWrapper>
          ))}
        </ImagesWrapper>
        {showImageViewer && (
          <ImagesViewer
            startCount={startCount}
            onClose={() => setShowImageViewer(false)}
            images={images}
          />
        )}
      </>
    );
  }

  if (count === 3) {
    return (
      <>
        <ImagesWrapper count={count}>
          <LargeImageWrapper>{renderImage(images[0], 0, true)}</LargeImageWrapper>
          <TwoStacked>
            {images.slice(1, 3).map((img, idx) => renderImage(img, idx + 1))}
          </TwoStacked>
        </ImagesWrapper>
        {showImageViewer && (
          <ImagesViewer
            startCount={startCount}
            onClose={() => setShowImageViewer(false)}
            images={images}
          />
        )}
      </>
    );
  }

  if (count === 5) {
    const [first, ...rest] = images;
    return (
      <>
        <ImagesWrapper count={count}>
          <LargeImageWrapper>{renderImage(first, 0, true)}</LargeImageWrapper>
          <FourGrid>{rest.map((img, idx) => renderImage(img, idx + 1))}</FourGrid>
        </ImagesWrapper>
        {showImageViewer && (
          <ImagesViewer
            startCount={startCount}
            onClose={() => setShowImageViewer(false)}
            images={images}
          />
        )}
      </>
    );
  }

  // Остальные случаи — 1 большая + грид из оставшихся (макс 9)
  const [first, ...rest] = images.slice(0, 10);
  return (
    <>
      <ImagesWrapper count={count}>
        <LargeImageWrapper>{renderImage(first, 0, true)}</LargeImageWrapper>
        <SmallImagesGrid>{rest.map((img, idx) => renderImage(img, idx + 1))}</SmallImagesGrid>
      </ImagesWrapper>
      {showImageViewer && (
        <ImagesViewer
          startCount={startCount}
          onClose={() => setShowImageViewer(false)}
          images={images}
        />
      )}
    </>
  );
};

export default ImageGallery;
