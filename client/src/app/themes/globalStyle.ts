import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle<{ bgColor: string }>`
  body {
    background-color: ${({ bgColor }) => bgColor};
  }
`

export default GlobalStyle
