"use client"
import React from 'react'
import UpdateUserForm from '../components/UpdateUserForm'
import styled from 'styled-components'

const StyledSettings = styled.div`
	display:flex;
	flex-direction:column;
	height:100%;
	align-items:center;
`

const page = () => {
	
  return (
	 <StyledSettings>
		<UpdateUserForm/>
	 </StyledSettings>
  )
}

export default page
