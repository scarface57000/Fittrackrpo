import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return React.createElement('div', {
        style: { padding: 20, background: '#1a0000', color: '#ff6b6b', fontFamily: 'monospace', fontSize: 14, whiteSpace: 'pre-wrap', minHeight: '100vh' }
      },
        React.createElement('h2', null, 'ERREUR FITTRACK'),
        React.createElement('p', null, String(this.state.error)),
        React.createElement('p', null, this.state.error?.stack)
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(ErrorBoundary, null,
    React.createElement(App)
  )
);
