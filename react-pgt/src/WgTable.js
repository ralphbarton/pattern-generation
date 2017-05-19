import React, { Component } from 'react';
import './WgTable.css';

class WgTable extends Component {

    constructor() {
	super();
	this.state = {
	    selectedRowIndex: 0
	};
    }
    
    render() {
	return (
	      <table className="WgTable">
		<thead>
		<tr>
		{
		    this.props.columns.map( (column, index) => {
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
		    this.props.data.map( (cpot, index) => {
			return (
				<tr className={index === this.state.selectedRowIndex ? "selected" : null}
			    key={cpot.uid}
			    onClick={() => {this.setState({selectedRowIndex: index})}}>
				<td className="col-1">
				{index+1}
			    </td>
				<td className="col-2">
				<input className="blue-cell"
			    value={cpot.description} 
				/>
				
			    </td>
				<td className="col-3">
				Prev s
			    </td>
				</tr>);
		    })
		}
		</tbody>
	      </table>
	);
    }
}


export default WgTable;
