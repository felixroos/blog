import React, { Fragment } from "react"
import { Styled, css } from "theme-ui"

const Footer = ({ socialLinks }) => (
  <footer
    css={css({
      mt: 4,
      pt: 3,
    })}
  >
    © {new Date().getFullYear()}
    {` `}&bull;{` `}
    <Fragment>
      <Styled.a
        href={"https://github.com/felixroos"}
        target="_blank"
        rel="noopener noreferrer"
      >
        github
      </Styled.a>
    </Fragment>
  </footer>
)
export default Footer
