import React from 'react';

const Body = ({ author, title, drawing, category }) => (
	<div>
		<h1>{ title }</h1>
		<h3>{ author }</h3>
		<p>{ drawing }</p>
		{ 
			category.ancestors && (category.ancestors.reverse().map(function(x) {
				return (<p>{ x.name }</p>)
			}))
		}
		<p>{ category.name }</p>
	</div>
);

export default Body;