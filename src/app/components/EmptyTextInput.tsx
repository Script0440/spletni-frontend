import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

const StyledEmptyTextInput = styled.input`
  background: transparent;
  border: none;
  color: #fff;
  &:focus {
    outline: none;
  }
`

const EmptyTextInput = ({ isActive, value, onChange }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isActive])

  return (
    <StyledEmptyTextInput
      ref={inputRef}
      disabled={!isActive}
      value={value}
      onChange={onChange}
      type="text"
    />
  )
}

export default EmptyTextInput
