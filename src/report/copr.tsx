import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

interface MLF {
    m: number,
    l: number,
    f: number
}

export interface propsCOPR {
    begDept: string;
    qSchedule: {
        b: number,
        s: number,
        t: number,
        e: MLF & {q: number}
    },
    chargedToDepart: {
        b: MLF,
        d: MLF
    }
}

const COPR: React.FC<propsCOPR> = (props) => {

    const totalQ1 = props.qSchedule.b + props.qSchedule.s;
    const totalQ2 = props.qSchedule.t + props.qSchedule.e.q;

    const totalBegCost = props.chargedToDepart.b.m + props.chargedToDepart.b.l + props.chargedToDepart.b.f;
    const totalDurCost = props.chargedToDepart.d.m + props.chargedToDepart.d.l+ props.chargedToDepart.d.f;

    const equivM = props.qSchedule.t + (props.qSchedule.e.m/100)*props.qSchedule.e.q;
    const equivL = props.qSchedule.t + (props.qSchedule.e.l/100)*props.qSchedule.e.q;
    const equivF = props.qSchedule.t + (props.qSchedule.e.f/100)*props.qSchedule.e.q;
    const totalEquiv = equivM + equivL + equivF;

    const unitcostM = (props.chargedToDepart.b.m + props.chargedToDepart.d.m)/equivM;
    const unitcostL = (props.chargedToDepart.b.l + props.chargedToDepart.d.l)/equivL;
    const unitcostF = (props.chargedToDepart.b.f + props.chargedToDepart.d.f)/equivF;
    const totalUnitcost = unitcostM + unitcostL + unitcostF;

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
                <Grid item xs={6}></Grid>
                <Grid item xs={2}>{props.qSchedule.b}</Grid>

                <Grid item xs={4}>Started in process this period</Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={2}>{props.qSchedule.s}</Grid>

                <Grid item xs={10}></Grid>
                <Grid item xs={2} sx={{borderTop: 2}}>{totalQ1}</Grid>

                <Grid item xs={4}>Transferred To Aldo Department </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={2}>{props.qSchedule.t}</Grid>

                <Grid item xs={4}>Ending Inventory</Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={2}>{props.qSchedule.e.q}</Grid>

                <Grid item xs={10}></Grid>
                <Grid item xs={2} sx={{borderTop: 2}}>{totalQ2}</Grid>

                <Grid item xs={6} borderBottom={3}><b>Cost Charged to Department</b></Grid>
                <Grid item xs={2} borderBottom={3}><b>Total Cost</b></Grid>
                <Grid item xs={2} borderBottom={3}><b>Equivalent Units</b></Grid>
                <Grid item xs={2} borderBottom={3}><b>Unit Cost</b></Grid>

                <Grid item xs={6}>Beginning Inventory:</Grid>
                <Grid item xs={6}></Grid>

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

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Material</Grid>
                <Grid item xs={2}>{props.chargedToDepart.d.m}</Grid>
                <Grid item xs={2}>{equivM}</Grid>
                <Grid item xs={2}>{unitcostM}</Grid>

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Labor</Grid>
                <Grid item xs={2}>{props.chargedToDepart.d.l}</Grid>
                <Grid item xs={2}>{equivL}</Grid>
                <Grid item xs={2}>{unitcostL}</Grid>

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Overhead</Grid>
                <Grid item xs={2}>{props.chargedToDepart.d.f}</Grid>
                <Grid item xs={2}>{equivF}</Grid>
                <Grid item xs={2}>{unitcostF}</Grid>

                <Grid item xs={6}>Total Cost Added During The Current Period </Grid>
                <Grid item xs={2} sx={{borderTop: 2}}>{totalDurCost}</Grid>
                <Grid item xs={2} sx={{borderTop: 2}}>{totalEquiv}</Grid>
                <Grid item xs={2} sx={{borderTop: 2}}>{totalUnitcost}</Grid>

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

                <Grid item xs={6}>Transferred to Assembly Deparment</Grid>
                <Grid item xs={1}>{props.qSchedule.t}</Grid>
                <Grid item xs={1}>100</Grid>
                <Grid item xs={1}>{props.qSchedule.t * 1}</Grid>
                <Grid item xs={1}>{totalUnitcost}</Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={1}>{props.qSchedule.t * totalUnitcost}</Grid>


                <Grid item xs={6}>Work In Process, Ending Inventory:</Grid>
                <Grid item xs={6}></Grid>

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Material</Grid>
                <Grid item xs={1}>{props.qSchedule.e.q}</Grid>
                <Grid item xs={1}>{props.qSchedule.e.m}</Grid>
                <Grid item xs={1}>{props.qSchedule.e.q * props.qSchedule.e.m}</Grid>
                <Grid item xs={1}>{unitcostM}</Grid>
                <Grid item xs={1}>{unitcostM * props.qSchedule.e.q * props.qSchedule.e.m}</Grid>
                <Grid item xs={1}></Grid>

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Labor</Grid>
                <Grid item xs={1}>{props.qSchedule.e.q}</Grid>
                <Grid item xs={1}>{props.qSchedule.e.l}</Grid>
                <Grid item xs={1}>{props.qSchedule.e.q * props.qSchedule.e.l}</Grid>
                <Grid item xs={1}>{unitcostL}</Grid>
                <Grid item xs={1}>{unitcostL * props.qSchedule.e.q * props.qSchedule.e.l}</Grid>
                <Grid item xs={1}></Grid>

                <Grid item xs={1}></Grid>
                <Grid item xs={5}>Overhead</Grid>
                <Grid item xs={1}>{props.qSchedule.e.q}</Grid>
                <Grid item xs={1}>{props.qSchedule.e.f}</Grid>
                <Grid item xs={1}>{props.qSchedule.e.q * props.qSchedule.e.f}</Grid>
                <Grid item xs={1}>{unitcostF}</Grid>
                <Grid item xs={1}>{unitcostF * props.qSchedule.e.q * props.qSchedule.e.f}</Grid>
                <Grid item xs={1} sx={{borderBottom: 2}}>8100</Grid>

                <Grid item xs={6}>Total Cost Accounted For</Grid>
                <Grid item xs={5}></Grid>
                <Grid item xs={1}>53600</Grid>
            </Grid>
        </Box>
    </>

};

export default COPR;