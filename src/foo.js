
export function getAlert(id){
    if(id == 1){
        return {
        severity: 'warning',
        children: "Reports are available for Category == 'Company' only!"
      }

    }else if(id == 2){
      return {
        severity: 'info',
        children: "Symbol copied to clipboard!"
      }
    }
    return null;
}

export function filterByValue(array, string) {
    return Array.isArray(array) ? array.filter(o =>
        Object.keys(o).some(k => o[k]?.toString().toLowerCase().includes(string.toLowerCase()))) : [];
}







  
