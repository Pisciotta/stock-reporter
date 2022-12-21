import { DataGrid } from '@mui/x-data-grid';
import { Box, Link, Tooltip   } from '@mui/material';
import { filterByValue } from './foo'
import { folder2category, backend_server } from './constants';

/*
export const getTickers = async () => {
    return await fetch(backend_server+"get/list/company").then((response) => response.json());
};
*/

export const getAllTickers = async () => {
    return await fetch(backend_server+"cache/search.json").then((response) => response.json());
};

export function QueryResultHTML(props){
    const matches = filterByValue(props.tickers, props.query);
    
    const columns = [
        /*
        {
            field: 'folder',
            headerName: 'Category',
            renderCell: (params) =>  (
                
                <Tooltip title={folder2category(params.value)} >
                 <span className="table-cell-trucate">{folder2category(params.value)}</span>
                 </Tooltip>
            )
            
        },*/
        {
          field: 'id',
          headerName: 'Symbol',
          description: "Symbol name of the stock",
          renderCell: (params) =>  (
            <Tooltip title={params.value} >
             <span className="table-cell-trucate" >{params.value}</span>
             </Tooltip>
          )

        },
 
        /*{
            field: 'isin',
            headerName: 'ISIN',
            renderCell: (params) =>  (
                <Tooltip title={params.value} >
                 <span className="table-cell-trucate">{params.value}</span>
                 </Tooltip>
            )
        },*/
        {
            field: 'companyName',
            headerName: 'Name',
            renderCell: (params) =>  (
                <Tooltip title={params.value}  >
                 <span className="table-cell-trucate">{params.value} </span>
                 </Tooltip>
            )
        },
        {
            field: 'industry',
            headerName: 'Industry',
            renderCell: (params) =>  (
                <Tooltip title={params.value} >
                 <span className="table-cell-trucate">{params.value}</span>
                 </Tooltip>
            )
        },
        {
            field: 'sector',
            headerName: 'Sector',
            renderCell: (params) =>  (
                <Tooltip title={params.value} >
                 <span className="table-cell-trucate">{params.value}</span>
                 </Tooltip>
            )
        },
        /*{
            field: 'ceo',
            headerName: 'CEO',
            renderCell: (params) =>  (
                <Tooltip title={params.value} >
                 <span className="table-cell-trucate">{params.value}</span>
                 </Tooltip>
            )
        },*/
        {
            field: 'fullTimeEmployees',
            headerName : "Employees",
            description : "Number of full-time employees",
            renderCell: (params) =>  (
                <Tooltip title={params.value} >
                 <span className="table-cell-trucate">{params.value}</span>
                 </Tooltip>
            )
        },
        {
            field: 'lastDiv',
            headerName: 'Last Div.',
            description: "Last issued dividend",
            renderCell: (params) =>  (
                <Tooltip title={params.value} >
                 <span className="table-cell-trucate">{params.value}</span>
                 </Tooltip>
            )
        },
        {
            field: 'mktCap',
            headerName: 'Market Cap',
            renderCell: (params) =>  (
                <Tooltip title={params.value} >
                 <span className="table-cell-trucate">{params.value}</span>
                 </Tooltip>
            )
        },
        {
            field: 'volAvg',
            headerName: 'Average Volume',
            renderCell: (params) =>  (
                <Tooltip title={params.value} >
                 <span className="table-cell-trucate">{params.value}</span>
                 </Tooltip>
            )
        },
        {
            field: 'beta',
            headerName: 'Beta',
            renderCell: (params) =>  (
                <Tooltip title={params.value} >
                 <span className="table-cell-trucate">{params.value}</span>
                 </Tooltip>
            )
        }

          
    ];

    if(matches.length > 0){
        return (
            <Box sx={{ width: '100%', cursor:"pointer" }} mb="4px">
                    <DataGrid
                      rows={matches}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      disableSelectionOnClick
                      onRowClick={props.onRowClick}
                      autoHeight={true}
                      noWrap 
                      
                    />
            </Box>
        );
    }else{
        return (
            <Box sx={{ width: '100%', cursor:"pointer" }} mb="4px">
                    Not finding what you're searching for? Click <Link target="_blank" rel="noreferrer"  href="https://docs.google.com/forms/d/e/1FAIpQLSd9kwTbP7F5KFeRosv3Vr3eSJDKGEdlpC7WWqnA9xwLBV0fvA/viewform?usp=sf_link">
                     here 
                    </Link> to request stock "{props.query}" now and come back later.
            </Box>
        
        );
    }
    
  }


