import React, { FocusEvent, useRef, useState } from 'react';
import { Box, Button, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import { propsCOPR } from '../report/copr';
import COPR from '../report/copr';

const blurInputHandler = (
    newValue: number,
    setStateFn: (v: React.SetStateAction<number>) => void,
    value: string,
    balanceValue: number,
    nextStateFn: (v: React.SetStateAction<number>) => void
    ) => {
        let parsedValue: number;
        if(!value) {
            parsedValue = 0;
        } else {
            parsedValue = parseInt(value);
        }
        setStateFn(parsedValue);
        if(newValue !== parsedValue) {
            const updateBalanced = balanceValue - newValue;
            nextStateFn(updateBalanced);
            nextStateFn((v: number) => {
                v += parsedValue;
                return v;
            });
        };
};

type MUIInputBaseRef = HTMLDivElement & {
    children: HTMLInputElement[]
}

const ProsesAvg: React.FC<{}> = () => {
    const deptInput = useRef<MUIInputBaseRef>(null);

    const [qBal, setQBal] = useState(0);
    const [teBal, setTEBal] = useState(0);


    const [begQ, setBegQ] = useState(0);
    const begQBlurHandler = (e: FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        blurInputHandler(begQ, setBegQ, e.target.value, qBal, setQBal);
    };

    const [periodQ, setPeriodQ] = useState(0);
    const periodQBlurHandler = (e: FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        blurInputHandler(periodQ, setPeriodQ, e.target.value, qBal, setQBal);
    };

    const [transferredQ, setTransferredQ] = useState(0);
    const transferredQBlurHandler = (e: FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        blurInputHandler(transferredQ, setTransferredQ, e.target.value, teBal, setTEBal);
    };

    const [endQ, setEndQ] = useState(0);
    const endQBlurHandler = (e: FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        blurInputHandler(endQ, setEndQ, e.target.value, teBal, setTEBal);
    };

    const materialP = useRef<MUIInputBaseRef>(null);
    const laborP = useRef<MUIInputBaseRef>(null);
    const overheadP = useRef<MUIInputBaseRef>(null);

    const materialC = useRef<MUIInputBaseRef>(null);
    const laborC = useRef<MUIInputBaseRef>(null);
    const overheadC = useRef<MUIInputBaseRef>(null);

    const materialDuringC = useRef<MUIInputBaseRef>(null);
    const laborDuringC = useRef<MUIInputBaseRef>(null);
    const overheadDuringC = useRef<MUIInputBaseRef>(null);

    const [showReport, setShowReport] = useState<{displayed: boolean, data: propsCOPR}>({
        displayed: false,
        data: {
            begDept: '',
            qSchedule: {
                b: 0,
                s: 0,
                t: 0,
                e: {
                    m: 0,
                    l: 0,
                    f: 0,
                    q: 0
                }
            },
            chargedToDepart: {
                b: {
                    m: 0,
                    l: 0,
                    f: 0
                },
                d: {
                    m: 0,
                    l: 0,
                    f: 0
                }
            }
        }
    });
    const reportBtnClickHandler = (_: React.MouseEvent<HTMLButtonElement>) => {
        const begDeptEl = deptInput.current!.children[1].children[0] as HTMLInputElement;

        const percentageM = materialP.current!.children[1].children[1] as HTMLInputElement;
        const percentageL = laborP.current!.children[1].children[1] as HTMLInputElement;
        const percentageC = overheadP.current!.children[1].children[1] as HTMLInputElement;

        const materialCEl = materialC.current!.children[1].children[1] as HTMLInputElement;
        const laborCEl = laborC.current!.children[1].children[1] as HTMLInputElement;
        const overheadCEl = overheadC.current!.children[1].children[1] as HTMLInputElement;

        const materialDuringEl = materialDuringC.current!.children[1].children[1] as HTMLInputElement;
        const laborDuringCEl = laborDuringC.current!.children[1].children[1] as HTMLInputElement;
        const overheadDuringCEl = overheadDuringC.current!.children[1].children[1] as HTMLInputElement;

        if(qBal !== teBal) { 
            alert("Pastikan Quantity-nya Balance");
            return;
        };
        setShowReport({displayed: true, data: {
            begDept: begDeptEl.value,
            qSchedule: {
                b: begQ,
                e: {
                    m: parseInt(percentageM.value),
                    l: parseInt(percentageL.value),
                    f: parseInt(percentageC.value),
                    q: endQ
                },
                s: periodQ,
                t: transferredQ,
            },
            chargedToDepart: {
                b: {
                    m: parseInt(materialCEl.value),
                    l: parseInt(laborCEl.value),
                    f: parseInt(overheadCEl.value)
                },
                d: {
                    m: parseInt(materialDuringEl.value),
                    l: parseInt(laborDuringCEl.value),
                    f: parseInt(overheadDuringCEl.value)
                }
            }
        }});
    };

    return <>
        <Grid container spacing={0} sx={{minHeight: '100vh', marginTop: 0}} alignContent='center' justifyContent='center'>
            <Box>
                <Box component='form'>
                    <Typography variant='h3' component='h3'>
                        Cost of Production Report
                    </Typography>
                    <Grid container spacing={2} sx={{marginTop: 0}}>
                        <Grid item xs={6}>
                            <TextField type='text' ref={deptInput} color='primary' id='dep-name' label='Department Awal' fullWidth></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField type='text' color='primary' id='tujuan-name' label='Deparment Tujuan' fullWidth></TextField>
                        </Grid>
                        <Grid item xs={12}>
                        <Typography variant='h4' component='h4'>
                            Quantity Schedule
                        </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField type='number' color='primary' onBlur={begQBlurHandler} id='beg-q' label='Beginning' InputProps={{startAdornment: <InputAdornment position='start'>q</InputAdornment>}} fullWidth ></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField type='number' onBlur={periodQBlurHandler} id='period-q' label='Added' fullWidth InputProps={{startAdornment: <InputAdornment position='start'>q</InputAdornment>}} ></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField id='balance1-q' value={qBal} fullWidth InputProps={{startAdornment: <InputAdornment position='start'>q</InputAdornment>}} disabled></TextField>
                        </Grid>
                        <Grid item xs={4.5}>
                            <TextField type='number' onBlur={transferredQBlurHandler} id='transferred-q' label='Transferred' InputProps={{startAdornment: <InputAdornment position='start'>q</InputAdornment>}} fullWidth></TextField>
                            </Grid>
                        <Grid item xs={4.5}>
                            <TextField type='number' onBlur={endQBlurHandler} id='end-q' label='Ended' InputProps={{startAdornment: <InputAdornment position='start'>q</InputAdornment>}} fullWidth></TextField>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField  id='balance2-q'fullWidth InputProps={{startAdornment: <InputAdornment position='start'>q</InputAdornment>}} value={teBal} disabled></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField ref={materialP} type='number' id='material-p' label='Finisihed Material' InputProps={{startAdornment: <InputAdornment position='start'>%</InputAdornment>}} fullWidth></TextField>
                            </Grid>
                        <Grid item xs={4}>
                            <TextField ref={laborP} type='number' id='labor-p' label='Finisihed Labor' InputProps={{startAdornment: <InputAdornment position='start'>%</InputAdornment>}} fullWidth></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField ref={overheadP} type='number' id='overhead-p' label='Finished Overhead' InputProps={{startAdornment: <InputAdornment position='start'>%</InputAdornment>}} fullWidth></TextField>
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
                            <TextField type='number' color='primary' ref={materialDuringC} id='d-mat-c' label='Added Material' InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} fullWidth ></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField ref={laborDuringC} type='number'  id='d-lab-c' label='Added Labor' fullWidth InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} ></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField ref={overheadDuringC} type='number'  id='d-overhead-c' label='Added Overhead' fullWidth InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} ></TextField>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Button onClick={reportBtnClickHandler} sx={{marginTop: 2}} variant='contained'color='primary' fullWidth>Calculate</Button>
        </Grid>
        {showReport.displayed && <Box id='copr-report' sx={{marginTop: 0}}>
            <COPR begDept={showReport.data.begDept} qSchedule={showReport.data.qSchedule} chargedToDepart={showReport.data.chargedToDepart}/>
        </Box>
        }
    </>
};

export default ProsesAvg;