import React from 'react'
import styled from 'styled-components'

const FileButtonStyled = styled.input`
			cursor:pointer;
			z-index:5;
			left:0;
			top:0;
			opacity:0%;
			width:100%;
			height:100%;
		position:absolute;
`

const FileButton = ({accept,multiple=false,type,onChange,title='Загрузить файлы'}:{multiple?:Boolean,accept?:string,type:string,onChange: ()=> void}) => {
  return (
	<FileButtonStyled accept={accept} multiple={multiple} title={title} type={type} onChange={onChange}/>
  )
}

export default FileButton
