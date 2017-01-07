import React from 'react';
import { Link } from 'react-router';

const Body = ({ author, title, drawing, category }) => (
	<div>
		<h1>{ title }</h1>
		<h3>{ author }</h3>
		<p>{ drawing }</p>
		{ 
			category.ancestors && (category.ancestors.reverse().map(function(x) {
				return (<Link to={ `api/${ x._id }` }>{ x.name }</Link>)
			}))
		}
		<Link to={ `api/${ category._id }` }>{ category.name }</Link>
	</div>
);

export default Body;