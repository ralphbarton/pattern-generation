import React from 'react';
import './WgTable.css';

// for colour pot preview rendering...
import CpotCellBlock from './CpotCellBlock';


function WgTable(props) {
    return (
	<table className="WgTable">
	  <thead>
	    <tr>
	      {
		  props.columns.map( (column, index) => {
		      return (
			  <th
			     key={index}
			     className={"col-"+(index+1)} >	
			    {column.name}
			  </th>);
		  })
	      }
	</tr>
	    </thead>
	    <tbody>
	    {
		props.cpotArray.map( (cpot, index) => {
		    return (
			<tr className={index === props.selectedRowIndex ? "selected" : null}
			    key={cpot.uid}
			    onClick={props.onRowSelectedChange.bind(null, index)}
			  >
			  <td className="col-1">
			    {index+1}
			  </td>
			  <td className="col-2">
			    <input className="blue-cell"
				   value={cpot.description} 
				   onChange={ event =>{ props.onCpotNameChange(index, event.target.value); }}
			      />
			      
			  </td>
			  <td className="col-3">
			    <CpotCellBlock
			       cpot={cpot}
			       nX={8}
			       nY={2}
			       />
			  </td>
			</tr>);
		})
	    }
	</tbody>
	    </table>
    );
}



export default WgTable;
