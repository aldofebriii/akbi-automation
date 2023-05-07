import React, { useRef } from 'react';
import { Box, Divider, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

interface Props { 
    color: 'red' | 'green';
}

const useStyles = makeStyles({
    root: {
        background: (props: Props) => 
            props.color === 'red'
            ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
            : 'linear-gradient(45deg, #6F8FAF 30%, #6495ED 90%)'
    }
})

const ProsesAvg: React.FC<{}> = () => {
    const classesRed = useStyles({ color: 'red' });
    const classesBlue = useStyles({ color: 'green' });
    const begQ = useRef(null);
    const recQ = useRef(null);
    const periodQ = useRef(null);
    const transferredQ = useRef(null);
    const endQ = useRef(null);

    const materialP = useRef(null);
    const laborP = useRef(null);
    const overheadP = useRef(null);

    const materialC = useRef(null);
    const laborC = useRef(null);
    const overheadC = useRef(null);

    const duringMaterialC = useRef(null);
    const duringLaborC = useRef(null);
    const duringOverheadC = useRef(null);

    return <>
        <Grid container spacing={0} sx={{minHeight: '100vh', marginTop: 0}} alignContent='center' justifyContent='center'>
            <Box>
                <Typography variant='h4' component='h4'>
                    Quantity Schedule
                </Typography>
                <Box component='form'>
                    <Grid container spacing={2} sx={{marginTop: 0}}>
                        <Grid item md={3}>
                            <TextField type='number' color='primary' ref={begQ} id='beg-q' label='Beginning' InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} fullWidth ></TextField>
                        </Grid>
                        <Grid item md={3}>
                            <TextField ref={recQ} type='number'  id='rec-q' label='Received' fullWidth InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} ></TextField>
                        </Grid>
                        <Grid item md={3}>
                            <TextField ref={periodQ} type='number'  id='period-q' label='Added' fullWidth InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} ></TextField>
                        </Grid>
                        <Grid item md={3}>
                            <TextField ref={periodQ} type='number'  id='balance1-q' fullWidth InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} disabled className={classesRed.root} ></TextField>
                        </Grid>
                        <Grid item md={4.5}>
                            <TextField ref={transferredQ} type='number' id='transferred-q' label='Transferred' InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} fullWidth></TextField>
                            </Grid>
                        <Grid item md={4.5}>
                            <TextField ref={endQ} type='number' id='end-q' label='Ended' InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} fullWidth></TextField>
                        </Grid>
                        <Grid item md={3}>
                            <TextField  type='number' id='balance2-q'fullWidth InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} disabled className={classesBlue.root}></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField ref={materialP} type='number' id='material-p' label='Finisihed Material Percentage' InputProps={{startAdornment: <InputAdornment position='start'>%</InputAdornment>}} fullWidth></TextField>
                            </Grid>
                        <Grid item xs={4}>
                            <TextField ref={laborP} type='number' id='labor-p' label='Finisihed Labor Percentage' InputProps={{startAdornment: <InputAdornment position='start'>%</InputAdornment>}} fullWidth></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField ref={overheadP} type='number' id='overhead-p' label='Finished Overhead Percentage' InputProps={{startAdornment: <InputAdornment position='start'>%</InputAdornment>}} fullWidth></TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h4' component='h4'>
                                Cost Charged To Deparment
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField type='number' color='primary' ref={materialC} id='d-mat-c' label='Beginning Material' InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} fullWidth ></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField ref={laborC} type='number'  id='d-lab-c' label='Beginning Labor' fullWidth InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} ></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField ref={overheadC} type='number'  id='d-overhead-c' label='Beginning Overhead' fullWidth InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} ></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField type='number' color='primary' ref={materialC} id='d-mat-c' label='Added Material' InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} fullWidth ></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField ref={laborC} type='number'  id='d-lab-c' label='Added Labor' fullWidth InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} ></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField ref={overheadC} type='number'  id='d-overhead-c' label='Added Overhead' fullWidth InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} ></TextField>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Grid>
    </>
};

export default ProsesAvg;