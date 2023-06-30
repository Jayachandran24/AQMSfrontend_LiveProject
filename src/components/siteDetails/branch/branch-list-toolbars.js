import {
  Box,
  Typography,
} from '@mui/material';

import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export function BranchListToolbar(props) {
  return (
    <Box 
    className='mt-6 sm:mt-0 '
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        // height: '6vh',
        // minHeight: '60px'
      }}
    >
      <Typography
        sx={{
          m: 1,
          fontSize: '16px',
          fontFamily: 'customfont',
          fontWeight: '600',
          letterSpacing: '1px',
          color: '#8f8f8f'
        }}
        variant="h5"
      >
        Branch
      </Typography>
      {props.userAccess.add && (
        <Box
          sx={{ m: 1 }}
          onClick={() => {
            props.setIsAddButton(true);
            props.setEditData([]);
            props.setOpen(true);
          }}
        >
          <Stack direction="row" spacing={2}>
            <Fab 
              style={{
                background: 'rgb(19 60 129)'
              }}
              sx={{
                height: '0',
                width:'100%',
                color: 'white',
                padding: "10px 15px",
                fontSize: '13px',
                borderRadius: '10px',
                fontWeight: '600',
                fontFamily: 'customfont',
                letterSpacing: '1px',
                boxShadow: 'none',
                float: 'right'
              }}>
              <AddIcon sx={{ mr: 1 }} />
              Add Branch
            </Fab>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
