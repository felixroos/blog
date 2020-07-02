import React, { useState } from 'react';
import { FormControlLabel, Checkbox, FormGroup } from '@material-ui/core';

export default function Sidebar({ checkboxes }) {
  const [state, setState] = useState<any>({});
  return (
    <FormGroup row>
      {checkboxes.map((checkbox, index) => {
        const key = `checkbox-${index}`;
        return (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={state.checkedB}
                onChange={(e) => {
                  console.log('bing');
                  setState({ ...state, [key]: e.target.checked });
                }}
                name={checkbox.value}
                color="primary"
              />
            }
            label={`${checkbox.value} (${checkbox.count})`}
          />
        );
      })}
    </FormGroup>
  );
}
