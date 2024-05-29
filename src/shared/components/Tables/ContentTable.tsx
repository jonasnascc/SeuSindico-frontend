import React from "react";
import { CntTable, TblCol, TblHeaderCol, TblHeaderRow, TblRow, TableContainer, TblButton } from "./styles";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


export type ContentTableColumn = {
    label : string,
    propName : string,
    compositeProp ?: string,
    button ?: {
        label : string,
        onClick : any
    },
    isIndex ?: boolean,
    nullPlaceholder ?: string
}

type ContentTableProps = {
    data : any[],
    columns : ContentTableColumn[],
    search ?: string | null
}

export const ContentTable = ({data,columns, search} : ContentTableProps) => {

    const getColumnValFromData = (data:any, index:number) => {
        const column = columns[index]
        if(column.button){
            const propName = column.propName;
            if(propName && propName !== "") {
                if(propName === "*") {
                    return getTblButton(column.button, data)
                }
                else {
                    if(Object.keys(data).includes(propName))
                        return getTblButton(column.button, data[propName])
                }
            }
            
            return getTblButton(column.button)
        }

        const props = Object.keys(data)
        
        if(!props.includes(column.propName)) return "";
        
        if(column.compositeProp) {
            const obj = data[column.propName as keyof typeof data]

            if(obj === null && column.nullPlaceholder) return column.nullPlaceholder
            
            return obj[column.compositeProp]
        }
        else return data[column.propName]
    }

    const getTblButton = (button : {label:string, onClick:any}, buttonArgs ?: any) => {
        let btnFn = button.onClick
        if(buttonArgs) btnFn = () => button.onClick(buttonArgs)

        return (<TblButton type="button" onClick={btnFn}>{button.label}</TblButton>)
    }

    const getRowsFromData = (data:any) => {
        return columns.map((col, index) => (
            <TblCol key={index}>{getColumnValFromData(data, index)}</TblCol>
        ))
    }

    const filterData = (obj: any) => {
        if(!search) return true;

        const cols = columns.filter(col => col.isIndex);

        let valid = false;

        cols.forEach((col, index) => {
            let val = getColumnValFromData(obj, index)
            if(typeof val !== "object") {
                val = String(val)
                const normalizedVal = val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const normalizedSearch = search.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                if(normalizedVal.includes(normalizedSearch)) valid = true
            }
        })

        return valid;
    }

    if(data.length===0 || columns.length===0) return null;
    return (
        <TableContainer>
            <CntTable>
                <thead>
                <TblHeaderRow>
                {
                    columns.map((col, index) => (
                        <TblHeaderCol key={`${col.propName}-${index}`}>{col.label}</TblHeaderCol>
                    ))
                }
                </TblHeaderRow>
                </thead>
                <tbody>
                {
                    data.filter(obj => filterData(obj)).map((obj, index) => (
                        <TblRow key={index}>
                            {getRowsFromData(obj)}
                        </TblRow>
                    ))
                }
                </tbody>
            </CntTable>
        </TableContainer>
        
    );
}