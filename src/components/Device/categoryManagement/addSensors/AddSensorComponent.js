import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import AddSensorListResult from './AddSensorListResult';

function AddSensorComponent() {
  return (
    <Container maxWidth={false} sx={{ marginTop: 0, padding: 0 }} style={{ padding: '5px'}}>
      <Grid
        sx={{ marginTop: 0, padding: 0 }}
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
      >
        <AddSensorListResult />
      </Grid>
    </Container>
  );
}

export default AddSensorComponent;
