import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

interface MLF {
    m: number,
    l: number,
    f: number
};

type chargedToDepartDetail = {p : number} & MLF;

export interface propsCOPR {
    isFifo: boolean,
    begDept: string;
    endDept: string
    qSchedule: {
        r: number
        b: MLF & {q: number},
        s: number,
        t: number,
        e: MLF & {q: number}
    },
    chargedToDepart: {
        b: chargedToDepartDetail
        d: chargedToDepartDetail
    }
};

type jenis = 'm' | 'l' | 'f';

const calcTotalCost = (jenis: 'b' | 'd', charged: propsCOPR['chargedToDepart']) => {
    let totalCost = 0;
    for(let key in charged[jenis]) {
        totalCost += charged[jenis][key as keyof chargedToDepartDetail];
    };
    return totalCost;
};

const calcEquiv = (qs: propsCOPR['qSchedule'], jenis: jenis | 'p', tipe: 'b' | 'd', isFifo: boolean) => {
    const transferred = qs.t;
    const endPercentage = jenis === 'p' ? 1 : qs.e[jenis]/100;
    const endQuantity = qs.e.q;
    const begPercentage = jenis === 'p' ? 1 : qs.b[jenis]/100;
    const begQuantity = qs.b.q;

    let equiv;
    if(tipe === 'd') {
        equiv = transferred + endPercentage * endQuantity;
        if(isFifo) { 
            equiv -= (begPercentage * begQuantity);
        }
    } else {
        equiv = Math.round((1 - begPercentage) * begQuantity);
    };
    return equiv;
};

const calcUnitCost = (charged: propsCOPR['chargedToDepart'], jenis: jenis | 'p', isFifo: boolean, equiv: number) => {
    const unitcost = (charged.d[jenis] + (isFifo ? 0 : charged.b[jenis]))/equiv;
    return unitcost;
};

const calcWIPCost = (unitcost: number, qs: propsCOPR['qSchedule'], jenis: jenis) => {
    const wipCost = unitcost * qs.e[jenis]/100 * qs.e.q;
    return wipCost;
};

const COPR: React.FC<propsCOPR> = (props) => {
    const secondDept = Boolean(props.qSchedule.r);

    const totalQ1 = props.qSchedule.b.q + props.qSchedule.s + props.qSchedule.r;
    const totalQ2 = props.qSchedule.t + props.qSchedule.e.q;

    const totalBegCost = calcTotalCost('b', props.chargedToDepart);
    const totalDurCost = calcTotalCost('d', props.chargedToDepart);

    const begEquivM = calcEquiv(props.qSchedule, 'm', 'b', props.isFifo);
    const begEquivL = calcEquiv(props.qSchedule, 'l', 'b', props.isFifo);
    const begEquivF = calcEquiv(props.qSchedule, 'f', 'b', props.isFifo);

    const durEquivM = calcEquiv(props.qSchedule, 'm', 'd', props.isFifo);
    const durEquivL = calcEquiv(props.qSchedule, 'l', 'd', props.isFifo);
    const durEquivF = calcEquiv(props.qSchedule, 'f', 'd', props.isFifo);
    const durEquivP = calcEquiv(props.qSchedule, 'p', 'd', props.isFifo);

    const unitcostM = calcUnitCost(props.chargedToDepart, 'm', props.isFifo, durEquivM);
    const unitcostL = calcUnitCost(props.chargedToDepart, 'l', props.isFifo, durEquivL);
    const unitcostF = calcUnitCost(props.chargedToDepart, 'f', props.isFifo, durEquivF);
    //Unit Cost Prev sedikit berbeda dikarenakan hanya dibagi dengan received
    const unitcostP = secondDept ? calcUnitCost(props.chargedToDepart, 'p', props.isFifo, durEquivP) : 0;
    const totalUnitcost = unitcostM + unitcostL + unitcostF + unitcostP;

    //Cost Accumulated
    const totalCostToCompleteThisPeriod = begEquivM * unitcostM + begEquivL * unitcostL + begEquivF * unitcostF + totalBegCost;
    const qStartedAndFinished = props.qSchedule.s + props.qSchedule.r - props.qSchedule.e.q;
    const costStartedAndFinished = qStartedAndFinished * totalUnitcost;

    //Wip Ending
    const wipM = calcWIPCost(unitcostM, props.qSchedule, 'm');
    const wipL = calcWIPCost(unitcostL, props.qSchedule, 'l');
    const wipF = calcWIPCost(unitcostF, props.qSchedule, 'f');

    const totalCostAccumulatedEnding = wipM + wipL + wipF + (secondDept? props.qSchedule.e.q * unitcostP : 0);
    const totalCostAccumulated = totalCostAccumulatedEnding + (props.qSchedule.t - (props.isFifo ? props.qSchedule.b.q : 0)) * totalUnitcost + (props.isFifo ? totalCostToCompleteThisPeriod : 0) ;

    return <>
        <Box sx={{textAlign: 'center'}} id='header'>
            <Typography variant='h3'>
                {props.begDept} Deparment
            </Typography>
            <Typography variant='h3'>
                Cost Of Production Report
            </Typography>
            <Typography>
                For June, 2023
            </Typography>
        </Box>
        <Box id='q-schedule' marginBottom={2}>
            <Grid container overflow='auto'>
                <Grid item xs={4} sx={{borderBottom:2}}><b>Quantity Schedule</b></Grid>
                <Grid item xs={2} sx={{borderBottom:2}}><b>Materials</b></Grid>
                <Grid item xs={2} sx={{borderBottom:2}}><b>Labor</b></Grid>
                <Grid item xs={2} sx={{borderBottom:2}}><b>Overhead</b></Grid>
                <Grid item xs={2} sx={{borderBottom:2}}><b>Total Quantity</b></Grid>
                
                <Grid item xs={4}>Beginning Inventory</Grid>
                <Grid item xs={2}>{props.qSchedule.b.m}</Grid>
                <Grid item xs={2}>{props.qSchedule.b.l}</Grid>
                <Grid item xs={2}>{props.qSchedule.b.f}</Grid>
                <Grid item xs={2}>{props.qSchedule.b.q}</Grid>

                {secondDept&& <>
                    <Grid item xs={4}>Received From Previous Department</Grid>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={2}>{props.qSchedule.r}</Grid>
                </>
                }

                <Grid item xs={4}>Started in process this period</Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={2}>{props.qSchedule.s}</Grid>

                <Grid item xs={10}></Grid>
                <Grid item xs={2} sx={{borderTop: 2}}>{totalQ1}</Grid>

                <Grid item xs={4}>Transferred To {secondDept} Department </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={2}>{props.qSchedule.t}</Grid>

                <Grid item xs={4}>Ending Inventory</Grid>
                <Grid item xs={2}>{props.qSchedule.e.m}</Grid>
                <Grid item xs={2}>{props.qSchedule.e.l}</Grid>
                <Grid item xs={2}>{props.qSchedule.e.f}</Grid>
                <Grid item xs={2}>{props.qSchedule.e.q}</Grid>

                <Grid item xs={10}></Grid>
                <Grid item xs={2} sx={{borderTop: 2}}>{totalQ2}</Grid>

                <Grid item xs={6} borderBottom={3}><b>Cost Charged to Department</b></Grid>
                <Grid item xs={2} borderBottom={3}><b>Total Cost</b></Grid>
                <Grid item xs={2} borderBottom={3}><b>Equivalent Units</b></Grid>
                <Grid item xs={2} borderBottom={3}><b>Unit Cost</b></Grid>

                <Grid item xs={6}>Beginning Inventory:</Grid>
                <Grid item xs={6}></Grid>

                {secondDept && <>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={5}>Cost From Prev Dept.</Grid>
                    <Grid item xs={2}>{props.chargedToDepart.b.p}</Grid>
                    <Grid item xs={4}></Grid>
                </>
                }

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Material</Grid>
                <Grid item xs={2}>{props.chargedToDepart.b.m}</Grid>
                <Grid item xs={4}></Grid>

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Labor</Grid>
                <Grid item xs={2}>{props.chargedToDepart.b.l}</Grid>
                <Grid item xs={4}></Grid>

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Overhead</Grid>
                <Grid item xs={2}>{props.chargedToDepart.b.f}</Grid>
                <Grid item xs={4}></Grid>

                <Grid item xs={6}>Total Cost Beginning Inventory </Grid>
                <Grid item xs={2} sx={{borderTop: 2}}>{totalBegCost}</Grid>
                <Grid item xs={4}></Grid>

                <Grid item xs={6}>Cost Added During The Current Period: </Grid>
                <Grid item xs={6}></Grid>

                {secondDept && <>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={5}>Cost From Prev Dept.</Grid>
                    <Grid item xs={2}>{props.chargedToDepart.d.p}</Grid>
                    <Grid item xs={2}>{durEquivP}</Grid>
                    <Grid item xs={2}>{unitcostP}</Grid>
                </>
                }

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Material</Grid>
                <Grid item xs={2}>{props.chargedToDepart.d.m}</Grid>
                <Grid item xs={2}>{durEquivM}</Grid>
                <Grid item xs={2}>{unitcostM}</Grid>

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Labor</Grid>
                <Grid item xs={2}>{props.chargedToDepart.d.l}</Grid>
                <Grid item xs={2}>{durEquivL}</Grid>
                <Grid item xs={2}>{unitcostL}</Grid>

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Overhead</Grid>
                <Grid item xs={2}>{props.chargedToDepart.d.f}</Grid>
                <Grid item xs={2}>{durEquivF}</Grid>
                <Grid item xs={2}>{unitcostF}</Grid>

                <Grid item xs={6}>Total Cost Added During The Current Period </Grid>
                <Grid item xs={2} sx={{borderTop: 2}}>{totalDurCost}</Grid>
                <Grid item xs={2} sx={{borderTop: 2}}></Grid>
                <Grid item xs={2} sx={{borderTop: 2}}>{totalUnitcost.toFixed(2)}</Grid>

                <Grid item xs={6} marginTop={1.5}><b>Total Cost Charged To The Department </b></Grid>
                <Grid item xs={2} sx={{borderTop: 2}} marginTop={1.5} >{totalBegCost + totalDurCost}</Grid>
                <Grid item xs={4} marginTop={1.5}></Grid>

                <Grid item xs={6} borderBottom={3} sx={{marginTop: 1.5}}><b>Cost Accounted for as Follows</b></Grid>
                <Grid item xs={1} borderBottom={3} sx={{marginTop: 1.5}}><b>Units</b></Grid>
                <Grid item xs={1} borderBottom={3} sx={{marginTop: 1.5}}><b>% Comp.</b></Grid>
                <Grid item xs={1} borderBottom={3} sx={{marginTop: 1.5}}><b>Equiv Units</b></Grid>
                <Grid item xs={1} borderBottom={3} sx={{marginTop: 1.5}}><b>Unit Cost</b></Grid>
                <Grid item xs={1} borderBottom={3} sx={{marginTop: 1.5}}></Grid>
                <Grid item xs={1} borderBottom={3} sx={{marginTop: 1.5}}><b>Total Cost</b></Grid>

                <Grid item xs={6}>Transferred to {secondDept} Deparment</Grid>
                {!props.isFifo && <>
                    <Grid item xs={1}>{props.qSchedule.t}</Grid>
                    <Grid item xs={1}>100</Grid>
                    <Grid item xs={1}>{props.qSchedule.t}</Grid>
                    <Grid item xs={1}>{totalUnitcost.toFixed(2)}</Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={1}>{Math.round(props.qSchedule.t * totalUnitcost)}</Grid>
                </>}

                {props.isFifo && <>
                    <Grid item xs={6}></Grid>

                    <Grid item xs={1}></Grid>
                    <Grid item xs={5}>1. From Beginning Inventory</Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={1}>{totalBegCost}</Grid>
                    <Grid item xs={1}></Grid>

                    <Grid item xs={1}></Grid>
                    <Grid item xs={4}>2. Cost To Finish From Beginning</Grid>
                    <Grid item xs={6}></Grid>


                    <Grid item xs={2}></Grid>
                    <Grid item xs={4}>Material</Grid>
                    <Grid item xs={1}>{props.qSchedule.b.q}</Grid>
                    <Grid item xs={1}>{100 - props.qSchedule.b.m}</Grid>
                    <Grid item xs={1}>{begEquivM}</Grid>
                    <Grid item xs={1}>{unitcostM}</Grid>
                    <Grid item xs={1}>{begEquivM * unitcostM}</Grid>
                    <Grid item xs={1}></Grid>


                    <Grid item xs={2}></Grid>
                    <Grid item xs={4}>Labor</Grid>
                    <Grid item xs={1}>{props.qSchedule.b.q}</Grid>
                    <Grid item xs={1}>{100 - props.qSchedule.b.l}</Grid>
                    <Grid item xs={1}>{begEquivL}</Grid>
                    <Grid item xs={1}>{unitcostL}</Grid>
                    <Grid item xs={1}>{begEquivL * unitcostL}</Grid>
                    <Grid item xs={1}></Grid>


                    <Grid item xs={2}></Grid>
                    <Grid item xs={4}>Overhead</Grid>
                    <Grid item xs={1}>{props.qSchedule.b.q}</Grid>
                    <Grid item xs={1}>{100 - props.qSchedule.b.f}</Grid>
                    <Grid item xs={1}>{begEquivF}</Grid>
                    <Grid item xs={1}>{unitcostF}</Grid>
                    <Grid item xs={1}>{begEquivF * unitcostF}</Grid>
                    <Grid item xs={1} sx={{borderBottom: 2}}>{totalCostToCompleteThisPeriod}</Grid>

                    <Grid item xs={1}></Grid>
                    <Grid item xs={5}>3. Started and Completed This Period</Grid>
                    <Grid item xs={1}>{qStartedAndFinished}</Grid>
                    <Grid item xs={1}>{100}</Grid>
                    <Grid item xs={1}>{qStartedAndFinished}</Grid>
                    <Grid item xs={1}>{totalUnitcost}</Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={1} sx={{borderBottom: 2}}>{costStartedAndFinished}</Grid>

                    <Grid item xs={6}>Total cost transferred to </Grid>
                    <Grid item xs={5}></Grid>
                    <Grid item xs={1}>{totalCostToCompleteThisPeriod + costStartedAndFinished}</Grid>
                </>}

                <Grid item xs={6}>Work In Process, Ending Inventory:</Grid>
                <Grid item xs={6}></Grid>

                {secondDept && <>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={5}>Cost From Prev Dept.</Grid>
                    <Grid item xs={1}>{props.qSchedule.e.q}</Grid>
                    <Grid item xs={1}>100</Grid>
                    <Grid item xs={1}>{props.qSchedule.e.q}</Grid>
                    <Grid item xs={1}>{unitcostP}</Grid>
                    <Grid item xs={1}>{Math.round(unitcostP * props.qSchedule.e.q)}</Grid>
                    <Grid item xs={1}></Grid>
                </>}

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Material</Grid>
                <Grid item xs={1}>{props.qSchedule.e.q}</Grid>
                <Grid item xs={1}>{props.qSchedule.e.m}</Grid>
                <Grid item xs={1}>{props.qSchedule.e.q * props.qSchedule.e.m/100}</Grid>
                <Grid item xs={1}>{unitcostM}</Grid>
                <Grid item xs={1}>{Math.round(unitcostM * props.qSchedule.e.q * props.qSchedule.e.m/100)}</Grid>
                <Grid item xs={1}></Grid>

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Labor</Grid>
                <Grid item xs={1}>{props.qSchedule.e.q}</Grid>
                <Grid item xs={1}>{props.qSchedule.e.l}</Grid>
                <Grid item xs={1}>{props.qSchedule.e.q * props.qSchedule.e.l/100}</Grid>
                <Grid item xs={1}>{unitcostL}</Grid>
                <Grid item xs={1}>{Math.round(unitcostL * props.qSchedule.e.q * props.qSchedule.e.l/100)}</Grid>
                <Grid item xs={1}></Grid>

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Overhead</Grid>
                <Grid item xs={1}>{props.qSchedule.e.q}</Grid>
                <Grid item xs={1}>{props.qSchedule.e.f}</Grid>
                <Grid item xs={1}>{props.qSchedule.e.q * props.qSchedule.e.f/100}</Grid>
                <Grid item xs={1}>{unitcostF}</Grid>
                <Grid item xs={1}>{Math.round(unitcostF * props.qSchedule.e.q * props.qSchedule.e.f/100)}</Grid>
                <Grid item xs={1} sx={{borderBottom: 2}}>{Math.round(totalCostAccumulatedEnding)}</Grid>

                <Grid item xs={6}>Total Cost Accounted For</Grid>
                <Grid item xs={5}></Grid>
                <Grid item xs={1}>{Math.round(totalCostAccumulated)}</Grid>
            </Grid>
        </Box>
    </>

};

export default COPR;