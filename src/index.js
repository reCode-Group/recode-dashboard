import AdminLayout from 'layouts/Admin.js';
import AuthLayout from 'layouts/Auth.js';
import MainLayout from 'layouts/Main';
import ReactDOM from 'react-dom';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

ReactDOM.render(
	<HashRouter>
		<Switch>
			<Route path={`/auth`} component={AuthLayout} />
			<Route path={`/admin`} component={AdminLayout} />
			<Route path={`/main`} component={MainLayout} />
			<Redirect from={`/`} to="/admin/dashboard" />
		</Switch>
	</HashRouter>,
	document.getElementById('root')
);
