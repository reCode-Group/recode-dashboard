import AdminLayout from 'layouts/Admin.js';
import AuthLayout from 'layouts/Auth.js';
import MainLayout from 'layouts/Main';
import 'styles/tailwind.css';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

ReactDOM.render(
	<BrowserRouter>
		<Switch>
			<Route path={`/auth`} component={AuthLayout} />
			<Route path={`/admin`} component={AdminLayout} />
			<Route path={`/lk`} component={AdminLayout} />
			<Route path={`/`} component={MainLayout} />
		</Switch>
	</BrowserRouter>,
	document.getElementById('root')
);
