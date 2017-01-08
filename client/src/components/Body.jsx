import React from 'react';
import { Link } from 'react-router';

const Body = ({ drawing_id, author_id, author, title, drawing, category }) => (
	<div>
		<Link to='/login'>
			<Link to={ `/drawing/${ drawing_id }` }><h1>{ title }</h1></Link>
			<Link to={ `/profile/${ author_id }` }><h3>{ author }</h3></Link>
			<p>{ drawing }</p>
			{ 
				category.ancestors && (category.ancestors.reverse().map(function(x) {
					return (<Link to={ `/category/${ x._id }` }><button>{ x.name }</button></Link>)
				}))
			}
			<Link to={ `category/${ category._id }` }><button>{ category.name }</button></Link>
		</Link>
	</div>
);

export default Body;