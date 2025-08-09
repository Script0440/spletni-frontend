import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{ count: number }>`
  position: relative;
  display: grid;
  cursor: pointer;
  border: 1px solid #fff;
  border-bottom: transparent;
  border-radius: 15px 15px 0px 0px;
  gap: 0px;
  width: ${({count})=> count === 1 ? "70px" : "140px"};
  height: 70px;
  &:hover {
    opacity: 50%;
  }
  overflow: hidden;
  box-sizing: border-box;

  ${({ count }) => {
    if (count === 1) return `grid-template-columns: 1fr; grid-template-rows: 1fr;`;
    if (count === 2) return `grid-template-columns: 1fr 1fr; grid-template-rows: 1fr;`;
    return `
      grid-template-columns: 2fr 1fr;
      grid-template-rows: 1fr 1fr;
      grid-template-areas:
        "main side1"
        "main side2";
    `;
  }}
`;

const ImageBox = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  video,
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const PlusOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-weight: bold;
  font-size: 28px;
  font-weight: 500;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const ImageWrapper = styled.div<{ area?: string }>`
  ${({ area }) => area && `grid-area: ${area};`}
  position: relative;
`;

interface MessageFile {
  imageUrl?: string;
  videoUrl?: string;
}

interface Props {
  documents: File[] | null;
  messageFiles: MessageFile[] | null;
  onClick: () => void;
}

const AddedFilesChat: React.FC<Props> = ({ documents, messageFiles, onClick }) => {
  const docList = Array.isArray(documents) ? documents : [];
  const msgList = Array.isArray(messageFiles) ? messageFiles : [];

  const allFiles = [...docList, ...msgList];
  if (allFiles.length === 0) return null;

  const displayFiles = allFiles.slice(0, 3);
  const remaining = allFiles.length > 3 ? allFiles.length - 3 : 0;

  return (
    <Wrapper onClick={onClick} count={displayFiles.length}>
      {displayFiles.map((file, index) => {
        const area =
          displayFiles.length === 3
            ? index === 0
              ? 'main'
              : index === 1
              ? 'side1'
              : 'side2'
            : undefined;

        // Если это File из documents
        if (file instanceof File) {
          return (
            <ImageWrapper key={`doc-${index}`} area={area}>
              {file.type.startsWith('video/') ? (
                <ImageBox>
                  <video src={URL.createObjectURL(file)} muted />
                </ImageBox>
              ) : (
                <ImageBox>
                  <img src={URL.createObjectURL(file)} alt={file.name} />
                </ImageBox>
              )}
            </ImageWrapper>
          );
        }

        // Если это объект из messageFiles
        return (
          <ImageWrapper key={`msg-${index}`} area={area}>
            {file.imageUrl ? (
              <ImageBox>
                <img src={`${process.env.NEXT_PUBLIC_BASE_URL}/${file.imageUrl}`} alt="Uploaded" />
              </ImageBox>
            ) : file.videoUrl ? (
              <ImageBox>
                <video src={`${process.env.NEXT_PUBLIC_BASE_URL}/${file.videoUrl}`} muted />
              </ImageBox>
            ) : null}
          </ImageWrapper>
        );
      })}
      {remaining > 0 && <PlusOverlay>+{remaining}</PlusOverlay>}
    </Wrapper>
  );
};

export default AddedFilesChat;
