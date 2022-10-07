import { Link } from 'react-router-dom';
import { Button } from "../components";
import classes from '../styles/error-page.module.scss';

const ErrorPage = () => {   // Change to arrow function
    return (
        <div className={classes.errorPage}>
            <h1>Oops!</h1>
            <p>Seems like you're lost...</p>
            <p className={classes.error}>
                <i>Page not found</i>
            </p>
            <Link to="/">
                <Button text="Click here to return to home page" type="unstyled" variant="cyan" bold />
            </Link>
        </div>
    );
};
export default ErrorPage;