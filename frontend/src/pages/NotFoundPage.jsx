import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404</h1>
      <p style={styles.text}>Oops! The page you are looking for does not exist.</p>
      <Link to="/" style={styles.button}>
        Go Back Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  heading: {
    fontSize: '6rem',
    margin: '0',
    color: '#dc3545',
  },
  text: {
    fontSize: '1.5rem',
    margin: '20px 0',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#007bff',
    textDecoration: 'none',
    borderRadius: '5px',
  },
};

export default NotFoundPage;
