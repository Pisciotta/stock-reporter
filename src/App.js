import './App.css';
import { useState, useEffect} from "react";
import { getAllTickers, QueryResultHTML } from "./listItems";
import { getReport, ReportHTML, ReportBar } from "./report";
import { TextField, Grid, Alert} from '@mui/material';


import { company_folder } from './constants';
import { getAlert  } from './foo';


export function MyAlert(props) {
  const [show, setShow] = useState(true);

  return <Alert severity={props.severity} key={Math.random()}>{props.children}</Alert>
};




function App() {
  const [alert, setAlert] = useState(null);
  const [tickerCategory, setTickerCategory] = useState(false);
  const [tickerName, setTickerName] = useState(false);
  const [query, setQuery] = useState(""); /* useState accepts an initial value (here an empty string)
  and returns two values: current state and a function updating the state.
  */
  const [tickers, setTickers] = useState([]);
  const [report, setReport] = useState([]);
  const [userClicked, setUserClicked] = useState(false);

  
  const [showReport, setShowReport] = useState(false);
  const [showReportBar, setShowReportBar] = useState(false);
  const [symbols, setSymbols] = useState([]);

  useEffect(()=>{
    getAllTickers().then(function(res){setTickers(res)});
  },[]); // useEffect runs the code only ONCE after component rendering

  useEffect(() => {
    setSymbols(Array.isArray(tickers) ? tickers.map((ticker, index) => (ticker.id)) : []);
  }, [tickers]);

  useEffect(() => {
    if(userClicked){
      
      if(tickerCategory && tickerCategory != company_folder){
        setAlert(getAlert(1)); 
        setShowReportBar(false);
      }else if ( tickerCategory == company_folder ) {
        setShowReportBar(true);
        getReport(tickerName).then(function(res){
          setReport(res);
          setShowReport(true);
        })
        
      }

      const timer = setTimeout(() => {
        setAlert(null);
        setUserClicked(false);
      }, 2000);
      return () => clearTimeout(timer);
    }

  }, [userClicked]);
/*
  useEffect(() => {
    

    setSymbols(Array.isArray(tickers) ? tickers.map((ticker, index) => (ticker.id)) : []);
  }, [tickers]);

  () => 
*/
  
  return (
    
      <div className="App">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7205360955855159"
     crossorigin="anonymous"></script>
        <div style={{height:"35px"}}>
          { alert && <MyAlert severity={alert.severity} key={Math.random()} >{alert.children}</MyAlert> }
        </div>
        <Grid container spacing={2} sx={{ pl: 2, pr: 2, pt: 0, pb: 0 }}  >
            
            <Grid item xs={12}>
              <TextField fullWidth margin="normal" id="outlined-basic" label="Search for ticker..." variant="outlined" size="small" onChange={(element) => setQuery(element.target.value)}/>
              <QueryResultHTML tickers={tickers}
                              query={query}
                              onRowClick={(row) => {setTickerName(row.id);
                                                    setShowReport(false);
                                                    setUserClicked(true);
                                                    setTickerCategory(row.row.folder);
                                                    
                                                    
                                                    
                                                    
                                                    
                                                    }}
                                />
            </Grid>
            
        </Grid>
        { tickerName && showReportBar ? <ReportBar tickerName={tickerName} /> : null }
        { showReport && tickerName && tickerCategory == company_folder ? <ReportHTML report={report} symbols={symbols} /> : null }

      </div>
  );
}

export default App;