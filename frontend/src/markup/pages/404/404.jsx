import { Link } from 'react-router-dom';


const ErrorComponent = () => {
  return (
    <section className="error-section" style={{ backgroundImage: `url(${error404})` }}>
      <div className="auto-container">
        <div className="content">
          <h1>404</h1>
          <h2>Oops! That page can’t be found</h2>
          <div className="text">Sorry, but the page you are looking for does not exist</div>
          <Link to="/" className="theme-btn btn-style-one">Go to home page</Link>
        </div>
      </div>
    </section>
  );
}

export default ErrorComponent;
