import React from 'react';
import { ObjectGrid, SteedosProvider, SteedosRouter as Router } from '@steedos/builder-community/dist/builder-community.react.js';
function SteedosGridContainer(prop){
	const { objectApiName, name, columnFields, filters, sort, onChange } = prop;
	return (
		<SteedosProvider iconPath="/assets/icons">
			<Router>
				<ObjectGrid
					name={name}
					columnFields={columnFields}
					objectApiName={objectApiName}
					filters={filters}
					sort={sort}
					onChange={onChange}
				></ObjectGrid>
			</Router>
		</SteedosProvider>
	)
}

export default SteedosGridContainer;