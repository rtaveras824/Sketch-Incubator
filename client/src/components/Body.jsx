import React from 'react';
import { Link } from 'react-router';

const Body = ({ drawing_id, author_id, author, title, drawing, category }) => (
	<div className="drawing-container clearfix">
		<img className="img-responsive float-left" width='300px' src={ drawing.walkthruImg } />
		<div className="right-half float-left">
			<a href={ `/drawing/${ drawing_id }` }><h1>{ title }</h1></a>
			<h2>By: <Link to={ `/profile/${ author_id }` }>{ author }</Link></h2>
			<ul className="breadcrumb">
				{ 
					category.ancestors && (category.ancestors.reverse().map(function(x, i) {
						return (<li><Link key={i} to={ `/category/${ x._id }` }>{ x.name }</Link></li>)
					}))
				}

				<li><Link to={ `category/${ category._id }` }>{ category.name }</Link></li>
			</ul>
		</div>
	</div>
);

export default Body;