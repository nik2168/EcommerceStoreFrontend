

export const useSearchFilter= (query, obj) => {
       const result = obj.filter((i) => {
        const name = i.name
        let j = 0;
        let flag = true;

        while(j < query.length && j < name.length){
            if(query[j].toLowerCase() != name[j].toLowerCase()){
              flag = false
              break;
            }
            j++;
        }
        if(flag) return i;
        return; 
       })
    return result
}
