import React, { useState, useEffect } from 'react'

const InputDebounce = props => {
  const { onChange, ...otherProps } = props

  const [inputTimeout, setInputTimeout] = useState(null)

  useEffect(() => () => clearTimeout(inputTimeout), [inputTimeout])

  const inputOnChange = value => {
    if (inputTimeout) clearTimeout(inputTimeout)
    setInputTimeout(
      setTimeout(() => {
        if (onChange) onChange(value)
      }, 1000)
    )
  }

  return (
    <input
      {...otherProps}
      onChange={e => inputOnChange(e.target.value)}
    />
  )
}

export default InputDebounce