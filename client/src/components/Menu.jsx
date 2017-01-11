import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import Auth from '../../../modules/Auth';

const Menu = () => (
	<div className="menu-container float-left">
		<ul className="top nav nav-pills nav-stacked">
			<li>
				<Link to='/category/5863f68da5a1ac0ecc852111'>People</Link>
				<ul className="sub1 nav nav-pills nav-stacked">
					<li>
						<Link to='/category/5863f68da5a1ac0ecc852112'>Classical</Link>
						<ul className="sub2 nav nav-pills nav-stacked">
							<li><Link to='/category/5863f68da5a1ac0ecc852113'>Face</Link></li>
							<li><Link to='/category/5863f68da5a1ac0ecc852114'>Figure</Link></li>
						</ul>
					</li>
				</ul>
			</li>
		</ul>
		<ul className="top nav nav-pills nav-stacked">
			<li>
				<Link to='/category/587481cd31645f0854cf53d8'>Environment</Link>
				<ul className="sub1 nav nav-pills nav-stacked">
					<li>
						<Link to='/category/587481cd31645f0854cf53d9'>Landscape</Link>
						<ul className="sub2 nav nav-pills nav-stacked">
							<li><Link to='/category/587481cd31645f0854cf5310'>Flower</Link></li>
						</ul>
					</li>
				</ul>
			</li>
		</ul>
		<ul className="top nav nav-pills nav-stacked">
			<li>
				<Link to='/category/587593fd0f768613848214b4'>Mechanical</Link>
				<ul className="sub1 nav nav-pills nav-stacked">
					<li>
						<Link to='/category/587593fd0f768613848214b5'>Vehicle</Link>
					</li>
				</ul>
			</li>
		</ul>
		<ul className="top nav nav-pills nav-stacked">
			<li>
				<Link to='/category/5874864d5f51f13320655432'>Design</Link>
				<ul className="sub1 nav nav-pills nav-stacked">
					<li>
						<Link to='/category/5874864d5f51f13320655433'>Swirls</Link>
					</li>
				</ul>
			</li>
		</ul>
	</div>
);

export default Menu;