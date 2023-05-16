import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

interface MLF {
    m: number,
    l: number,
    f: number
};

type chargedToDepartDetail = {p : number} & MLF;

export interface propsCOPR {
    isFinalDept: {
        bool: boolean,
        p: number
    };
    isFifo: boolean;
    begDept: string;
    endDept: string;
    qSchedule: {
        r: number
        b: MLF & {q: number},
        a: number,
        t: number,
        e: MLF & {q: number},
        s: MLF & {q: number}
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

const calcEquiv = (qs: propsCOPR['qSchedule'], jenis: jenis | 'p', isFifo: boolean, spoiled: boolean) => {
    const transferred = qs.t;
    const endPercentage = jenis === 'p' ? 1 : qs.e[jenis]/100;
    const endQuantity = qs.e.q;
    const begPercentage = jenis === 'p' ? 1 : qs.b[jenis]/100;
    const begQuantity = qs.b.q;
    const spoilPercentge = jenis === 'p' ? 1 : qs.s[jenis]/100;
    const spoilQuantity = qs.s.q;

    //Rumus Dasar
    let equiv = transferred + endPercentage * endQuantity;
    //Jika Dia previous cost maka equiv setara dengan unit receieved
    if(jenis === 'p' && isFifo) {
        equiv = qs.r + (spoiled ? spoilPercentge * spoilQuantity : 0 ) ;
        return equiv;   
    };
    //Penambahan rumus jika FIFO
    if(isFifo) { 
        equiv -= (begPercentage * begQuantity);
    };
    //Penambahan akan spoiled goods
    if(spoiled) {
        equiv += spoilPercentge * spoilQuantity;
    };
    return equiv;
};

const calcUnitCost = (charged: propsCOPR['chargedToDepart'], jenis: jenis | 'p', isFifo: boolean, equiv: number) => {
    const unitcost = (charged.d[jenis] + (isFifo ? 0 : charged.b[jenis]))/equiv;
    return unitcost;
};

const calcTransferedAndEndingCost = (unitcost: number, qs: propsCOPR['qSchedule'], jenis: jenis, tipe: 'e' | 'b' | 's') => {
    const percentage = tipe === 'b' ? 1 - qs[tipe][jenis]/100 : qs[tipe][jenis]/100; 
    const wipCost = unitcost * percentage * qs[tipe].q;
    return Math.round(wipCost);
};

const COPR: React.FC<propsCOPR> = (props) => {
    //Quantity Schdule
    const secondDept = Boolean(props.qSchedule.r);
    const spoiled = Boolean(props.qSchedule.s.q);

    const totalQ1 = props.qSchedule.b.q + props.qSchedule.a + props.qSchedule.r;
    const totalQ2 = props.qSchedule.t + props.qSchedule.e.q + props.qSchedule.s.q;

    const totalBegCost = calcTotalCost('b', props.chargedToDepart);
    const totalDurCost = calcTotalCost('d', props.chargedToDepart);

    //Cost Charged
    const durEquivM = calcEquiv(props.qSchedule, 'm', props.isFifo, spoiled);
    const durEquivL = calcEquiv(props.qSchedule, 'l', props.isFifo, spoiled);
    const durEquivF = calcEquiv(props.qSchedule, 'f', props.isFifo, spoiled);
    const durEquivP = calcEquiv(props.qSchedule, 'p', props.isFifo, spoiled);

    const unitcostM = calcUnitCost(props.chargedToDepart, 'm', props.isFifo, durEquivM);
    const unitcostL = calcUnitCost(props.chargedToDepart, 'l', props.isFifo, durEquivL);
    const unitcostF = calcUnitCost(props.chargedToDepart, 'f', props.isFifo, durEquivF);
    //(*)Unit Cost Prev sedikit berbeda dikarenakan hanya dibagi dengan received
    const unitcostP = secondDept ? calcUnitCost(props.chargedToDepart, 'p', props.isFifo, durEquivP) : 0;
    const totalUnitcost = unitcostM + unitcostL + unitcostF + unitcostP;

    //Trasnferred
    let begCostM = 0;
    let begCostL = 0;
    let begCostF = 0;
    if(props.isFifo) {
        begCostM = calcTransferedAndEndingCost(unitcostM, props.qSchedule, 'm', 'b');
        begCostL = calcTransferedAndEndingCost(unitcostL, props.qSchedule, 'l', 'b');
        begCostF = calcTransferedAndEndingCost(unitcostF, props.qSchedule, 'f', 'b');
    };
    const totalCostFromBeginning = begCostM + begCostL + begCostF + totalBegCost;
    //Dimulai dan diselesaikan
    const qStartedAndFinished = props.qSchedule.t - props.qSchedule.b.q;
    const costStartedAndFinished = qStartedAndFinished * totalUnitcost;

    //Spoiled
    const spoiledCostM = calcTransferedAndEndingCost(unitcostM, props.qSchedule, 'm', 's');
    const spoiledCostL = calcTransferedAndEndingCost(unitcostL, props.qSchedule, 'l', 's');
    const spoiledCostF = calcTransferedAndEndingCost(unitcostF, props.qSchedule, 'f', 's');
    const totalSpoiledCost = spoiledCostM + spoiledCostL + spoiledCostF;
    
    //Spoiled Final Dept
    const spoiledWarehouseCost = props.qSchedule.s.q * props.isFinalDept.p;;
    const spoiledFOHCost = (totalUnitcost - props.isFinalDept.p) * props.qSchedule.s.q;

    //Wip Ending
    const wipM = calcTransferedAndEndingCost(unitcostM, props.qSchedule, 'm', 'e');
    const wipL = calcTransferedAndEndingCost(unitcostL, props.qSchedule, 'l', 'e');
    const wipF = calcTransferedAndEndingCost(unitcostF, props.qSchedule, 'f', 'e');
    const totalCostWIPEnd = wipM + wipL + wipF + (secondDept? props.qSchedule.e.q * unitcostP : 0);
    //Akhir
    const totalCostAccumulated = totalCostWIPEnd + (props.isFifo ? costStartedAndFinished + totalCostFromBeginning : props.qSchedule.t * totalUnitcost) + (spoiled ? props.isFinalDept.bool ? (spoiledWarehouseCost + spoiledFOHCost) : totalSpoiledCost : 0);

    return <>
        <Box sx={{textAlign: 'center'}} id='header'>
            <Typography variant='h3'>
                {props.begDept} Department
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

                {secondDept && <>
                    <Grid item xs={4}>Received From Previous Department</Grid>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={2}>{props.qSchedule.r}</Grid>
                </>
                }

                <Grid item xs={4}>Started in process this period</Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={2}>{props.qSchedule.a}</Grid>

                <Grid item xs={10}></Grid>
                <Grid item xs={2} sx={{borderTop: 2}}>{totalQ1}</Grid>

                <Grid item xs={4}>Transferred To {secondDept} Department </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={2}>{props.qSchedule.t}</Grid>

                {spoiled && <>
                    <Grid item xs={4}>Spoiled Units</Grid>
                    <Grid item xs={2}>{props.qSchedule.s.m}</Grid>
                    <Grid item xs={2}>{props.qSchedule.s.l}</Grid> 
                    <Grid item xs={2}>{props.qSchedule.s.f}</Grid>
                    <Grid item xs={2}>{props.qSchedule.s.q}</Grid> 
                </>}

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
                <Grid item xs={2}>{unitcostM.toFixed(2)}</Grid>

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Labor</Grid>
                <Grid item xs={2}>{props.chargedToDepart.d.l}</Grid>
                <Grid item xs={2}>{durEquivL}</Grid>
                <Grid item xs={2}>{unitcostL.toFixed(2)}</Grid>

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Overhead</Grid>
                <Grid item xs={2}>{props.chargedToDepart.d.f}</Grid>
                <Grid item xs={2}>{durEquivF}</Grid>
                <Grid item xs={2}>{unitcostF.toFixed(2)}</Grid>

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

                <Grid item xs={6}>Transferred to {secondDept} Department</Grid>
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
                    <Grid item xs={1}>{props.qSchedule.b.q * (100 - props.qSchedule.b.m)/100}</Grid>
                    <Grid item xs={1}>{unitcostM.toFixed(2)}</Grid>
                    <Grid item xs={1}>{begCostM}</Grid>
                    <Grid item xs={1}></Grid>


                    <Grid item xs={2}></Grid>
                    <Grid item xs={4}>Labor</Grid>
                    <Grid item xs={1}>{props.qSchedule.b.q}</Grid>
                    <Grid item xs={1}>{100 - props.qSchedule.b.l}</Grid>
                    <Grid item xs={1}>{props.qSchedule.b.q * (100 - props.qSchedule.b.m)/100}</Grid>
                    <Grid item xs={1}>{unitcostL.toFixed(2)}</Grid>
                    <Grid item xs={1}>{begCostL}</Grid>
                    <Grid item xs={1}></Grid>


                    <Grid item xs={2}></Grid>
                    <Grid item xs={4}>Overhead</Grid>
                    <Grid item xs={1}>{props.qSchedule.b.q}</Grid>
                    <Grid item xs={1}>{100 - props.qSchedule.b.f}</Grid>
                    <Grid item xs={1}>{props.qSchedule.b.q * (100 - props.qSchedule.b.m)/100}</Grid>
                    <Grid item xs={1}>{unitcostF}</Grid>
                    <Grid item xs={1}>{begCostF.toFixed(2)}</Grid>
                    <Grid item xs={1} sx={{borderBottom: 2}}>{totalCostFromBeginning}</Grid>

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
                    <Grid item xs={1}>{totalCostFromBeginning + costStartedAndFinished}</Grid>
                </>}

                {spoiled && !props.isFinalDept.bool && <>
                    <Grid item xs={6}>Spoiled Units</Grid>
                    <Grid item xs={6}></Grid>

                    <Grid item xs={1}></Grid>
                    <Grid item xs={5}>Material</Grid>
                    <Grid item xs={1}>{props.qSchedule.s.q}</Grid>
                    <Grid item xs={1}>{props.qSchedule.s.m}</Grid>
                    <Grid item xs={1}>{props.qSchedule.s.q * props.qSchedule.s.m/100}</Grid>
                    <Grid item xs={1}>{unitcostM}</Grid>
                    <Grid item xs={1}>{spoiledCostM}</Grid>
                    <Grid item xs={1}></Grid>


                    <Grid item xs={1}></Grid>
                    <Grid item xs={5}>Labor</Grid>
                    <Grid item xs={1}>{props.qSchedule.s.q}</Grid>
                    <Grid item xs={1}>{props.qSchedule.s.l}</Grid>
                    <Grid item xs={1}>{props.qSchedule.s.q * props.qSchedule.s.l/100}</Grid>
                    <Grid item xs={1}>{unitcostL}</Grid>
                    <Grid item xs={1}>{spoiledCostL}</Grid>
                    <Grid item xs={1}></Grid>


                    <Grid item xs={1}></Grid>
                    <Grid item xs={5}>Overhead</Grid>
                    <Grid item xs={1}>{props.qSchedule.s.q}</Grid>
                    <Grid item xs={1}>{props.qSchedule.s.f}</Grid>
                    <Grid item xs={1}>{props.qSchedule.s.q * props.qSchedule.s.f/100}</Grid>
                    <Grid item xs={1}>{unitcostF}</Grid>
                    <Grid item xs={1}>{spoiledCostF}</Grid>
                    <Grid item xs={1} borderTop={2}>{totalSpoiledCost}</Grid>
                </>
                }
                {spoiled && props.isFinalDept.bool && <>
                    <Grid item xs={6}>Move To Scrap Warehouse</Grid>
                    <Grid item xs={1}>{props.qSchedule.s.q}</Grid>
                    <Grid item xs={1}>100</Grid>
                    <Grid item xs={1}>{props.qSchedule.s.q}</Grid>
                    <Grid item xs={1}>{props.isFinalDept.p}</Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={1}>{props.isFinalDept.p * props.qSchedule.s.q}</Grid>

                    <Grid item xs={6}>Scrap Goods Into FOH</Grid>
                    <Grid item xs={6}></Grid>

                    <Grid item xs={1}></Grid>
                    <Grid item xs={5}>Scrap Cost</Grid>
                    <Grid item xs={1}>{props.qSchedule.s.q}</Grid>
                    <Grid item xs={1}>100</Grid>
                    <Grid item xs={1}>{props.qSchedule.s.q}</Grid>
                    <Grid item xs={1}>{totalUnitcost}</Grid>
                    <Grid item xs={2}></Grid>

                    <Grid item xs={1}></Grid>
                    <Grid item xs={5}>Less: Sold Value</Grid>
                    <Grid item xs={1}>{props.qSchedule.s.q}</Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={1}>{totalUnitcost}</Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={1}>{(totalUnitcost - props.isFinalDept.p) * props.qSchedule.s.q}</Grid>
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
                <Grid item xs={1}>{wipM}</Grid>
                <Grid item xs={1}></Grid>

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Labor</Grid>
                <Grid item xs={1}>{props.qSchedule.e.q}</Grid>
                <Grid item xs={1}>{props.qSchedule.e.l}</Grid>
                <Grid item xs={1}>{props.qSchedule.e.q * props.qSchedule.e.l/100}</Grid>
                <Grid item xs={1}>{unitcostL}</Grid>
                <Grid item xs={1}>{wipL}</Grid>
                <Grid item xs={1}></Grid>

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Overhead</Grid>
                <Grid item xs={1}>{props.qSchedule.e.q}</Grid>
                <Grid item xs={1}>{props.qSchedule.e.f}</Grid>
                <Grid item xs={1}>{props.qSchedule.e.q * props.qSchedule.e.f/100}</Grid>
                <Grid item xs={1}>{unitcostF}</Grid>
                <Grid item xs={1}>{wipF}</Grid>
                <Grid item xs={1} sx={{borderBottom: 2}}>{Math.round(totalCostWIPEnd)}</Grid>

                <Grid item xs={6}>Total Cost Accounted For</Grid>
                <Grid item xs={5}></Grid>
                <Grid item xs={1}>{Math.round(totalCostAccumulated)}</Grid>
            </Grid>
        </Box>
    </>

};

export default COPR;