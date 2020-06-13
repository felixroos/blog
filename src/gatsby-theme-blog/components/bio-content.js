import React, { Fragment } from 'react';
import { Styled } from 'theme-ui';

/**
 * Change the content to add your own bio
 */

export default () => (
  <Fragment>
    This is where{' '}
    <Styled.a href="https://github.com/felixroos/">felixroos</Styled.a> writes
    about music and coding and stuff that he finds interesting.{' '}
    <Styled.a href={`https://github.com/felixroos/notes/toc`}>
      Table of Contents
    </Styled.a>
    <br />
  </Fragment>
);
