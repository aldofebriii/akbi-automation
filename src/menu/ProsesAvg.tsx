import React, { FocusEvent, useRef, useState } from 'react';
import { Box, Button, Grid, InputAdornment, TextField, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { propsCOPR } from '../report/copr';
import COPR from '../report/copr';
import PetunjukDialog from './Petunjuk';

const blurInputHandler = (
    newValue: number,
    setStateFn: (v: React.SetStateAction<number>) => void,
    value: string,
    balanceValue: number,
    nextStateFn: (v: React.SetStateAction<number>) => void
    ) => {
        let parsedValue: number;
        //Check apakah user telah mengisi
        if(!value) {
            parsedValue = 0;
        } else {
            parsedValue = parseFloat(value);
        }
        setStateFn(parsedValue); //Mengset state penyimpinan dari Q
        //Melakukan penyesuaian apabila sebelumnya sudah ada isian
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
};

const getElementFromTheMUIInput = (elementRef: React.RefObject<MUIInputBaseRef>, children: number) => {
    return elementRef.current?.children[1].children[children];
};

const ProsesAvg: React.FC<{}> = () => {

    const [petunjuk, setPetunjuk] = useState(false);

    const petunjukHandler = (e: React.MouseEvent) => {
        setPetunjuk((v: boolean) => !v);
    };
 
    const deptInput = useRef<MUIInputBaseRef>(null);
    const deptOutput = useRef<MUIInputBaseRef>(null);

    const [secondDept, setSecondDept] = useState(false);
    const [isFifo, setIsFifo] = useState(false);
    const [isScrap, setIsScrap] = useState(false);
    const [isFinalDept, setFinalDept] = useState(false);
    
    const scrapPrice = useRef<MUIInputBaseRef>(null);

    const [qBal, setQBal] = useState(0);
    const [teBal, setTEBal] = useState(0);

    const [begQ, setBegQ] = useState(0);
    const begQBlurHandler = (e: FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        blurInputHandler(begQ, setBegQ, e.target.value, qBal, setQBal);
    };

    const [recQ, setRecQ] = useState(0);
    const recQHandler = (e: FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if(secondDept) {
            blurInputHandler(recQ, setRecQ, e.target.value, qBal, setQBal);
        }
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

    const [scrapQ, setScrapQ] = useState(0);
    const scrapQBlurHandler = (e: FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        blurInputHandler(scrapQ, setScrapQ, e.target.value, teBal, setTEBal);
    };


    const begMaterialP = useRef<MUIInputBaseRef>(null);
    const begLaborP = useRef<MUIInputBaseRef>(null);
    const begOverheadP = useRef<MUIInputBaseRef>(null);

    const materialP = useRef<MUIInputBaseRef>(null);
    const laborP = useRef<MUIInputBaseRef>(null);
    const overheadP = useRef<MUIInputBaseRef>(null);
    
    const scrapMaterialP = useRef<MUIInputBaseRef>(null);
    const scrapLaborP = useRef<MUIInputBaseRef>(null);
    const scrapOverheadP = useRef<MUIInputBaseRef>(null);

    const prevC = useRef<MUIInputBaseRef>(null);
    const materialC = useRef<MUIInputBaseRef>(null);
    const laborC = useRef<MUIInputBaseRef>(null);
    const overheadC = useRef<MUIInputBaseRef>(null);

    const prevDurC = useRef<MUIInputBaseRef>(null);
    const materialDuringC = useRef<MUIInputBaseRef>(null);
    const laborDuringC = useRef<MUIInputBaseRef>(null);
    const overheadDuringC = useRef<MUIInputBaseRef>(null);

    const [showReport, setShowReport] = useState<{displayed: boolean, data: propsCOPR}>({
        displayed: false,
        data: {
            isFinalDept: {
                bool: isFinalDept,
                p: 0
            },
            isFifo: false,
            begDept: '',
            endDept: '',
            qSchedule: {
                b: {m: 0, l:0, f: 0,q: 0},
                r: 0,
                a: 0,
                t: 0,
                e: {
                    m: 0,
                    l: 0,
                    f: 0,
                    q: 0
                },
                s: {
                    m: 0,
                    l: 0,
                    f: 0,
                    q: 0
                }
            },
            chargedToDepart: {
                b: {
                    p: 0,
                    m: 0,
                    l: 0,
                    f: 0
                },
                d: {
                    p: 0,
                    m: 0,
                    l: 0,
                    f: 0
                }
            }
        }
    });

    const finalDeptChangeHandler = (e: React.ChangeEvent) => {
        if(!isScrap) { 
            setFinalDept(false);
            return;
        };
        setFinalDept((v: boolean) => !v);
    };

    const scrapChangeHandler = (e: React.ChangeEvent) => {
        //Ubah Finish
        setIsScrap((v: boolean) => !v);
        if(isScrap) {
            setFinalDept(false);
            setTEBal((v: number) => v-= scrapQ);
            setScrapQ(0);
        }
    };

    const secondChangeHandler = (e: React.ChangeEvent) => {
        setSecondDept((v: boolean) => !v);
        if(secondDept) {
            setQBal((v:number) => v-= recQ);
            setRecQ(0);
            (prevC.current!.children[1].children[1] as HTMLInputElement).value = '';
            (prevDurC.current!.children[1].children[1] as HTMLInputElement).value = '';
        }
    };

    const fifoChangeHandler = (e: React.ChangeEvent) => {
        setIsFifo((v: boolean) => !v); 
    };

    const reportBtnClickHandler = (_: React.MouseEvent<HTMLButtonElement>) => {
        const begDeptEl = getElementFromTheMUIInput(deptInput, 0) as HTMLInputElement;
        const endDeptEl = getElementFromTheMUIInput(deptOutput, 0) as HTMLInputElement;

        const scrapPriceEl = getElementFromTheMUIInput(scrapPrice, 1) as HTMLInputElement;

        const begPercentageM = getElementFromTheMUIInput(begMaterialP, 1)  as HTMLInputElement;
        const begPercentageL = getElementFromTheMUIInput(begLaborP, 1) as HTMLInputElement;
        const begPercentageF = getElementFromTheMUIInput(begOverheadP, 1) as HTMLInputElement;
        
        const percentageM = materialP.current!.children[1].children[1] as HTMLInputElement;
        const percentageL = laborP.current!.children[1].children[1] as HTMLInputElement;
        const percentageF = overheadP.current!.children[1].children[1] as HTMLInputElement;

        const scrapPercentageM = scrapMaterialP.current?.children[1].children[1] as HTMLInputElement;
        const scrapPercentageL= scrapLaborP.current?.children[1].children[1] as HTMLInputElement;
        const scrapPercentageF = scrapOverheadP.current?.children[1].children[1] as HTMLInputElement;

        const prevCEl = prevC.current?.children[1].children[1] as HTMLInputElement
        const materialCEl = materialC.current!.children[1].children[1] as HTMLInputElement;
        const laborCEl = laborC.current!.children[1].children[1] as HTMLInputElement;
        const overheadCEl = overheadC.current!.children[1].children[1] as HTMLInputElement;

        const prevDurCEl = prevDurC.current?.children[1].children[1] as HTMLInputElement;
        const materialDuringEl = materialDuringC.current!.children[1].children[1] as HTMLInputElement;
        const laborDuringCEl = laborDuringC.current!.children[1].children[1] as HTMLInputElement;
        const overheadDuringCEl = overheadDuringC.current!.children[1].children[1] as HTMLInputElement;

        if(qBal !== teBal) { 
            alert("Pastikan Quantity-nya Balance");
            return;
        };
        setShowReport({displayed: true, data: {
            isFinalDept: {
                bool: isFinalDept,
                p: isScrap && isFinalDept ? parseFloat(scrapPriceEl.value) : 0
            },
            isFifo: isFifo,
            begDept: begDeptEl.value,
            endDept: endDeptEl.value,
            qSchedule: {
                b: {
                    m: isFifo ? parseFloat(begPercentageM.value) : 100,
                    l: isFifo ? parseFloat(begPercentageL.value) : 100,
                    f: isFifo ? parseFloat(begPercentageF.value) : 100,
                    q: begQ
                },
                e: {
                    m: parseFloat(percentageM.value),
                    l: parseFloat(percentageL.value),
                    f: parseFloat(percentageF.value),
                    q: endQ
                },
                a: periodQ,
                t: transferredQ,
                r: secondDept ? recQ : 0,
                s: {
                    m: isScrap ? parseFloat(scrapPercentageM.value) : 0,
                    l: isScrap ? parseFloat(scrapPercentageL.value) : 0,
                    f: isScrap ? parseFloat(scrapPercentageF.value) : 0,
                    q: scrapQ
                }
            },
            chargedToDepart: {
                b: {
                    p: secondDept ?  parseFloat(prevCEl.value) : 0,
                    m: parseFloat(materialCEl.value),
                    l: parseFloat(laborCEl.value),
                    f: parseFloat(overheadCEl.value)
                },
                d: {
                    p: secondDept ? parseFloat(prevDurCEl.value) : 0,
                    m: parseFloat(materialDuringEl.value),
                    l: parseFloat(laborDuringCEl.value),
                    f: parseFloat(overheadDuringCEl.value)
                }
            }
        }});
    };

    return <>
        <Box marginY={10}>
            <PetunjukDialog open={petunjuk} fnHandle={petunjukHandler}/>
            <Box component='form'>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant='h3' component='h3'>
                        Cost of Production Report
                    </Typography>
                    <Button variant='outlined' size='small' onClick={petunjukHandler}>Petunjuk</Button>
                </Box>
                <FormGroup>
                    <FormControlLabel control={<Checkbox onChange={secondChangeHandler} />} label='Departmen II'/>
                    <FormControlLabel control={<Checkbox onChange={fifoChangeHandler} />} label='FIFO'/>
                    <Box display='flex' justifyContent='left'>
                        <FormControlLabel control={<Checkbox onChange={scrapChangeHandler} />} label='Scrap Goods' disabled={isFinalDept}/>
                        <FormControlLabel control={<Checkbox onChange={finalDeptChangeHandler} />} label='Final Department' disabled={!isScrap} checked={isFinalDept}/>
                        {isFinalDept && <TextField type='text' ref={scrapPrice} color='primary' id='price-rusak' label='Harga Jual Rusak' fullWidth InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}}></TextField>}
                    </Box>
                </FormGroup>
                <Grid container spacing={2} sx={{marginTop: 0}}>
                    <Grid item xs={6}>
                        <TextField type='text' ref={deptInput} color='primary' id='dep-name' label='Department Awal' fullWidth></TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField type='text' ref={deptOutput} color='primary' id='tujuan-name' label='Deparment Tujuan' fullWidth></TextField>
                    </Grid>
                    <Grid item xs={12}>
                    <Typography variant='h4' component='h4'>
                        Quantity Schedule
                    </Typography>
                    </Grid>
                    <Grid item xs={secondDept ? 3 : 4.5}>
                        <TextField type='number' color='primary' onBlur={begQBlurHandler} id='beg-q' label='Beginning' InputProps={{startAdornment: <InputAdornment position='start'>q</InputAdornment>}} fullWidth ></TextField>
                    </Grid>
                    {secondDept && <Grid item xs={3}>
                        <TextField type='number' color='primary' onBlur={recQHandler} id='rec-q' label='Received' InputProps={{startAdornment: <InputAdornment position='start'>q</InputAdornment>}} fullWidth ></TextField>
                    </Grid>}
                    <Grid item xs={secondDept ? 3 : 4.5}>
                        <TextField type='number' onBlur={periodQBlurHandler} id='period-q' label='Added' fullWidth InputProps={{startAdornment: <InputAdornment position='start'>q</InputAdornment>}} ></TextField>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField id='balance1-q' value={qBal} fullWidth InputProps={{startAdornment: <InputAdornment position='start'>q</InputAdornment>}} disabled label='Balance'></TextField>
                    </Grid>
                    <Grid item xs={isScrap ? 3 : 4.5}>
                        <TextField type='number' onBlur={transferredQBlurHandler} id='transferred-q' label='Transferred' InputProps={{startAdornment: <InputAdornment position='start'>q</InputAdornment>}} fullWidth></TextField>
                    </Grid>
                    {isScrap && <Grid item xs={3}>
                        <TextField type='number' onBlur={scrapQBlurHandler} id='scrap-q' label='Scrap' InputProps={{startAdornment: <InputAdornment position='start'>q</InputAdornment>}} fullWidth></TextField>
                    </Grid>}
                    <Grid item xs={isScrap ? 3 : 4.5}>
                        <TextField type='number' onBlur={endQBlurHandler} id='end-q' label='Ended' InputProps={{startAdornment: <InputAdornment position='start'>q</InputAdornment>}} fullWidth></TextField>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField  id='balance2-q'fullWidth InputProps={{startAdornment: <InputAdornment position='start'>q</InputAdornment>}} value={teBal} disabled label='Balance'></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='h4' component='h4'>
                            Percentage
                        </Typography>
                    </Grid>
                    {isFifo && <>
                        <Grid item xs={4}>
                            <TextField ref={begMaterialP} type='number' id='b-material-p' label='Beginning Material' InputProps={{startAdornment: <InputAdornment position='start'>%</InputAdornment>}} fullWidth></TextField>
                            </Grid>
                        <Grid item xs={4}>
                            <TextField ref={begLaborP} type='number' id='b-labor-p' label='Beginning Labor' InputProps={{startAdornment: <InputAdornment position='start'>%</InputAdornment>}} fullWidth></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField ref={begOverheadP} type='number' id='b-overhead-p' label='Beginning Overhead' InputProps={{startAdornment: <InputAdornment position='start'>%</InputAdornment>}} fullWidth></TextField>
                        </Grid>
                    </>}
                    <Grid item xs={4}>
                        <TextField ref={materialP} type='number' id='material-p' label='Finished Material' InputProps={{startAdornment: <InputAdornment position='start'>%</InputAdornment>}} fullWidth></TextField>
                        </Grid>
                    <Grid item xs={4}>
                        <TextField ref={laborP} type='number' id='labor-p' label='Finished Labor' InputProps={{startAdornment: <InputAdornment position='start'>%</InputAdornment>}} fullWidth></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField ref={overheadP} type='number' id='overhead-p' label='Finished Overhead' InputProps={{startAdornment: <InputAdornment position='start'>%</InputAdornment>}} fullWidth></TextField>
                    </Grid>
                    {isScrap && <>
                        <Grid item xs={4}>
                            <TextField ref={scrapMaterialP} type='number' id='s-material-p' label='Scrap Material' InputProps={{startAdornment: <InputAdornment position='start'>%</InputAdornment>}} fullWidth></TextField>
                            </Grid>
                        <Grid item xs={4}>
                            <TextField ref={scrapLaborP} type='number' id='s-labor-p' label='Scrap Labor' InputProps={{startAdornment: <InputAdornment position='start'>%</InputAdornment>}} fullWidth></TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField ref={scrapOverheadP} type='number' id='s-overhead-p' label='Scrap Overhead' InputProps={{startAdornment: <InputAdornment position='start'>%</InputAdornment>}} fullWidth></TextField>
                        </Grid>
                    </>}
                    <Grid item xs={12}>
                        <Typography variant='h4' component='h4'>
                            Cost Charged To Deparment
                        </Typography>
                    </Grid>
                    {secondDept &&  <>
                        <Grid item xs={6}>
                            <TextField type='number' color='primary' ref={prevC} id='b-prev-c' label='Beginning Previous Cost' InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} fullWidth ></TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField type='number' color='primary' ref={prevDurC} id='d-prev-c' label='Previous Transferred Cost' InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} fullWidth ></TextField>
                        </Grid>
                    </>}
                    <Grid item xs={4}>
                        <TextField type='number' color='primary' ref={materialC} id='b-mat-c' label='Beginning Material' InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} fullWidth ></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField ref={laborC} type='number'  id='b-lab-c' label='Beginning Labor' fullWidth InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} ></TextField>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField ref={overheadC} type='number'  id='b-overhead-c' label='Beginning Overhead' fullWidth InputProps={{startAdornment: <InputAdornment position='start'>Rp</InputAdornment>}} ></TextField>
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
            <Button onClick={reportBtnClickHandler} sx={{marginTop: 2}} variant='contained'color='primary' fullWidth>Calculate</Button>
            <Box display='block'marginTop={1.5}>
                <Typography variant='body1' textAlign='center'>
                    Made with ❤️ By A & Supported By M, C, K and E
                </Typography>
                <Typography variant='body1' textAlign='center'>
                    Find this project on <span><a href='https://github.com/aldofebriii/akbi-automation' target='_blank' rel='noreferrer'>Github</a></span>
                </Typography>
            </Box>
            {showReport.displayed && <Box id='copr-report' sx={{marginTop: 3}}>
                <COPR isFifo={isFifo} begDept={showReport.data.begDept} endDept={showReport.data.endDept} qSchedule={showReport.data.qSchedule} chargedToDepart={showReport.data.chargedToDepart} isFinalDept={showReport.data.isFinalDept}/>
            </Box>
            }
        </Box>
    </>
};

export default ProsesAvg;