import { backend_server, company_folder } from './constants'
import { TextField, Grid, Button, Chip, Tooltip, Link, Alert  } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { List } from '@mui/material';
import { useState, useEffect } from "react";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


export const getReport = async (tickerName) => {
    
    return await fetch(backend_server+"report/"+tickerName).then((response) => response.json());
};

function printThumb(value){
    if(value == true){
        return <Tooltip title="True. Condition is met."><Chip color="success" label="T"/></Tooltip>
    }else if(value == false){
        return <Tooltip title="False. Condition is not met."><Chip color="error" label="F" /></Tooltip>
    }else if(value == null){
        return <Tooltip title="No data available about this condition."><Chip color="warning" label="?" /></Tooltip>
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

function StatsListItemHTML(props){
    const tot = props.props.props.report.stats[props.Index].TOT
    if(props.Index=="0"){
        var label = "for the same day of the week.";
    }else if(props.Index == "1"){
        var label = "for similar volume changes (+/- 5% tolerance)";
    }else if(props.Index == "2"){
        var label = "for the same day of the week and similar volume changes (+/- 5% tolerance)";
    }
    if(tot>0){
        return (
            <ListItem><span><Chip  size="small" label={Number(100*props.props.props.report.stats[props.Index][props.ABCD]).toFixed(2)+"%"} /> based on {tot} candles {label}</span></ListItem>
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
    //const now = new Date()
    //const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
    //const splitted = props.report.lastUpdate.split(" ");
    //const last_update = new Date(splitted[1]+" "+splitted[0]+", "+splitted[2]);

    /*
    var updateMessage = "";
    if(last_update-yesterday<0){
        if(!addRequested){
            updateMessage = <Alert severity="warning">Outdated? Ask for an <Button onClick={()=>{add_company_to_requested(props.report.id).then(function(res){setAddRequested(res.success);})}}>UPDATE</Button> to last daily close.</Alert>
        }else{
            updateMessage = <Alert severity="success">Thanks! Your request was submitted. Come back later!</Alert>
        }
    }*/

    if (Object.keys(props.report).length>0){
        return (
            
            <Grid container spacing={2} padding={2}>
                
                
                <Grid item xs={12} align="left" ><b>{props.report.id}</b>
                </Grid>
                

                
                <Grid item xs={12} align="left" ><i><Alert severity="warning">Last updated: {props.report.lastUpdate}</Alert></i>
                </Grid>
                

                
                <Grid item xs={6} align="left">
                    
                    <Grid item xs={12}>

                    <SectionTitleHTML label="Defensive Checklist" />
                        
                        <Grid item xs={12} >
                            <List>
                                {printListItem(props.report.sales)}
                                {printListItem(props.report.assets)}
                                {printListItem(props.report.debt)}
                                {printListItem(props.report.pe)}
                                {printListItem(props.report.pb)}
                                {printListItem(props.report.ncavps)}
                            </List>
                        </Grid>



                    <SectionTitleHTML label="Score" />


                        <Grid item xs={12}>
                            <List>
                                {printListItem(props.report.zScore)}
                                {printListItem(props.report.fScore)}
                            </List>
                        </Grid>


                    <SectionTitleHTML label="Prices" />


                        <Grid item xs={12} >
                            <List>
                                {printListItem(props.report.price)}
                                {printListItem(props.report.realizedPrice, "https://www.pisciottablog.com/2022/07/14/pseudo-realized-price/")}
                                {printListItem(props.report.dcf)}
                                {printListItem(props.report.graham)}
                                {printListItem(props.report.low)}
                            </List>
                        </Grid>     


                        

                    </Grid>
                    
                    
                </Grid>
                <Grid item xs={6}>
                    <SectionTitleHTML label="Statistical Analysis" />
                    <Grid item xs={12} align="left">
                        <StatsHTML props={props} /> 
                    </Grid>
                </Grid>
                
                
            </Grid>

            
    
        );
    }else{
        return null;
    }



}

export function ReportBar(props){
    //props.onClick(); // simulate click on button (removed now, but can be introduced later!)
    return (
        <Grid container spacing={2} sx={{ pl: 2, pr: 2, pt: 0, pb: 0 }}>

            <Grid item xs={12}>
            Give us a <Link target="_blank"  rel="noreferrer" href="https://docs.google.com/forms/d/e/1FAIpQLScjSStoElTDkQxaEBg5OvyVmoZRQwNg26M90DDVE5YZaQmR3Q/viewform?usp=sf_link">feedback</Link> to request new features or report problems.
            </Grid>
            

        </Grid>
    );
}
