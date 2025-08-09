import React, { useEffect } from 'react'
import styled,{ keyframes, css } from 'styled-components';
import Button from './Button';
import ButtonHover from './ButtonHover';
import { IoClose } from "react-icons/io5";
import FileButton from './FileButton';
import { LuUpload } from "react-icons/lu";
import { useTheme } from '../hooks/useTheme';

const Image = styled.img`
	width:100px;
	height:100px;
	object-fit:contain;
`

const Container = styled.div`
	display:flex; 
	height:100%;
	gap:20px;
	margin:10px;
	justify-content:space-between;
	flex-direction:column;
`
const Items = styled.ul`
		overflow-y:auto;
display:flex;
gap:10px;
flex-direction:column;

video{
	width:100px;
	height:100px;
	object-fit:contain;
}

li{
	border-bottom:1px solid ${({theme})=> theme.borderColor};
	&:hover{
		border-bottom:1px solid ${({theme})=> theme.accentColor};
	}
	display:flex;
	justify-content:space-between;
	padding:10px;
	div{
		display:flex;
		gap:10px;
	}
	ul{
		padding:0px;
		display:flex;
		flex-direction:column;
		gap:10px;
		h5{
			width:100%;
			word-wrap: break-word;
			span{
			word-wrap: wrap;
			font-weight:600;

			}
			font-size:12px;
			font-weight:500;
		}
	}
}
li:last-child{
		border-bottom:none;
	}
`

const AddFileButton = styled.div<{ fileCount: number }>`
  min-width: 180px;
  min-height: 120px;
  position: relative;
  border: 2px solid ${({theme})=> theme.borderColor};
  border-radius: 10px 10px 40px 40px;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin:0 auto;
  justify-content: center;
  font-weight: 500;
  font-size: 16px;
  color: ${({theme})=> theme.color};
  transition:0.3s all;
  ${({isFull})=> isFull && `
cursor: not-allowed;
  `}
	&:hover{
		transition:0.3s all;
		box-shadow:0px 0px 8px ${({theme})=> theme.color};
	}
  /* Слой воды */
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: ${({ fileCount }) => (Math.min(fileCount, 10) / 10) * 100}%;
    width: 100%;
    background: ${({theme})=> theme.accentColor};
    transition: height 0.5s ease;
    z-index: 0;
  }

  /* Текст поверх воды */
  span {
	font-size:40px;
    position: relative;
    z-index: 1;
  }
  h6{
	font-size:12px;
	position: absolute;
	top:5px;
	right:5px;
	z-index: 1;
	font-weight:500;
  }
`;
const AddFiles = ({documents,addFile,deleteFile}) => {
	const {themeObject} = useTheme()
  return (
	 <Container>
		<Items theme={themeObject}>
			{documents.map((d)=> {
				const url = URL.createObjectURL(d);
				const isImage = d.type.startsWith('image/');
				const isVideo = d.type.startsWith('video/');

				return<li>
					<div>
					{isImage && <Image src={url} alt={d.name} />}
					{isVideo && (<video src={url} />)}
					<ul>
					<h5>
          		  Тип файла: <span>{isImage ? 'Изображение' : isVideo ? 'Видео' : d.type}</span>
         		 </h5>
						<h5>Название файла: <span>{d.name.length > 20 ? `${d.name.slice(0,20)} ...` : d.name}</span></h5>
						<h5>Дата: <span>{new Date(d.lastModified).toLocaleDateString()}</span></h5>
					</ul>
					</div>
					<ButtonHover onClick={()=> deleteFile(d)} style={{fontSize:"30px"}}><IoClose/></ButtonHover>
					</li>
			})}
			</Items>
				<AddFileButton isFull={documents.length >= 10} theme={themeObject} fileCount={documents.length} disabled={documents.length >= 10} style={{position:'relative'}}>
					{
						documents.length !== 10 && <FileButton title='Загрузить фотографии' type='file' onChange={addFile}/>
					}
					<span>
					<LuUpload />
					</span>
					<h6>{documents.length}/10 файлов добавлено</h6></AddFileButton>
	 </Container>
  )
}

export default AddFiles
