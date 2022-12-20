import { backend_server, company_folder } from './constants'
import { TextField, Grid, Button, Chip, Tooltip, Link, Alert  } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { List } from '@mui/material';
import { useState, useEffect } from "react";
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
import { TailSpin   } from 'react-loading-icons'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


export const getReport = async (tickerName) => {
    return await fetch(backend_server+"report/"+tickerName).then((response) => response.json());
};

const correlate = async(ticker1, ticker2) => {
    return await fetch(backend_server+"corr/"+ticker1+"/"+ticker2).then((response) => response.json());
};

const add_company_to_requested = async(ticker) => {
    return await fetch(backend_server+"add/requested/"+company_folder+"/"+ticker).then((response) => response.json());
};

function printThumb(value){
    if(value == true){
        return <Tooltip title="True. Condition is met."><Chip color="success" label="T"/></Tooltip>
    }else if(value == false){
        return <Tooltip title="False. Condition is not met."><Chip color="error" label="F" /></Tooltip>
    }else if(value == null){
        return <Tooltip title="No data available about this condition."><Chip color="warning" label="Unknown" /></Tooltip>
    }else{
        return <Chip  label={value+" $"} size="small"/>
    }
}

function printListItem(element, info_url=NaN){
    return (
    <ListItemButton>
            
            <ListItemText primary={element[0]} />
            { info_url ? <Link target="_blank" href={info_url}>[?]</Link> : null }
            <ListItemIcon>{printThumb(element[1])}</ListItemIcon>
    </ListItemButton>
    );
}

function printCorrelationListItems(props, nDays, onlyLast){
    if(onlyLast){
        var suffix = "Last"+onlyLast+"Days"
    }else{
        var suffix = ""
    }
    const prob = Number(100*props.corrResult["Next"+nDays+"DaysPrediction"+suffix].prob).toFixed(2)+"%";
    const downTrend = props.corrResult["Next"+nDays+"DaysPrediction"+suffix].isTrendNegative;
    var label = "Prob. "+prob;
    var icon = <ArrowUpwardIcon/>;
    var color = "success";
    var trendName = "positive";
    if(downTrend){
        label = "Prob. "+prob;
        color = "error";
        icon = <ArrowDownwardIcon/>;
        var trendName = "negative";
    }
    const tooltip=<>Next {nDays}-Candles-Trend should be {trendName} with a probability of {prob}</>;
    return (
        <ListItem>
            <Tooltip title={tooltip}>
                <div>
                <Chip label={label} icon={icon} color={color} size="small" sx={{mr:2}} />
                <i>next {nDays}-Candles-Trend</i>
                </div>
            </Tooltip>
        </ListItem>
    );
}

function CorrResultHTML(props){
    return (
        <Card variant="outlined">

                
            <CardContent>
                Based on last {props.corrResult.totCandles} daily candles:
                <List>
                    <ListItem>
                        <span>Historical probability for {props.t1} and {props.t2} to have less correlated ("similar") 5-Days-Trends is <Chip  size="small" label={Number(100*props.corrResult["5DaysCorr"].prLess).toFixed(2)+"%"} />.</span>
                    </ListItem>
                    <ListItem>According to the historical correlation with {props.t2}, next trends of {props.t1} will be:</ListItem>
                    <ListItem>
                        <List>
                        { printCorrelationListItems(props, 5, false) }
                        { printCorrelationListItems(props, 6, false) }
                        { printCorrelationListItems(props, 7, false) }
                        { printCorrelationListItems(props, 8, false) }
                        { printCorrelationListItems(props, 9, false) }
                        { printCorrelationListItems(props, 10, false) }
                        </List>
                    </ListItem>
                </List>
                Based on last 90 candles:
                <List>
                <ListItem>
                        <span>Historical probability for {props.t1} and {props.t2} to have a less correlated 5-Days-Trends is <Chip label={Number(100*props.corrResult["5DaysCorrLast90Days"].prLess).toFixed(2)+"%"} size="small" /></span>.
                    </ListItem>
                    <ListItem>According to the historical correlation with {props.t2}:</ListItem>
                    <ListItem>
                        <List>
                        { printCorrelationListItems(props, 5, 90) }
                        { printCorrelationListItems(props, 6, 90) }
                        { printCorrelationListItems(props, 7, 90) }
                        { printCorrelationListItems(props, 8, 90) }
                        { printCorrelationListItems(props, 9, 90) }
                        { printCorrelationListItems(props, 10, 90) }
                        </List>
                    </ListItem>
                </List>
            </CardContent>
        </Card>
        );
}

function StatsListItemHTML(props){
    const tot = props.props.props.report[0].stats[props.Index].TOT
    if(props.Index=="0"){
        var label = "for the same day of the week.";
    }else if(props.Index == "1"){
        var label = "for similar volume changes (+/- 5% tolerance)";
    }else if(props.Index == "2"){
        var label = "for the same day of the week and similar volume changes (+/- 5% tolerance)";
    }
    if(tot>0){
        return (
            <ListItem><span><Chip  size="small" label={Number(100*props.props.props.report[0].stats[props.Index][props.ABCD]).toFixed(2)+"%"} /> based on {tot} candles {label}</span></ListItem>
        );
    }else{
        return (
            <ListItem><span>No data available {label}</span></ListItem>
        );
    }
    
}

function StatsHTML(props){
    
    return (
        <div>
        The probability of the next daily candle to be...
        <List>
            <ListItem><Chip color="success" label="green" size="small"/>is...</ListItem>
            <StatsListItemHTML props={props} ABCD="A" Index="0"/>
            <StatsListItemHTML props={props} ABCD="A" Index="1"/>
            <StatsListItemHTML props={props} ABCD="A" Index="2"/>

         </List>
        <List>
            <ListItem><Chip color="error" label="red" size="small"/>is...</ListItem>
            <StatsListItemHTML props={props} ABCD="B" Index="0"/>
            <StatsListItemHTML props={props} ABCD="B" Index="1"/>
            <StatsListItemHTML props={props} ABCD="B" Index="2"/>
        </List>


    
        </div>
    );
}

function SectionTitleHTML(props){
    return (
    <Grid item xs={12} align="left"><Divider role="presentation"><Chip variant="outlined" label={props.label} /></Divider></Grid>
    );
}

export function ReportHTML(props){
    const [corrTicker, setCorrTicker] = useState(null);
    const [loading, setLoading] = useState(false);
    const [corrResult, setCorrResult] = useState(null);
    const [addRequested, setAddRequested] = useState(null);

    const now = new Date()
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
    const splitted = props.report[0].lastUpdate.split(" ");
    const last_update = new Date(splitted[1]+" "+splitted[0]+", "+splitted[2]);
    var updateMessage = "";
    if(last_update-yesterday<0){
        if(!addRequested){
            updateMessage = <Alert severity="warning">Outdated? Ask for an <Button onClick={()=>{add_company_to_requested(props.report[0].id).then(function(res){setAddRequested(res.success);})}}>UPDATE</Button> to last daily close.</Alert>
        }else{
            updateMessage = <Alert severity="success">Thanks! Your request was submitted. Come back later!</Alert>
        }
    }
    if (props.report.length > 0){
        return (
            
            <Grid container spacing={2} padding={2}>
                
                <Grid item xs={3}></Grid>
                <Grid item xs={6} align="left" ><b>{props.report[0].id}</b>
                </Grid>
                <Grid item xs={3}></Grid>

                <Grid item xs={3}></Grid>
                <Grid item xs={6} align="left" ><i>Last updated: {props.report[0].lastUpdate}</i>{updateMessage}
                </Grid>
                <Grid item xs={3}></Grid>

                <Grid item xs={3}></Grid>
                <Grid item xs={3} align="left">
                    
                    <Grid item xs={12}>

                    <SectionTitleHTML label="Defensive Checklist" />
                        
                        <Grid item xs={12} >
                            <List>
                                {printListItem(props.report[0].sales)}
                                {printListItem(props.report[0].assets)}
                                {printListItem(props.report[0].debt)}
                                {printListItem(props.report[0].pe)}
                                {printListItem(props.report[0].pb)}
                                {printListItem(props.report[0].ncavps)}
                            </List>
                        </Grid>



                    <SectionTitleHTML label="Score" />


                        <Grid item xs={12}>
                            <List>
                                {printListItem(props.report[0].zScore)}
                                {printListItem(props.report[0].fScore)}
                            </List>
                        </Grid>


                    <SectionTitleHTML label="Prices" />


                        <Grid item xs={12} >
                            <List>
                                {printListItem(props.report[0].price)}
                                {printListItem(props.report[0].realizedPrice, "https://www.pisciottablog.com/2022/07/14/pseudo-realized-price/")}
                                {printListItem(props.report[0].dcf)}
                                {printListItem(props.report[0].graham)}
                                {printListItem(props.report[0].low)}
                            </List>
                        </Grid>     


                        

                    </Grid>
                    
                    
                </Grid>
                <Grid item xs={3}>
                
                <SectionTitleHTML label="Correlation Analysis" />
                <Grid item xs={12} align="left">
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 1 }}>
                        <div>Correlate with</div> 
                        <Autocomplete sx={{ width: 110}} onChange={(event, value) => {setCorrTicker(value); setCorrResult(null)}} disablePortal options={props.symbols}  renderInput={(params) => <TextField {...params} label="" variant="standard" size="small"  />} />
                        { !loading && <DoubleArrowOutlinedIcon sx={{ cursor:"pointer"}} onClick={() => {setLoading(true); correlate(props.report[0].id, corrTicker).then(function(res){setCorrResult(res); setLoading(false)})} }/> }
                        { loading && <TailSpin  height="20px" fill="#3c3c3c" stroke="#4c4c4c" speed="1" fillOpacity="1" strokeOpacity="1" strokeWidth="2"/> }
                        
                    </Stack>
                </Grid>
                <Grid item xs={12} align="left">
                    { corrResult && <CorrResultHTML corrResult={corrResult} t1={props.report[0].id} t2={corrTicker} />}              
                    <br/>
                            
                </Grid>
                <SectionTitleHTML label="Statistical Analysis" />
                        <Grid item xs={12} align="left">
                        
                        <StatsHTML props={props} />
                            

                           
                        </Grid>
                </Grid>
                
                <Grid item xs={3}></Grid>




            </Grid>

            
    
        );
    }else{
        return null;
    }

    return <div>HELLO {props.report.length > 0 && props.report[0].A}</div>;

}

export function ReportBar(props){
    props.onClick(); // simulate click on button (removed now, but can be introduced later!)
    return (
        <Grid container spacing={2} sx={{ pl: 2, pr: 2, pt: 0, pb: 0 }}>
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
            Give us a <Link target="_blank"  rel="noreferrer" href="https://docs.google.com/forms/d/e/1FAIpQLScjSStoElTDkQxaEBg5OvyVmoZRQwNg26M90DDVE5YZaQmR3Q/viewform?usp=sf_link">feedback</Link> to request new features or report problems.
            </Grid>
            
            <Grid item xs={3}></Grid>
        </Grid>
    );
}
