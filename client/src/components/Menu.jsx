import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import Auth from '../../../modules/Auth';

const Menu = () => (
		<ul>
			<li>
				<Link to='/category/5863f68da5a1ac0ecc852111'>People</Link>
				<ul>
					<li>
						<Link to='/category/5863f68da5a1ac0ecc852112'>Anatomy</Link>
						<ul>
							<li><Link to='/category/5863f68da5a1ac0ecc852113'>Face</Link></li>
							<li><Link to='/category/5863f68da5a1ac0ecc852114'>Torso</Link></li>
						</ul>
					</li>
				</ul>
			</li>
			
			
		</ul>
);

export default Menu;